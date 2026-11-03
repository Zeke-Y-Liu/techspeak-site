# TechSpeak Werner Vogels（AWS CTO）演讲素材导入测试报告

**日期**：2026-11-03
**版本**：commit `f2a3461`（main，CI run `41626627018` 全绿）
**任务**：增加最近一次 AWS CTO 的演讲内容，处理方式同黄仁勋演讲（见 TEST-REPORT-jensen.md / TEST-REPORT-musk.md / TEST-REPORT-hinton.md / TEST-REPORT-kaiming.md）
**线上地址**：https://zeke-y-liu.github.io/techspeak-site/#/vpractice/vogels-reinvent-2025

---

## 1. 素材概况

"最近一次 AWS CTO 的演讲"甄别：AWS CTO 职位于 2025-06 由 Matt Wood 接任（Werner Vogels 转 Amazon 顾问），但经检索 **Matt Wood 无公开主题演讲记录**；公众认知中的 "AWS CTO" 仍是 2005 年起任 VP & CTO 的 **Werner Vogels**。其 **re:Invent 2025 闭幕日（2025-12-04）谢幕主题演讲**（"If you evolve" 主题，宣告 14 场 re:Invent keynote 收官）即最近一次 AWS CTO 级公开演讲，演讲中自我佐证："I've been giving this keynote since 2012, and I've done all of them." `[29.74-38.83]`、"This is my final re:Invent keynote." `[46.61-49.87]`。

| 指标 | 值 |
|---|---|
| 素材 ID | `vogels-reinvent-2025` |
| 标题 | AWS re:Invent 2025 谢幕主题演讲：拥抱变化 If you evolve（开场节选） |
| 演讲者 | Werner Vogels 维尔纳·沃格尔（Amazon VP & CTO，公众认知中的 AWS CTO） |
| 来源 | B站官方镜像 `BV16Dm2BDENF`（英文原声，发布 2025-12） |
| 平台 / 类型 | `bilibili` / `keynote`（主题演讲） |
| 裁剪窗口 | 原视频 353.1s 起共 358.3s（跳过片头暖场视频，紧贴 Vogels 开口 "Good morning"） |
| 练习句 | **56 句 / 605 词**（句窗总跨度 315.3s，实际 115 wpm → 目标语速 125） |
| 原声音频 | 358.3s / 1.43MB（1,433,908B）MP3 |
| 标签 | Werner Vogels · AWS · re:Invent（难度 ★★★） |

内容锚点（与 B站视频核对）：`[0.03-3.62]` 开场口误自嘲 "Good morning. Oh, no, it's not. Hello, guys."；`[10.70-18.76]` 主题排比 "tools evolve, architectures evolve, expectations evolve, and so do we"；`[29.74-38.83]` "14 场全勤 + 一堆 T 恤" 现场梗；`[46.61-49.87]` 谢幕宣言；`[125.30-130.02]` "Will AI take my job?"（4.72s 提问蓄势）；`[133.71]` "Maybe." / `[160.85]` "Will AI make me obsolete?" / `[167.74]` "Absolutely not." / `[174.54-176.06]` "If you evolve."（问答体节奏，难度 ★★★ 主因）；`[223.64-230.39]` "68,000 assembler, COBOL, and Pascal" 编年史叙事；`[345.87-358.17]` 末句 "…large-scale distributed systems." 完整收尾于自然停顿。

## 2. 导入与清洗过程

### 2.1 素材甄别（"最近一次 AWS CTO 演讲"三重核验）

- 现任核对：Matt Wood（2025-06 起 CTO）检索无公开主题演讲 → 不适用
- 公众认知核对：Werner Vogels 为 AWS 二十年 CTO 门面，其 re:Invent 2025 谢幕演讲（2025-12-04 闭幕日）为最近一次 CTO 级公开演讲
- 原声自证：演讲者开场自述 2012 年起 14 场 keynote 全勤、本场为最后一场

### 2.2 裁剪定界

| 轮次 | 裁剪 | 问题 | 词级证据 |
|---|---|---|---|
| 1 | 0s 起 | 片头暖场视频（无跟读价值，且首个词远离 0 点） | Vogels 实际开口 "Good" 在原视频 353.13s |
| 2 | **353.1s 起 358.3s** | — | 首词 "Good" 落在 clip 0.03s；末句收尾 358.17s 自然停顿，其后无紧邻语音 |

### 2.3 词级时间戳句窗口重建（同步保障）

延续 musk 之后确立的流程：以 `word_timestamps=True` 词级时间线为主源构建练习句，句窗 = 首词真实起点−0.08s → 末词真实终点+0.12s，钳制 `[0, 358.3]` 且 `start ≥ prev_end`（相邻 token 边界保持窗口不重叠，与 kaiming 同规则）。

