#!/usr/bin/env node
'use strict';
/* ============================================================
 * 汇总 scripts/video-imports/*.json → techspeak/video-data.js
 * 单一事实来源模式（同 scripts/tts-units.cjs）：
 *   - import-video.py 产出素材 JSON（含句级时间戳）
 *   - 本脚本生成浏览器加载的 video-data.js
 *   - tests/video.test.js 锁定两者一致（改素材必须重新生成）
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const IMPORTS_DIR = path.join(__dirname, 'video-imports');
const OUT = path.join(ROOT, 'techspeak', 'video-data.js');

const HEADER = `/* ============================================================
 * TechSpeak 视频练习素材（由 scripts/build-video-data.cjs 生成，勿手改）
 * 来源：scripts/video-imports/*.json（import-video.py 产出）
 * 版权归原视频作者所有，仅作英语学习用途，原视频地址见 sourceUrl。
 * ============================================================ */
`;

function buildVideoData() {
  const ids = fs.readdirSync(IMPORTS_DIR).filter(f => f.endsWith('.json')).sort();
  const videos = ids.map(f => {
    const entry = JSON.parse(fs.readFileSync(path.join(IMPORTS_DIR, f), 'utf8'));
    const audioAbs = path.join(ROOT, 'techspeak', entry.audio);
    if (!fs.existsSync(audioAbs)) throw new Error(`缺少音频文件: ${entry.audio}`);
    return entry;
  });
  const body = `const VIDEOS = ${JSON.stringify(videos, null, 2)};

if (typeof module !== 'undefined' && module.exports) module.exports = { VIDEOS };
`;
  return HEADER + body;
}

function main() {
  fs.writeFileSync(OUT, buildVideoData());
  console.log(`✅ 生成 ${OUT}`);
}

module.exports = { buildVideoData };
if (require.main === module) main();
