/* ============================================================
 * TechSpeak 预生成音频单元清单（单一事实来源）
 * 被 scripts/gen-audio.cjs（批量生成）与 tests/audio.test.js
 * （覆盖锁定）共用。切句与前端完全一致：直接调用 core.js
 * 的 buildRefWords / splitWords，不复制任何切分逻辑。
 * ============================================================ */
'use strict';
const path = require('node:path');
const core = require('../techspeak/core.js');
const { ARTICLES, GLOSSARY, PATTERNS, PARAGRAPHS } = require('../techspeak/data.js');

const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'techspeak', 'audio');
const VOICE = 'en-US-AriaNeural';
const ENGINE = 'edge-tts 7.3.1';

/* 收集全部需要预生成 TTS 的固定文本单元（按 hash 去重） */
async function collectUnits() {
  const byHash = new Map();
  const push = async (text, src) => {
    const t = String(text);
    const hash = await core.ttsHash(t);
    if (hash && !byHash.has(hash)) byHash.set(hash, { hash, text: t, src });
  };

  /* 文章库：逐段进练习（articleParaRef 仅取 paragraphs[pi].text） */
  for (const a of ARTICLES) {
    for (let pi = 0; pi < a.paragraphs.length; pi++) {
      const ref = { text: a.paragraphs[pi].text };
      const { sentences } = core.buildRefWords(ref);
      for (const s of sentences) await push(s.text, `article/${a.id}/${pi}`);
    }
  }
  /* 句段库：整段进练习（libParaRef 仅取 p.text） */
  for (const p of PARAGRAPHS) {
    const { sentences } = core.buildRefWords({ text: p.text });
    for (const s of sentences) await push(s.text, `paragraph/${p.id}`);
  }
  /* 术语库：术语发音按钮 + 例句 mini-practice */
  for (const g of GLOSSARY) {
    await push(g.term, `glossary-term/${g.term}`);
    await push(g.example, `glossary-example/${g.term}`);
  }
  /* 句型库：全部英文例句 */
  for (const cat of PATTERNS) {
    for (const it of cat.items) {
      for (const ex of it.examples) await push(ex.en, `pattern/${it.name}`);
    }
  }
  return [...byHash.values()];
}

module.exports = { collectUnits, AUDIO_DIR, VOICE, ENGINE };

/* ---------- CLI：提取单元并写 manifest ----------
 * 用法：node scripts/tts-units.cjs --dump /tmp/units.json
 * 之后用 python3 scripts/gen-audio.py 并发生成 MP3。 */
if (require.main === module) {
  const fs = require('node:fs');
  const path = require('node:path');
  const dumpIdx = process.argv.indexOf('--dump');
  (async () => {
    const units = await collectUnits();
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
    fs.writeFileSync(path.join(AUDIO_DIR, 'manifest.json'),
      JSON.stringify({ v: 1, engine: ENGINE, voice: VOICE, files: units.map(u => u.hash) }, null, 1) + '\n');
    console.log(`units=${units.length} → ${path.join(AUDIO_DIR, 'manifest.json')}`);
    if (dumpIdx >= 0) {
      fs.writeFileSync(process.argv[dumpIdx + 1], JSON.stringify(units));
      console.log(`units dumped → ${process.argv[dumpIdx + 1]}`);
    }
  })().catch(e => { console.error(e); process.exit(1); });
}
