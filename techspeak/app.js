'use strict';
/* ============================================================
 * TechSpeak 应用逻辑
 * 语音：Web Speech API（TTS 播放 + SpeechRecognition 识别）
 * 录音：MediaRecorder（自我回听）
 * 评分：词级动态规划对齐（Levenshtein 相似度）+ 流畅性模型
 * ============================================================ */

/* ================= 基础工具 ================= */
/* 纯逻辑（esc / splitSentences / splitWords / 评分算法 / chunkSpeech）
 * 已抽取至 core.js，本文件只保留 DOM 与语音交互逻辑。 */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const SRSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

function fmtDate(ts) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function toast(msg, type = '') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${esc(msg)}</span>`;
  $('#toast-root').appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .4s'; setTimeout(() => el.remove(), 400); }, 2600);
}

/* ================= 词汇本 / 记录 存储 ================= */
const VocabStore = {
  key: 'techspeak_vocab_v1',
  all() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; } },
  save(l) { localStorage.setItem(this.key, JSON.stringify(l)); },
  has(word) { return this.all().some(v => v.word.toLowerCase() === word.toLowerCase()); },
  add(entry) {
    if (this.has(entry.word)) return false;
    const l = this.all();
    l.unshift(Object.assign({ addedAt: Date.now(), status: 'learning', reviews: 0 }, entry));
    this.save(l); return true;
  },
  remove(word) { this.save(this.all().filter(v => v.word.toLowerCase() !== word.toLowerCase())); },
  setStatus(word, status) {
    const l = this.all(); const v = l.find(x => x.word.toLowerCase() === word.toLowerCase());
    if (v) { v.status = status; v.reviews = (v.reviews || 0) + 1; this.save(l); }
  }
};
const HistoryStore = {
  key: 'techspeak_history_v1',
  all() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; } },
  add(r) { const l = this.all(); l.unshift(Object.assign({ ts: Date.now() }, r)); if (l.length > 500) l.length = 500; localStorage.setItem(this.key, JSON.stringify(l)); },
  clear() { localStorage.removeItem(this.key); }
};
const Prefs = {
  key: 'techspeak_prefs_v1',
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { return {}; } },
  set(o) { localStorage.setItem(this.key, JSON.stringify(Object.assign(this.get(), o))); }
};

/* 按词长加标点停顿加权，把播放进度映射到词序（逐词高亮估算） */
function wordWeights(text) {
  const words = splitWords(text);
  const weights = words.map(w => {
    const letters = w.replace(/[^\p{L}\p{N}]/gu, '').length || 1;
    let extra = 0.25;
    if (/[.!?]["')\]]*$/.test(w)) extra = 2.2;       /* 句末长停顿 */
    else if (/[,;:—]["')\]]*$/.test(w)) extra = 1.1; /* 子句停顿 */
    return letters + extra;
  });
  return { words, weights, total: weights.reduce((s, x) => s + x, 0) };
}

/* ================= TTS 引擎（双引擎） =================
 * 主引擎：预生成的微软神经网络语音 MP3（scripts/gen-audio.cjs
 * 用 edge-tts 离线生成 → techspeak/audio/<指纹>.mp3 + manifest.json，
 * 多邻国式"预生成静态音频"方案，跨设备音质一致）。
 * 兜底引擎：浏览器 Web Speech API（任意未预生成文本，如生词）。 */
const TTS = {
  voices: [], audioSet: null, audioEl: null, _timer: null,
  init() {
    const load = () => {
      this.voices = (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter(v => /^en[-_]/i.test(v.lang));
      const sel = $('#voice-select');
      if (sel && P && P.mode === 'listen') this.fillSelect(sel);
    };
    load();
    if (window.speechSynthesis) speechSynthesis.onvoiceschanged = load;
    /* 预生成音频清单；加载失败则整体回退 Web Speech（与旧版行为一致） */
    this.ready = fetch('audio/manifest.json')
      .then(r => r.ok ? r.json() : null)
      .then(m => { this.audioSet = (m && Array.isArray(m.files)) ? new Set(m.files) : null; })
      .catch(() => { this.audioSet = null; });
  },
  fillSelect(sel) {
    const cur = Prefs.get().voiceURI;
    sel.innerHTML = this.voices.map(v => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === cur ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('') || '<option>默认英文语音</option>';
  },
  pick() {
    const cur = Prefs.get().voiceURI;
    return this.voices.find(v => v.voiceURI === cur) || this.voices.find(v => /US/i.test(v.lang)) || this.voices[0] || null;
  },
  /* 双引擎入口：文本指纹命中预生成清单 → 播本地神经网络音频；
   * 未命中（生词等任意文本、清单缺失）→ Web Speech 兜底。 */
  async speak(text, opts = {}) {
    try { if (this.ready) await this.ready; } catch (e) { }
    const key = await ttsHash(text);
    if (key && this.audioSet && this.audioSet.has(key)) return this.playAudio(key, text, opts);
    return this.speakWeb(text, opts);
  },
  playAudio(key, text, opts = {}) {
    if (window.speechSynthesis) speechSynthesis.cancel();
    const audio = this.audioEl || (this.audioEl = new Audio());
    audio.pause();
    if ('preservesPitch' in audio) audio.preservesPitch = true; /* 变速不变调 */
    const { words, weights, total } = wordWeights(text);
    let lastIdx = -1, done = false, started = false;
    clearInterval(this._timer); this._timer = null;
    const abort = () => {
      done = true; audio.pause(); clearInterval(this._timer); this._timer = null;
      audio.onended = audio.onerror = audio.onloadedmetadata = null;
    };
    const finish = () => { if (done) return; abort(); opts.onEnd && opts.onEnd(); };
    audio.onended = finish;
    /* 起播前错误（404 / 解码失败）→ Web Speech 兜底；起播后的输出设备错误
     * （无音频设备环境媒体时钟仍在走、逐词高亮正常）不误杀 interval。 */
    audio.onerror = () => { if (done || started) return; abort(); this.speakWeb(text, opts); };
    audio.onloadedmetadata = () => {
      audio.onloadedmetadata = null; started = true;
      opts.onStart && opts.onStart();
      audio.playbackRate = opts.rate || 0.9;
      audio.play().catch(() => { if (!done) { abort(); this.speakWeb(text, opts); } });
      if (opts.onWord && words.length) {
        this._timer = setInterval(() => {
          const p = Math.min(audio.currentTime / (audio.duration || 1), 1);
          let acc = 0, idx = words.length - 1;
          for (let i = 0; i < words.length; i++) { acc += weights[i]; if (p * total < acc) { idx = i; break; } }
          if (idx !== lastIdx) { lastIdx = idx; opts.onWord(idx); }
        }, 60);
      }
    };
    audio.src = `audio/${key}.mp3`;
  },
  /* 原声分段播放（视频导入素材）：seek 到句起点、播到句终点自动收尾，
   * 逐词高亮用真实时间戳区间加权映射。音频不可用 → TTS 双引擎兜底。 */
  playSegment(src, seg, opts = {}) {
    if (window.speechSynthesis) speechSynthesis.cancel();
    const audio = this.audioEl || (this.audioEl = new Audio());
    audio.pause();
    if ('preservesPitch' in audio) audio.preservesPitch = true;
    const { words, weights, total } = wordWeights(seg.text);
    let lastIdx = -1, done = false, started = false;
    clearInterval(this._timer); this._timer = null;
    const abort = () => {
      done = true; audio.pause(); clearInterval(this._timer); this._timer = null;
      audio.onended = audio.onerror = audio.onloadedmetadata = null;
    };
    const finish = () => { if (done) return; abort(); opts.onEnd && opts.onEnd(); };
    audio.onended = finish;
    /* 起播前错误（404 / 解码失败）→ TTS 双引擎兜底；起播后的输出设备错误
     * （无音频设备环境媒体时钟仍在走、逐词高亮正常）不误杀 interval。 */
    audio.onerror = () => { if (done || started) return; abort(); this.speak(seg.text, opts); };
    const startSeg = () => {
      started = true;
      opts.onStart && opts.onStart();
      audio.playbackRate = opts.rate || 0.9;
      try { audio.currentTime = seg.start; } catch (e) { }
      audio.play().catch(() => { if (!done) { abort(); this.speak(seg.text, opts); } });
      if (opts.onWord && words.length) {
        const span = Math.max(seg.end - seg.start, 0.2);
        this._timer = setInterval(() => {
          if (audio.currentTime >= seg.end - 0.03) { finish(); return; }
          const p = Math.min(Math.max((audio.currentTime - seg.start) / span, 0), 1);
          let acc = 0, idx = words.length - 1;
          for (let i = 0; i < words.length; i++) { acc += weights[i]; if (p * total < acc) { idx = i; break; } }
          if (idx !== lastIdx) { lastIdx = idx; opts.onWord(idx); }
        }, 60);
      }
    };
    audio.onloadedmetadata = () => { audio.onloadedmetadata = null; startSeg(); };
    if (audio.getAttribute('src') === src) startSeg();  /* 同文件已在缓冲：免重载，直接 seek */
    else audio.src = src;
  },
  /* Web Speech 兜底引擎（预生成清单未命中时） */
  speakWeb(text, opts = {}) {
    if (!window.speechSynthesis) { toast('当前浏览器不支持语音合成', 'err'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = this.pick();
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-US'; }
    u.rate = opts.rate || 0.9;
    const words = []; let re = /\S+/g, m;
    while ((m = re.exec(text))) words.push(m.index);
    let estTimer = null, estIdx = 0, boundary = false, done = false;
    const finish = () => { if (done) return; done = true; clearInterval(estTimer); opts.onEnd && opts.onEnd(); };
    u.onboundary = e => {
      if (e.name && e.name !== 'word') return;
      boundary = true; clearInterval(estTimer);
      if (opts.onWord) {
        let idx = 0;
        for (let i = 0; i < words.length; i++) { if (e.charIndex >= words[i]) idx = i; else break; }
        opts.onWord(idx);
      }
    };
    u.onstart = () => {
      opts.onStart && opts.onStart();
      if (opts.onWord) {
        setTimeout(() => {
          if (boundary) return;
          const estDur = (words.length / (2.7 * u.rate)) * 1000;
          const step = Math.max(estDur / Math.max(words.length, 1), 120);
          estTimer = setInterval(() => { if (estIdx < words.length) opts.onWord(estIdx++); }, step);
        }, 650);
      }
    };
    u.onend = finish;
    u.onerror = finish;
    speechSynthesis.speak(u);
  },
  stop() {
    clearInterval(this._timer); this._timer = null;
    if (this.audioEl) { this.audioEl.pause(); this.audioEl.onended = this.audioEl.onerror = this.audioEl.onloadedmetadata = null; }
    if (window.speechSynthesis) speechSynthesis.cancel();
  }
};

/* ================= 语音识别引擎 ================= */
function createRecognizer(handlers) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { handlers.onFatal && handlers.onFatal('当前浏览器不支持语音识别，请使用 Chrome 或 Edge 打开本站。'); return null; }
  const rec = new SR();
  rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1;
  const st = { manualStop: false, finalText: '', lastEventT: 0, pauseCount: 0, firstSpeechT: 0, lastSpeechT: 0, confSum: 0, confN: 0, fatal: false, active: false, restartTimer: null, doneFired: false };
  rec.onresult = e => {
    const now = performance.now();
    if (st.lastEventT && now - st.lastEventT > 1500) st.pauseCount++;
    st.lastEventT = now;
    if (!st.firstSpeechT) st.firstSpeechT = now;
    st.lastSpeechT = now;
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i]; const t = r[0].transcript;
      if (r.isFinal) {
        st.finalText += (st.finalText ? ' ' : '') + t.trim();
        if (r[0].confidence > 0 && r[0].confidence <= 1) { st.confSum += r[0].confidence; st.confN++; }
      } else interim += t;
    }
    handlers.onUpdate && handlers.onUpdate(st.finalText + (interim ? (st.finalText ? ' ' : '') + interim : ''));
  };
  rec.onerror = e => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      st.fatal = true;
      handlers.onFatal && handlers.onFatal('麦克风权限被拒绝：请点击地址栏的锁形图标，允许麦克风访问后重试。');
    }
  };
  rec.onend = () => {
    if (!st.manualStop && !st.fatal && st.active) {
      st.restartTimer = setTimeout(() => { try { rec.start(); } catch (err) { } }, 250);
    } else {
      st.active = false; fireDone();
    }
  };
  function fireDone() {
    if (st.doneFired) return; st.doneFired = true;
    st.durationSec = st.firstSpeechT ? Math.max(0, (st.lastSpeechT - st.firstSpeechT) / 1000) : 0;
    handlers.onDone && handlers.onDone(st);
  }
  return {
    start() {
      st.manualStop = false; st.fatal = false; st.doneFired = false; st.finalText = '';
      st.lastEventT = 0; st.pauseCount = 0; st.firstSpeechT = 0; st.lastSpeechT = 0; st.confSum = 0; st.confN = 0; st.active = true;
      try { rec.start(); } catch (e) { }
    },
    stop() {
      st.manualStop = true; clearTimeout(st.restartTimer);
      try { rec.stop(); } catch (e) { st.active = false; fireDone(); }
      setTimeout(() => { if (st.active) { st.active = false; fireDone(); } }, 900);
    },
    state: st
  };
}

async function startVoiceRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    const chunks = [];
    mr.ondataavailable = e => chunks.push(e.data);
    mr.start();
    return {
      stop: () => new Promise(res => {
        mr.onstop = () => {
          try { const url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })); stream.getTracks().forEach(t => t.stop()); res(url); }
          catch (e) { res(null); }
        };
        try { mr.stop(); } catch (e) { res(null); }
      })
    };
  } catch (e) { return null; }
}

/* 评分算法（normalizeWord / prepareTokens / levDist / wordSim /
 * alignTokens / scoreAttempt / buildRefWords / chunkSpeech）位于 core.js */
/* ================= 练习会话（核心组件） ================= */
let P = null;

function mountPractice(ref) {
  let sentences, W;
  if (ref.media) {
    /* 视频素材：用导入时的句级切分（自带原声时间戳） */
    sentences = ref.media.segments.map(s => ({ text: s.text, words: splitWords(s.text), start: s.start, end: s.end }));
    W = [];
    sentences.forEach((s, si) => s.words.forEach((raw, wi) => W.push({ s: si, w: wi, raw })));
  } else ({ sentences, W } = buildRefWords(ref));
  /* mode 初始留空：mountPractice 末尾的 switchMode('listen') 需通过
   * "P.mode === mode 则跳过" 的守卫，才能完成听读控制区的首次渲染 */
  P = { ref, sentences, W, media: ref.media || null, mode: '', sent: 0, cancelled: false, listen: { playingAll: false, rate: Prefs.get().rate || 0.9 }, shadow: { rec: null, scores: {} }, fluency: { rec: null, recording: false, recorder: null } };
  let readerHTML = '';
  sentences.forEach((s, si) => {
    readerHTML += `<span class="sentence" data-s="${si}">`;
    s.words.forEach((raw, wi) => { readerHTML += `<span class="w" data-s="${si}" data-w="${wi}">${esc(raw)}</span> `; });
    readerHTML += '</span> ';
  });
  const focusNote = ref.focus ? `<div class="notice info mt-14"><div><b>练习要点</b>：${esc(ref.focus)}</div></div>` : '';
  const wpmNote = ref.wpmTarget ? `<span class="tag gold">目标语速 ${ref.wpmTarget} wpm</span>` : '';
  $('#main').innerHTML = `
    <a class="back-link" href="${esc(ref.back)}">← 返回</a>
    <div class="practice-head">
      <div>
        <h2>${esc(ref.title)}</h2>
        <div class="meta"><span class="tag">${esc(ref.kind === 'article' ? '博客文章' : ref.kind === 'video' ? '视频精练' : '句段练习')}</span><span>${esc(ref.subtitle)}</span>${wpmNote}</div>
      </div>
    </div>
    ${ref.video ? `<div class="text-muted text-sm mt-8">演讲者 <b>${esc(ref.video.speaker)}</b> · 来源 <b>${esc(VIDEO_META.platforms[ref.video.platform] || ref.video.platform)}</b> · ${esc(VIDEO_META.types[ref.video.type] || ref.video.type)} · 原声音频（变速不变调）${ref.video.sourceUrl ? ` · <a class="link-quiet" href="${esc(ref.video.sourceUrl)}" target="_blank" rel="noopener">视频来源 ↗</a>` : ''}</div>` : ''}
    ${!SRSupported ? '<div class="notice warn"><div>当前浏览器不支持语音识别。<b>听读模式可用</b>，跟读与评分请使用 Chrome / Edge（通过 localhost 或 https 访问）。</div></div>' : ''}
    ${focusNote}
    <div class="mode-tabs" id="mode-tabs">
      <div class="mode-tab" data-mode="listen"><div class="t">听读模式</div><div class="d">听标准朗读，逐词高亮跟看</div></div>
      <div class="mode-tab" data-mode="shadow"><div class="t">逐句跟读</div><div class="d">一句一听一读，即时词级反馈</div></div>
      <div class="mode-tab" data-mode="fluency"><div class="t">整段朗读评分</div><div class="d">完整朗读，输出多维评分报告</div></div>
    </div>
    <div class="reader" id="reader">${readerHTML}</div>
    <div class="text-muted text-sm mt-8">点击任意单词：听发音、看释义、加入词汇本</div>
    <div id="control-zone"></div>
    <div id="result-zone"></div>`;
  $$('#mode-tabs .mode-tab').forEach(tab => tab.addEventListener('click', () => switchMode(tab.dataset.mode)));
  $$('#reader .w').forEach(el => el.addEventListener('click', () => {
    const gi = P.W.findIndex(x => x.s === +el.dataset.s && x.w === +el.dataset.w);
    if (gi >= 0) openWordModal(P.W[gi].raw, P.sentences[+el.dataset.s].text);
  }));
  switchMode('listen');
}

function destroyPractice() {
  if (!P) return;
  P.cancelled = true;
  try { if (P.shadow.rec && P.shadow.rec.state.active) P.shadow.rec.stop(); } catch (e) { }
  try { if (P.fluency.rec && P.fluency.rec.state.active) P.fluency.rec.stop(); } catch (e) { }
  if (P.fluency.recorder) P.fluency.recorder.stop();
  TTS.stop();
  P = null;
}

function switchMode(mode) {
  if (!P) return;
  if (P.mode === mode) return;
  /* 离开旧模式前清理 */
  P.cancelled = true;
  try { if (P.shadow.rec && P.shadow.rec.state.active) P.shadow.rec.stop(); } catch (e) { }
  try { if (P.fluency.rec && P.fluency.rec.state.active) P.fluency.rec.stop(); } catch (e) { }
  if (P.fluency.recorder) { P.fluency.recorder.stop(); P.fluency.recorder = null; }
  TTS.stop();
  P.listen.playingAll = false;
  setTimeout(() => { if (P) P.cancelled = false; }, 50);
  P.mode = mode;
  $$('#mode-tabs .mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
  clearWordMarks(); clearSpeaking();
  $('#result-zone').innerHTML = '';
  if (mode === 'listen') renderListenControls();
  else if (mode === 'shadow') renderShadowControls();
  else renderFluencyControls();
}

function clearWordMarks() { $$('#reader .w').forEach(el => el.classList.remove('hit', 'close', 'miss', 'sub')); }
function clearSpeaking() { $$('#reader .w').forEach(el => el.classList.remove('speaking')); $$('#reader .sentence').forEach(el => el.classList.remove('current')); }
function setCurrentSentence(si) {
  $$('#reader .sentence').forEach(el => el.classList.toggle('current', +el.dataset.s === si));
}
function highlightWord(si, wi) {
  $$('#reader .w').forEach(el => { if (+el.dataset.s === si) el.classList.remove('speaking'); });
  const el = $(`#reader .w[data-s="${si}"][data-w="${wi}"]`);
  if (el) el.classList.add('speaking');
}

