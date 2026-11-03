# TechSpeak 何恺明演讲素材导入测试报告

**日期**：2026-11-03
**版本**：commit `95bda59`（main，CI run `41563616974` 全绿）
**任务**：增加最近一次何恺明的演讲内容，处理方式同黄仁勋/马斯克/辛顿演讲（见 TEST-REPORT-video-import.md / TEST-REPORT-musk.md / TEST-REPORT-hinton.md）
**线上地址**：https://zeke-y-liu.github.io/techspeak-site/#/vpractice/kaiming-neurips-2025

---

## 1. 素材概况

何恺明最近一次演讲为 **NeurIPS 2025 Test of Time Award 颁奖演讲 "A Brief History of Visual Object Detection"（目标检测简史）**——Faster R-CNN（NeurIPS 2015）获时间考验奖，四位合著者中唯一到场的何恺明代为登台致辞，2025-12-03 周三 14:00-14:30，美国圣迭戈（NeurIPS 2025 官方日程 day-3，经 neurips.cc 日历页核验）。

| 指标 | 值 |
|---|---|
| 素材 ID | `kaiming-neurips-2025` |
| 标题 | NeurIPS 2025 Test of Time 颁奖演讲：目标检测简史（节选） |
| 演讲者 | 何恺明 Kaiming He（MIT CSAIL，Faster R-CNN 一作） |
| 来源 | B站官方镜像 `BV1XL2VBkEdo`（26:44 英文原声，发布 2025-12） |
| 平台 / 类型 | `bilibili` / `talk`（大会分享） |
| 裁剪窗口 | 原视频 2.9s 起共 418.0s（跳过片头 1.49s 噪声词，从 "Welcome to the talk, everyone" 起句） |
| 练习句 | **65 句 / 900 词**（句窗总跨度 349s，实际 155 wpm → 目标语速 170） |
| 原声音频 | 417.9s / 1.63MB（1,672,804B）MP3，16kHz 单声道 32kbps |
| 标签 | Kaiming He · 计算机视觉 · 目标检测（难度 ★★） |

内容锚点（与 B站视频核对）：`[2.72-9.54]` 开场自我介绍 + 代三位合著者致辞（"on behalf of my dear friends and co-authors"）；`[29.09-33.03]` 选题缘由 "So why I decided to take this title?"；`[38.56-48.81]` "the context of the context, and so forth, so and so forth" 现场幽默排比；`[107.02-111.36]` 1996 年读过的第一篇 CV 论文（神经网络人脸检测，ToT 奖两次呼应）；`[244.18-257.89]` Viola-Jones / SIFT / HOG 手工特征三连讲；`[410.86-417.84]` 末句 "…Deformable Parts Models, or DPM in short." 完整收尾于自然停顿（原视频下一句 421.61s 才出现）。

## 2. 导入与清洗过程

### 2.1 素材甄别（"最近一次演讲"三重核验）

B站检索"何恺明/何凯明"，近期候选需逐一排除：
- B站 2026 年上传的 "MIT Deep Learning Bootcamp"（75:46）——经其官网 Selected Talks 页（people.csail.mit.edu/kaiming）核验，实为 **Jan 2024 旧讲座重传**，非新演讲
- 2026 年各类论文解说/中配视频——非原声
- NeurIPS 2024 讲座——时间更早

以官网 Selected Talks 置顶条目确证：NeurIPS 2025 Test of Time 颁奖演讲（2025-12-03）为最近一次演讲。原速原声验证：全片转录英文占比 p=1.00，语速 ~133 wpm（含停顿）偏慢清晰、自我介绍开头、"And that's it for my talk." 结尾，开口即 "Welcome to the talk, everyone."。

### 2.2 裁剪定界

| 轮次 | 裁剪 | 问题 | 词级证据 |
|---|---|---|---|
| 1 | 0s 起 421s | 开头 1.49s 处孤立噪声词 "Cool."（掌声间隙误收） | 首可用词 "Welcome" 实际在 3.19s |
| 2 | **2.9s 起 418s** | — | 首词 "Welcome" 落在 clip 0.34s；末句 "…DPM in short." 收尾于 417.72s，其后为 3.9s 自然停顿（下一句原视频 421.61s），完整收尾不破句 |

### 2.3 词级时间戳句窗口重建（同步保障）

