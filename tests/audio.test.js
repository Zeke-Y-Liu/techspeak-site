'use strict';
/* ============================================================
 * 预生成音频资产锁定测试
 * 目标：内容（data.js）与音频资产（techspeak/audio/）必须同步——
 * 改动任何练习文本后未重新生成音频，本文件将失败并提示
 * 运行 python3 scripts/gen-audio.py（多邻国式预生成音频方案）。
 * ============================================================ */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const core = require('../techspeak/core.js');
const { collectUnits, AUDIO_DIR } = require('../scripts/tts-units.cjs');

const manifestPath = path.join(AUDIO_DIR, 'manifest.json');
const readManifest = () => JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

test('audio: manifest.json 存在且结构合法', () => {
  assert.ok(fs.existsSync(manifestPath), '缺少 techspeak/audio/manifest.json，请运行: python3 scripts/gen-audio.py');
  const m = readManifest();
  assert.strictEqual(m.v, 1, 'manifest.v 应为 1');
  assert.ok(Array.isArray(m.files) && m.files.length > 0, 'manifest.files 不能为空');
  assert.ok(m.files.every(f => typeof f === 'string' && /^[0-9a-f]{16}$/.test(f)), 'files 中每项须为 16 位 hex 指纹');
  assert.strictEqual(new Set(m.files).size, m.files.length, 'manifest.files 存在重复指纹');
  assert.ok(typeof m.voice === 'string' && m.voice.length > 0, 'manifest.voice 缺失');
});

test('audio: 清单内每个指纹都有非空 MP3 文件', () => {
  const m = readManifest();
  const bad = [];
  for (const h of m.files) {
    const f = path.join(AUDIO_DIR, h + '.mp3');
    if (!fs.existsSync(f) || fs.statSync(f).size < 400) bad.push(h);
  }
  assert.deepStrictEqual(bad, [], `以下音频缺失或为空，请重新运行: python3 scripts/gen-audio.py\n${bad.join('\n')}`);
});

test('audio: 全部固定内容已被预生成覆盖（改内容必须重新生成音频）', async () => {
  const set = new Set(readManifest().files);
  const units = await collectUnits();
  assert.ok(units.length >= 200, `音频单元数异常: ${units.length}（预期 ≥ 200）`);
  const miss = units.filter(u => !set.has(u.hash));
  assert.deepStrictEqual(miss.map(u => `[${u.src}] ${u.text.slice(0, 60)}`), [],
    '以下内容没有预生成音频。请运行: python3 scripts/gen-audio.py --refresh');
});

test('audio: ttsHash 三端同算法锁定（SHA-256 前 8 字节 hex）', async () => {
  const samples = [
    'Hello, world.',
    "Today, we're launching Claude 3.5 Sonnet.",
    'go-to-market',
    '  multiple   spaces\t\nnormalized ',
    'With Ironwood, we can scale up to 9,216 chips in a superpod.'
  ];
  for (const s of samples) {
    const norm = s.replace(/\s+/g, ' ').trim();
    const expected = crypto.createHash('sha256').update(norm, 'utf8').digest('hex').slice(0, 16);
    assert.strictEqual(await core.ttsHash(s), expected, `指纹不匹配: ${JSON.stringify(s)}`);
  }
  assert.strictEqual(await core.ttsHash('   '), null, '空白文本应返回 null');
  assert.strictEqual(await core.ttsHash(''), null, '空文本应返回 null');
});
