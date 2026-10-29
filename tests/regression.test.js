'use strict';
/* ============================================================
 * 回归测试：真实数据端到端评分流水线
 * 锁定当前行为基线 —— 任何更新（样式/TTS/数据/算法）后由 CI
 * 自动重跑，行为漂移即失败。
 * ============================================================ */
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  splitSentences, splitWords, prepareTokens, scoreAttempt,
  buildRefWords, chunkSpeech
} = require('../techspeak/core.js');
const { ARTICLES, GLOSSARY, PARAGRAPHS } = require('../techspeak/data.js');

const allTexts = [];
ARTICLES.forEach(a => a.paragraphs.forEach(p => allTexts.push({ src: a.id, text: p.text })));
PARAGRAPHS.forEach(p => allTexts.push({ src: p.id, text: p.text }));

/* ---------- 不变量 1：句级切分不丢词 ---------- */
test('所有练习文本：分句后词数守恒', () => {
  allTexts.forEach(({ src, text }) => {
    const sentences = splitSentences(text);
    const rebuilt = sentences.map(s => splitWords(s)).flat();
    assert.deepEqual(rebuilt, splitWords(text), `${src} 分句丢词`);
    assert.ok(sentences.length >= 1, `${src} 至少一句`);
  });
});

/* ---------- 不变量 2：自我跟读（识别=原文）必得满分 ---------- */
test('所有句段库文本：token 完全对齐（accuracy=completeness=1）', () => {
  PARAGRAPHS.forEach(p => {
    const target = prepareTokens(splitWords(p.text));
    const rec = prepareTokens(splitWords(p.text));
    const sc = scoreAttempt(target, rec, { durationSec: 30, pauseCount: 2, confSum: 0.92 * 20, confN: 20 });
    assert.equal(sc.accuracy, 1, `${p.id} accuracy`);
    assert.equal(sc.completeness, 1, `${p.id} completeness`);
    assert.equal(sc.hit, target.length, `${p.id} hit`);
    assert.equal(sc.missCount, 0, `${p.id} miss`);
  });
});

/* ---------- 不变量 3：术语例句评分闭环 ---------- */
test('术语例句：自我跟读 hit 全中且 overall>=90', () => {
  GLOSSARY.forEach(g => {
    const target = prepareTokens(splitWords(g.example));
    /* 时长按 130 wpm 目标语速随 token 数缩放：固定 8 秒会让短例句 wpm<100 拖累 fluency */
    const dur = target.length / 130 * 60;
    const sc = scoreAttempt(target, target, { durationSec: dur, pauseCount: 0, confSum: 0.95 * 10, confN: 10 });
    assert.equal(sc.hit, target.length, `${g.term} hit`);
    assert.ok(sc.overall >= 90, `${g.term} overall=${sc.overall}`);
  });
});

/* ---------- 基线场景：固定输入 → 固定输出 ---------- */
test('基线：漏读半句的精确评分快照', () => {
  const target = prepareTokens(splitWords('we are building safe and reliable AI systems'));
  const rec = prepareTokens(splitWords('we are building safe'));
  const sc = scoreAttempt(target, rec, { durationSec: 4, pauseCount: 1, confSum: 3.6, confN: 4 });
  assert.equal(sc.hit, 4);
  assert.equal(sc.missCount, 4);
  assert.equal(sc.accuracy, 0.5);
  assert.equal(sc.wpm, 60);
  assert.equal(sc.pauses, 1);
  assert.equal(sc.durationSec, 4);
  assert.ok(sc.overall >= 50 && sc.overall <= 65, `overall=${sc.overall}`);
});

test('基线：数字词识别合并后与原文数字对齐命中', () => {
  const target = prepareTokens(splitWords('scale up to 9,216 chips with 9.6 terabits'));
  const rec = prepareTokens(splitWords('scale up to nine thousand two hundred and sixteen chips with nine point six terabits'));
  const sc = scoreAttempt(target, rec, { durationSec: 6, pauseCount: 0, confSum: 5, confN: 6 });
  /* 数字词应被合并成同一 token 而命中 */
  assert.equal(sc.hit, target.length, `hit=${sc.hit}/${target.length} 数字词应全命中`);
  assert.equal(sc.missCount, 0);
});

