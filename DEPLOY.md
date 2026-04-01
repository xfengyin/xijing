# 🚀 兮·境 部署指南

## 📦 项目状态

- ✅ **GitHub仓库**: https://github.com/xfengyin/xijing
- ✅ **代码已推送**: 主分支包含完整代码
- ✅ **构建成功**: dist/ 文件夹已生成
- ⏳ **待部署**: 需要连接到Vercel/Netlify

---

## 方案一：Vercel 一键部署（推荐⭐）

### 步骤 1：导入 GitHub 仓库

1. 打开 [Vercel](https://vercel.com)
2. 点击 "Add New Project"
3. 导入 `xfengyin/xijing` 仓库
4. 框架预设选择：**Other**
5. 构建设置：
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 点击 **Deploy**

### 步骤 2：配置域名（可选）

1. 在 Vercel Dashboard 选择项目
2. 进入 Settings → Domains
3. 添加自定义域名

### 预计完成时间

🕐 **2分钟**

---

## 方案二：Netlify Drop 部署

### 步骤 1：上传构建文件

1. 打开 [Netlify Drop](https://app.netlify.com/drop)
2. 拖拽 `xijing/dist` 文件夹到页面
3. 等待上传完成

### 步骤 2：配置域名（可选）

1. 点击 "Site settings"
2. 进入 "Domain management"
3. 添加自定义域名

### 预计完成时间

🕐 **1分钟**

---

## 方案三：Cloudflare Pages

### 步骤 1：连接仓库

1. 打开 [Cloudflare Pages](https://dash.cloudflare.com)
2. 点击 "Create a project"
3. 连接 GitHub 仓库 `xfengyin/xijing`
4. 构建设置：
   - Build command: `npm run build`
   - Build output directory: `dist`
5. 点击 **Save and Deploy**

### 预计完成时间

🕐 **3分钟**

---

## 方案四：GitHub Pages

### 步骤 1：启用 GitHub Actions

仓库已包含 `.github/workflows/deploy.yml`，只需：

1. 在 GitHub 仓库页面，点击 Settings
2. 进入 Pages 设置
3. Source 选择 "GitHub Actions"
4. 自动部署

### 预计完成时间

🕐 **5分钟**

---

## 📋 部署前检查清单

- [ ] GitHub 仓库代码完整
- [ ] package.json 配置正确
- [ ] vite.config.js 配置正确
- [ ] 环境变量设置（如有）

---

## 🌐 部署后配置

### PWA 验证

部署后访问网站，检查：
1. 地址栏是否有"安装"图标
2. 离线模式下是否能访问
3. Service Worker 是否注册成功

### 性能优化

1. 启用 CDN 压缩
2. 配置缓存策略
3. 开启 HTTP/2

---

## 🆘 常见问题

### Q: 部署后白屏？
A: 检查构建输出目录是否为 `dist`

### Q: 资源加载 404？
A: 检查 base URL 配置是否正确

### Q: PWA 无法安装？
A: 确认 manifest.json 路径正确，且网站为 HTTPS

---

## 🎯 推荐配置

| 平台 | 优点 | 缺点 |
|------|------|------|
| **Vercel** | Git集成好，自动部署，全球CDN | 免费版有带宽限制 |
| **Netlify** | 部署简单，Drag & Drop | 免费版有构建时间限制 |
| **Cloudflare** | 速度快，无带宽限制 | 配置稍复杂 |
| **GitHub Pages** | 免费，与GitHub集成 | 仅静态网站 |

---

## 🚀 快速开始

**最快捷方式**：使用 Vercel

👉 [点击一键部署到 Vercel](https://vercel.com/new/clone?repository-url=https://github.com/xfengyin/xijing)

---

**项目已准备就绪，随时可以部署上线！** 🎉