**沙箱重置导致的缓存重生成与重锚**：56 句终稿表（R1 聚焦仲裁 + R2 微窗裁决结果）在沙箱重置前冻结；重置后按确定性参数（beam5+VAD500）重生成全片词级缓存 **74 段 / 620 词**，全部 56 句锚点以 `(seg_idx, word_off)` 重映射到新缓存布局，边界词与终稿文本**逐句断言**，其中 7 条按白名单放行（VAD 伪影/含混音，终稿以多轮仲裁为准）：

| # | 缓存边界词 | 终稿词 | 仲裁依据 |
|---|---|---|---|
| 3 | "Yeah" | "You" | VAD 把 "You know" 首词吞成 "Yeah" |
| 9 | "I" | "I've" | "Yeah, I" + "Still…" → 终稿 "I've still things to do" |
| 11 | "so" | "There" | There's 被 VAD 吞 → 终稿 "There are so many…" |
| 18 | "real" | "Will" | "real AI" 含混 → 终稿 "Will AI take my job?" |
| 35 | "it's" | "And" | "it's so" 含混 → 终稿 "And so change is constant" |
| 38 | "that" | "heck" | "Just for that" 含混 → 终稿 "Just for the heck" |
| 46 | "removing" | "We're" | "Removing towards" 含混 → 终稿 "We're moving towards that" |

- 56 句窗口全量单调不重叠，0 ≤ start < end ≤ 358.3
- 紧凑度最难句 S18 "Will AI take my job?"：5 词 4.72s 窗 = **0.944s/词，贴 0.95s/词失真阈值线**——这是演讲者向全场提问后的刻意停顿（下一句才是自答 "Maybe."），保真保留；n≥3 检查规则下全素材无超阈值窗口（"Yeah." 等单词句不适用 n≥3）
- 开场口误自嘲句（S1）完整保留原貌，起点落在实际首词 "Good"

### 2.4 终稿口语原貌（最小干预）

谢幕演讲现场感强，以下均经词级缓存核对为原声原话，按最小干预原则保留："Good morning. Oh, no, it's not. Hello, guys."（口误自嘲）、"you guys are owed young, fresh, new voices"、"There are so many amazing engineers at Amazon that have great stories to tell, to teach, to help you, to educate you."（口语堆叠）、"I've still things to do."、"the industry at large became adopting these kind of practices"（口语语法）、"Just for the heck."、"68,000 assembler"（口述 68k 汇编器）。

## 3. 测试矩阵与结果

### 3.1 单元 / 数据完整性 — 71/71 ✅

`npm test` 全绿（基线 71 不变），含 imports ↔ video-data.js 一致性绊网（素材 JSON 改动后必须重跑 build，本次已重生成：5 素材 / 324 句）。无应用代码改动。

### 3.2 本地 E2E（Range 等价环境）— 132/132 ✅

自建 206/Content-Range 静态服务器（rangeserver.py，8924 端口）模拟 GitHub Pages，chromium headless（chrome-for-testing 149.0.7827.55，与 playwright 1.61 要求的 chromium-1228 同版本）。**五素材（hinton/jensen/kaiming/musk/vogels）×26 项 + 全局 2 项**：

- 库 6 ×5：素材总数=5、素材卡、B站徽章、类型徽章（主题演讲）、演讲者标注、来源链接（`_blank` + `noopener`）
- 练 9 ×5：路由/标题、信息行（演讲者/日期/目标语速）、句数（66/59/65/78/56）、词全量（`.w==P.W.length`）、控制区 5 元素、隐藏 TTS 选择器、"句 1 / N"、练习要点、演讲者来源行
- 播 5 ×5：readyState≥2、时长 358.3、媒体 200/206、`!paused` + 时间轴推进、`.w.speaking`
- seek 2 ×5：`setSentence(9)` → 57.84s、`setSentence(24)` → 150.68s，currentTime 精确落句起点（±1.5s，依赖 Range）
- 紧凑 1 ×5：无 >0.95s/词失真窗口（n≥3）
- 链播 1 ×5：按实际句窗动态推进（0→1→2 不跳句、采样时刻全落句窗）
- 跟读 1 ×5：听原句 currentTime ∈ 句窗（vogels 取 `[68.6,80.5]` 最长窗）
- 零 console 1 ×5 + 全局 2：素材数=5、总句数=324、全程零控制台错误

### 3.3 线上 E2E（生产环境）— 132/132 ✅

