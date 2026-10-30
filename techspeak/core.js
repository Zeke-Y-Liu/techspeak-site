'use strict';
/* ============================================================
 * TechSpeak 核心纯逻辑层（浏览器 / Node 测试共用）
 * 从 app.js 抽取：文本切分、规范化、评分算法、语音分块。
 * 不依赖 DOM，便于单元 / 回归 / 安全测试。
 * ============================================================ */

/* ---------- 通用工具 ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function splitSentences(text) {
  const t = text.replace(/\s+/g, ' ').trim();
  /* 保护小数点（3.5 / 42.5）不被当作句号切分 */
  const guarded = t.replace(/(\d)\.(\d)/g, '$1\u0001$2');
  const m = guarded.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g);
  return (m || [guarded]).map(s => s.replace(/\u0001/g, '.').trim()).filter(Boolean);
}

function splitWords(text) { return text.split(/\s+/).filter(Boolean); }

/* ---------- TTS 音频键（预生成音频的文本指纹） ----------
 * 三端（浏览器 app.js / scripts 生成端 / tests）同一算法：
 * 规范化空白 → SHA-256 → 取前 8 字节 hex（16 字符）。
 * 依赖 crypto.subtle（https 与 localhost 均属 secure context，可用）。 */
async function ttsHash(text) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (!t) return null;
  if (typeof crypto === 'undefined' || !crypto.subtle) return null;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  return Array.from(new Uint8Array(buf)).slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ---------- 文本规范化与数字转换 ---------- */
function normalizeWord(w) {
  return (w || '').toLowerCase()
    .replace(/[\u2019\u2018]/g, "'")
    .replace(/[^a-z0-9'.\-]/g, '')
    .replace(/^['.\-]+|['.\-]+$/g, '');
}
const NUM_UNITS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const NUM_SCALES = { hundred: 100, thousand: 1000, million: 1e6, billion: 1e9, trillion: 1e12 };

/* 把连续的英文数字词合并成数字 token（两侧同样处理，保证对齐一致） */
function prepareTokens(rawWords, indexMapper) {
  const toks = rawWords.map((raw, i) => ({ norm: normalizeWord(raw), i })).filter(t => t.norm);
  const out = [];
  let i = 0;
  const isNumStart = w => NUM_UNITS[w] != null || NUM_SCALES[w] != null;
  while (i < toks.length) {
    if (isNumStart(toks[i].norm)) {
      let j = i, total = 0, current = 0, any = false, pointMode = false, dec = '';
      const is = [];
      while (j < toks.length) {
        const w = toks[j].norm;
        if (!pointMode) {
          if (NUM_UNITS[w] != null) { current += NUM_UNITS[w]; any = true; }
          else if (NUM_SCALES[w]) { total += (current || 1) * NUM_SCALES[w]; current = 0; any = true; }
          else if (w === 'point' && any && j + 1 < toks.length && NUM_UNITS[toks[j + 1].norm] != null && NUM_UNITS[toks[j + 1].norm] < 10) { pointMode = true; }
          else if (w === 'and' && any && j + 1 < toks.length && (isNumStart(toks[j + 1].norm))) { }
          else break;
        } else {
          if (NUM_UNITS[w] != null && NUM_UNITS[w] < 10) { dec += String(NUM_UNITS[w]); }
          else break;
        }
        is.push(toks[j].i); j++;
      }
      if (j > i) {
        let val = String(total + current);
        if (pointMode && dec) val += '.' + dec;
        out.push({ norm: val, is, raw: rawWords[toks[i].i] });
        i = j; continue;
      }
    }
    out.push({ norm: toks[i].norm, is: [toks[i].i], raw: rawWords[toks[i].i] });
    i++;
  }
  /* "4 x" → "4x" 合并 */
  for (let k = 0; k < out.length - 1; k++) {
    if (/^\d+(\.\d+)?$/.test(out[k].norm) && out[k + 1].norm === 'x') {
      out[k] = { norm: out[k].norm + 'x', is: out[k].is.concat(out[k + 1].is), raw: out[k].raw + 'x' };
      out.splice(k + 1, 1);
    }
  }
  return out;
}

/* ---------- 评分算法 ---------- */
function levDist(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}
function wordSim(a, b) {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;
  return 1 - levDist(a, b) / Math.max(a.length, b.length);
}
function alignTokens(target, rec) {
  const n = target.length, m = rec.length;
  const INS = 0.55, DEL = 1.0;
  const subCost = (a, b) => a === b ? 0 : 1 - wordSim(a, b);
  const dp = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
  for (let i = 0; i <= n; i++) dp[i][0] = i * DEL;
  for (let j = 0; j <= m; j++) dp[0][j] = j * INS;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    dp[i][j] = Math.min(dp[i - 1][j - 1] + subCost(target[i - 1].norm, rec[j - 1].norm), dp[i - 1][j] + DEL, dp[i][j - 1] + INS);
  }
  const ops = []; let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const c = subCost(target[i - 1].norm, rec[j - 1].norm);
      if (Math.abs(dp[i][j] - (dp[i - 1][j - 1] + c)) < 1e-9) {
        const a = target[i - 1].norm, b = rec[j - 1].norm;
        const s = a === b ? 1 : wordSim(a, b);
        ops.push({ type: a === b ? 'hit' : (s >= 0.55 ? 'close' : 'sub'), tw: target[i - 1], rw: rec[j - 1], sim: s });
        i--; j--; continue;
      }
    }
    if (i > 0 && Math.abs(dp[i][j] - (dp[i - 1][j] + DEL)) < 1e-9) { ops.push({ type: 'miss', tw: target[i - 1] }); i--; continue; }
    if (j > 0) { ops.push({ type: 'extra', rw: rec[j - 1] }); j--; continue; }
    break;
  }
  ops.reverse();
  return ops;
}
function scoreAttempt(targetTokens, recTokens, stats) {
  const ops = alignTokens(targetTokens, recTokens);
  let hit = 0, closeSum = 0, closeCount = 0, missCount = 0;
  const closeWords = [], missWords = [];
  ops.forEach(o => {
    if (o.type === 'hit') hit++;
    else if (o.type === 'close') { closeSum += o.sim; closeCount++; closeWords.push({ raw: o.tw.raw, heard: o.rw.norm }); }
    else if (o.type === 'miss') { missCount++; missWords.push(o.tw.raw); }
  });
  const n = Math.max(targetTokens.length, 1);
  const accuracy = Math.min(1, (hit + closeSum * 0.7) / n);
  const completeness = Math.min(1, (hit + closeCount * 0.5) / n);
  let fluency = 0, wpm = 0;
  if (recTokens.length > 0 && stats.durationSec > 0.5) {
    const durMin = stats.durationSec / 60;
    wpm = recTokens.length / durMin;
    const paceScore = (wpm >= 100 && wpm <= 165) ? 1 : (wpm < 100 ? Math.max(0, 1 - (100 - wpm) / 65) : Math.max(0, 1 - (wpm - 165) / 85));
    const ppm = stats.pauseCount / durMin;
    const pauseScore = ppm <= 12 ? 1 : Math.max(0, 1 - (ppm - 12) / 16);
    fluency = 0.6 * paceScore + 0.4 * pauseScore;
  }
  const clarity = stats.confN > 0 ? stats.confSum / stats.confN : 0.8;
  const overall = recTokens.length === 0 ? 0 : Math.round(100 * (0.45 * accuracy + 0.15 * clarity + 0.1 * completeness + 0.3 * fluency));
  return { overall, accuracy, completeness, fluency, clarity, wpm: Math.round(wpm), pauses: stats.pauseCount, durationSec: Math.round(stats.durationSec || 0), ops, hit, closeCount, missCount, closeWords, missWords, targetCount: targetTokens.length, recCount: recTokens.length, empty: recTokens.length === 0 };
}