吸取 musk/jensen「语音与跟读轨迹不同步」教训（commit 9a0a412），直接以 `word_timestamps=True` 的词级时间线为主源构建练习句（**180 段 / 901 词**缓存于 /root/e2e/kaiming-words-cache.json，beam5+VAD500；全片 1603s 的 763 段/3370 词缓存作为仲裁第 7 轮），句窗 = 首词真实起点−0.08s → 末词真实终点+0.12s：
- 全 65 句语速 0.18-0.66s/词，无一超 0.95s/词 失真阈值（最难句为介绍合著者后的长停顿句窗）
- 65 句窗口全量单调不重叠，0≤start<end≤418；连续 VAD 段边界（178.10s / 321.43s / 379.34s 三处 gap≈0）按 `start≥prev_end` 钳制，杜绝句窗重叠
- 起点落在句首引导词 "Welcome" 上，无破碎首句

### 2.4 三轮异参解码仲裁（29 处段级 FIXES + 全片缓存多数决）

R1：22 个存疑窗 × 5 轮异参（beam5 无VAD temp0 / greedy 无上下文 / 温度采样 / CV 术语表 initial_prompt / greedy+prompt）；R2：7 个残留疑点窗 × 3 参数组聚焦解码；R3：0.65x/0.55x 慢速重放 + 微窗词级解码终裁。

| # | whisper 直听 | 终稿 | 仲裁依据 |
|---|---|---|---|
| 1 | "Kai Minghe" / "Rose Gershik" | **Kaiming He** / **Ross Girshick** | 官方拼写；人名修正 |
| 2 | "boning box" | **bounding box** | CV 术语 |
| 3 | "in competition / in conservation / confusion"（6 处）| in **computer vision** | 全片缓存确证 + R2 聚焦 3/3；whisper 对该短语系统性近音误听 |
| 4 | "the community of confusion" | the community of **computer vision** | 全片缓存确证 |
| 5 | "Then the competition community" | Then the **computer vision community** | 全片缓存确证 |
| 6 | "pen engineering features" | **hand-engineering** features | h→p 混淆模式（R2 "pan-crafted"→"handcrafted" 佐证）；全片同样误听但语义唯一 |
| 7 | "phase detection" | **face detection** | 语义强制（Rowley 系均为人脸检测）；R2 聚焦确证 |
| 8 | "the tangent H" / "back propagation" | **tanh** / **backpropagation** | 术语规范 |
| 9 | "Hock, which is short for his Gram of Gradients" | **HOG**, which is short for **Histogram of Gradients** | 6 轮解码均无 "oriented"（句中含 2s 指幻灯片停顿），按最小听写原则不加 |
| 10 | "Scale Invariance Feature Transformation" | Scale **Invariant** Feature **Transform** | SIFT 官方全称 |
| 11 | "Best of Time awards" | **Test of Time** awards | 官方奖项名（ToT Award） |
| 12 | "the most powerful method" | the most powerful **methods** | R1 聚焦 5/5 听出复数（主缓存单复数各一次，聚焦轮全数复数） |
| 13 | "DPM in Shots" | DPM **in short** | 多数决 |
| 14 | "contribution paper" | **computer vision** paper | R1 多数决 + 全片缓存确证 |
| 15 | "think about a context"（seg14）| think about **the** context | R2 聚焦 3/3 + 全片缓存一致 "the"（4/5） |
| 16 | "talk about a history. Well, we need to stop somewhere." | talk about history **while** we need to stop somewhere | R3 慢速重放：5/9 无冠词、beam5 慢速仍听 "while"；seg33-34 合并一句 |
| 17 | "Then the competition almost at the same time…" | Then the **computer vision at** almost the same time started… | "computer vision" 全片+聚焦 3/3；词序由 R3 微窗词级解码终裁（at@274.40→almost@275.22，与全片缓存逐字吻合，2:1） |
| 18 | "Which is not popular at that time."（句首大写）| …networks, which is not popular… | seg42-43 合并主从句；时态保留 "is"（R2 聚焦 3/3 原声即 "is"） |

