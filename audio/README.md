# 🎵 音频文件说明

## 当前状态

本项目的音频文件（`./audio/*.mp3`）**尚未包含在仓库中**，原因是：

1. 本兮的音乐作品版权归属唱片公司，未经授权不得分发
2. 播放器已内置**模拟播放模式**，可在无音频文件时正常运行

## 模拟播放模式

播放器会自动检测音频是否可用：
- ✅ 音频文件存在 → 播放真实音频
- ❌ 音频文件不存在 → 自动切换模拟模式，显示进度动画

模拟模式功能完整：
- ✅ 播放 / 暂停 / 上一首 / 下一首
- ✅ 进度条拖动
- ✅ 歌词同步滚动
- ✅ 随机 / 循环模式

## 如何添加真实音频

如果你拥有本兮音乐的正版授权（或已购买数字专辑），可以按以下方式添加：

### 方式一：手动放置（推荐）

```bash
# 在项目根目录创建 audio 文件夹
mkdir audio

# 将 MP3 文件命名为：1.mp3, 2.mp3, ..., 8.mp3
# 文件顺序对应 songs.js 中的歌曲顺序
cp /path/to/your/music/*.mp3 audio/

# 重新构建
npm run build
```

### 方式二：托管到 CDN

将音频上传至你自己的 CDN/云存储，修改 `src/data/songs.js` 中的 `audioSrc` 字段：

```javascript
audioSrc: "https://your-cdn.com/xijing/1.mp3"
```

### 方式三：自建媒体服务器

使用 Nginx/Caddy 等反向代理：

```nginx
location /audio/ {
    alias /path/to/your/music/;
    add_header Access-Control-Allow-Origin *;
}
```

## 版权声明

> ⚠️ 本项目仅作为**纪念本兮及其音乐作品**的非商业用途。
> 所有歌曲版权归属原作者及对应唱片公司。
> 请尊重版权，请勿将受版权保护的音乐文件用于任何商业目的。

## 开源音频替代方案（开发测试用）

如果你想在开发阶段使用示例音频，可以使用以下开源音乐：

```bash
# 使用免费音乐（需遵守对应开源协议）
curl -L "https://files.freemusicarchive.org/..." -o audio/1.mp3
```

推荐免费音乐来源：
- [Free Music Archive](https://freemusicarchive.org/)
- [Pixabay Music](https://pixabay.com/music/)
- [Uppbeat](https://uppbeat.io/)

## 音频格式要求

- 格式：MP3 / AAC / OGG（推荐 MP3）
- 采样率：44100Hz
- 比特率：≥128kbps（推荐 320kbps）
- 单文件大小：≤ 15MB