/* ---------- 练习文本构建 ---------- */
function buildRefWords(ref) {
  const sentences = splitSentences(ref.text).map(t => ({ text: t, words: splitWords(t) }));
  const W = [];
  sentences.forEach((s, si) => s.words.forEach((raw, wi) => W.push({ s: si, w: wi, raw })));
  return { sentences, W };
}

/* ---------- TTS 语音分块（流畅度核心） ----------
 * 浏览器 speechSynthesis 对长文本（尤其 >200 字符）会出现
 * 中途截断 / 卡顿 / 静默。按子句边界切成短块顺序播放，
 * 每块记录其在整句中的起始词序号，供逐词高亮回映射。 */
function chunkSpeech(text, maxLen = 200) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (!t) return [];
  if (t.length <= maxLen) return [{ text: t, startWi: 0, words: splitWords(t).length }];
  /* 子句 = 标点（,;:）处切分并保留标点，形成自然停顿。
   * 用 lastIndex 推进的切片保证内容零丢失：全局 match 在
   * "标点后无空格"（如千分位 9,216）时会整段跳过前文。 */
  const clauses = [];
  {
    const cre = /[,;:]+(?:\s|$)/g;
    let last = 0, m;
    while ((m = cre.exec(t)) !== null) {
      clauses.push(t.slice(last, m.index + m[0].length));
      last = m.index + m[0].length;
    }
    if (last < t.length) clauses.push(t.slice(last));
  }
  const chunks = [];
  let cur = null, gi = 0;
  for (let k = 0; k < clauses.length; k++) {
    const c = clauses[k].trim();
    if (!c) continue;
    const w = splitWords(c).length;
    if (cur && cur.text.length + 1 + c.length > maxLen) { chunks.push(cur); cur = null; }
    if (!cur) cur = { text: '', startWi: gi, words: 0 };
    cur.text = cur.text ? cur.text + ' ' + c : c;
    cur.words += w;
    gi += w;
  }
  if (cur) chunks.push(cur);
  /* 无标点的超长子句：按词硬切兜底 */
  const out = [];
  chunks.forEach(ch => {
    if (ch.text.length <= maxLen) { out.push(ch); return; }
    const ws = splitWords(ch.text);
    let piece = [], pw = 0, pstart = ch.startWi, acc = 0;
    ws.forEach(wd => {
      if (acc + wd.length + 1 > maxLen && piece.length) {
        out.push({ text: piece.join(' '), startWi: pstart, words: pw });
        pstart += pw; piece = []; pw = 0; acc = 0;
      }
      piece.push(wd); pw++; acc += wd.length + 1;
    });
    if (piece.length) out.push({ text: piece.join(' '), startWi: pstart, words: pw });
  });
  return out;
}

/* ---------- Node 测试导出（浏览器中不生效） ---------- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    esc, splitSentences, splitWords, ttsHash, normalizeWord, NUM_UNITS, NUM_SCALES,
    prepareTokens, levDist, wordSim, alignTokens, scoreAttempt,
    buildRefWords, chunkSpeech
  };
}
