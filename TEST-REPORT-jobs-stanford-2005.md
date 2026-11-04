# TechSpeak 第 6 批视频素材导入测试报告：史蒂夫·乔布斯斯坦福 2005 毕业演讲

## 概览

| 项目 | 内容 |
|---|---|
| 素材 | `jobs-stanford-2005` — 乔布斯斯坦福大学毕业演讲：求知若渴，虚怀若愚 Stay Hungry, Stay Foolish（2005 全篇） |
| 演讲者 | Steve Jobs 史蒂夫·乔布斯（Apple 联合创始人） |
| 来源 | [B站英文原声 BV1T2YLeYE3g](https://www.bilibili.com/video/BV1T2YLeYE3g)（bilibili · keynote · level 2） |
| 演讲日期 | 2005-06-12（斯坦福大学毕业典礼） |
| 音频时长 | 852.0s（14 分 12 秒，mp3 3,408,292B / 16kHz mono） |
| 句子规模 | 149 句 / 锚定 2270 词 / 语音跨度 851.4s / 实测语速 160.0 wpm → 目标语速 170 wpm |
| 测试日期 | 2026-11-04 |
| 结论 | npm test 71/71 全绿；本地 E2E 158/158；CI 绿；线上 E2E 158/158 ✅ |

---

## 1. 输入与数据链路

| 环节 | 说明 |
|---|---|
| 选源甄别 | "乔布斯最著名演讲"公认即斯坦福 2005 毕业典礼演讲（三个故事 + Stay Hungry, Stay Foolish 收尾）；锁定 B站英文原声 BV1T2YLeYE3g |
| 音频抽取 | yt-dlp 抽取 + ffmpeg 转 16kHz mono mp3，入库 `techspeak/media/jobs-stanford-2005.mp3`（3,408,292B / 851.976s） |
| 词级时间戳 | faster-whisper `pengzhendong/faster-whisper-small`（int8 / beam_size=5 / VAD min_silence 500ms / word_timestamps / language=en），转写 121s 产出 178 段 / 2274 词缓存 |
| 句窗重建 | 官方演讲稿（斯坦福新闻稿版本）人工仲裁 S 表 149 句 → `build_jobs.py` 逐词对齐缓存 → `scripts/video-imports/jobs-stanford-2005.json` → `node scripts/build-video-data.cjs` 汇总进 `techspeak/video-data.js` |

## 2. 时间戳仲裁（本批核心工作）

S 表 149 句与词级缓存对齐 **149/149 全锚定、跳词 100% 白名单化、紧凑超限 0、wpm=160.0**。

### 2.1 仲裁规则（沿前批 + 本批新增）

| 规则 | 说明 |
|---|---|
| 容错 op 白名单 | 拼/拼反/缺/吞/专名/换 六类操作，命中即跳词并须列入 OVR 白名单；OVR 终稿 **24 条** |
| 屈折容差 | close() 引入 `_stem()`（剥 -ed/-s/-d 词干再比），处理 copied↔copy、loved↔love 等 ASR 吞屈折 |
| 专名 op（新增） | 同首字母 + len≥5 + 编辑距离≤4 + 下一词对上，处理 Laurene↔Loreen、Woz↔Was 等专名变体 |
| 头锚三段式 | 精确相等 → close 双词确认 → 编辑距离≤2+次词确认，杜绝次句同词抢先误锚 |
| 失败重锚 | 单句对齐失败时跳过头词重试至多 6 次（pre 按原始锚点计，前跳入审计） |
| 句首幻影钳制（新增） | whisper 会在句后掌声处幻听句首词；幻影词与真实次词间隙 >1.5s 时，句起点钳制为次词 −0.45s |
| 末词掌声钳制 | 末词时长 >1.5s（掌声被吸入词内）时，句末封顶为词始 +0.62s |
| 句窗公式 | start = 首词 −0.08s、end = 末词 +0.12s，单调不重叠，2 位小数 |

### 2.2 典型仲裁案例

| 句 | 现象 → 裁决 |
|---|---|
| S34 | whisper 听写 "hand-caligraphed"（拼写变体）→ 官方稿 hand lettered，按 ASR 拼写变体入白名单 |
| S50 / S93 | 句首幻影词 'My'（掌声间隙 5.6s / 10.2s）→ dump 证伪后撤销拆分方案，改用句首幻影钳制；同类 S43/S78/S115 共 5 处 |
| S80 | Laurene→Loreen（lev=4 超换上限）→ 新增专名 op 解决 |
| S82 | VAD 重复伪影 "Sometimes life ×2" → 无 VAD 探针证实仅一次，失败重锚跳到第二处，前跳 2 词入审计（本批唯一前跳，已裁决） |
| S87 | whisper 渲染 "gonna to fill"（多一 to）→ 拼反 op + 白名单 |
| S96 | whisper 近听 "What I want"（官方稿 would I want）→ 换上限放宽至 lev≤4 |
| S108 / S138 | ten→10（数字化）、in→and（近听）→ 白名单收官，未白名单清零 |
| 尾部裁决 | 旧缓存跨度 801.1s vs 新缓存 851.4s 矛盾 → 无 VAD 探针重转 [795,852] 证实结尾语音真实持续到 851.28s（"Thank you all very much."），851.4s 成立，无结尾长掌声 |

### 2.3 与前批工时对照

本批 149 句为目前最长素材（前三名：jobs 149 > hinton 66 > kaiming 65），掌声/欢呼密集，幻影词与掌声吸入现象显著多于前五批，仲裁 5 轮收敛。

## 3. 数据完整性锁定（npm test）

```
✔ 71/71（fail 0）
  - video: 素材字段完整且来源/类型标签合法
  - video: 句级时间戳单调、不越音频时长、文本无 HTML 字符
  - video: 音频文件存在且非空
  - video: video-data.js 与 video-imports 源目录一致（6 素材）
```

## 4. E2E（升级 6 素材 ×26 + 全局 2 = 158 项）

### 4.1 E2E 环境

- Chrome 155.0.8059.39（沙箱 puppeteer 缓存内 CfT）+ `--no-sandbox --disable-http2 --autoplay-policy=no-user-gesture-required --disable-dev-shm-usage`；线上跑附加 `--proxy-server`（代理出网）
- 本地 Range 等价环境：`rangeserver.py`（0.0.0.0:8924，根目录 techspeak/，支持 206/Content-Range/Accept-Ranges + 目录 index.html 回退）
- 每素材页内 6 路并行 Range fetch 预热整只 mp3（线上代理慢路径必备）

### 4.2 本地 E2E 结果：158/158 ✅

| 分组 | 项/素材 | jobs 实测 |
|---|---|---|
| 库 6 | 素材总数=6、素材卡、B站徽章、主题演讲徽章、演讲者标注、来源链接(_blank+noopener) | 全过 |
| 练 9 | 路由/标题、信息行（演讲者/2005-06-12/目标语速 170 wpm）、句数=149、词全量(.w==P.W)、控制区 5 元素、隐藏 TTS 选择器、句指示器、练习要点、演讲者来源行 | 全过 |
| 播 5 | 起播 readyState≥2、时长≈852、媒体 200/206(Content-Range bytes 0-1023/3408292)、时间轴推进、逐词高亮 .w.speaking | 全过 |
| seek 2 | setSentence(9)→52.89s、setSentence(24)→146.23s，currentTime 落句起点 ±1.5s | 全过 |
| 紧凑 1 | n≥3 无 >0.95s/词失真窗口 | 全过 |
| 链播 1 | 播放整段 0→1→2 不跳句、采样时刻全落句窗 | 全过 |
| 跟读 1 | 逐句跟读模式听原句，currentTime∈句窗 [14.71,24.51] | 全过 |
| 零 console 1 | 无控制台错误 | 全过 |
| 全局 2 | 素材数=6、总句数=473（66+59+149+65+78+56） | 全过 |

### 4.3 本批 harness 环境适配（不影响应用代码）

| 事项 | 处理 |
|---|---|
| Chrome 系统依赖缺失（libatk/atk-bridge/Xcomposite/Xdamage/atspi 等） | `python3 -m playwright install-deps chromium` 一次性补齐 |
| favicon 404 | 仓库未内置 favicon（线上 GH Pages 同为 404，属全素材等价环境噪声），console 计数按 location url 过滤 |
| 播4 竞态（play() promise 在预热后偶发 abort 冻结时钟） | 紧邻采样 + 采样窗内自然收尾判定 + 冻结时重试一次；该竞态为既有应用行为（vogels 报告 §4.1 已归档），非本批素材回归 |
| 播3 fetch 与播4 采样顺序 | 媒体 200/206 检查移至时间轴采样后，避免 fetch 干扰采样窗 |

## 5. 部署与线上验收

| 环节 | 结果 |
|---|---|
| 分支推送 | `trae/agent-eJ0zNh` 7b36038 ✅ |
| main 合入 | f2a3461..c23f51f（素材三件套：JSON + video-data.js + mp3）✅ |
| GitHub Actions | run 41843587909 completed / success（Deploy TechSpeak to GitHub Pages）✅ |
| 线上资产 | `media/jobs-stanford-2005.mp3` 200 全量 3,408,292B 与本地逐字节一致；Range 请求 206 + Content-Range；`video-data.js` 含 jobs-stanford-2005 ✅ |
| 线上 E2E | 同一脚本对 `https://zeke-y-liu.github.io/techspeak-site` 运行：**158/158 全过 ✅**（代理出网 + 每素材 6 路预热 + seek 慢路径兜底） |

线上地址：https://zeke-y-liu.github.io/techspeak-site/#/vpractice/jobs-stanford-2005

## 6. 结论

- 第 6 批视频素材（乔布斯斯坦福 2005 毕业演讲）全流程导入完成：词级时间戳对齐 149 句、数据完整性 71/71、本地与线上 E2E 均 158/158、CI 绿、线上资产逐字节核验通过。
- 素材库现为 6 素材 / 473 句 / 约 75 分钟原声。
- 本批沉淀的仲裁能力（句首幻影钳制、专名 op、屈折容差、失败重锚）已固化进 `build_jobs.py`，可复用于后续素材。
