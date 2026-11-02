# TechSpeak 马斯克演讲素材导入测试报告

**日期**：2026-11-02
**版本**：commit `7fb9d96`（main，CI run `41464733441` 全绿）
**任务**：增加最近一次埃隆·马斯克的演讲内容，处理方式同黄仁勋演讲（见 TEST-REPORT-video-import.md）
**线上地址**：https://zeke-y-liu.github.io/techspeak-site/#/vpractice/musk-roadster-event-2026

---

## 1. 素材概况

马斯克最近一次公开演讲为 **2026-10-15 特斯拉全新 Roadster 发布会**（得州 SpaceX 麦格雷戈试验基地，飞行演示 + 现场技术讲解）。

| 指标 | 值 |
|---|---|
| 素材 ID | `musk-roadster-event-2026` |
| 标题 | 特斯拉 Roadster 发布会演讲（技术讲解节选） |
| 演讲者 | 埃隆·马斯克 Elon Musk（含设计团队技术讲解） |
| 来源 | B站官方全程镜像 `BV17zn66hEga`（46:42，发布 2026-10-21） |
| 平台 / 类型 | `bilibili` / `press`（产品发布会） |
| 裁剪窗口 | 原视频 469.0s 起共 420s（Peter Thiel "flying cars" 金句开场 → Roadster 实车讲解） |
| 练习句 | **78 句 / 795 词**（有效语音 341s，wpm≈140 → 目标语速 150） |
| 原声音频 | 420s / 1.68MB（1,680,720B）MP3，16kHz 单声道 32kbps |
| 标签 | Tesla · SpaceX · Roadster · 发布会（难度 ★★★） |

内容锚点（与 B站视频核对）：`[0.0-11.4]` Peter Thiel 金句 "the future promised us flying cars, but instead we got 140 characters"；`[102.9-107.4]` "I think he went for a little ride"（Starman 悬念）；`[261.0-272.0]` Lars 讲解 600 liters / 250 kilos / 10 nozzles 参数段。

## 2. 导入与清洗过程

### 2.1 管线（与黄仁勋素材完全同构）

```
B站公开 API 直连下载音轨（yt-dlp 412 WAF 回退路径）
  → ffmpeg 469.0s 起裁 420s → 16kHz 单声道 32kbps MP3
  → faster-whisper small（CPU int8, VAD, beam 5）→ 85 段句级时间戳
  → 自研多层清洗（见 2.2）→ 78 个自然练习句
  → scripts/video-imports/musk-roadster-event-2026.json
  → build-video-data.cjs → techspeak/video-data.js
```

### 2.2 现场演讲特有伪影与清洗规则

Roadster 发布会为户外现场活动（欢呼/掌声/背景音乐），whisper 输出较黄仁勋的室内 keynote 噪声更多，清洗规则相应增强：

| # | 伪影 | 清洗策略 |
|---|---|---|
| 1 | VAD 在欢呼声中不切断，产生跨 34-45s 的 mega 段（span >> 词数×语速） | stretched 段检测（span > (W×0.45+1.5)×1.6）：非尾片从段首顺序排布，尾片锚定段末，与 app.js 逐词高亮的句内比例插值一致 |
| 2 | 现场即兴语气词被插伪句点（"Yeah."、"So."、"Okay." 悬空） | 开放句尾续句合并 gap 阈值 1.2→2.6s；悬空 1 词句向后并入（"Yeah." + "I think…" → "Yeah, I think…"），首词为 I 时保持大写 + 全局 `\bi\b`→`I` 保险 |
| 3 | 小写词伪句点（"...air. and we have"） | LOWERCASE_MID 修正集，且仅在非句界后小写（保留 "air. And we" 的大写 And） |
| 4 | 22:45 双语字幕视频为加速版（句间隔均匀 ~2s） | 弃用，选官方全程原速镜像，保证跟读节奏真实 |
| 5 | 裁剪起点切在句中（468s → "Are real."） | 起点定 469.0s，落在 "Yeah." 引导词上，首句完整 |

### 2.3 人工校正清单（16 条 FIXES，均经第二源/惯用表达核验）

同音/近音误听：`in old jurisdictions`→`in all jurisdictions`、`carbon overlay`→`carbon overwrap`、`pop itself up`→`puff itself up`、`Ritzer`→`Roadster`、`Disappointing.`→`The anticipation.`、`They can have`→`That you can have`、`in the car front?`→`in the car for us?` 等；另有标点/大小写修饰。

### 2.4 五轮独立解码多数决

对 3 处存疑片段，用不同 VAD/温度/prompt 参数独立解码 5 轮仲裁：

| 片段 | 各轮结果 | 终稿 |
|---|---|---|
| 跳跃演示后玩笑句 | v1 独听出 "could have cleared…hopefully"；v2/v4/v5 三轮完全一致 "we're going to clear it more than our whole fleet"；v3 近似 | "Yeah, I think we're going to clear it more than our whole fleet." |
| "Let's see ___ it up" | 两轮一致 "who gets it up" | "Let's see who gets it up." |
| 600L 参数段 | 两轮一致 "They are a total of 600 liters" / "online"（讲解人转场词） | 维持原听写 |

## 3. 测试矩阵与结果

### 3.1 单元 / 数据完整性 — 71/71 ✅

`npm test` 全绿，含 5 个视频素材锁定用例（字段/白名单、句级时间戳单调不越界、音频>20000B、imports 与 video-data.js 一致绊网）。新增素材无代码改动，app.js 的 VIDEO_META 已含 bilibili/press 标签映射。

### 3.2 本地 E2E（Range 等价环境）— 26/26 ✅

