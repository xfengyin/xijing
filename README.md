# 🎵 兮·境 | 本兮音乐纪念空间

<p align="center">
  <img src="https://img.shields.io/badge/版本-v1.0.0-ff6b9d?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/许可证-MIT-4ecdc4?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/技术-Three.js-ffb6c1?style=flat-square" alt="Tech">
  <img src="https://img.shields.io/badge/PWA-支持-87ceeb?style=flat-square" alt="PWA">
</p>

<p align="center">
  <strong>沉浸式本兮音乐纪念空间，让青春永不散场</strong>
</p>

<p align="center">
  <a href="https://github.com/xfengyin/xijing">🌟 GitHub</a> •
  <a href="https://xijing.vercel.app">🚀 在线体验</a> •
  <a href="#功能介绍">✨ 功能介绍</a> •
  <a href="#快速开始">🚀 快速开始</a>
</p>

---

## ✨ 功能介绍

### 🎵 核心音乐体验
- **3D唱片店** - Three.js打造的沉浸式3D场景，旋转的黑胶唱片
- **歌词同步** - 8首完整LRC歌词，逐字高亮显示
- **情感主题** - 根据歌曲情绪自动切换氛围色彩
- **音效反馈** - 全程Web Audio API音效，每一次交互都有回响

### 🤖 AI技术演示
- **音质修复** - AI音质增强可视化演示
- **波形可视化** - 音波律动效果
- **人声分离** - 虚拟对唱间概念展示

### 💫 互动纪念空间
- **虚拟对唱间** - 与本兮"合唱"，生成纪念卡片
- **永恒直播间** - 模拟直播场景，弹幕互动，赠送礼物
- **粉丝留言墙** - 留下你的回忆，与大家一起纪念
- **照片画廊** - 3D照片墙展示珍贵瞬间

### 📱 PWA支持
- ✅ 可安装到主屏幕（手机/平板/电脑）
- ✅ 离线访问支持
- ✅ Service Worker缓存
- ✅ 后台同步

---

## 🚀 快速开始

### 在线体验
👉 **[https://xijing.vercel.app](https://xijing.vercel.app)**

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/xfengyin/xijing.git
cd xijing

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开 http://localhost:5173
```

### 构建生产版本

```bash
npm run build
# 输出到 dist/ 目录
```

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **3D渲染** | Three.js + WebGL |
| **构建工具** | Vite |
| **样式** | CSS3 + Glassmorphism |
| **音频** | Web Audio API |
| **PWA** | Service Worker + Manifest |
| **部署** | Vercel |

---

## 📁 项目结构

```
xijing/
├── public/              # 静态资源
│   ├── lyrics/         # LRC歌词文件
│   ├── icons/          # PWA图标
│   ├── manifest.json   # PWA配置
│   └── sw.js           # Service Worker
├── src/
│   ├── scenes/         # 3D场景
│   ├── components/     # UI组件
│   ├── data/           # 歌曲数据
│   ├── styles/         # CSS样式
│   └── utils/          # 工具函数
├── index.html
├── package.json
└── README.md
```

---

## 🎯 使用指南

### 首次访问
1. 打开网页，欣赏开屏动画
2. 点击"安装"添加到主屏幕
3. 浏览歌曲列表，点击播放
4. 探索各种功能面板

### 键盘快捷键
| 快捷键 | 功能 |
|--------|------|
| `空格` | 播放/暂停 |
| `Ctrl + ←` | 上一首 |
| `Ctrl + →` | 下一首 |
| `L` | 切换歌词面板 |
| `M` | 切换留言墙 |
| `T` | 切换时间轴 |
| `ESC` | 关闭面板 |

---

## 📊 项目数据

- 📈 **代码总量**: 6,481行
- 🎵 **歌曲数量**: 8首完整歌词
- 🎨 **3D场景**: 2个（唱片店 + 照片画廊）
- ⚡ **功能模块**: 14个
- 📱 **PWA支持**: 完整

---

## 🌟 特色亮点

1. **沉浸式3D体验** - Three.js打造的梦幻音乐空间
2. **完整歌词同步** - 8首歌曲逐字高亮
3. **AI概念演示** - 音质修复、人声分离可视化
4. **纪念互动** - 对唱、直播、留言多功能
5. **PWA支持** - 可安装，离线使用
6. **情感化设计** - 主题随歌曲变化
7. **无障碍优化** - 键盘操作、焦点管理
8. **性能卓越** - 流畅60fps体验

---

## 📜 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

## 💝 致敬

**本兮 (1994-2016)**

> "音乐是我表达的方式，每一首歌都是我的心情日记。"

本项目仅为纪念本兮及其音乐作品，所有歌曲版权归属原作者及唱片公司。

---

<p align="center">
  Made with 💕 by 兮·境团队
</p>

<p align="center">
  <sub>让青春永不散场</sub>
</p>