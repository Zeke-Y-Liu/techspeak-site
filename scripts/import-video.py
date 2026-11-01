#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TechSpeak 视频导入管线（离线工具，构建期运行，站点保持纯静态）

视频链接（B站 / 微博 / 抖音，或视频号等手动下载的本地文件）
  → yt-dlp 下载音轨
  → ffmpeg 截取片段 + 压缩为 16kHz 单声道 MP3（体积小、GitHub Pages 友好）
  → faster-whisper 语音转录（句级时间戳）
  → 清洗/合并为练习句
  → 写出 techspeak/media/<id>.mp3 + scripts/video-imports/<id>.json
  → 由 scripts/build-video-data.cjs 汇总生成 techspeak/video-data.js

用法示例：
  python3 scripts/import-video.py \
    --id jensen-gtc-berlin-2026 \
    --url 'https://www.bilibili.com/video/BVxxxx' \
    --start 300 --duration 420 \
    --title 'GTC 柏林 2026 主题演讲（节选）' \
    --speaker '黄仁勋 Jensen Huang' \
    --type keynote --tags 'NVIDIA,AI,主题演讲' \
    --desc '……' --focus '……'

微信视频号无网页直链：先手动下载视频，再用 --file 指定本地路径 + --platform wechat。
"""
import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MEDIA_DIR = ROOT / 'techspeak' / 'media'
IMPORTS_DIR = ROOT / 'scripts' / 'video-imports'

PLATFORM_RULES = [
    (r'(bilibili\.com|b23\.tv)', 'bilibili'),
    (r'(douyin\.com|iesdouyin\.com)', 'douyin'),
    (r'(weibo\.com|weibo\.cn)', 'weibo'),
]
TYPES = ['keynote', 'interview', 'press', 'talk', 'other']


def sh(cmd, **kw):
    """运行外部命令，失败即退出并打印输出。"""
    print('+', ' '.join(str(c) for c in cmd), flush=True)
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        sys.stderr.write(r.stdout[-3000:] + '\n' + r.stderr[-3000:] + '\n')
        sys.exit(f'命令失败: {cmd[0]}')
    return r.stdout

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'


def bili_download(url, workdir, pid):
    """B站公开 API 直连下载（yt-dlp 被 412 WAF 拦截时的回退路径）：
    finger/spi 取 buvid 指纹 cookie → view API 取 cid → playurl API 取 DASH 音轨直链。
    仅使用无需登录的公开接口。"""
    import requests
    m = re.search(r'(BV[\w]+)', url)
    if not m:
        sys.exit('无法从链接解析 BV 号')
    bvid = m.group(1)
    hdr = {'User-Agent': UA, 'Referer': 'https://www.bilibili.com/'}
    s = requests.Session()
    s.headers.update(hdr)
    spi = s.get('https://api.bilibili.com/x/frontend/finger/spi', timeout=15).json()['data']
    s.cookies.set('buvid3', spi['b_3'], domain='.bilibili.com')
    s.cookies.set('buvid4', spi['b_4'], domain='.bilibili.com')
    info = s.get(f'https://api.bilibili.com/x/web-interface/view?bvid={bvid}', timeout=15).json()
    if info.get('code') != 0:
        sys.exit(f'B站 view API 失败: {info.get("message")}')
    v = info['data']
    print(f'标题: {v["title"]}（{v["duration"]}s）')
    pu = s.get(f'https://api.bilibili.com/x/player/playurl?bvid={bvid}&cid={v["cid"]}&fnval=16', timeout=15).json()
    if pu.get('code') != 0:
        sys.exit(f'B站 playurl API 失败: {pu.get("message")}（部分视频需登录）')
    audios = pu['data'].get('dash', {}).get('audio') or []
    if not audios:
        sys.exit('playurl 未返回音轨（可能需要登录或仅提供视频流）')
    a = max(audios, key=lambda x: x.get('bandwidth', 0))
    dl = a.get('baseUrl') or (a.get('backupUrl') or [None])[0]
    if not dl:
        sys.exit('音轨无可用直链')
    print(f'直连下载音轨（id={a.get("id")}，{a.get("bandwidth", 0)//1000} kbps）…')
    dst = Path(workdir) / f'{pid}.m4a'
    attempts = 0
    while True:
        attempts += 1
        start = dst.stat().st_size if dst.exists() else 0
        headers = {'User-Agent': UA, 'Referer': 'https://www.bilibili.com/'}
        if start:
            headers['Range'] = f'bytes={start}-'
        try:
            with s.get(dl, headers=headers, stream=True, timeout=90) as r:
                r.raise_for_status()
                if start and r.status_code == 200:
                    start = 0  # 服务器忽略 Range：放弃断点重头下
                with open(dst, 'wb' if not start else 'ab') as f:
                    for chunk in r.iter_content(1 << 16):
                        if chunk:
                            f.write(chunk)
            print(f'下载完成: {dst} ({dst.stat().st_size/1048576:.1f} MB)')
            return dst
        except Exception as e:
            print(f'下载中断（第 {attempts} 次，已 {start/1048576:.1f} MB）: {e}')
            if attempts >= 8:
                sys.exit('多次重试后仍下载失败')
            time.sleep(2)


def detect_platform(url):
    for pat, plat in PLATFORM_RULES:
        if re.search(pat, url):
            return plat
    return None


def download_audio(url, workdir, pid):
    """优先 yt-dlp（通用平台支持）；B站被 412 WAF 拦截时回退公开 API 直连。"""
    outtmpl = str(workdir / f'{pid}.%(ext)s')
    r = subprocess.run(['yt-dlp', '--no-warnings', '--user-agent', UA,
                         '--add-header', 'Referer:https://www.bilibili.com/',
                         '-f', 'bestaudio/best', '-o', outtmpl, url],
                        capture_output=True, text=True)
    if r.returncode == 0:
        for f in sorted(workdir.glob(f'{pid}.*')):
            if f.suffix != '.json':  # 跳过 info json
                return f
        sys.exit('下载完成但未找到音轨文件')
    err = (r.stderr or '').strip().splitlines()
    print(f'yt-dlp 失败: {err[-1] if err else r.returncode}')
    if re.search(r'(bilibili\.com|b23\.tv)', url):
        print('回退 B站公开 API 直连…')
        return bili_download(url, workdir, pid)
    sys.exit('下载失败')


def trim_compress(src, start, duration, dst):
    """ffmpeg 截取 + 压缩为 16kHz 单声道 32kbps MP3。"""
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    sh(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
        '-ss', str(start), '-t', str(duration), '-i', str(src),
        '-ac', '1', '-ar', '16000', '-b:a', '32k', str(dst)])
    size = dst.stat().st_size
    print(f'音频产出: {dst} ({size/1024:.0f} KB)')
    return size


def transcribe(audio, model_name, lang):
    """faster-whisper 转录，返回 [(text, start, end)]。
    输入音频先经 ffmpeg 解码为 16kHz 单声道 float32 PCM 数组，
    绕过 faster-whisper 内部的 PyAV 解码（新版 PyAV 移除了
    metadata_errors 参数，与其 1.2.x 不兼容）。"""
    from faster_whisper import WhisperModel
    import numpy as np
    t0 = time.time()
    print(f'加载模型 {model_name}…', flush=True)
    model = WhisperModel(model_name, device='cpu', compute_type='int8')
    print(f'模型就绪 ({time.time()-t0:.0f}s)，解码音频…', flush=True)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error',
                        '-i', str(audio), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'],
                       capture_output=True)
    if r.returncode != 0 or not r.stdout:
        sys.stderr.write(r.stderr.decode('utf-8', 'ignore'))
        sys.exit('ffmpeg 音频解码失败')
    samples = np.frombuffer(r.stdout, dtype=np.float32)
    print(f'开始转录（{len(samples)/16000:.0f}s 音频）…', flush=True)
    segments, info = model.transcribe(
        samples, language=lang or None, vad_filter=True,
        vad_parameters={'min_silence_duration_ms': 500},
        beam_size=5)
    out = []
    for s in segments:
        t = s.text.strip()
        if t:
            out.append((t, round(float(s.start), 2), round(float(s.end), 2)))
    print(f'转录完成: {len(out)} 段，语言={info.language}，耗时 {time.time()-t0:.0f}s')
    return out


def clean_sentences(raw):
    """whisper 段 → 练习句：合并未收尾的碎段、清洗文本。"""
    merged = []
    for text, s, e in raw:
        if merged:
            ptext, ps, pe = merged[-1]
            gap = s - pe
            ends_open = not re.search(r'[.!?]["\')\]]*$', ptext)
            if ends_open and gap < 1.2:
                merged[-1] = (ptext + ' ' + text, ps, e)
                continue
        merged.append((text, s, e))
    out = []
    for text, s, e in merged:
        text = re.sub(r'\s+', ' ', text).strip()
        if not text:
            continue
        if text[0].islower():  # 句首大写
            text = text[0].upper() + text[1:]
        if e <= s:
            continue
        out.append({'text': text, 'start': s, 'end': e})
    return out


def main():
    ap = argparse.ArgumentParser(description='导入视频为 TechSpeak 练习素材')
    ap.add_argument('--id', required=True, help='素材 ID（kebab-case）')
    ap.add_argument('--url', help='视频链接（B站/微博/抖音）')
    ap.add_argument('--file', help='本地视频/音频文件路径（视频号等手动下载）')
    ap.add_argument('--title', required=True)
    ap.add_argument('--speaker', required=True)
    ap.add_argument('--platform', choices=['bilibili', 'douyin', 'weibo', 'wechat', 'local'])
    ap.add_argument('--source-url', dest='sourceUrl', help='原始视频页（--file 时可留空）')
    ap.add_argument('--published', required=True, help='演讲/发布日期 YYYY-MM-DD')
    ap.add_argument('--type', required=True, choices=TYPES)
    ap.add_argument('--tags', required=True, help='逗号分隔标签')
    ap.add_argument('--desc', required=True)
    ap.add_argument('--focus', default='', help='练习要点')
    ap.add_argument('--level', type=int, default=3, choices=[1, 2, 3])
    ap.add_argument('--start', type=float, default=0, help='截取起点（秒，相对原视频）')
    ap.add_argument('--duration', type=float, default=420, help='截取时长（秒）')
    ap.add_argument('--model', default='small', help='whisper 模型（tiny/base/small/…）')
    ap.add_argument('--lang', default='en', help='音频语言（留空自动检测）')
    ap.add_argument('--wpm-target', dest='wpmTarget', type=int, default=130)
    args = ap.parse_args()

    if not args.url and not args.file:
        sys.exit('需要 --url 或 --file 之一')
    platform = args.platform or (detect_platform(args.url) if args.url else None)
    if not platform:
        sys.exit('无法从链接识别平台，请用 --platform 指定（bilibili/douyin/weibo/wechat/local）')

    import tempfile
    audio_rel = f'media/{args.id}.mp3'
    audio_abs = ROOT / 'techspeak' / audio_rel
    with tempfile.TemporaryDirectory() as td:
        if audio_abs.exists() and audio_abs.stat().st_size > 20000:
            print(f'音频已存在，跳过下载/裁剪: {audio_abs}')
        else:
            src = Path(args.file) if args.file else download_audio(args.url, Path(td), args.id)
            trim_compress(src, args.start, args.duration, audio_abs)

        raw = transcribe(audio_abs, args.model, args.lang)
    sentences = clean_sentences(raw)
    if len(sentences) < 3:
        sys.exit(f'转录句子过少（{len(sentences)}），请检查音频/参数')

    duration = round(max(sentences[-1]['end'], args.duration), 1)
    entry = {
        'id': args.id, 'title': args.title, 'speaker': args.speaker,
        'platform': platform,
        'sourceUrl': args.sourceUrl or args.url or '',
        'published': args.published, 'type': args.type, 'level': args.level,
        'tags': [t.strip() for t in args.tags.split(',') if t.strip()],
        'desc': args.desc, 'focus': args.focus, 'wpmTarget': args.wpmTarget,
        'durationSec': duration, 'audio': audio_rel, 'sentences': sentences,
    }
    IMPORTS_DIR.mkdir(parents=True, exist_ok=True)
    out = IMPORTS_DIR / f'{args.id}.json'
    out.write_text(json.dumps(entry, ensure_ascii=False, indent=2), encoding='utf-8')
    total_words = sum(len(s['text'].split()) for s in sentences)
    print(f'✅ 导入完成: {out}')
    print(f'   {len(sentences)} 句 / {total_words} 词 / 时长 {duration:.0f}s / 平台 {platform}')
    print('   下一步: node scripts/build-video-data.cjs 生成 video-data.js')


if __name__ == '__main__':
    main()
