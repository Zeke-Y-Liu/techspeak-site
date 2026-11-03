# TechSpeak 辛顿演讲素材导入测试报告

**日期**：2026-11-03
**版本**：commit `bef6dbc`（main，CI run `41555846238` 全绿）
**任务**：增加最近一次杰弗里·辛顿的演讲内容，处理方式同黄仁勋/马斯克演讲（见 TEST-REPORT-video-import.md / TEST-REPORT-musk.md）
**线上地址**：https://zeke-y-liu.github.io/techspeak-site/#/vpractice/hinton-godel-lecture-2026

---

## 1. 素材概况

辛顿最近一次公开演讲为 **2026-10-23 17:00 维也纳哥德尔讲座（Vienna Gödel Lecture, TU Wien Campus Karlsplatz）**，官方标题 *"Is AI Like Us and Will It Like Us?"*（AI 和我们相似吗？它又会喜欢我们吗？）。

| 指标 | 值 |
|---|---|
| 素材 ID | `hinton-godel-lecture-2026` |
| 标题 | 维也纳哥德尔讲座 2026：AI 和我们相似吗？（节选） |
| 演讲者 | 杰弗里·辛顿 Geoffrey Hinton（诺贝尔物理学奖得主，"AI 教父"） |
| 来源 | B站官方直播全程镜像 `BV1spHA66EJ9`（198:52，发布 2026-10-24，对应 TU Wien 官方 YouTube 直播） |
| 平台 / 类型 | `bilibili` / `keynote`（年度荣誉主题演讲） |
| 裁剪窗口 | 原视频 1502.7s 起共 414.5s（跳过主持人欢迎致辞与开场掌声，从 "Okay, thank you for the introduction" 起句） |
| 练习句 | **66 句 / 1142 词**（句窗总跨度 355s，实际 193 wpm → 目标语速 210） |
| 原声音频 | 414.58s / 1.62MB（1,658,688B）MP3，16kHz 单声道 32kbps |
| 标签 | Geoffrey Hinton · 人工智能 · 诺奖得主（难度 ★★★） |

内容锚点（与 B站视频核对）：`[0.00-7.53]` 开场 "a very brief and very biased history of AI"；`[12.06-31.84]` logic-inspired vs learning-inspired 两种范式；`[102.93-105.63]` "It was John von Neumann and Alan Turing."；`[203.06-219.62]` cat/woman 特征向量类比名段；`[385.68-402.76]` "Yoshua Bengio in Montreal" 自然语言预测段（末句完整收尾于 412.52s）。

## 2. 导入与清洗过程

### 2.1 素材筛选（原速源鉴别）

B站搜索 API 检索"辛顿演讲"，候选两个近期视频：
- `BV1eyHG67Ev9`（80 分钟剪辑版，2026-10-25）——**60s 探针转录证实开头是主持人欢迎致辞**（非英文演讲主体）
- `BV1spHA66EJ9`（198:52 官方直播全程镜像，2026-10-24，简介含 TU Wien 官方 YouTube 直播链接与章节时间轴：24:50 演讲开始）——**1490s 处探针转录证实 "Okay, thank you for the introduction and thank you for inviting me. I'm going to give you a very brief and very biased history of AI."**，英文原声 p=1.00，语速自然（0.3s/词级）

选官方直播镜像，保证原速、原声、官方源三点。

### 2.2 两轮裁剪定界

| 轮次 | 裁剪 | 问题 | 词级证据 |
|---|---|---|---|
| 1 | 1490s 起 420s | 开头 12.85s 为上台掌声（跟读死时间）；420s 处 "The best existing models. The best…" 被切断 | 首词 "Okay," 实际在 12.85s；末词 419.96s 为半句 |
| 2 | **1502.7s 起 414.5s** | — | 首词 0.0s 直接开口；末句 "…how often different phrases occurred." 完整收尾于 412.40s，其后 "So if you saw fish and…" 新例子确认丢弃 |

### 2.3 词级时间戳句窗口重建（同步保障）

吸取 musk/jensen「语音与跟读轨迹不同步」教训（commit 9a0a412），本次**直接以 `word_timestamps=True` 的词级时间线为主源构建练习句**（114 段/1175 词缓存于 /root/e2e/hinton-words-cache.json），句窗 = 首词真实起点−0.08s → 末词真实终点+0.12s，从根上消除 VAD 段级时间戳的噪声尾巴/拉伸失真：
- 全 66 句语速 0.19-0.51s/词，无一超 0.95s/词 失真阈值
- 66 句窗口全量单调不重叠，0≤start<end≤414.5
- 起点落在句首引导词 "Okay" 上，无破碎首句

### 2.4 五轮异参解码仲裁（9 处 FIXES，均经多轮核验）

