# TechSpeak 视频导入功能测试报告

**日期**：2026-11-02
**版本**：commit `b36a2b0`（main，CI run `41325502836` 全绿）
**线上地址**：https://zeke-y-liu.github.io/techspeak-site/#/videos

---

## 1. 功能概述

按需求实现「视频链接 → 音频 + 文字」练习素材导入链路：

| 需求项 | 实现 | 状态 |
|---|---|---|
| 支持 B站/微博/抖音链接导入 | `yt-dlp` 下载 + B站公开 API 直连回退（412 WAF 适配） | ✅ |
| 微信视频号（无网页直链） | 手动下载后 `--file <本地文件> --platform wechat` | ✅ |
| 转音频 + 文字 | ffmpeg 截取压缩（16kHz 单声道 32kbps MP3）+ faster-whisper 句级时间戳转录 | ✅ |
| 区分来源/类型 | `platform`（bilibili/douyin/weibo/wechat/local）+ `type`（keynote/interview/press/talk/other）白名单，UI 徽章展示 | ✅ |
| 标签标记 | `tags[]` 自由标签 + 难度星级 + 语速目标，素材库页平台筛选 chips | ✅ |
| 实测黄仁勋最新演讲 | GTC 柏林 2026 主题演讲（2026-10-21）已导入并全链路验收 | ✅ |

**架构约束**：导入在构建期离线完成，站点保持纯静态（GitHub Pages 直接部署，无后端）。`scripts/video-imports/<id>.json` 为单一事实来源，`build-video-data.cjs` 生成浏览器可直接 `<script>` 加载的 `video-data.js`。

## 2. 导入管线（scripts/import-video.py）

```
视频链接 / 本地文件
  ├─ yt-dlp 下载音轨（UA + Referer）
  │    └─ B站被 412 WAF 拦截时回退：finger/spi 取 buvid 指纹 cookie
  │       → view API 取 cid → playurl API（DASH）取音轨直链
  │       → Range 断点续传 + 8 次重试流式下载
  ├─ ffmpeg -ss START -t DUR -ac 1 -ar 16000 -b:a 32k → techspeak/media/<id>.mp3
  ├─ faster-whisper small（CPU int8, VAD, beam 5）→ 句级时间戳
  │    └─ 输入经 ffmpeg 预解码为 float32 PCM 数组（绕过 PyAV 19 兼容问题）
  └─ 清洗合并（碎段合并/空白规范化/句首大写）→ scripts/video-imports/<id>.json
```

幂等优化：目标音频已存在时自动跳过下载/裁剪，只重跑转录。

## 3. 黄仁勋演讲导入实测

**素材**：NVIDIA CEO 黄仁勋 **GTC 柏林 2026 主题演讲**（开场节选）
**源**：B站镜像 `BV1Von26VErZ`（94 分钟大会演讲，2026-10-21）
**截取**：开场后 300s 起 420s（7 分钟）

导入结果数据：

| 指标 | 值 |
|---|---|
| 素材 ID | `jensen-gtc-berlin-2026` |
| 平台 / 类型标签 | `bilibili` / `keynote`（主题演讲） |
| 练习句 | **59 句 / 853 词** |
| 原声音频 | 420s / 1.68MB MP3（GitHub Pages 友好） |
| 标签 | NVIDIA · GTC · 主题演讲 · AI（难度 ★★★，目标语速 135 wpm） |
| 语言检测 | en（有效语音段 ✓） |
| 转录耗时 | 61s（CPU small 模型） |

转录文本抽样（内容验证正确：欧洲 33 年历史、NV1 芯片、AI factories 等）：

> `[0.0–7.4]` Portia, Nestle, and HSBC have in common.
> `[7.4–14.7]` Well, they're all European companies, and they're all working with NVIDIA on AI.
> `[25.3–28.9]` We've been working here in Europe now for 33 years.

## 4. 测试矩阵与结果

### 4.1 单元 / 数据完整性测试 — 71/71 ✅

`npm test`（Node 内置 test runner），其中视频功能新增 4 个锁定用例：

- 素材字段完整且来源/类型白名单合法（platform 5 值 / type 5 值）
- 句级时间戳单调、不越音频时长、文本无 HTML 字符
- 音频文件存在且 >20000B
- `video-data.js` 与 `video-imports` 源目录一致（过期绊网）

安全基线同步更新：innerHTML 写入点 37 → 39（视频素材库页 2 处，插值全部经 `esc()`），security.test.js 锁定。

### 4.2 Playwright E2E — 本地 25/25 ✅