/* ---------- 听读模式 ---------- */
function renderListenControls() {
  $('#control-zone').innerHTML = `
    <div class="controls">
      <button class="btn btn-primary" id="btn-play-all">播放整段</button>
      <button class="btn" id="btn-play-one">播放当前句</button>
      <button class="btn btn-sm" id="btn-prev">上一句</button>
      <span class="tag grey" id="sent-indicator"></span>
      <button class="btn btn-sm" id="btn-next">下一句</button>
      <div class="speed-ctl">语速 <input type="range" id="rate" min="0.5" max="1.2" step="0.05" value="${P.listen.rate}"><span class="val" id="rate-val">${P.listen.rate.toFixed(2)}x</span></div>
      ${P.media ? '' : '<select id="voice-select" class="btn btn-sm" style="max-width:200px"></select>'}
    </div>
    <div class="text-muted text-sm mt-8">${P.media ? '演讲者原声音频（变速不变调）。' : ''}听读技巧：先 0.7x 精听每个词 → 1.0x 跟着默读 → 最后切换到跟读模式开口。</div>`;
  if (!P.media) TTS.fillSelect($('#voice-select'));
  updateSentIndicator();
  $('#btn-play-all').addEventListener('click', () => { P.listen.playingAll = true; playSentenceFrom(P.sent); });
  $('#btn-play-one').addEventListener('click', () => { P.listen.playingAll = false; playSentenceFrom(P.sent); });
  $('#btn-prev').addEventListener('click', () => { setSentence(Math.max(0, P.sent - 1)); });
  $('#btn-next').addEventListener('click', () => { setSentence(Math.min(P.sentences.length - 1, P.sent + 1)); });
  $('#rate').addEventListener('input', e => {
    P.listen.rate = +e.target.value; $('#rate-val').textContent = P.listen.rate.toFixed(2) + 'x';
    Prefs.set({ rate: P.listen.rate });
  });
  if (!P.media) $('#voice-select').addEventListener('change', e => Prefs.set({ voiceURI: e.target.value }));
}
function updateSentIndicator() { const el = $('#sent-indicator'); if (el) el.textContent = `句 ${P.sent + 1} / ${P.sentences.length}`; }
function setSentence(si) {
  P.sent = si; setCurrentSentence(si); updateSentIndicator();
  if (P.mode === 'listen') { P.listen.playingAll = false; TTS.stop(); playSentenceFrom(si); }
  else if (P.mode === 'shadow') { clearWordMarks(); renderShadowControls(); }
}
/* 播放一句：视频素材用原声分段，其余走 TTS 双引擎 */
function playSentenceAudio(si, opts = {}) {
  const s = P.sentences[si];
  const o = Object.assign({ rate: P.listen.rate, onWord: wi => highlightWord(si, wi) }, opts);
  if (P.media) TTS.playSegment(P.media.audio, s, o);
  else TTS.speak(s.text, o);
}
function playSentenceFrom(si) {
  P.sent = si; setCurrentSentence(si); updateSentIndicator(); clearSpeaking();
  playSentenceAudio(si, {
    onEnd: () => {
      if (P && P.listen.playingAll && !P.cancelled) {
        if (si + 1 < P.sentences.length) setTimeout(() => { if (P && P.listen.playingAll) playSentenceFrom(si + 1); }, 520);
        else P.listen.playingAll = false;
      }
    }
  });
}

