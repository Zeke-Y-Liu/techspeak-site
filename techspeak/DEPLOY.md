# TechSpeak 部署文档

技术与商业英语演讲练习网站 · 纯静态应用部署指南

---

## 1. 项目概况

TechSpeak 是一个**纯静态 SPA**，无构建步骤、无运行时依赖、无后端服务。

| 项目 | 说明 |
|---|---|
| 架构 | 单页应用 + hash 路由（`#/library`、`#/practice/...` 等） |
| 后端 | 无。所有数据（词汇本/练习记录/偏好）存于浏览器 localStorage |
| 构建 | 无需构建，文件即产物 |
| 体积 | 4 个文件，共约 150 KB |

### 文件清单

```
techspeak/
├── index.html    # 应用外壳（入口）
├── style.css     # 样式（暗色设计系统）
├── data.js       # 内容数据（文章/术语/句型/句段）
└── app.js        # 应用逻辑（语音/评分/路由）
```

部署时**整个目录原样上传**即可，四个文件缺一不可。

---

## 2. 部署前检查

```bash
# 1. 确认文件完整（应输出 4 个文件）
ls techspeak/

# 2. 本地冒烟测试
cd techspeak && python3 -m http.server 8080
# 浏览器打开 http://localhost:8080，确认首页正常渲染
```

---

## 3. 部署方式（任选其一）

### 3.1 Trae 一键部署

1. 在 Trae 客户端打开本项目工作区
2. 使用「一键部署」插件的部署入口
3. 配置选择：
   - **类型**：静态网站（StaticWeb）
   - **访问策略**：公开（Public）
4. 部署完成后获得公网 URL

### 3.2 GitHub Pages

```bash
# 1. 创建仓库（如 techspeak）后推送
cd techspeak
git init
git add .
git commit -m "init: TechSpeak static site"
git branch -M main
git remote add origin https://github.com/<你的用户名>/techspeak.git
git push -u origin main
```

2. 仓库 **Settings → Pages → Build and deployment**
   - Source 选 **Deploy from a branch**
   - Branch 选 `main`，目录选 `/ (root)`
3. 等待 1–2 分钟，访问 `https://<用户名>.github.io/techspeak/`

> 注意：GitHub Pages 的 URL 带子路径 `/techspeak/`，本项目使用 hash 路由（`#/...`），相对路径加载资源，**无需任何修改即可直接工作**。

### 3.3 Netlify

**方式 A（最快，无需账号 Git）**：访问 [app.netlify.com/drop](https://app.netlify.com/drop)，把 `techspeak/` 目录拖入页面，立即获得公网 URL。

**方式 B（CLI）**：

```bash
npm i -g netlify-cli
netlify login
cd techspeak
netlify deploy --dir=. --prod
```

### 3.4 Vercel

```bash
npm i -g vercel
cd techspeak
vercel --prod
```

（Vercel 会识别为静态站点，无构建命令，输出目录为当前目录。）

### 3.5 自有服务器（nginx）

```nginx
server {
    listen 80;
    server_name your.domain.com;
    root /var/www/techspeak;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;   # 兜底到入口（hash 路由本身不依赖此项）
    }
}
```

上传方式：`scp -r techspeak/* user@server:/var/www/techspeak/`

### 3.6 本地 / 内网快速运行

```bash
cd techspeak
python3 -m http.server 8080
# 本机访问 http://localhost:8080
# 局域网访问 http://<本机IP>:8080（加 --bind 0.0.0.0）
```

---

## 4. 部署后验证清单

| # | 验证项 | 操作 | 预期 |
|---|---|---|---|
| 1 | 首页渲染 | 打开站点根 URL | 侧边栏 + 今日推荐 + 统计卡片正常，Console 无报错 |
| 2 | 路由跳转 | 侧边栏切换「文章库→术语库→句型库→句段库→词汇本」 | 各页面渲染正常，浏览器后退可用 |
| 3 | 文章详情 | 文章库点任意文章 | 段落列表 + 「开始练习」按钮出现 |
| 4 | TTS 播放 | 练习页点「播放」 | 朗读开始，当前词金色高亮跟随走词 |
| 5 | 语音识别 | 点「开始跟读」→ 允许麦克风 → 朗读 | 实时转写文本出现，停止后显示评分环 + 词级着色 |
| 6 | 词汇本 | 练习页点单词 → 「加入词汇本」 | 词汇本页面出现该词，翻卡复习可用 |
| 7 | 刷新持久化 | 刷新页面 | 词汇本/练习记录仍在（localStorage） |

---

## 5. 语音功能环境要求（重要）

本站核心功能依赖浏览器 Web Speech API，对**浏览器**和**访问协议**有硬性要求：

| 功能 | 依赖 API | 要求 |
|---|---|---|
| 朗读播放（TTS） | `speechSynthesis` | 主流浏览器均支持；Chrome 网络音色可能不触发词级高亮事件，已做时长估算降级 |
| 跟读识别（STT） | `SpeechRecognition` | **仅 Chrome / Edge**，且页面必须运行在**安全上下文** |

### 安全上下文（Secure Context）要求

语音识别**只在以下两种环境下可用**：

- `https://` 公网地址（GitHub Pages / Netlify / Vercel / 带 SSL 的自有服务器 ✅）
- `http://localhost` 本地调试（✅）

**以下情况识别功能不可用**（页面会显示明确提示，其余功能不受影响）：

- `http://<局域网IP>`（如 `http://192.168.1.5:8080`）—— 非安全上下文
- Safari / Firefox —— 不支持 `SpeechRecognition`

### 麦克风权限

首次点击「开始跟读」时浏览器会弹出麦克风授权，必须允许。若误拒：点击地址栏锁形/调试图标 → 网站设置 → 麦克风 → 允许，然后刷新页面。

---

## 6. 常见问题（FAQ）

**Q1：点「开始跟读」提示"当前浏览器不支持语音识别"？**
使用 Chrome 或 Edge 打开站点，并确认地址是 `https://` 或 `http://localhost`。

**Q2：TTS 播放没有声音？**
检查系统音量；Chrome 设置中确认未禁用语音合成；练习页顶部的音色下拉可切换其他英文音色。

**Q3：换了一台电脑/浏览器，词汇本空了？**
数据存在浏览器 localStorage，不随账号漫游。可在「词汇本」页导出 JSON 备份，在新设备导入。

**Q4：识别结果和原文对不上、评分偏低？**
环境噪音大或麦克风质量差会影响置信度。评分基于词级对齐算法，数字（如 "9,216"）已做英文数字词归一化（"nine thousand..."）双向兼容。

**Q5：想部署到内网且需要识别功能？**
需给内网地址配 HTTPS（自签证书或内部 CA 签发），否则只能用 TTS 播放和浏览类功能。

---

## 7. 数据与隐私说明

- 无后端、无统计埋点、无 Cookie
- 词汇本 / 练习记录 / 偏好设置全部存储在**本地浏览器** localStorage（键名前缀 `techspeak_`）
- 清除浏览器数据会丢失练习记录，请用词汇本页的导出功能备份
- 文章内容节选自 Anthropic / Google DeepMind / Google 官方博客，仅用于学习练习，页面内保留原文链接署名
