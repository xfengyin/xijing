# 🎵 兮·境 | 本兮音乐纪念空间

<p align="center">
  <img src="https://img.shields.io/badge/版本-v2.0.0-ff6b9d?style=flat-square" alt="Version">
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

## ✨ UI 2.0 — Spotify × QQ音乐 融合风格

融合 **Spotify** 的深色沉浸体验与 **QQ音乐** 的大封面卡片设计，打造极致的音乐播放器体验。

| 设计元素 | 说明 |
|---------|------|
| 纯黑沉浸背景 | Spotify 风格深色主题，减少视觉疲劳 |
| 大封面展示 | QQ 音乐式专辑封面 + 3D 黑胶唱片旋转效果 |
| 粉色品牌色 | 本兮专属渐变粉色，点亮整体视觉 |
| 固定底部播放栏 | 经典 Spotify 布局，随时掌控播放 |
| 侧边播放队列 | 清晰展示播放列表，实时高亮当前歌曲 |
| 玻璃态面板 | 半透明覆盖层，层次分明的视觉体验 |

---

## 🎯 功能介绍

### 🎵 核心音乐体验
- 完整播放控制 — 播放/暂停、上一首、下一首、随机、循环
- 进度条拖动 — 点击任意位置直接跳转
- 音量控制 — 滑动调节音量
- 喜欢收藏 — 一键标记喜欢的歌曲
- 黑胶唱片动画 — 播放时 3D 唱片旋转效果

### 📜 歌词同步
- 逐行高亮，当前歌词醒目显示
- 大字体设计，沉浸式阅读体验
- 自动滚动，跟随播放进度定位

### 💌 互动功能
- 留言墙 — 与万千兮饭共鸣，留下你的回忆
- AI 音质修复 — 一键增强音质演示
- 虚拟对唱 — 与本兮隔空合唱
- 永恒直播间 — 24 小时循环播放
- 音乐历程 — 回顾本兮音乐之路时间轴

### 📱 PWA 支持
- 可安装到主屏幕（手机/平板/电脑）
- 离线访问支持
- Service Worker 缓存
- 响应式设计，完美适配移动端

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
| PWA | Service Worker + Web App Manifest |
| 部署 | GitHub Pages (Actions) |

---

## 📁 项目结构

```
xijing/
├── .github/workflows/   # CI/CD 工作流
├── public/               # 静态资源（直接复制到 dist）
│   ├── icons/           # PWA 图标
│   ├── lyrics/          # LRC 歌词文件
│   ├── manifest.json    # PWA 配置
│   ├── sw.js            # Service Worker
│   └── favicon.svg      # 网站图标
├── src/
│   ├── spotify-app.js   # 主应用逻辑
│   ├── main.js          # 入口文件
│   ├── styles/
│   │   └── spotify-theme.css  # UI 2.0 样式
│   ├── data/
│   │   └── songs.js     # 歌曲数据
│   ├── components/      # 功能组件
│   ├── scenes/          # 场景组件
│   └── utils/           # 工具函数
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
| `ESC` | 关闭面板 |

---

## 🌟 版本更新

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