/* ---------- 逐句跟读模式 ---------- */
function renderShadowControls() {
  const chips = P.sentences.map((s, i) => {
    const sc = P.shadow.scores[i];
    const cls = sc == null ? '' : sc >= 80 ? 's-good' : sc >= 60 ? 's-mid' : 's-bad';
    return `<span class="sent-chip ${i === P.sent ? 'active' : ''}" data-si="${i}">${i + 1}${sc != null ? ` <span class="sc ${cls}">${sc}</span>` : ''}</span>`;
  }).join('');
  $('#control-zone').innerHTML = `
    <div class="sent-nav">${chips}</div>
    <div class="controls">
      <button class="btn" id="btn-shadow-listen">听原句</button>
      <button class="btn btn-rec" id="btn-shadow-rec">跟读本句</button>
      <button class="btn" id="btn-shadow-next">下一句</button>
      <div class="speed-ctl">语速 <input type="range" id="rate" min="0.5" max="1.2" step="0.05" value="${P.listen.rate}"><span class="val" id="rate-val">${P.listen.rate.toFixed(2)}x</span></div>
    </div>
    <div class="transcript-box" id="transcript">点击 <b>跟读本句</b> 后朗读当前句子…</div>`;
  $$('.sent-chip').forEach(c => c.addEventListener('click', () => { P.sent = +c.dataset.si; clearWordMarks(); renderShadowControls(); }));
  $('#btn-shadow-listen').addEventListener('click', () => playSentenceAudio(P.sent));
  $('#btn-shadow-next').addEventListener('click', () => { if (P.sent < P.sentences.length - 1) { P.sent++; clearWordMarks(); renderShadowControls(); } });
  $('#rate').addEventListener('input', e => { P.listen.rate = +e.target.value; $('#rate-val').textContent = P.listen.rate.toFixed(2) + 'x'; Prefs.set({ rate: P.listen.rate }); });
  $('#btn-shadow-rec').addEventListener('click', startShadowRec);
}
function startShadowRec() {
  if (P.shadow.rec && P.shadow.rec.state.active) { P.shadow.rec.stop(); return; }
  setCurrentSentence(P.sent);
  const btn = $('#btn-shadow-rec'); btn.textContent = '停止并评分'; btn.classList.remove('btn-rec');
  $('#transcript').innerHTML = '<span class="live-dot"></span>正在聆听，请朗读当前句子…';
  const sentWords = P.W.filter(x => x.s === P.sent).map(x => x.raw);
  const targetTokens = prepareTokens(sentWords);
  P.cancelled = false;
  P.shadow.rec = createRecognizer({
    onUpdate: txt => { const t = $('#transcript'); if (t) t.innerHTML = `<span class="live-dot"></span>${esc(txt)}`; },
    onFatal: msg => { toast(msg, 'err'); resetShadowBtn(); },
    onDone: st => {
      if (!P || P.cancelled || P.mode !== 'shadow') return;
      resetShadowBtn();
      const recTokens = prepareTokens(splitWords(st.finalText));
      const sc = scoreAttempt(targetTokens, recTokens, st);
      P.shadow.scores[P.sent] = sc.overall;
      colorSentenceFromOps(P.sent, sc.ops);
      $('#transcript').innerHTML = st.finalText ? `${esc(st.finalText)}` : '未识别到语音，请再试一次。';
      $('#result-zone').innerHTML = `
        <div class="card score-panel mt-20">
          <div class="flex-between"><b>第 ${P.sent + 1} 句 · 跟读评分</b>
          <button class="btn btn-sm" id="btn-shadow-retry">再读一遍</button></div>
          <div class="score-hero mt-14">${ringHTML(sc.overall)}
            <div class="dim-grid">
              ${dimHTML('准确率', sc.accuracy)}${dimHTML('清晰度', sc.clarity)}
              ${dimHTML('完整度', sc.completeness)}${dimHTML('流畅度', sc.fluency)}
            </div></div>
          <div class="stat-row">
            <div class="stat-item"><b>${sc.wpm}</b><span>语速 wpm</span></div>
            <div class="stat-item"><b>${sc.pauses}</b><span>停顿次数</span></div>
            <div class="stat-item"><b>${sc.durationSec}s</b><span>朗读用时</span></div>
            <div class="stat-item"><b>${sc.hit}/${sc.targetCount}</b><span>命中词数</span></div>
          </div>
          <div class="suggestions">${suggestionsHTML(sc)}</div>
        </div>`;
      $('#btn-shadow-retry').addEventListener('click', startShadowRec);
      HistoryStore.add({ refType: P.ref.kind, refTitle: `${P.ref.refTitle} · 句${P.sent + 1}`, mode: 'shadow', overall: sc.overall, accuracy: sc.accuracy, fluency: sc.fluency, clarity: sc.clarity, completeness: sc.completeness, wpm: sc.wpm, durationSec: sc.durationSec });
      renderShadowChipsBadges();
    }
  });
  if (P.shadow.rec) P.shadow.rec.start();
}
function resetShadowBtn() { const btn = $('#btn-shadow-rec'); if (btn) { btn.textContent = '跟读本句'; btn.classList.add('btn-rec'); } }
function renderShadowChipsBadges() {
  const chips = P.sentences.map((s, i) => {
    const sc = P.shadow.scores[i];
    const cls = sc == null ? '' : sc >= 80 ? 's-good' : sc >= 60 ? 's-mid' : 's-bad';
    return `<span class="sent-chip ${i === P.sent ? 'active' : ''}" data-si="${i}">${i + 1}${sc != null ? ` <span class="sc ${cls}">${sc}</span>` : ''}</span>`;
  }).join('');
  const nav = $('.sent-nav'); if (nav) nav.innerHTML = chips;
  $$('.sent-chip').forEach(c => c.addEventListener('click', () => { P.sent = +c.dataset.si; clearWordMarks(); renderShadowControls(); }));
}