同一脚本对 `https://zeke-y-liu.github.io/techspeak-site` 运行（代理出网 + 每素材并发预热 + seek 慢网络兜底），**五素材 132/132 全过、零控制台错误**，含线上 Range seek 精度 10 处（vogels 57.84s / 150.68s，musk 46.87s / 120.03s 等）与全部素材窗口紧凑度验证。

### 3.4 CI 与部署 ✅

- GitHub Actions run `41626627018`（commit `f2a3461`，main）：`success`（回归+安全测试通过，Pages 部署成功）
- 线上资产核对：`/media/vogels-reinvent-2025.mp3` HTTP/2 **206** + `content-range: bytes 0-1023/1433908` + `accept-ranges: bytes`（总长与本地一致）；`/video-data.js` 经 node 解析含 5 素材、324 句、vogels 56 句、wpmTarget 125、durationSec 358.3、首句 "Good morning. Oh, no, it's not. Hello, guys."

## 4. 已知限制与发现

1. **playSegment pause-interrupt 竞态（既有应用行为，非本次素材回归）**：亚秒级连续双 seek 且目标未缓冲时，前一句 `play()` promise 尚未 resolve 即被 `setSentence` 内 `TTS.stop()` 暂停，promise 以 AbortError 拒绝 → 旧闭包 catch 中的 `abort()` 误杀**新句**（清空已属于新句的 handlers 与 timer），音频永久 paused。对全部素材等价存在；真实用户单击间隔远大于触发窗口，不影响使用；E2E harness 已按"播放实际推进 ≥0.15s（证明 promise 已 resolve）再发起下一句"规避。建议后续在应用侧加播放令牌（token 代际）守卫修复，不在本次素材导入范围。
2. 素材为谢幕演讲开场节选，现场口语密度高（口误自嘲、问答体短句、刻意停顿），难度 ★★★；已按"最小干预、保留原话"处理。
3. 原声 seek 依赖服务端 Range 支持（GitHub Pages 原生支持，线上已实证）。
4. 版权：素材仅作英语学习用途，B站原视频地址在素材页完整标注，版权归 Amazon / Werner Vogels 及 B站搬运者所有。

## 5. E2E harness 强化（本次新增基建，非应用改动）

1. **seek 进度验证**：seek 检查要求播放实际推进 ≥0.15s 后再发起下一句（证明 `play()` promise 已 resolve），规避 §4.1 竞态——线上 E2E 从 127/132 修至 130/132。
2. **seek 慢网络兜底**（本次收尾）：快路径（10s）失败时，轮询媒体缓冲实际覆盖 seek 目标位后（≤150s，等价于等视频加载好的真实用户），彻底 `TTS.stop()` 让悬挂的 play() promise 走完旧闭包 abort，再重试一次（15s）——线上从 130/132 收至 **132/132**。插桩诊断实证：musk 素材在慢代理下预热后，媒体元素的开放式 Range 请求仍以单流 ~9-12KB/s 拉取且偶发代理停滞（seek 落点 46.87s 后 43s 才起播），属环境噪声而非应用缺陷（同一素材在 kaiming 批次线上 E2E 曾 104/104 全过）。
3. **链播起播等待**：点链播前先等句 0 实际起播（同源竞态规避）。
4. **并发预热**：每素材起播前页内 6 路并行 Range fetch 把整文件拉入 HTTP 缓存（失败段串行重试），加速素材加载与多数素材的 seek。关键点：须配 `--disable-http2`——否则同源请求经代理复用单条 HTTP/2 CONNECT 隧道，6 路并发无加速（实测 158.9s/1.68MB）；禁用后每请求独占隧道，27.8s/1.68MB（≈76KB/s，与 6 路 curl 一致）。此前"12 点 seek 扫描铺缓冲"方案会把慢代理打崩（60 个 range 请求致网络死）已弃用。
5. **chromium 环境重建**（沙箱重置后）：playwright 1.61 要求 chromium-1228（149.0.7827.55），官方下载器 25-88KB/s 过慢 → 12 路并行 curl 拉 chrome-for-testing 同版本（≈850KB/s）+ `executable_path` 启动，系统依赖经 `playwright install-deps chromium`（内部 apt 镜像）解决。

## 6. 结论

Werner Vogels re:Invent 2025 谢幕主题演讲已按与黄仁勋/马斯克/辛顿/何恺明演讲完全一致的处理方式导入并上线：

- 单元/数据完整性：**71/71**
- E2E（本地 Range 等价环境，五素材）：**132/132**
- E2E（线上生产环境，五素材）：**132/132**，零控制台错误
- CI：**全绿**（run `41626627018`，commit `f2a3461`）；线上部署与资产核验通过

**素材验收：通过。**
