#!/usr/bin/env python3
"""TechSpeak 预生成音频批量生成器（并发 3，幂等续跑）。
一条命令完成：Node 提取全部固定文本并写 manifest → edge-tts
并发生成 MP3。改过 data.js 内容后加 --refresh 强制重新提取。
用法：
  python3 scripts/gen-audio.py --proxy http://127.0.0.1:18080 [--refresh]
依赖：Python3 + edge-tts >= 7.3.1（pip install edge-tts）、Node.js
"""
import argparse, asyncio, json, os, subprocess, sys, time

import edge_tts

async def synth_one(text, file, voice, proxy, sem):
    async with sem:
        for attempt in (1, 2):
            try:
                comm = edge_tts.Communicate(text, voice, proxy=proxy)
                await comm.save(file)
                if os.path.exists(file) and os.path.getsize(file) > 0:
                    return True
            except Exception:
                pass
            await asyncio.sleep(1.5)
    if os.path.exists(file) and os.path.getsize(file) == 0:
        os.remove(file)
    return False

async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--proxy', default=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy') or '')
    ap.add_argument('--units', default='/tmp/techspeak-units.json')
    ap.add_argument('--audio-dir', default=os.path.join(os.path.dirname(__file__), '..', 'techspeak', 'audio'))
    ap.add_argument('--concurrency', type=int, default=3)
    ap.add_argument('--refresh', action='store_true', help='强制重新提取单元（内容改动后）')
    args = ap.parse_args()

    if args.refresh or not os.path.exists(args.units):
        print('extracting units via node scripts/tts-units.cjs ...', flush=True)
        r = subprocess.run(['node', os.path.join(os.path.dirname(__file__), 'tts-units.cjs'), '--dump', args.units])
        if r.returncode != 0:
            sys.exit('unit extraction failed')

    units = json.load(open(args.units, encoding='utf-8'))
    voice = 'en-US-AriaNeural'
    audio_dir = os.path.abspath(args.audio_dir)
    os.makedirs(audio_dir, exist_ok=True)
    sem = asyncio.Semaphore(args.concurrency)

    todo = [u for u in units if not (os.path.exists(os.path.join(audio_dir, u['hash'] + '.mp3'))
            and os.path.getsize(os.path.join(audio_dir, u['hash'] + '.mp3')) > 0)]
    print(f'total={len(units)} todo={len(todo)} concurrency={args.concurrency} proxy={args.proxy!r}', flush=True)

    ok, fail = 0, 0
    start = time.time()
    done_count = 0

    async def run(u):
        nonlocal ok, fail, done_count
        good = await synth_one(u['text'], os.path.join(audio_dir, u['hash'] + '.mp3'), voice, args.proxy, sem)
        if good: ok += 1
        else:
            fail += 1
            print(f"  FAIL [{u['hash']}] {u['src']}: {u['text'][:60]}", flush=True)
        done_count += 1
        if done_count % 20 == 0 or done_count == len(todo):
            rate = done_count / max(time.time() - start, 1)
            print(f'  progress {done_count}/{len(todo)} ({rate:.1f}/s)', flush=True)

    await asyncio.gather(*(run(u) for u in todo))
    print(f'done: ok={ok} fail={fail}', flush=True)
    sys.exit(1 if fail else 0)

asyncio.run(main())