test('基线：语速 133wpm + 零停顿 → fluency 满分', () => {
  /* 数字词会被 prepareTokens 合并成单 token，wpm 失真 → 用普通词 */
  const text = 'we are building safe and reliable AI systems for everyone today';
  const target = prepareTokens(splitWords(text));
  const sc = scoreAttempt(target, target, { durationSec: 12 / 133 * 60, pauseCount: 0, confSum: 1, confN: 1 });
  assert.equal(sc.fluency, 1);
  assert.equal(sc.overall, 100);
});

/* ---------- buildRefWords 在真实素材上的完整性 ---------- */
test('全部文章段落：buildRefWords 索引零缺失', () => {
  ARTICLES.forEach(a => a.paragraphs.forEach((p, pi) => {
    const { sentences, W } = buildRefWords({ text: p.text });
    W.forEach(entry => {
      assert.ok(sentences[entry.s], `${a.id}#${pi} 句 ${entry.s} 应存在`);
      assert.equal(sentences[entry.s].words[entry.w], entry.raw, `${a.id}#${pi} 词索引错位`);
    });
  }));
});

/* ---------- TTS 分块在真实素材上的流畅度保障 ---------- */
test('全部练习文本：chunkSpeech 词守恒 + 长度合规', () => {
  allTexts.forEach(({ src, text }) => {
    const sentences = splitSentences(text);
    sentences.forEach((sentence, si) => {
      const cs = chunkSpeech(sentence, 200);
      const merged = cs.map(c => splitWords(c.text)).flat();
      assert.deepEqual(merged, splitWords(sentence), `${src} 第${si}句分块丢词`);
      cs.forEach(c => assert.ok(c.text.length <= 200, `${src} 第${si}句块超长`));
    });
  });
});

test('长段落必须被分块（规避 speechSynthesis 长文本截断）', () => {
  const long = PARAGRAPHS.find(p => p.text.length > 250);
  assert.ok(long, '句段库应存在 >250 字符的段落');
  /* 分块是防御层：对超过 maxLen 的整段文本必须切分且零丢词、索引链连续 */
  const cs = chunkSpeech(long.text, 200);
  assert.ok(cs.length >= 2, `长段落应至少分成两块，实际 ${cs.length}`);
  const merged = cs.map(c => splitWords(c.text)).flat();
  assert.deepEqual(merged, splitWords(long.text), '分块丢词');
  let acc = 0;
  cs.forEach(c => {
    assert.ok(c.text.length <= 200, '块超长');
    assert.equal(c.startWi, acc, 'startWi 链断裂');
    acc += c.words;
  });
  assert.equal(acc, splitWords(long.text).length, '块词数之和 != 原文');
});

/* ---------- 端到端：模拟一次完整跟读会话 ---------- */
test('端到端：整段朗读评分管线（识别含噪声）', () => {
  const p = PARAGRAPHS[0];
  const { W } = buildRefWords({ text: p.text });
  const target = prepareTokens(W.map(x => x.raw));
  /* 模拟识别结果：去掉两个词、加一个口头禅 */
  const recWords = W.map(x => x.raw).filter((_, i) => i !== 2 && i !== 7);
  recWords.push('um');
  const rec = prepareTokens(recWords);
  const sc = scoreAttempt(target, rec, { durationSec: 30, pauseCount: 3, confSum: 6, confN: 8 });
  assert.ok(sc.overall > 0 && sc.overall < 100, '含错识别应得中间分数');
  assert.ok(sc.missCount >= 2, '至少 2 个漏读');
  assert.equal(sc.recCount, rec.length);
  assert.equal(sc.targetCount, target.length);
});
