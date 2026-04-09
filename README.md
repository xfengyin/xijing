# 🎵 兮·境 | 本兮音乐纪念空间

<p align="center">
  <img src="https://img.shields.io/badge/版本-v2.1.0-ff6b9d?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/许可证-MIT-4ecdc4?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/设计风格-Spotify_x_QQ音乐-ffb6c1?style=flat-square" alt="Design">
  <img src="https://img.shields.io/badge/PWA-支持-87ceeb?style=flat-square" alt="PWA">
  <img src="https://img.shields.io/github/actions/workflow/status/xfengyin/xijing/deploy.yml?style=flat-square" alt="CI">
</p>

<p align="center">
  <strong>沉浸式本兮音乐纪念空间，让青春永不散场</strong>
</p>

<p align="center">
  <a href="https://github.com/xfengyin/xijing">🌟 GitHub</a> •
  <a href="https://xfengyin.github.io/xijing">🚀 在线体验</a> •
  <a href="#功能介绍">✨ 功能</a> •
  <a href="#快速开始">🚀 快速开始</a>
</p>

---

## ✨ UI 2.1 — Spotify × QQ音乐 融合风格

融合 **Spotify** 的深色沉浸体验与 **QQ音乐** 的大封面卡片设计，打造极致的音乐播放器体验。

| 设计元素 | 说明 |
|---------|------|
| 纯黑沉浸背景 | Spotify 风格深色主题，减少视觉疲劳 |
| 大封面展示 | QQ 音乐式渐变封面 + 3D 黑胶唱片旋转效果 |
| 粉色品牌色 | 本兮专属渐变粉色，点亮整体视觉 |
| 主题色联动 | 每首歌拥有独立渐变色，切换歌曲时背景联动变化 |
| 固定底部播放栏 | 经典 Spotify 布局，随时掌控播放 |
| 侧边播放队列 | 清晰展示播放列表，实时高亮当前歌曲 |
| 玻璃态面板 | 半透明覆盖层，层次分明的视觉体验 |

---

## 🎯 功能介绍

### 🎵 核心音乐体验
- 真实音频播放架构 — HTML5 Audio API，支持模拟模式降级
- 完整播放控制 — 播放/暂停、上一首、下一首、随机、循环
- 进度条拖动 — 支持鼠标和触摸拖拽
- 音量控制 — 滑动调节音量
- 喜欢收藏 — 一键标记喜欢的歌曲
- 黑胶唱片动画 — 播放时 3D 唱片旋转效果

### 📜 歌词同步
- LRC歌词解析器 — 完整的LRC格式解析支持
- 动态加载 — 切换歌曲自动加载对应歌词文件
- 逐行高亮 — 当前歌词醒目显示
- 自动滚动 — 跟随播放进度定位

### 💌 互动功能
- 留言墙 — 支持发送留言，localStorage持久存储
- AI音质修复 — 波形动画演示效果
- 虚拟对唱 — 对唱界面示意
- 永恒直播间 — 模拟弹幕效果
- 音乐历程 — 完整时间轴（2010-2016）

### 🔍 其他功能
- 歌曲搜索 — 实时搜索过滤
- 分享 — Web Share API / 复制链接
- 全屏 — Fullscreen API支持
- 主题色联动 — 每首歌独立渐变色

### 📱 PWA 支持
- 可安装到主屏幕（手机/平板/电脑）
- 离线访问支持（动态缓存策略）
- Service Worker v2 缓存
- 响应式设计，完美适配移动端
- 无障碍支持（aria-label）

---

## 🚀 快速开始

### 在线体验

👉 **[https://xfengyin.github.io/xijing](https://xfengyin.github.io/xijing)**

### 本地开发

```bash
git clone https://github.com/xfengyin/xijing.git
cd xijing
npm install
npm run dev
# 打开 http://localhost:3000
```

### 构建生产版本

```bash
npm run build
```

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| UI 框架 | 原生 HTML / CSS / JS (ES Modules) |
| 构建工具 | Vite 5 |
| 样式 | CSS3 + 自定义属性 |
| 音频 | HTML5 Audio API + 模拟降级 |
| 歌词 | LRC格式解析器 |
| PWA | Service Worker + Web App Manifest |
| 部署 | GitHub Pages (Actions) |

---

## 📁 项目结构

```
xijing/
├── .github/workflows/   # CI/CD 工作流
├── public/               # 静态资源（直接复制到 dist）
│   ├── icons/           # PWA 图标（渐变+兮字）
│   ├── lyrics/          # LRC 歌词文件（8首）
│   ├── 404.html         # 404页面
│   ├── manifest.json    # PWA 配置
│   ├── sw.js            # Service Worker v2
│   └── favicon.svg      # 网站图标
├── src/
│   ├── spotify-app.js   # 主应用逻辑（含AudioPlayer）
│   ├── main.js          # 入口文件
│   ├── styles/
│   │   └── spotify-theme.css  # UI 2.1 样式
│   ├── data/
│   │   └── songs.js     # 歌曲数据（含封面色、音频源）
│   └── utils/
│       └── lrcParser.js # LRC歌词解析器
├── index.html            # 主页面
├── vite.config.js        # Vite 配置
└── package.json
```

---

## 🎹 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `空格` | 播放/暂停 |
| `Ctrl + ←` | 上一首 |
| `Ctrl + →` | 下一首 |
| `Shift + ←` | 快退5秒 |
| `Shift + →` | 快进5秒 |
| `ESC` | 关闭面板 |

---

## 🌟 版本更新

### v2.1.0 (2026-04)
- 添加真实音频播放架构（AudioPlayer + HTML5 Audio API）
- 集成LRC歌词解析器，动态加载歌词并同步高亮
- 修复Service Worker缓存路径，升级为动态缓存策略
- 修复内存泄漏（进度模拟interval清除）
- 歌曲封面从emoji改为渐变色+歌名首字
- 切换歌曲时主题色/背景渐变联动
- 留言墙可交互（localStorage持久存储）
- AI功能添加演示动画效果（波形/弹幕）
- 时间线补全2016纪念节点
- 添加搜索面板、分享、全屏功能
- 统一颜色体系（manifest.json + CSS）
- 生成高质量PWA图标
- 添加404页面
- 进度条支持拖拽（鼠标+触摸）
- 无障碍支持（aria-label）
- 修复推送通知图标引用

### v2.0.0 (2026-04)
- 全新 UI 设计 — Spotify × QQ 音乐融合风格
- 纯黑深色主题 + 粉色品牌强调色
- 优化移动端适配
- 简化架构，移除 Three.js 依赖
- 提升加载速度

### v1.0.0 (2026-03)
- 基础播放器功能
- 8 首歌曲歌词
- 留言墙功能
- AI 音质修复演示

---

## 📜 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

## 💝 致敬

**本兮 (1994–2016)**

> "音乐是我表达的方式，每一首歌都是我的心情日记。"

本项目仅为纪念本兮及其音乐作品，所有歌曲版权归属原作者及唱片公司。

---

<p align="center">Made with 💕 by 兮·境</p>
<p align="center"><sub>让青春永不散场</sub></p>