在 **Range 等价环境**（自建 206/Content-Range 静态服务器，模拟 GitHub Pages）运行，覆盖：

- 素材库页：素材卡、B站徽章、主题演讲徽章、演讲者标注、平台筛选 chips、来源链接、侧栏导航 active（7 项）
- 练习页：路由 `#/vpractice/jensen-gtc-berlin-2026`、标题、演讲者/来源/原声信息行、听读控制区、**原声模式隐藏 TTS 语音选择器**、853 词渲染（7 项）
- 原声播放：音频加载（readyState=4）、播放中、媒体请求发出、时间轴推进、逐词高亮（5 项）
- seek 精度：切句后 `currentTime` 精确落到句起点（容差 1.5s）（2 项）
- 整段链式播放、跟读模式原声听句、**零控制台错误**（3 项）

### 4.3 线上 E2E — 25/25 ✅

同一脚本直接对 `https://zeke-y-liu.github.io/techspeak-site` 运行，**25/25 全过、零控制台错误**（含线上 Range seek 精度验证）。

### 4.4 CI 与部署 ✅

- GitHub Actions run `41325502836`：`success`（regression + security + data integrity）
- 线上资产核对：`/video-data.js` 200（11,136B）、`/media/jensen-gtc-berlin-2026.mp3` 200（1,680,720B，`accept-ranges: bytes`）、导航「视频精练」已上线

## 5. 测试过程中发现并修复的问题

| # | 问题 | 根因 | 修复 |
|---|---|---|---|
| 1 | 视频练习页初始化抛 `Cannot read properties of null (reading 'addEventListener')` | `renderListenControls` 中 `#voice-select` 的 change 监听未按原声模式（`P.media`）分支守卫，E2E 页面错误捕获器抓到 | [app.js L412](file:///workspace/techspeak/app.js#L412) 加 `if (!P.media)` 守卫 ✅（本地+线上复测零错误） |
| 2 | 切句后原声从头播放而非 seek 到句起点 | **测试服务器限制而非代码缺陷**：`python http.server` 不支持 Range 请求，浏览器 `seekable` 范围为 `[0,0]`，`currentTime` 赋值被钳制 | 代码无需改；自建支持 Range 的静态服务器复测，seek 精确。线上 GitHub Pages 原生支持 Range，E2E 实证 206 ✅ |
| 3 | 转录崩溃：`av.open() got unexpected keyword 'metadata_errors'` | 沙箱 PyAV 19（已移除该参数）与 faster-whisper 1.2.1 内部解码不兼容 | 管线改用 ffmpeg 预解码为 float32 PCM 数组直接喂模型，绕开 PyAV ✅ |
| 4 | whisper 模型下载 `SSL: UNEXPECTED_EOF_WHILE_READING` | 出网代理对 huggingface.co TLS 握手掐断 | 改从 ModelScope 镜像（`pengzhendong/faster-whisper-small`）curl 断点续传下载到本地目录，`--model <本地路径>` 加载 ✅ |
| 5 | B站 yt-dlp 412 / CDN 音轨下载中断 | B站 WAF 指纹校验 + 代理不稳定 | buvid cookie 公开 API 直连 + Range 断点续传 8 次重试 ✅ |
| 6 | `__pycache__/*.pyc` 误入仓库 | 早期提交混入 | 已从仓库移除并加入 `.gitignore` ✅ |

## 6. 已知限制与使用说明

1. **微信视频号**：无公开网页直链，需手动下载视频后 `--file` 导入（文档已注明用法）。
2. **原声 seek 依赖服务端 Range 支持**：GitHub Pages 支持（已实证）；本地用 `python -m http.server` 直接打开时 seek 会退化为从头播放，属该服务器限制。
3. **沙箱网络**：whisper 模型与浏览器工具链下载受代理限制，管线本身在正常网络下可直接走 HF 官方源。
4. **版权**：素材仅作英语学习用途，原视频地址与演讲者信息在素材页完整标注，版权归原视频作者所有。

## 7. 结论

视频导入功能（链接/本地文件 → 原声音频 + 句级时间戳文本 + 来源/类型/标签体系 + 素材库 UI + 原声变速不变调播放）**全链路实现并以黄仁勋 GTC 柏林 2026 演讲完成实测验收**：

- 单元/数据完整性：**71/71**
- E2E（本地 Range 等价环境）：**25/25**
- E2E（线上生产环境）：**25/25**，零控制台错误
- CI：**全绿**；线上部署与资产核验通过

**功能验收：通过。**