/* ---------- 整段朗读（流畅性）模式 ---------- */
function renderFluencyControls() {
  $('#control-zone').innerHTML = `
    <div class="controls">
      <button class="btn btn-rec btn-lg" id="btn-flu-rec">开始整段朗读</button>
      <button class="btn" id="btn-flu-clear">清除标记</button>
    </div>
    <div class="transcript-box" id="transcript">点击 <b>开始整段朗读</b>，一口气读完整段文字，系统将评估你的准确率、语速与停顿…</div>`;
  $('#btn-flu-rec').addEventListener('click', startFluencyRec);
  $('#btn-flu-clear').addEventListener('click', () => { clearWordMarks(); $('#result-zone').innerHTML = ''; });
}
async function startFluencyRec() {
  if (P.fluency.recording) { P.fluency.recording = false; try { P.fluency.rec.stop(); } catch (e) { } return; }
  clearWordMarks(); clearSpeaking();
  P.fluency.recording = true; P.cancelled = false;
  const btn = $('#btn-flu-rec'); btn.textContent = '停止并评分'; btn.classList.remove('btn-rec');
  $('#transcript').innerHTML = '<span class="live-dot"></span>正在聆听，请完整朗读整段文字…';
  const targetTokens = prepareTokens(P.W.map(x => x.raw));
  P.cancelled = false;
  P.fluency.rec = createRecognizer({
    onUpdate: txt => { const t = $('#transcript'); if (t) t.innerHTML = `<span class="live-dot"></span>${esc(txt)}`; },
    onFatal: msg => {
      toast(msg, 'err'); resetFluBtn(); P.fluency.recording = false;
      if (P.fluency.recorder) { P.fluency.recorder.stop(); P.fluency.recorder = null; }
    },
    onDone: async st => {
      if (!P || P.cancelled || P.mode !== 'fluency') return;
      resetFluBtn(); P.fluency.recording = false;
      let audioURL = null;
      if (P.fluency.recorder) { audioURL = await P.fluency.recorder.stop(); P.fluency.recorder = null; }
      const recTokens = prepareTokens(splitWords(st.finalText));
      const sc = scoreAttempt(targetTokens, recTokens, st);
      colorSentenceFromOps(-1, sc.ops);
      $('#transcript').innerHTML = st.finalText ? `${esc(st.finalText)}` : '未识别到语音，请再试一次。';
      $('#result-zone').innerHTML = `
        <div class="card score-panel mt-20">
          <div class="flex-between"><b>整段朗读 · 评分报告</b>
            <div class="flex gap-8"><button class="btn btn-sm" id="btn-flu-retry">再来一次</button></div></div>
          <div class="score-hero mt-14">${ringHTML(sc.overall)}
            <div class="dim-grid">
              ${dimHTML('准确率', sc.accuracy)}${dimHTML('清晰度', sc.clarity)}
              ${dimHTML('完整度', sc.completeness)}${dimHTML('流畅度', sc.fluency)}
            </div></div>
          <div class="stat-row">
            <div class="stat-item"><b>${sc.wpm}</b><span>语速 wpm${P.ref.wpmTarget ? `（目标 ${P.ref.wpmTarget}）` : ''}</span></div>
            <div class="stat-item"><b>${sc.pauses}</b><span>停顿次数</span></div>
            <div class="stat-item"><b>${sc.durationSec}s</b><span>朗读用时</span></div>
            <div class="stat-item"><b>${sc.hit}/${sc.targetCount}</b><span>命中词数</span></div>
          </div>
          ${audioURL ? `<audio class="player" controls src="${audioURL}"></audio><div class="text-muted text-sm">回听自己的录音，对比标准语音找差距</div>` : ''}
          <div class="suggestions">${suggestionsHTML(sc)}</div>
        </div>`;
      $('#btn-flu-retry').addEventListener('click', startFluencyRec);
      HistoryStore.add({ refType: P.ref.kind, refTitle: P.ref.refTitle, mode: 'fluency', overall: sc.overall, accuracy: sc.accuracy, fluency: sc.fluency, clarity: sc.clarity, completeness: sc.completeness, wpm: sc.wpm, durationSec: sc.durationSec });
    }
  });
  if (!P.fluency.rec) { resetFluBtn(); P.fluency.recording = false; return; }
  P.fluency.recorder = await startVoiceRecording();
  P.fluency.rec.start();
}
function resetFluBtn() { const btn = $('#btn-flu-rec'); if (btn) { btn.textContent = '开始整段朗读'; btn.classList.add('btn-rec'); } }

function colorSentenceFromOps(si, ops) {
  ops.forEach(o => {
    if (!o.tw) return;
    o.tw.is.forEach(gi => {
      const word = P.W[gi];
      if (!word) return;
      if (si >= 0 && word.s !== si) return;
      const el = $(`#reader .w[data-s="${word.s}"][data-w="${word.w}"]`);
      if (el) el.classList.add(o.type === 'hit' ? 'hit' : o.type === 'close' ? 'close' : o.type === 'sub' ? 'sub' : 'miss');
    });
  });
}

/* ---------- 评分渲染 ---------- */
function ringHTML(score) {
  const c = 2 * Math.PI * 54;
  const color = score >= 80 ? 'var(--good)' : score >= 60 ? 'var(--warn)' : 'var(--bad)';
  return `<div class="score-ring"><svg width="128" height="128" viewBox="0 0 128 128">
    <circle cx="64" cy="64" r="54" fill="none" stroke="var(--panel-3)" stroke-width="11"/>
    <circle cx="64" cy="64" r="54" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - score / 100)}" style="transition: stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1);"/>
  </svg><div class="num"><b style="color:${color}">${score}</b><span>总分</span></div></div>`;
}
function dimHTML(label, val) {
  const v = Math.round(val * 100);
  return `<div class="dim"><div class="lbl"><b>${label}</b><span class="v">${v}</span></div><div class="bar"><i style="width:${v}%"></i></div></div>`;
}
function suggestionsHTML(sc) {
  const out = [];
  if (sc.empty) { out.push(`<div class="suggestion"><div>没有识别到语音。请检查麦克风权限，或靠近麦克风再试一次。</div></div>`); return out.join(''); }
  if (sc.overall >= 85) out.push(`<div class="suggestion"><div><b>出色的表现！</b>继续保持这个节奏，可以挑战更高难度的 Advanced 素材。</div></div>`);
  if (sc.closeWords.length) {
    const words = sc.closeWords.slice(0, 6).map(w => `<span class="clickable" data-say="${esc(w.raw)}">${esc(w.raw)}</span>`).join('、');
    out.push(`<div class="suggestion"><div>以下单词可能发音不够准（听成 <i>${esc(sc.closeWords.slice(0, 3).map(w => w.heard).join(', '))}</i>…）：${words}。点击单词听标准发音，跟读 3 遍。</div></div>`);
  }
  if (sc.missCount > 0) out.push(`<div class="suggestion"><div>有 <b>${sc.missCount}</b> 个词未读出（红色下划线标记），注意不要吞词、跳词。</div></div>`);
  if (sc.wpm > 0 && sc.wpm < 95) out.push(`<div class="suggestion"><div>语速 <b>${sc.wpm} wpm</b> 偏慢。演讲语速建议 110–150 wpm，试着按意群连读，减少词间停顿。</div></div>`);
  if (sc.wpm > 170) out.push(`<div class="suggestion"><div>语速 <b>${sc.wpm} wpm</b> 偏快。在关键数据和术语前刻意停顿，给听众吸收时间。</div></div>`);
  if (sc.accuracy < 0.7 && sc.closeWords.length + sc.missCount > 3) out.push(`<div class="suggestion"><div>准确率偏低：建议先回到<b>听读模式</b>用 0.7x 语速精听，再切到<b>逐句跟读</b>逐个攻克。</div></div>`);
  if (sc.pauses >= 4 && sc.durationSec > 8) out.push(`<div class="suggestion"><div>停顿较频繁（${sc.pauses} 次）。练习"意群朗读"：一口气读完一个短语，只在逗号和句号处换气。</div></div>`);
  if (!out.length) out.push(`<div class="suggestion"><div>整体不错！可再练一遍冲击更高分，或进入下一篇素材。</div></div>`);
  return out.join('');
}
document.addEventListener('click', e => {
  const say = e.target.closest('[data-say]');
  if (say) TTS.speak(say.dataset.say, { rate: 0.85 });
});

