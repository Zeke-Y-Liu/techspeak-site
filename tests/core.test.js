'use strict';
/* ============================================================
 * 单元测试：core.js 纯逻辑层
 * 运行：node --test tests/（或 npm test）
 * ============================================================ */
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  esc, splitSentences, splitWords, normalizeWord,
  NUM_UNITS, NUM_SCALES, prepareTokens,
  levDist, wordSim, alignTokens, scoreAttempt,
  buildRefWords, chunkSpeech
} = require('../techspeak/core.js');

/* ---------- esc：HTML 转义 ---------- */
test('esc 转义全部 HTML 特殊字符', () => {
  assert.equal(esc('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
  assert.equal(esc('a&b'), 'a&amp;b');
  assert.equal(esc('"q"'), '&quot;q&quot;');
  assert.equal(esc("it's"), 'it&#39;s');
});
test('esc 输出不含裸露的 < > " \' &', () => {
  const payload = `"><svg onload=alert(1)>&'`;
  const out = esc(payload);
  assert.ok(!/[<>"']/.test(out.replace(/&\w+;/g, '')), `应无残留裸字符: ${out}`);
  assert.ok(!out.includes('<'), '输出不应包含裸 <');
  assert.ok(!out.includes('>'), '输出不应包含裸 >');
});
test('esc 处理非字符串输入不抛异常', () => {
  assert.equal(esc(undefined), 'undefined');
  assert.equal(esc(123), '123');
  assert.equal(esc(''), '');
});

/* ---------- splitSentences ---------- */
test('splitSentences 基本切分', () => {
  assert.deepEqual(splitSentences('Hello world. Next one!'), ['Hello world.', 'Next one!']);
  assert.deepEqual(splitSentences('One'), ['One']);
  assert.deepEqual(splitSentences(''), []);
});
test('splitSentences 保护小数点不被切分', () => {
  const r = splitSentences('Claude runs at 3.5 times the speed of a 42.5 ton model.');
  assert.equal(r.length, 1);
  assert.ok(r[0].includes('3.5'));
  assert.ok(r[0].includes('42.5'));
});
test('splitSentences 折叠多余空白', () => {
  const r = splitSentences('  spaced    out.  ');
  assert.deepEqual(r, ['spaced out.']);
});

/* ---------- splitWords ---------- */
test('splitWords 按空白切分并过滤空串', () => {
  assert.deepEqual(splitWords('  a  b c '), ['a', 'b', 'c']);
  assert.deepEqual(splitWords(''), []);
});

/* ---------- normalizeWord ---------- */
test('normalizeWord 小写化并移除标点', () => {
  assert.equal(normalizeWord('Don\'t'), 'don\'t');
  assert.equal(normalizeWord('(AI)'), 'ai');
  assert.equal(normalizeWord('Word!'), 'word');
  assert.equal(normalizeWord('U.S.'), 'u.s');
  assert.equal(normalizeWord('state-of-the-art'), 'state-of-the-art');
  assert.equal(normalizeWord('’curly’'), 'curly');
});

/* ---------- prepareTokens：数字词合并 ---------- */
test('prepareTokens 合并小数（three point five → 3.5）', () => {
  const t = prepareTokens(['runs', 'at', 'three', 'point', 'five', 'times']);
  assert.deepEqual(t.map(x => x.norm), ['runs', 'at', '3.5', 'times']);
});
test('prepareTokens 合并数量级（nine thousand / two million）', () => {
  assert.equal(prepareTokens(['nine', 'thousand', 'chips'])[0].norm, '9000');
  assert.equal(prepareTokens(['two', 'million', 'users'])[0].norm, '2000000');
});
test('prepareTokens and 连接（one hundred and twenty → 120）', () => {
  assert.equal(prepareTokens(['one', 'hundred', 'and', 'twenty'])[0].norm, '120');
});
test('prepareTokens "4 x" 合并为 "4x"', () => {
  const t = prepareTokens(['scale', 'to', 'four', 'x', 'chips']);
  assert.deepEqual(t.map(x => x.norm), ['scale', 'to', '4x', 'chips']);
});
test('prepareTokens 保留原始词索引（is 数组）', () => {
  const raw = ['the', 'three', 'point', 'five', 'billion'];
  const t = prepareTokens(raw);
  const merged = t.find(x => x.norm === '3.5');
  assert.ok(merged, '应存在合并后的 3.5 token');
  assert.deepEqual(merged.is, [1, 2, 3]); /* 指向原句第 2~4 个词 */
});

/* ---------- 编辑距离与相似度 ---------- */
test('levDist 经典用例', () => {
  assert.equal(levDist('kitten', 'sitting'), 3);
  assert.equal(levDist('', 'abc'), 3);
  assert.equal(levDist('same', 'same'), 0);
});
test('wordSim 边界行为', () => {
  assert.equal(wordSim('a', 'a'), 1);
  assert.equal(wordSim('', 'a'), 0);
  assert.ok(wordSim('train', 'trane') > 0.5);
});

/* ---------- alignTokens ---------- */
test('alignTokens 完全命中', () => {
  const t = prepareTokens(['hello', 'world']);
  const r = prepareTokens(['hello', 'world']);
  const ops = alignTokens(t, r);
  assert.equal(ops.filter(o => o.type === 'hit').length, 2);
});
test('alignTokens 漏读判定为 miss', () => {
  const t = prepareTokens(['we', 'are', 'building', 'safe', 'ai']);
  const r = prepareTokens(['we', 'are', 'building']);
  const ops = alignTokens(t, r);
  assert.equal(ops.filter(o => o.type === 'hit').length, 3);
  assert.equal(ops.filter(o => o.type === 'miss').length, 2);
});
test('alignTokens 多读判定为 extra', () => {
  const t = prepareTokens(['hello']);
  const r = prepareTokens(['hello', 'world']);
  const ops = alignTokens(t, r);
  assert.equal(ops.filter(o => o.type === 'hit').length, 1);
  assert.equal(ops.filter(o => o.type === 'extra').length, 1);
});
test('alignTokens 近音词判定为 close', () => {
  const t = prepareTokens(['training']);
  const r = prepareTokens(['train']);
  const ops = alignTokens(t, r);
  assert.equal(ops[0].type, 'close');
});

/* ---------- scoreAttempt ---------- */
const STATS = { durationSec: 10, pauseCount: 1, confSum: 7.2, confN: 8 };
test('scoreAttempt 完美跟读：准确率/完整度满分', () => {
  const target = prepareTokens(splitWords('we are building safe and reliable AI systems'));
  const rec = prepareTokens(splitWords('we are building safe and reliable AI systems'));
  const sc = scoreAttempt(target, rec, STATS);
  assert.equal(sc.accuracy, 1);
  assert.equal(sc.completeness, 1);
  assert.equal(sc.hit, target.length);
  assert.equal(sc.missCount, 0);
  assert.ok(sc.overall >= 80 && sc.overall <= 100);
  assert.ok(!sc.empty);
});
test('scoreAttempt 空识别：0 分且 empty=true', () => {
  const target = prepareTokens(splitWords('hello world'));
  const sc = scoreAttempt(target, [], { durationSec: 0, pauseCount: 0, confSum: 0, confN: 0 });
  assert.equal(sc.overall, 0);
  assert.equal(sc.empty, true);
});
test('scoreAttempt 漏读一半：accuracy=0.5，wpm 换算正确', () => {
  const target = prepareTokens(splitWords('we are building safe and reliable AI systems'));
  const rec = prepareTokens(splitWords('we are building safe'));
  const sc = scoreAttempt(target, rec, { durationSec: 4, pauseCount: 1, confSum: 3.6, confN: 4 });
  assert.equal(sc.hit, 4);
  assert.equal(sc.missCount, 4);
  assert.equal(sc.accuracy, 0.5);
  assert.equal(sc.wpm, 60); /* 4 词 / (4/60) 分钟 */
  assert.ok(sc.overall >= 50 && sc.overall <= 65, `overall=${sc.overall}`);
});
test('scoreAttempt 语速区间：100-165 wpm 时 pace 满分', () => {
  /* 注意不能用数字词做夹具：prepareTokens 会把数字词合并成单 token，wpm 失真 */
  const text = 'we are building safe and reliable AI systems for everyone today';
  const target = prepareTokens(splitWords(text));
  const rec = prepareTokens(splitWords(text));
  /* 12 词 / 5.4 秒 = 133 wpm → paceScore=1；无停顿 → pauseScore=1 → fluency=1 */
  const sc = scoreAttempt(target, rec, { durationSec: 12 / 133 * 60, pauseCount: 0, confSum: 1, confN: 1 });
  assert.equal(sc.fluency, 1);
});

/* ---------- buildRefWords ---------- */
test('buildRefWords 句/词索引一致性', () => {
  const { sentences, W } = buildRefWords({ text: 'First sentence here. Second one!' });
  assert.equal(sentences.length, 2);
  const total = sentences.reduce((s, x) => s + x.words.length, 0);
  assert.equal(W.length, total);
  W.forEach((entry, gi) => {
    assert.equal(sentences[entry.s].words[entry.w], entry.raw);
  });
});

/* ---------- chunkSpeech：TTS 分块（流畅度核心） ---------- */
test('chunkSpeech 短文本单块直出', () => {
  const cs = chunkSpeech('Hello, world.', 200);
  assert.equal(cs.length, 1);
  assert.equal(cs[0].text, 'Hello, world.');
  assert.equal(cs[0].startWi, 0);
  assert.equal(cs[0].words, 2);
});
test('chunkSpeech 空文本返回空数组', () => {
  assert.deepEqual(chunkSpeech('   '), []);
});
test('chunkSpeech 长文本：每块不超上限、词索引链连续', () => {
  const text = 'Ironwood groups TPUs into interconnected units called pods, and with Ironwood we can scale up to 9,216 chips in a superpod: these chips are linked via a breakthrough Inter-Chip Interconnect network operating at 9.6 terabits per second, delivering staggering shared memory bandwidth.';
  const cs = chunkSpeech(text, 200);
  assert.ok(cs.length >= 2, '长文本应至少分成两块');
  const totalWords = splitWords(text).length;
  let acc = 0;
  for (let i = 0; i < cs.length; i++) {
    assert.ok(cs[i].text.length <= 200, `第 ${i} 块超长: ${cs[i].text.length}`);
    assert.ok(cs[i].words > 0, '块内词数应为正');
    assert.equal(cs[i].startWi, acc, `第 ${i} 块 startWi 应为 ${acc}`);
    acc += cs[i].words;
  }
  assert.equal(acc, totalWords, '分块词数之和应等于原文词数');
});
test('chunkSpeech 分块词集合与原文一致（不丢词）', () => {
  const text = 'SIMA learned to perform over 600 language-following skills, like turn left, climb the ladder, and open the map, across a diverse set of commercial video games without access to the underlying game mechanics.';
  const cs = chunkSpeech(text, 120);
  const merged = cs.map(c => splitWords(c.text)).flat();
  assert.deepEqual(merged, splitWords(text));
});
test('chunkSpeech 无标点长句按词硬切兜底', () => {
  const text = Array.from({ length: 80 }, (_, i) => `word${i}`).join(' ');
  const cs = chunkSpeech(text, 200);
  assert.ok(cs.length >= 2);
  const merged = cs.map(c => splitWords(c.text)).flat();
  assert.equal(merged.length, 80);
  cs.forEach(c => assert.ok(c.text.length <= 200));
});
test('chunkSpeech maxLen 生效', () => {
  const text = 'a'.repeat(50) + ', ' + 'b'.repeat(50) + ', ' + 'c'.repeat(50) + ', ' + 'd'.repeat(50) + ', ' + 'e'.repeat(50);
  const cs = chunkSpeech(text, 80);
  assert.ok(cs.length >= 2);
  cs.forEach(c => assert.ok(c.text.length <= 80));
});

/* ---------- 常量完整性 ---------- */
test('NUM_UNITS / NUM_SCALES 基础值正确', () => {
  assert.equal(NUM_UNITS.zero, 0);
  assert.equal(NUM_UNITS.nineteen, 19);
  assert.equal(NUM_SCALES.billion, 1e9);
  assert.equal(NUM_SCALES.trillion, 1e12);
});