**保留口语原貌（最小干预）**："So why I decided to take this title?"、"set up a context correctly"（两缓存一致）、"the context of the context, and so forth, so and so forth"（现场幽默，两缓存一致）、"one of the most successful framework"（两缓存一致单数）、"some of the simplest classifier works the best"（两缓存一致）、"more powerful classifier"、"orientation gradients"、"their Viola Jones features"、"That's what our community can do at that time"（两缓存一致）、"a work that is 10 years ago"（Faster R-CNN 距 NeurIPS 2025 恰十年）与 "set the stop sign **30** years ago"（历史讲述起点，两处年份并存均经核验）、"visual community"（5/5 轮均听 visual 而非 vision）。

## 3. 测试矩阵与结果

### 3.1 单元 / 数据完整性 — 71/71 ✅

`npm test` 全绿（基线 71 不变），含视频素材锁定用例与 imports↔video-data.js 一致性绊网（素材 JSON 改动后必须重跑 build，本次已重生成）。无应用代码改动，app.js 的 VIDEO_META 已含 bilibili/talk（大会分享）标签映射。

### 3.2 本地 E2E（Range 等价环境）— 104/104 ✅

自建 206/Content-Range 静态服务器（rangeserver.py，8924 端口）模拟 GitHub Pages，chromium headless 经代理出网。**四素材（jensen/musk/hinton/kaiming）×26 项**：

- **素材库页（8×4）**：素材总数=4、四张素材卡、B站徽章、类型徽章（大会分享）、演讲者标注、来源链接、侧栏 active
- **练习页（9×4）**：路由/标题、信息行、句数（59/78/66/65）、词全量（.w==P.W.length）、控制区 5 元素、隐藏 TTS 选择器、"句 1 / N"、练习要点
- **原声播放（5×4）**：readyState≥2、时长 418、媒体 200/206、!paused、时间轴推进、.w.speaking
- **seek 精度（2×4）**：setSentence(9)/(24) 后 currentTime 精确落句起点（±1.5s，依赖 Range）
- **窗口紧凑度（1×4）**：无 >0.95s/词失真窗口
- **链播/跟读（3×4）**：链播按实际句界动态跨越推进、跟读「听原句」用原声（currentTime 11.49 ∈ 句窗 [10.24,14.04]）、**零 console/pageerror**

过程中修复测试基建一处缺陷：链播推进检查原为固定 "13s 内 ≥2 句"，按 Hinton 句密度硬编码，对 kaiming 开场长停顿（介绍合著者后 1.7s 间歇）误判——改为**按实际句窗动态计算观察窗内句界跨越数**（更严格：既验证推进、又验证不跳句，且跨素材公平）。

### 3.3 线上 E2E（生产环境）— 104/104 ✅

同一脚本对 `https://zeke-y-liu.github.io/techspeak-site` 运行（`--proxy-server` 出网），**四素材 104/104 全过、零控制台错误**，含线上 Range seek 精度与 kaiming 窗口紧凑度验证。

### 3.4 CI 与部署 ✅

- GitHub Actions run `41563616974`（commit `95bda59`，main）：`success`（回归+安全测试通过，Pages 部署成功）
- 线上资产核对：`/media/kaiming-neurips-2025.mp3` HTTP **206** + `content-range: bytes 0-1023/1672804` + `accept-ranges: bytes`（总长与本地一致）；`/video-data.js`（47,388B）经 node 解析含 4 素材、kaiming 65 句、wpmTarget 170、durationSec 418、首句 "Welcome to the talk, everyone."

## 4. 已知限制

1. 素材为颁奖致辞，含现场口语（"So why I decided to take this title?" 疑问语序陈述、单复数口语化、"the context of the context" 即兴幽默），已按"最小干预、保留原话"原则处理；语速适中（155 wpm 不含停顿），难度 ★★，适合入门后进阶跟读。
2. 与既有素材一致：原声 seek 依赖服务端 Range 支持（GitHub Pages 原生支持，线上已实证）。
3. 版权：素材仅作英语学习用途，B站原视频地址在素材页完整标注，版权归 NeurIPS / Kaiming He 及 B站搬运者所有。

## 5. 结论

何恺明 NeurIPS 2025 Test of Time 颁奖演讲已按与黄仁勋/马斯克/辛顿演讲完全一致的处理方式导入并上线：

- 单元/数据完整性：**71/71**
- E2E（本地 Range 等价环境，四素材）：**104/104**
- E2E（线上生产环境，四素材）：**104/104**，零控制台错误
- CI：**全绿**（run `41563616974`）；线上部署与资产核验通过

**素材验收：通过。**