/* ================= 单词弹窗 ================= */
function lookupGlossary(contextWords, idx) {
  if (!contextWords) return null;
  const norm = contextWords.map(normalizeWord);
  for (let start = Math.max(0, idx - 2); start <= idx && start < norm.length; start++) {
    for (let len = 3; len >= 1; len--) {
      if (start + len > norm.length || idx >= start + len || idx < start) continue;
      const phrase = norm.slice(start, start + len).join(' ');
      if (GLOSSARY_MAP[phrase]) return GLOSSARY_MAP[phrase];
    }
  }
  const w = norm[idx]; if (!w) return null;
  const cands = [w.replace(/'s$/, ''), w.replace(/es$/, ''), w.replace(/s$/, ''), w.replace(/ing$/, ''), w.replace(/ed$/, ''), w.replace(/ed$/, 'ing'), w.replace(/er$/, ''), w + 'e'];
  for (const c of cands) if (GLOSSARY_MAP[c]) return GLOSSARY_MAP[c];
  return null;
}
function openWordModal(word, context) {
  const g = lookupGlossary(splitWords(context || ''), splitWords(context || '').findIndex(x => normalizeWord(x) === normalizeWord(word)));
  const inVocab = VocabStore.has(word);
  const glossaryBlock = g ? `
    <div class="chip-row mb-14"><span class="tag teal">${esc(g.cat)}</span><span class="tag grey">${esc(g.ipa)}</span></div>
    <div style="font-size:15px">${esc(g.zh)}</div>
    <div class="text-muted text-sm mt-8" style="font-style:italic">${esc(g.def)}</div>
    <div class="ex mt-14" style="background:var(--bg-soft);padding:10px 14px;border-radius:9px;border-left:3px solid var(--accent);font-size:13.5px">${esc(g.example)}</div>` : '';
  $('#modal-root').innerHTML = `
    <div class="modal-mask" id="word-modal">
      <div class="modal-box">
        <div class="modal-head">
          <h3>${esc(word)} ${g ? `<span class="tag teal">${esc(g.cat)}</span>` : ''}</h3>
          <button class="modal-close" id="modal-x">✕</button>
        </div>
        ${g ? `<div class="text-muted" style="font-family:var(--mono);font-size:14px">${esc(g.ipa)}</div>` : ''}
        <div class="flex gap-8 mt-14">
          <button class="btn" id="btn-word-say">听发音</button>
          <button class="btn btn-primary" id="btn-word-add" ${inVocab ? 'disabled' : ''}>${inVocab ? '✓ 已在词汇本' : '加入词汇本'}</button>
        </div>
        ${glossaryBlock}
        ${context ? `<div class="mt-14"><div class="text-muted text-sm">遇到的语境：</div><div class="text-sm mt-8" style="font-style:italic;border-left:2px solid var(--border);padding-left:10px">${esc(context)}</div></div>` : ''}
        ${g ? `<div class="divider"></div><b class="text-sm">练习术语例句</b><div class="mini-practice mt-8" data-text="${esc(g.example)}"></div>` : ''}
      </div>
    </div>`;
  $('#modal-x').addEventListener('click', closeModal);
  $('#word-modal').addEventListener('click', e => { if (e.target.id === 'word-modal') closeModal(); });
  $('#btn-word-say').addEventListener('click', () => TTS.speak(word, { rate: 0.85 }));
  $('#btn-word-add').addEventListener('click', () => {
    const ok = VocabStore.add({ word, ipa: g ? g.ipa : '', zh: g ? g.zh : '', context: context || '', source: g ? '术语库' : '练习文章' });
    toast(ok ? `「${word}」已加入词汇本` : '已在词汇本中', ok ? 'ok' : '');
    if (ok) $('#btn-word-add').outerHTML = '<button class="btn" disabled>✓ 已在词汇本</button>';
  });
  mountMiniPractice($('.mini-practice'));
}
function closeModal() { $('#modal-root').innerHTML = ''; }

/* ================= 迷你练习（句型/术语例句） ================= */
function mountMiniPractice(box) {
  if (!box) return;
  const text = box.dataset.text;
  const g = lookupGlossary(splitWords(text), 0);
  box.innerHTML = `
    <div class="flex gap-8 flex-wrap">
      <button class="btn btn-sm">听</button>
      <button class="btn btn-sm btn-rec">跟读评分</button>
    </div>
    <div class="mini-result"></div>`;
  const [listenBtn, recBtn] = $$('button', box);
  const result = $('.mini-result', box);
  listenBtn.addEventListener('click', () => TTS.speak(text, { rate: 0.9 }));
  recBtn.addEventListener('click', () => {
    if (recBtn.dataset.active === '1') { box.rec.stop(); return; }
    recBtn.dataset.active = '1'; recBtn.textContent = '停止'; recBtn.classList.remove('btn-rec');
    const targetTokens = prepareTokens(splitWords(text));
    const refTitle = box.dataset.title || text.slice(0, 30);
    const refType = box.dataset.type || 'pattern';
    box.rec = createRecognizer({
      onUpdate: txt => { result.innerHTML = `<div class="text-muted text-sm" style="font-style:italic"><span class="live-dot"></span>${esc(txt)}</div>`; },
      onFatal: msg => { toast(msg, 'err'); recBtn.dataset.active = ''; recBtn.textContent = '跟读评分'; recBtn.classList.add('btn-rec'); },
      onDone: st => {
        recBtn.dataset.active = ''; recBtn.textContent = '跟读评分'; recBtn.classList.add('btn-rec');
        const recTokens = prepareTokens(splitWords(st.finalText));
        const sc = scoreAttempt(targetTokens, recTokens, st);
        const cls = sc.overall >= 80 ? 'sp-good' : sc.overall >= 60 ? 'sp-mid' : 'sp-bad';
        let colored = '';
        sc.ops.forEach(o => {
          if (!o.tw) return;
          const cls = o.type === 'hit' ? '' : o.type === 'close' ? 'close' : o.type === 'sub' ? 'sub' : 'miss';
          colored += `<span class="${cls}" style="border-radius:3px;padding:0 2px;">${esc(o.tw.raw)}</span> `;
        });
        result.innerHTML = `
          <div class="mt-8 flex gap-12 flex-wrap" style="align-items:center">
            <span class="score-pill ${cls}">${sc.overall} 分</span>
            <span class="text-muted text-sm">准确 ${Math.round(sc.accuracy * 100)} · 流畅 ${Math.round(sc.fluency * 100)} · ${sc.wpm} wpm</span>
          </div>
          <div class="mt-8 text-sm" style="line-height:1.9">${colored}</div>
          ${sc.closeWords.length ? `<div class="text-muted text-sm mt-8">发音可再打磨：${sc.closeWords.slice(0, 5).map(w => `<span class="clickable" data-say="${esc(w.raw)}" style="cursor:pointer;font-weight:700">${esc(w.raw)}</span>`).join('、')}（点击可听）</div>` : ''}`;
        bindSays(result);
        HistoryStore.add({ refType, refTitle, mode: 'mini', overall: sc.overall, accuracy: sc.accuracy, fluency: sc.fluency, clarity: sc.clarity, completeness: sc.completeness, wpm: sc.wpm, durationSec: sc.durationSec });
      }
    });
    if (box.rec) box.rec.start(); else { recBtn.dataset.active = ''; recBtn.textContent = '跟读评分'; }
  });
}
function bindSays(root) {
  $$('[data-say]', root).forEach(el => el.addEventListener('click', () => TTS.speak(el.dataset.say, { rate: 0.85 })));
}

/* ================= 页面视图 ================= */
function articleParaRef(a, pi) {
  return {
    kind: 'article', id: `${a.id}-${pi}`,
    route: `#/practice/${a.id}/${pi}`,
    title: `${a.title} · ${a.paragraphs[pi].title}`,
    subtitle: `${a.source} · ${a.date} · ${a.difficulty}`,
    back: `#/article/${a.id}`, text: a.paragraphs[pi].text, refTitle: `${a.title} · ${a.paragraphs[pi].title}`
  };
}
function libParaRef(p) {
  return {
    kind: 'paragraph', id: `lib-${p.id}`, route: `#/ppractice/${p.id}`, title: p.theme,
    subtitle: `${p.difficulty} · ${p.sourceNote}`, back: '#/paragraphs', text: p.text, refTitle: p.theme,
    focus: p.focus, wpmTarget: p.wpmTarget
  };
}

function viewHome() {
  const recs = HistoryStore.all();
  const vocab = VocabStore.all();
  const avg = recs.length ? Math.round(recs.slice(0, 10).reduce((s, r) => s + r.overall, 0) / Math.min(recs.length, 10)) : 0;
  const days = new Set(recs.map(r => new Date(r.ts).toDateString()));
  let streak = 0; const d = new Date();
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
  const allRefs = [];
  ARTICLES.forEach(a => a.paragraphs.forEach((_, pi) => allRefs.push(articleParaRef(a, pi))));
  PARAGRAPHS.forEach(p => allRefs.push(libParaRef(p)));
  VIDEOS.forEach(v => allRefs.push(videoRef(v)));
  const pick = allRefs[new Date().getDate() % allRefs.length];
  $('#main').innerHTML = `
    ${!SRSupported ? '<div class="notice warn"><div>当前浏览器不支持<b>语音识别</b>（跟读/评分需要）。请使用 <b>Chrome / Edge</b>，并通过 <b>localhost 或 https</b> 访问本站。听读与浏览功能不受影响。</div></div>' : ''}
    <div class="card hero">
      <h1>把世界级的技术博客，<br>变成你的<span class="grad">英语演讲练习台</span></h1>
      <p>精选 Anthropic、Google DeepMind、Google Cloud 官方博客的真实素材 —— 听标准朗读、逐句跟读、整段演讲评分，配套 AI/Infra 术语、句型与专属词汇本。</p>
      <div class="cta-row">
        <button class="btn btn-primary btn-lg" onclick="location.hash='#/library'">进入文章库</button>
        <button class="btn btn-lg" onclick="location.hash='#/paragraphs'">句段速练</button>
      </div>
      <div class="src-row">
        <span class="tag">Anthropic</span><span class="tag teal">Google DeepMind</span><span class="tag gold">Google Cloud Infra</span>
      </div>
    </div>
    <div class="grid grid-4 stat-cards">
      <div class="card stat-card"><div class="k">练习次数</div><div class="v">${recs.length}<small> 次</small></div></div>
      <div class="card stat-card"><div class="k">近 10 次平均分</div><div class="v">${avg || '—'}</div></div>
      <div class="card stat-card"><div class="k">词汇本</div><div class="v">${vocab.length}<small> 词</small></div></div>
      <div class="card stat-card"><div class="k">连续练习</div><div class="v">${streak}<small> 天</small></div></div>
    </div>
    <div class="section-title">今日推荐 <span class="line"></span></div>
    <div class="card">
      <div class="flex-between">
        <div>
          <h3 style="font-size:18px">${esc(pick.title)}</h3>
          <div class="text-muted text-sm mt-8">${esc(pick.subtitle)}</div>
        </div>
        <button class="btn btn-primary" onclick="location.hash='${pick.route}'">开始练习 →</button>
      </div>
    </div>
    <div class="section-title">核心能力 <span class="line"></span></div>
    <div class="grid grid-4">
      <div class="card feature-card" onclick="location.hash='#/library'"><h3>听读 · 跟读</h3><p>逐词高亮的标准朗读，可调语速；逐句跟读即时词级反馈。</p></div>
      <div class="card feature-card" onclick="location.hash='#/library'"><h3>多维评分</h3><p>准确率 / 清晰度 / 完整度 / 流畅度四维打分，语速与停顿分析。</p></div>
      <div class="card feature-card" onclick="location.hash='#/glossary'"><h3>AI / Infra 术语</h3><p>56+ 领域专属术语：发音、释义、真实例句、跟读练习。</p></div>
      <div class="card feature-card" onclick="location.hash='#/vocab'"><h3>词汇本</h3><p>练习中一键收藏生词，附原始语境，内置翻卡复习模式。</p></div>
    </div>`;
}

function viewLibrary() {
  const cards = ARTICLES.map(a => `
    <div class="card article-card">
      <span class="src-badge src-${a.sourceClass}">${esc(a.source)}</span>
      <h3>${esc(a.title)}</h3>
      <div class="meta-row">
        <span class="diff-stars">${'★'.repeat(a.level)}${'☆'.repeat(3 - a.level)}</span>
        <span>${esc(a.difficulty)}</span><span>·</span><span>${esc(a.date)}</span>
        ${a.tags.map(t => `<span class="tag grey">${esc(t)}</span>`).join('')}
      </div>
      <div class="desc">${esc(a.desc)}</div>
      <div class="para-list">
        ${a.paragraphs.map((p, i) => `
          <div class="para-item" onclick="location.hash='#/practice/${a.id}/${i}'">
            <div class="idx">${i + 1}</div>
            <div class="body"><div class="pt">${esc(p.title)}</div><div class="pd">${esc(p.text.slice(0, 76))}…</div></div>
            <div class="go">练习 →</div>
          </div>`).join('')}
      </div>
      <a class="link-quiet text-sm" href="${esc(a.url)}" target="_blank" rel="noopener">查看原文 ↗</a>
    </div>`).join('');
  $('#main').innerHTML = `
    <div class="page-head"><h1>文章库</h1><div class="sub">节选自 Anthropic / Google DeepMind / Google Cloud 官方博客的真实段落。每段可进行听读、逐句跟读、整段朗读评分三种练习。</div></div>
    <div class="grid">${cards}</div>`;
}

function viewArticle(aid) {
  const a = ARTICLES.find(x => x.id === aid);
  if (!a) return viewNotFound();
  $('#main').innerHTML = `
    <a class="back-link" href="#/library">← 返回文章库</a>
    <div class="page-head">
      <h1>${esc(a.title)}</h1>
      <div class="sub flex gap-8"><span class="src-badge src-${a.sourceClass}">${esc(a.source)}</span><span>${esc(a.date)}</span><span class="diff-stars">${'★'.repeat(a.level)}${'☆'.repeat(3 - a.level)}</span>${a.tags.map(t => `<span class="tag grey">${esc(t)}</span>`).join('')}</div>
    </div>
    <div class="card mb-14"><div class="text-muted text-sm">${esc(a.desc)} <a class="link-quiet" href="${esc(a.url)}" target="_blank" rel="noopener">阅读原文 ↗</a></div></div>
    <div class="para-list">
      ${a.paragraphs.map((p, i) => `
        <div class="para-item card" onclick="location.hash='#/practice/${a.id}/${i}'">
          <div class="idx">${i + 1}</div>
          <div class="body"><div class="pt">${esc(p.title)}</div><div class="pd" style="white-space:normal">${esc(p.text.slice(0, 140))}…</div></div>
          <div class="go">练习 →</div>
        </div>`).join('')}
    </div>`;
}

function viewNotFound() {
  $('#main').innerHTML = `<div class="empty">页面不存在，<a href="#/">返回首页</a></div>`;
}

function viewGlossary() {
  const cats = ['全部', 'AI/ML', 'Infra/Systems', 'Business'];
  const render = (cat, q) => {
    const list = GLOSSARY.filter(g => (cat === '全部' || g.cat === cat) && (!q || g.term.includes(q.toLowerCase()) || g.zh.includes(q)));
    $('#glossary-grid').innerHTML = list.map(g => `
      <div class="card term-card">
        <div class="term-head">
          <span class="term-word" data-say="${esc(g.term)}">${esc(g.term)}</span>
          <span class="ipa">${esc(g.ipa)}</span>
          <span class="tag ${g.cat === 'AI/ML' ? '' : g.cat === 'Business' ? 'gold' : 'teal'}">${esc(g.cat)}</span>
        </div>
        <div class="zh">${esc(g.zh)}</div>
        <div class="def">${esc(g.def)}</div>
        <div class="ex">${esc(g.example)}</div>
        <div class="actions">
          <button class="btn btn-sm" data-say="${esc(g.term)}">发音</button>
          <button class="btn btn-sm btn-primary" data-practice="${esc(g.term)}">练习</button>
          <button class="btn btn-sm" data-add="${esc(g.term)}">${VocabStore.has(g.term) ? '✓ 已收藏' : '词汇本'}</button>
        </div>
      </div>`).join('') || '<div class="empty" style="grid-column:1/-1">没有匹配的术语</div>';
    bindSays($('#glossary-grid'));
    $$('[data-add]', $('#glossary-grid')).forEach(b => b.addEventListener('click', () => {
      const g = GLOSSARY.find(x => x.term === b.dataset.add);
      const ok = VocabStore.add({ word: g.term, ipa: g.ipa, zh: g.zh, context: g.example, source: '术语库' });
      toast(ok ? `「${g.term}」已加入词汇本` : '已在词汇本中', ok ? 'ok' : '');
      if (ok) b.textContent = '✓ 已收藏';
    }));
    $$('[data-practice]', $('#glossary-grid')).forEach(b => b.addEventListener('click', () => {
      const g = GLOSSARY.find(x => x.term === b.dataset.practice);
      openWordModal(g.term, g.example);
    }));
  };
  $('#main').innerHTML = `
    <div class="page-head"><h1>AI / Infra 术语库</h1><div class="sub">${GLOSSARY.length} 个技术与商业高频术语：音标、中文释义、英文定义与真实语境例句。点击术语听发音，或进行例句跟读练习。</div></div>
    <div class="flex gap-12 mb-14" style="align-items:center">
      <div class="search-box" style="flex:1;max-width:380px"><input id="g-search" placeholder="搜索术语 / 中文释义…"></div>
      <div class="chip-row" id="g-cats">${cats.map((c, i) => `<span class="chip ${i === 0 ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}</span>`).join('')}</div>
    </div>
    <div class="glossary-grid" id="glossary-grid"></div>`;
  let curCat = '全部';
  render('全部', '');
  $('#g-search').addEventListener('input', e => render(curCat, e.target.value.trim()));
  $$('#g-cats .chip').forEach(c => c.addEventListener('click', () => {
    $$('#g-cats .chip').forEach(x => x.classList.remove('active')); c.classList.add('active');
    curCat = c.dataset.cat; render(curCat, $('#g-search').value.trim());
  }));
}

function viewPatterns() {
  const html = PATTERNS.map(cat => `
    <div class="pattern-cat"><h3>${esc(cat.category)}</h3><div class="line"></div></div>
    <div class="grid grid-2">
      ${cat.items.map(p => `
        <div class="card pattern-card">
          <div class="flex-between"><b>${esc(p.name)}</b></div>
          <div class="pattern-template mt-8">${esc(p.template).replace(/\{([^}]+)\}/g, '<span class="slot">{$1}</span>')}</div>
          ${p.examples.map(ex => `
            <div class="pattern-ex">
              <div class="en">${esc(ex.en)}</div>
              <div class="zh">${esc(ex.zh)}</div>
              <div class="mini-practice mt-8" data-text="${esc(ex.en)}" data-title="${esc(p.name)}" data-type="pattern"></div>
            </div>`).join('')}
          <div class="pattern-note"><span>${esc(p.note)}</span></div>
        </div>`).join('')}
    </div>`).join('');
  $('#main').innerHTML = `
    <div class="page-head"><h1>演讲句型库</h1><div class="sub">技术与商业演讲的 ${PATTERNS.reduce((s, c) => s + c.items.length, 0)} 个高频句型：开场、发布、架构、指标、权衡、规模、商业价值、收尾与 Q&A。每个例句都可以跟读评分。</div></div>
    ${html}`;
  $$('.mini-practice').forEach(mountMiniPractice);
}

function viewParagraphs() {
  $('#main').innerHTML = `
    <div class="page-head"><h1>句段库 · 整段朗读</h1><div class="sub">按主题精选的 50–90 词练习段，来自三大博客的真实表述。每段附练习要点（重音、连读、数字读法）与目标语速，适合流畅性打磨。</div></div>
    <div class="grid grid-2">
      ${PARAGRAPHS.map(p => `
        <div class="card">
          <div class="flex-between">
            <h3 style="font-size:16.5px">${esc(p.theme)}</h3>
            <span class="tag ${p.difficulty === 'Advanced' ? 'gold' : p.difficulty === 'Basic' ? 'teal' : ''}">${esc(p.difficulty)}</span>
          </div>
          <div class="text-muted text-sm mt-8">${esc(p.sourceNote)} · 目标 <b>${p.wpmTarget} wpm</b> · ${splitWords(p.text).length} 词</div>
          <div class="mt-14 text-sm" style="line-height:1.9;color:var(--muted)">${esc(p.text.slice(0, 150))}…</div>
          <div class="notice info mt-14" style="margin-bottom:0"><div>${esc(p.focus)}</div></div>
          <button class="btn btn-primary mt-14" onclick="location.hash='#/ppractice/${p.id}'">进入练习 →</button>
        </div>`).join('')}
    </div>`;
}

/* ---------- 视频精练（导入素材） ---------- */
const VIDEO_META = {
  platforms: { bilibili: 'B站', douyin: '抖音', weibo: '微博视频', wechat: '微信视频号', local: '本地上传' },
  types: { keynote: '主题演讲', interview: '访谈', press: '产品发布会', talk: '大会分享', other: '其他' }
};
function videoRef(v) {
  return {
    kind: 'video', id: `video-${v.id}`, route: `#/vpractice/${v.id}`,
    title: v.title, subtitle: `${v.speaker} · ${v.published}`,
    back: '#/videos', refTitle: v.title, focus: v.focus, wpmTarget: v.wpmTarget,
    media: { audio: v.audio, segments: v.sentences }, video: v
  };
}
function fmtDur(sec) { const m = Math.floor(sec / 60), s = Math.round(sec % 60); return `${m}:${String(s).padStart(2, '0')}`; }
function viewVideos() {
  const plats = ['全部', ...new Set(VIDEOS.map(v => v.platform))];
  const render = pf => {
    const list = VIDEOS.filter(v => pf === '全部' || v.platform === pf);
    $('#video-grid').innerHTML = list.map(v => `
      <div class="card article-card">
        <div class="flex gap-8 flex-wrap">
          <span class="tag gold">${esc(VIDEO_META.platforms[v.platform] || v.platform)}</span>
          <span class="tag teal">${esc(VIDEO_META.types[v.type] || v.type)}</span>
        </div>
        <h3 class="mt-8">${esc(v.title)}</h3>
        <div class="meta-row">
          <span class="diff-stars">${'★'.repeat(v.level)}${'☆'.repeat(3 - v.level)}</span>
          <span>${esc(v.speaker)}</span><span>·</span><span>${esc(v.published)}</span>
          ${v.tags.map(t => `<span class="tag grey">${esc(t)}</span>`).join('')}
        </div>
        <div class="desc">${esc(v.desc)}</div>
        <div class="text-muted text-sm mt-8">原声 ${fmtDur(v.durationSec)} · ${v.sentences.length} 句 · ${v.sentences.reduce((s, x) => s + splitWords(x.text).length, 0)} 词 · 句级时间戳对齐</div>
        <div class="flex gap-8 mt-14">
          <button class="btn btn-primary" onclick="location.hash='#/vpractice/${esc(v.id)}'">进入练习 →</button>
          ${v.sourceUrl ? `<a class="btn" href="${esc(v.sourceUrl)}" target="_blank" rel="noopener">视频来源 ↗</a>` : ''}
        </div>
      </div>`).join('') || '<div class="empty" style="grid-column:1/-1">该平台暂无素材</div>';
  };
  $('#main').innerHTML = `
    <div class="page-head"><h1>视频精练</h1><div class="sub">从 B站 / 抖音 / 微博视频 / 微信视频号导入的真实演讲与访谈，保留<b>演讲者原声</b>：句级时间戳对齐逐词高亮，支持听读、逐句跟读与整段朗读评分。来源与类型均已用标签标注。</div></div>
    <div class="grid grid-4 mb-14">
      <div class="card stat-card"><div class="k">素材数</div><div class="v">${VIDEOS.length}</div></div>
      <div class="card stat-card"><div class="k">总时长</div><div class="v">${fmtDur(VIDEOS.reduce((s, v) => s + v.durationSec, 0))}</div></div>
      <div class="card stat-card"><div class="k">总句数</div><div class="v">${VIDEOS.reduce((s, v) => s + v.sentences.length, 0)}</div></div>
      <div class="card stat-card"><div class="k">来源平台</div><div class="v">${new Set(VIDEOS.map(v => v.platform)).size}</div></div>
    </div>
    <div class="flex gap-12 mb-14" style="align-items:center">
      <div class="chip-row" id="v-plats">${plats.map((p, i) => `<span class="chip ${i === 0 ? 'active' : ''}" data-p="${esc(p)}">${esc(p === '全部' ? p : (VIDEO_META.platforms[p] || p))}</span>`).join('')}</div>
    </div>
    <div class="grid" id="video-grid"></div>`;
  render('全部');
  $$('#v-plats .chip').forEach(c => c.addEventListener('click', () => {
    $$('#v-plats .chip').forEach(x => x.classList.remove('active')); c.classList.add('active');
    render(c.dataset.p);
  }));
}

/* ---------- 词汇本 ---------- */
function viewVocab() {
  const render = (filter, q) => {
    let list = VocabStore.all();
    if (filter === 'learning') list = list.filter(v => v.status === 'learning');
    if (filter === 'mastered') list = list.filter(v => v.status === 'mastered');
    if (q) list = list.filter(v => v.word.toLowerCase().includes(q.toLowerCase()));
    $('#vocab-list').innerHTML = list.map(v => `
      <div class="card vocab-card">
        <div class="vw">${esc(v.word)}${v.ipa ? `<span class="vipa">${esc(v.ipa)}</span>` : ''}</div>
        <div class="vbody">
          <div class="vzh">${esc(v.zh || '')} <span class="status-pill ${v.status}">${v.status === 'mastered' ? '已掌握' : '学习中'}</span></div>
          ${v.context ? `<div class="vctx">"${esc(v.context)}"</div>` : ''}
          <div class="vsrc">来源：${esc(v.source || '')} · ${fmtDate(v.addedAt)} · 复习 ${v.reviews || 0} 次</div>
        </div>
        <div class="vactions">
          <button class="btn btn-sm" data-say="${esc(v.word)}">发音</button>
          <button class="btn btn-sm" data-master="${esc(v.word)}">${v.status === 'mastered' ? '取消掌握' : '✓ 已掌握'}</button>
          <button class="btn btn-sm btn-danger" data-del="${esc(v.word)}">删除</button>
        </div>
      </div>`).join('') || '<div class="empty" style="grid-column:1/-1">词汇本还是空的 —— 在练习中点击生词即可加入</div>';
    bindSays($('#vocab-list'));
    $$('[data-master]', $('#vocab-list')).forEach(b => b.addEventListener('click', () => {
      const v = VocabStore.all().find(x => x.word === b.dataset.master);
      VocabStore.setStatus(b.dataset.master, v.status === 'mastered' ? 'learning' : 'mastered');
      render(curFilter, curQ);
    }));
    $$('[data-del]', $('#vocab-list')).forEach(b => b.addEventListener('click', () => { VocabStore.remove(b.dataset.del); render(curFilter, curQ); }));
  };
  const all = VocabStore.all();
  $('#main').innerHTML = `
    <div class="page-head"><h1>词汇本</h1><div class="sub">练习中点击生词即可收藏（含原始语境）。进入翻卡复习模式，巩固记忆。</div></div>
    <div class="grid grid-4 mb-14">
      <div class="card stat-card"><div class="k">总词数</div><div class="v">${all.length}</div></div>
      <div class="card stat-card"><div class="k">学习中</div><div class="v">${all.filter(v => v.status !== 'mastered').length}</div></div>
      <div class="card stat-card"><div class="k">已掌握</div><div class="v">${all.filter(v => v.status === 'mastered').length}</div></div>
      <div class="card" style="display:flex;align-items:center;gap:10px">
        <button class="btn btn-primary" id="btn-flash">翻卡复习</button>
        <button class="btn" id="btn-export">导出</button>
      </div>
    </div>
    <div class="flex gap-12 mb-14" style="align-items:center">
      <div class="search-box" style="flex:1;max-width:340px"><input id="v-search" placeholder="搜索单词…"></div>
      <div class="chip-row" id="v-filters">
        <span class="chip active" data-f="all">全部</span>
        <span class="chip" data-f="learning">学习中</span>
        <span class="chip" data-f="mastered">已掌握</span>
      </div>
    </div>
    <div class="grid" id="vocab-list"></div>`;
  let curFilter = 'all', curQ = '';
  render('all', '');
  $('#v-search').addEventListener('input', e => { curQ = e.target.value.trim(); render(curFilter, curQ); });
  $$('#v-filters .chip').forEach(c => c.addEventListener('click', () => {
    $$('#v-filters .chip').forEach(x => x.classList.remove('active')); c.classList.add('active');
    curFilter = c.dataset.f; render(curFilter, curQ);
  }));
  $('#btn-flash').addEventListener('click', startFlashcards);
  $('#btn-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(VocabStore.all(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'techspeak-vocab.json'; a.click();
    toast('词汇本已导出', 'ok');
  });
}