自建 206/Content-Range 静态服务器模拟 GitHub Pages，chromium headless（沙箱环境重建：playwright 1.50 + chromium-headless-shell 1155 经 npmmirror 镜像下载）：

- **素材库页（8）**：路由可达、素材总数=2、马斯克素材卡（标题含 Roadster）、B站徽章、产品发布会徽章、演讲者标注、来源链接指向 `BV17zn66hEga`、侧栏导航 active
- **练习页（9）**：路由挂载与标题、演讲者/来源/原声信息行、78 句渲染、795 词全量渲染（.w==P.W）、听读控制区 5 元素、原声模式隐藏 TTS 语音选择器、"句 1 / 78" 指示器、练习要点（flying cars 金句）
- **原声播放（5）**：音频加载 readyState≥2 且时长≈420s、媒体请求 200/206、播放中（!paused）、时间轴推进、逐词高亮（.w.speaking）
- **seek 精度（2）**：切句 10/25 后 currentTime 精确落句起点（±1.5s 容差，验证 Range 环境）
- **链式/跟读（3）**：播放整段自动链到后续句、跟读模式「听原句」用原声（currentTime 落句内）、**全程零控制台错误**

### 3.3 线上 E2E — 26/26 ✅

同一脚本对 `https://zeke-y-liu.github.io/techspeak-site` 运行（浏览器经代理出网），**26/26 全过、零控制台错误**，含线上 Range seek 精度验证。

### 3.4 CI 与部署 ✅

- GitHub Actions run `41464733441`（commit `7fb9d96`）：`success`
- 线上资产核对：`/media/musk-roadster-event-2026.mp3` HTTP 206 + `accept-ranges: bytes` + 总长 1,680,720B（与本地一致）；`/video-data.js`（22,647B）含新素材 ID

## 4. 已知限制

1. 素材为现场发布会，含马斯克与设计团队对话轮换及观众互动短句（"No?"、"Hey, buddy."），跟读难度高于室内 keynote，难度已标 ★★★。
2. 与黄仁勋素材一致：原声 seek 依赖服务端 Range 支持（GitHub Pages 原生支持，线上已实证）。
3. 版权：素材仅作英语学习用途，B站原视频地址在素材页完整标注，版权归原视频作者与 Tesla 所有。

## 5. 结论

马斯克 Roadster 发布会演讲已按与黄仁勋演讲完全一致的处理方式导入并上线：

- 单元/数据完整性：**71/71**
- E2E（本地 Range 等价环境）：**26/26**
- E2E（线上生产环境）：**26/26**，零控制台错误
- CI：**全绿**；线上部署与资产核验通过

**素材验收：通过。**

---

## 6. 追加修复（2026-11-02 晚）：语音与跟读轨迹不同步

**用户反馈**：语音和跟读轨迹不同步。

### 6.1 根因

app.js 的原声高亮模型（app.js:168-173）是「`audio.currentTime` 在句窗口 `[seg.start, seg.end]` 内按词权重比例插值」，句窗口偏差直接转化为轨迹偏差。而句级时间戳来自 whisper 的 VAD 段——**欢呼/掌声/笑声中 VAD 不切断**，产生两类失真：

1. **噪声尾巴混入句窗**：马斯克首句窗口含 ~4s 欢笑（11.41s 实际 7.5s）；"So, yeah, I think the last time…" 起点比真实语音早 **6 秒**（81.14 → 真实 87.21，前半是欢呼）；"Here he is." 窗口 3.15s 实际 0.48s。
2. **拉伸段人工插值假窗口**：清洗时对 stretched 段按固定语速顺序排布，产生均匀假窗口（如 Lars 参数段 2.00s/句）。

审计发现 **jensen 素材同样存在** 系统性句尾失真（黄仁勋等观众笑，句尾平均多出 0.6-2.9s），52/59 句显著偏差——用户 complaint 对两个素材均成立。

### 6.2 修复

`faster-whisper word_timestamps=True` 词级重转录 → **Needleman-Wunsch 对齐**（终稿句词 × whisper 词时间线；musk 807×812 对齐代价 62、jensen 854×856 代价 5，文本近乎完美匹配，偏差全在窗口）→ 句窗口重建为「**首词真实起点 −80ms → 末词真实终点 +120ms**」（垫量防截词首/尾）→ 无对齐句（"Hi."、"Yeah." 观众插话）邻句夹逼 → 单调/越界/语速全量校验。

- musk：**66/78 句**校正；jensen：**58/59 句**校正
- 备份：musk-before-wordfix.json / jensen-before-wordfix.json（/root/e2e/）
- 词级转录缓存：musk-words-cache.json / jensen-words-cache.json

### 6.3 验证

| 项 | 结果 |
|---|---|
| npm test | **71/71** ✅ |
| E2E 本地（Range 等价环境，双素材，含新增「窗口紧凑度」检查：无 >0.95s/词 失真窗口） | **48/48** ✅ |
| E2E 线上（生产环境，双素材） | **48/48** ✅ 零控制台错误 |
| 线上数据抽查 | musk#1 end 11.41→**7.50**、musk#15 start 81.14→**87.21**、jensen#1 end 7.37→**4.82** ✅ |
| CI | run `41477550113` commit `9a0a412` **success** ✅ |

**修复验收：通过。** 逐词高亮轨迹现与原声句窗一致；句内比例插值保持与站点既有模型（jensen 素材同构）一致。若后续需要句内词级精度（现场演讲长句内的即兴停顿），可扩展素材 schema 携带词级时间戳并在 app.js 优先使用——属后续增强，本次未做。