| # | whisper 直听 | 终稿 | 仲裁依据 |
|---|---|---|---|
| 1 | "logic inspired" | logic-inspired | 复合形容词连字符 |
| 2 | "they **do do** reasoning, or as far as we know, they don't do much reasoning" | they **don't do** reasoning | R0/R4-greedy/R4-beam5 三轮高保真听出否定式；语义与"鸽子不做推理、不用逻辑"的论点及后文平行否定结构一致 |
| 3 | "Anne Schuring" | **Alan Turing** | 全轮一致误听（近音）；与后文 "Turing was sort of studying how you could learn neural networks" 衔接 |
| 4 | "co -occurs" / "you occur" | it co-occurs | 与段 32 "It's implicit in how it co-occurs with other words" 平行结构；学术惯用词 |
| 5 | "a loof" | aloof | 近音分词 |
| 6 | "sizes of the same coin" | two different **sides** of the same coin | 惯用表达 |
| 7 | "when you want when you generate one" | when you want **one**, when you generate one | 7 轮完全一致——Hinton 现场口语自我修正，最小干预补 "one" 保持可读 |
| 8 | "Yoshua/Yoshio Benjo"×2 | **Yoshua Bengio**×2 | 5+ 轮一致听到名字出现两次（Hinton 先点名、后重述的即兴口语结构），保留原话，仅修拼写 |
| 9 | 超长 VAD 段（38-81 词） | 66 句语义拆分 | 词时间线句内拆点（1.18s 停顿等），最长句 38 词 |

另有 61→64→66 句三轮清洗迭代：VAD 段合并（开放句尾 gap<2.6s）、碎段并入、超长段语义拆分、句首大写/句尾标点归一。

## 3. 测试矩阵与结果

### 3.1 单元 / 数据完整性 — 71/71 ✅

`npm test` 全绿，含视频素材锁定用例（字段/白名单、句级时间戳单调不越界、音频>20000B、imports 与 video-data.js 一致绊网）。新增素材无应用代码改动，app.js 的 VIDEO_META 已含 bilibili/keynote 标签映射。

### 3.2 本地 E2E（Range 等价环境）— 78/78 ✅

自建 206/Content-Range 静态服务器模拟 GitHub Pages，chromium headless（沙箱环境重建：playwright 1.50.0 + chromium-headless-shell 1155 经 npmmirror 镜像下载 + install-deps）。三素材（jensen/musk/hinton）×26 项：

- **素材库页（8×3）**：素材总数=3、三张素材卡、B站徽章、类型徽章、演讲者标注、来源链接、侧栏 active
- **练习页（9×3）**：路由/标题、信息行、句数（59/78/66）、词全量（.w==P.W.length：853/795/1142）、控制区 5 元素、隐藏 TTS 选择器、"句 1 / N"、练习要点
- **原声播放（5×3）**：readyState≥2、时长（420/420/414.58）、媒体 200/206、!paused、时间轴推进、.w.speaking
- **seek 精度（2×3）**：setSentence(9)/(24) 后 currentTime 精确落句起点（±1.5s，依赖 Range）
- **窗口紧凑度（1×3）**：无 >0.95s/词失真窗口
- **链播/跟读（3×3）**：播放整段自动链播（观察窗 15.5s 内推进≥2句）、跟读「听原句」用原声（currentTime 落句窗）、**零 console/pageerror**

过程中修复了测试基建两个问题：本地 Range 服务器对 `bytes=0-` 全量请求的 `PosixPath.read` 崩溃（ERR_EMPTY_RESPONSE 根因）与 E2E 脚本三处缺陷（P.W 为词数组非计数、链播指示器解析字段、媒体请求监听器注册时序）。

### 3.3 线上 E2E（生产环境）— 78/78 ✅

同一脚本对 `https://zeke-y-liu.github.io/techspeak-site` 运行（浏览器经代理出网，`--proxy-server`），**三素材 78/78 全过、零控制台错误**，含线上 Range seek 精度与 hinton 窗口紧凑度验证。

### 3.4 CI 与部署 ✅

- GitHub Actions run `41555846238`（commit `bef6dbc`）：`success`
- 线上资产核对：`/media/hinton-godel-lecture-2026.mp3` HTTP 206 + `accept-ranges: bytes` + 总长 1,658,688B（与本地一致）；`/video-data.js` 含 3 素材、hinton 66 句、wpmTarget 210、durationSec 414.5、末句 412.52 完整收尾

## 4. 已知限制

1. 素材为学术讲座，含 Hinton 现场口语自我修正（"when you want one, when you generate one"）与即兴重复（"Yoshua Bengio" 两现），已按"最小干预、保留原话"原则处理；句长跨度大（4-38 词），难度 ★★★。
2. 与既有素材一致：原声 seek 依赖服务端 Range 支持（GitHub Pages 原生支持，线上已实证）。
3. 版权：素材仅作英语学习用途，B站原视频地址在素材页完整标注，版权归 TU Wien 与 Geoffrey Hinton 所有。

## 5. 结论

辛顿维也纳哥德尔讲座演讲已按与黄仁勋/马斯克演讲完全一致的处理方式导入并上线：

- 单元/数据完整性：**71/71**
- E2E（本地 Range 等价环境，三素材）：**78/78**
- E2E（线上生产环境，三素材）：**78/78**，零控制台错误
- CI：**全绿**；线上部署与资产核验通过

**素材验收：通过。**