function startFlashcards() {
  let deck = VocabStore.all().filter(v => v.status !== 'mastered');
  if (!deck.length) { toast('没有"学习中"的词汇，先去收藏一些生词吧', ''); return; }
  deck = deck.slice().sort(() => Math.random() - 0.5);
  let idx = 0, flipped = false;
  const renderCard = () => {
    const v = deck[idx];
    $('#modal-root').innerHTML = `
      <div class="flash-overlay">
        <div class="flash-box">
          <div class="flash-progress">
            <span class="text-muted text-sm">${idx + 1} / ${deck.length}</span>
            <button class="btn btn-sm" id="flash-quit">退出复习</button>
          </div>
          <div class="card flash-card" id="flash-card">
            <div class="flash-word">${esc(v.word)}</div>
            ${v.ipa ? `<div class="flash-ipa">${esc(v.ipa)}</div>` : ''}
            <button class="btn btn-sm" data-say="${esc(v.word)}">听发音</button>
            ${flipped ? `
              <div class="flash-answer">
                <div class="zh">${esc(v.zh || '（暂无释义）')}</div>
                ${v.context ? `<div class="ctx">"${esc(v.context)}"</div>` : ''}
                <div class="flex gap-8 mt-14" style="justify-content:center">
                  <button class="btn btn-primary" id="flash-good">已掌握</button>
                  <button class="btn" id="flash-again">继续练</button>
                </div>
              </div>` : `<div class="text-muted text-sm">点击卡片查看释义</div>`}
          </div>
        </div>
      </div>`;
    bindSays($('#modal-root'));
    $('#flash-quit').addEventListener('click', () => { $('#modal-root').innerHTML = ''; });
    $('#flash-card').addEventListener('click', e => {
      if (e.target.closest('button')) return;
      flipped = true; renderCard();
    });
    if (flipped) {
      $('#flash-good').addEventListener('click', () => {
        VocabStore.setStatus(deck[idx].word, 'mastered');
        next();
      });
      $('#flash-again').addEventListener('click', () => { VocabStore.setStatus(deck[idx].word, 'learning'); next(); });
    }
  };
  const next = () => {
    idx++; flipped = false;
    if (idx >= deck.length) {
      $('#modal-root').innerHTML = '';
      toast('本轮复习完成！', 'ok');
      route();
    } else renderCard();
  };
  renderCard();
}

