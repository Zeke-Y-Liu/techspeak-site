'use strict';
/* 视频导入素材（techspeak/video-data.js）数据完整性锁定：
 * 字段/来源/类型白名单、句级时间戳合法性、音频文件存在、
 * 与 scripts/video-imports 源目录一致（改素材必须重跑 build 脚本）。 */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { VIDEOS } = require('../techspeak/video-data.js');
const { buildVideoData } = require('../scripts/build-video-data.cjs');

const ROOT = path.resolve(__dirname, '..');
const PLATFORMS = ['bilibili', 'douyin', 'weibo', 'wechat', 'local'];
const TYPES = ['keynote', 'interview', 'press', 'talk', 'other'];
const REQUIRED = ['id', 'title', 'speaker', 'platform', 'sourceUrl', 'published', 'type', 'level', 'tags', 'desc', 'durationSec', 'audio', 'sentences'];

test('video: 素材字段完整且来源/类型标签合法', () => {
  for (const v of VIDEOS) {
    assert.match(v.id, /^[\w-]+$/, `${v.id}: id 应为 kebab-case`);
    for (const k of REQUIRED) assert.ok(v[k] != null && v[k] !== '', `${v.id}: 缺少字段 ${k}`);
    assert.ok(PLATFORMS.includes(v.platform), `${v.id}: platform 非法 "${v.platform}"（白名单 ${PLATFORMS}）`);
    assert.ok(TYPES.includes(v.type), `${v.id}: type 非法 "${v.type}"（白名单 ${TYPES}）`);
    assert.ok(Array.isArray(v.tags) && v.tags.length > 0, `${v.id}: tags 不能为空`);
    assert.ok([1, 2, 3].includes(v.level), `${v.id}: level 应为 1-3`);
    assert.match(v.published, /^\d{4}-\d{2}-\d{2}$/, `${v.id}: published 应为 YYYY-MM-DD`);
    assert.ok(/^media\/[\w.-]+\.mp3$/.test(v.audio), `${v.id}: audio 路径应为 media/*.mp3`);
  }
});

test('video: 句级时间戳单调、不越音频时长、文本无 HTML 字符', () => {
  for (const v of VIDEOS) {
    assert.ok(v.sentences.length >= 3, `${v.id}: 句子过少`);
    assert.ok(v.durationSec > 10, `${v.id}: durationSec 应大于 10 秒`);
    let prevEnd = 0;
    for (const s of v.sentences) {
      assert.ok(typeof s.start === 'number' && typeof s.end === 'number', `${v.id}: 时间戳须为数字`);
      assert.ok(s.end > s.start, `${v.id}: 句时间戳 end<=start`);
      assert.ok(s.start >= prevEnd - 0.05, `${v.id}: 句开始时间回退`);
      assert.ok(s.text && s.text.trim().length >= 1, `${v.id}: 句文本为空`);
      assert.ok(!/[<>]/.test(s.text), `${v.id}: 句文本不应含 HTML 尖括号`);
      prevEnd = s.end;
    }
    assert.ok(prevEnd <= v.durationSec + 1.5, `${v.id}: 最后一句超出音频时长`);
  }
});

test('video: 音频文件存在且非空', () => {
  for (const v of VIDEOS) {
    const p = path.join(ROOT, 'techspeak', v.audio);
    assert.ok(fs.existsSync(p), `${v.id}: 缺少音频文件 ${v.audio}`);
    const size = fs.statSync(p).size;
    assert.ok(size > 20000, `${v.id}: 音频过小（${size}B），疑似空文件`);
  }
});

test('video: video-data.js 与 video-imports 源目录一致（改素材须重跑 build）', () => {
  const ids = fs.readdirSync(path.join(ROOT, 'scripts', 'video-imports'))
    .filter(f => f.endsWith('.json')).sort().map(f => path.basename(f, '.json'));
  assert.deepEqual(VIDEOS.map(v => v.id).sort(), ids, 'video-data.js 与 scripts/video-imports 不一致');
  const onDisk = fs.readFileSync(path.join(ROOT, 'techspeak', 'video-data.js'), 'utf8');
  assert.equal(onDisk, buildVideoData(), 'techspeak/video-data.js 过期：请运行 node scripts/build-video-data.cjs');
});