/* ---------- 练习记录 ---------- */
function viewHistory() {
  const recs = HistoryStore.all();
  const avg = recs.length ? Math.round(recs.reduce((s, r) => s + r.overall, 0) / recs.length) : 0;
  const best = recs.length ? Math.max(...recs.map(r => r.overall)) : 0;
  const totalTime = recs.reduce((s, r) => s + (r.durationSec || 0), 0);
  const days = new Set(recs.map(r => new Date(r.ts).toDateString()));
  let streak = 0; const d = new Date();
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
  const trend = recs.slice(0, 20).reverse();
  const chart = trend.length > 1 ? trendSVG(trend.map(r => r.overall)) : '';
  const modeName = { shadow: '逐句跟读', fluency: '整段朗读', mini: '句型/术语' };
  $('#main').innerHTML = `
    <div class="page-head"><h1>练习记录</h1><div class="sub">所有跟读与朗读评分的历史记录与趋势。数据保存在本地浏览器中。</div></div>
    <div class="grid grid-4 mb-14">
      <div class="card stat-card"><div class="k">练习次数</div><div class="v">${recs.length}</div></div>
      <div class="card stat-card"><div class="k">平均总分</div><div class="v">${avg || '—'}</div></div>
      <div class="card stat-card"><div class="k">最高分</div><div class="v">${best || '—'}</div></div>
      <div class="card stat-card"><div class="k">累计朗读</div><div class="v">${Math.round(totalTime / 60)}<small> 分钟</small></div></div>
    </div>
    ${chart ? `<div class="card mb-14"><b class="text-sm">最近 ${trend.length} 次总分趋势</b><div class="mt-8">${chart}</div></div>` : ''}
    <div class="card">
      <div class="flex-between mb-14"><b class="text-sm">记录明细</b>${recs.length ? '<button class="btn btn-sm btn-danger" id="btn-clear">清空记录</button>' : ''}</div>
      ${recs.length ? `<div class="table-wrap"><table class="rec-table">
        <tr><th>时间</th><th>素材</th><th>模式</th><th>总分</th><th>准确率</th><th>流畅度</th><th>语速</th><th>用时</th></tr>
        ${recs.slice(0, 60).map(r => `
          <tr>
            <td class="text-muted">${fmtDate(r.ts)}</td><td>${esc(r.refTitle || '')}</td><td class="text-muted">${modeName[r.mode] || r.mode}</td>
            <td><span class="score-pill ${r.overall >= 80 ? 'sp-good' : r.overall >= 60 ? 'sp-mid' : 'sp-bad'}">${r.overall}</span></td>
            <td>${Math.round((r.accuracy || 0) * 100)}</td><td>${Math.round((r.fluency || 0) * 100)}</td>
            <td>${r.wpm || '—'}</td><td class="text-muted">${r.durationSec || 0}s</td>
          </tr>`).join('')}
      </table></div>` : '<div class="empty">还没有练习记录，去文章库开始第一次跟读吧</div>'}
    </div>`;
  const clearBtn = $('#btn-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (confirm('确定清空全部练习记录？')) { HistoryStore.clear(); route(); }
  });
}
function trendSVG(scores) {
  const w = 640, h = 150, padL = 26, padB = 22, padT = 10;
  const n = scores.length;
  const x = i => padL + (w - padL - 10) * (n === 1 ? 0.5 : i / (n - 1));
  const y = v => padT + (h - padT - padB) * (1 - v / 100);
  const pts = scores.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const grid = [40, 60, 80, 100].map(v => `<line x1="${padL}" y1="${y(v)}" x2="${w - 10}" y2="${y(v)}" stroke="var(--border-soft)" stroke-dasharray="3 5"/><text x="0" y="${y(v) + 4}" fill="var(--muted-2)" font-size="10">${v}</text>`).join('');
  const dots = scores.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="${v >= 80 ? 'var(--good)' : v >= 60 ? 'var(--warn)' : 'var(--bad)'}"/>`).join('');
  return `<svg class="trend-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    ${grid}<polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>
    ${dots}</svg>`;
}

/* ---------- 关于 ---------- */
function viewAbout() {
  $('#main').innerHTML = `
    <div class="page-head"><h1>关于 TechSpeak</h1><div class="sub">面向技术与商业人士的英语演讲练习工具。</div></div>
    <div class="grid grid-2">
      <div class="card">
        <h3 class="mb-14">素材来源</h3>
        <p class="text-sm text-muted">练习素材节选自以下官方博客，版权归原作者所有，仅作英语学习用途：</p>
        <div class="mt-14 flex" style="flex-direction:column;gap:10px">
          ${ARTICLES.map(a => `<a class="link-quiet text-sm" href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.title)} — ${esc(a.source)} ↗</a>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3 class="mb-14">评分如何计算</h3>
        <div class="text-sm text-muted" style="display:flex;flex-direction:column;gap:8px">
          <div><b class="text" style="color:var(--text)">准确率（45%）</b>：语音识别结果与原文的词级动态规划对齐，逐词判定 命中 / 相近 / 错误 / 漏读。</div>
          <div><b style="color:var(--text)">清晰度（15%）</b>：来自浏览器语音识别的置信度。</div>
          <div><b style="color:var(--text)">完整度（10%）</b>：成功覆盖的原文词占比。</div>
          <div><b style="color:var(--text)">流畅度（30%）</b>：语速（建议 110–150 wpm）与停顿频率的综合。</div>
        </div>
      </div>
      <div class="card">
        <h3 class="mb-14">浏览器要求</h3>
        <div class="text-sm text-muted">
          语音识别基于 <b>Web Speech API</b>，需要 <b>Chrome / Edge</b>，且通过 <b>localhost 或 https</b> 访问。本地运行：<code class="kbd">python3 -m http.server 8080</code> 后访问 <code class="kbd">http://localhost:8080</code>。首次使用需允许麦克风权限。
        </div>
      </div>
      <div class="card">
        <h3 class="mb-14">数据隐私</h3>
        <div class="text-sm text-muted">词汇本与练习记录保存在你浏览器的 localStorage，不上传任何服务器。语音识别由浏览器内置引擎处理。</div>
      </div>
    </div>`;
}

/* ================= 路由 ================= */
function route() {
  destroyPractice();
  closeModal();
  const hash = location.hash || '#/';
  $$('#nav a').forEach(a => a.classList.toggle('active', a.dataset.route === hash.split('/').slice(0, 2).join('/')));
  const m = hash.match(/^#\/practice\/([\w-]+)\/(\d+)$/);
  if (m) {
    const a = ARTICLES.find(x => x.id === m[1]);
    if (a && a.paragraphs[+m[2]]) return mountPractice(articleParaRef(a, +m[2]));
    return viewNotFound();
  }
  const mp = hash.match(/^#\/ppractice\/([\w-]+)$/);
  if (mp) {
    const p = PARAGRAPHS.find(x => x.id === mp[1]);
    if (p) return mountPractice(libParaRef(p));
    return viewNotFound();
  }
  const mv = hash.match(/^#\/vpractice\/([\w-]+)$/);
  if (mv) {
    const v = VIDEOS.find(x => x.id === mv[1]);
    if (v) return mountPractice(videoRef(v));
    return viewNotFound();
  }
  if (hash === '#/videos') return viewVideos();
  if (hash === '#/' || hash === '') return viewHome();
  if (hash === '#/library') return viewLibrary();
  const ma = hash.match(/^#\/article\/([\w-]+)$/);
  if (ma) return viewArticle(ma[1]);
  if (hash === '#/glossary') return viewGlossary();
  if (hash === '#/patterns') return viewPatterns();
  if (hash === '#/paragraphs') return viewParagraphs();
  if (hash === '#/vocab') return viewVocab();
  if (hash === '#/history') return viewHistory();
  if (hash === '#/about') return viewAbout();
  viewNotFound();
}
window.addEventListener('hashchange', route);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ================= 启动 ================= */
TTS.init();
route();
$('#mic-check').className = 'mic-check ' + (SRSupported ? 'ok' : 'bad');
$('#mic-check').textContent = SRSupported ? '语音识别可用' : '语音识别不可用，请用 Chrome/Edge';
