/**
 * 兮·境 UI 3.0 - Spotify Design System 规范
 * 严格遵循 Spotify 配色/组件/排版规范
 * 核心变更：#1DB954绿色功能色 + 700/400字重 + pill按钮 + 8px卡片
 */

import { songs, getMoodConfig } from './data/songs.js'
import { LrcParser } from './utils/lrcParser.js'

// ==================== 音频播放器类 ====================
class AudioPlayer {
  constructor() {
    /** @type {HTMLAudioElement|null} */
    this.audio = null
    /** @type {boolean} 是否使用模拟进度 */
    this.simulationMode = true
    /** @type {number} 模拟播放当前时间（秒） */
    this.simulatedTime = 0
    /** @type {number} 歌曲总时长（秒） */
    this.duration = 0
    /** @type {number} 音量 0-1 */
    this.volume = 0.7
    /** @type {boolean} */
    this.isPlaying = false
    /** @type {number|null} 模拟进度的定时器ID */
    this.simulationInterval = null
    /** @type {Function|null} 播放结束回调 */
    this.onEnded = null
    /** @type {Function|null} 进度更新回调 */
    this.onTimeUpdate = null
    /** @type {Function|null} 音频模式切换回调 */
    this.onModeChange = null
  }

  /** 初始化音频元素 */
  init() {
    this.audio = new Audio()
    this.audio.volume = this.volume
    this.audio.preload = 'auto'

    // 音频时间更新
    this.audio.addEventListener('timeupdate', () => {
      if (!this.simulationMode && this.onTimeUpdate) {
        this.onTimeUpdate(this.audio.currentTime)
      }
    })

    // 音频播放结束
    this.audio.addEventListener('ended', () => {
      if (this.onEnded) this.onEnded()
    })

    // 音频加载错误 - 切换到模拟模式
    this.audio.addEventListener('error', () => {
      console.log('[AudioPlayer] 音频加载失败，切换到模拟模式')
      this.switchToSimulation()
    })
  }

  /** 加载音频文件 */
  loadSong(src, duration) {
    this.duration = duration
    this.simulatedTime = 0
    this.stopSimulation()

    if (this.audio && src) {
      this.simulationMode = false
      this.audio.src = src
      this.audio.load()

      // 设置超时检测：3秒内无法播放则切换模拟
      const timeout = setTimeout(() => {
        if (!this.simulationMode && this.audio.readyState < 2) {
          this.switchToSimulation()
        }
      }, 3000)

      this.audio.addEventListener('canplay', () => clearTimeout(timeout), { once: true })
    } else {
      this.switchToSimulation()
    }
  }

  /** 切换到模拟模式 */
  switchToSimulation() {
    this.simulationMode = true
    if (this.audio) {
      this.audio.pause()
      this.audio.src = ''
    }
    if (this.onModeChange) {
      this.onModeChange(true) // true = 模拟模式
    }
  }

  /** 播放 */
  play() {
    this.isPlaying = true
    if (this.simulationMode) {
      this.startSimulation()
    } else {
      this.audio.play().catch(() => {
        this.switchToSimulation()
        this.startSimulation()
      })
    }
  }

  /** 暂停 */
  pause() {
    this.isPlaying = false
    if (this.simulationMode) {
      this.stopSimulation()
    } else {
      this.audio.pause()
    }
  }

  /** 跳转到指定时间 */
  seek(time) {
    this.simulatedTime = Math.max(0, Math.min(time, this.duration))
    if (this.simulationMode) {
      if (this.onTimeUpdate) this.onTimeUpdate(this.simulatedTime)
    } else {
      this.audio.currentTime = this.simulatedTime
    }
  }

  /** 设置音量 */
  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v))
    if (this.audio) this.audio.volume = this.volume
  }

  /** 获取当前时间 */
  getCurrentTime() {
    if (this.simulationMode) return this.simulatedTime
    return this.audio ? this.audio.currentTime : 0
  }

  /** 启动模拟进度 */
  startSimulation() {
    this.stopSimulation()
    this.simulationInterval = setInterval(() => {
      if (this.isPlaying) {
        this.simulatedTime += 0.25
        if (this.onTimeUpdate) this.onTimeUpdate(this.simulatedTime)
        if (this.simulatedTime >= this.duration) {
          this.stopSimulation()
          if (this.onEnded) this.onEnded()
        }
      }
    }, 250)
  }

  /** 停止模拟进度 */
  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval)
      this.simulationInterval = null
    }
  }

  /** 销毁 */
  destroy() {
    this.stopSimulation()
    if (this.audio) {
      this.audio.pause()
      this.audio.src = ''
    }
  }
}

// ==================== 主应用类 ====================
export class XijingSpotifyApp {
  constructor() {
    this.currentSong = null
    this.currentSongIndex = 0
    this.isPlaying = false
    this.isLiked = false
    this.isShuffle = false
    this.repeatMode = 0 // 0: off, 1: all, 2: one
    this.activePanel = null

    /** @type {AudioPlayer} */
    this.audioPlayer = new AudioPlayer()

    /** @type {LrcParser} */
    this.lrcParser = new LrcParser()

    /** @type {Array} 当前歌词数据 */
    this.currentLyrics = []

    /** @type {number} 当前高亮歌词索引 */
    this.currentLyricIndex = -1

    /** @type {boolean} 是否模拟模式 */
    this.isSimulationMode = true

    /** @type {Array} 留言数据 */
    this.messages = this.loadMessages()
  }

  init() {
    this.audioPlayer.init()
    this.audioPlayer.onTimeUpdate = (time) => this.onTimeUpdate(time)
    this.audioPlayer.onEnded = () => this.onSongEnded()
    this.audioPlayer.onModeChange = (sim) => { this.isSimulationMode = sim }
    this.loadSongs()
    this.bindEvents()
    this.loadSong(0)
  }

  // ==================== 歌曲列表 ====================

  loadSongs() {
    const songListEl = document.getElementById('song-list')
    if (!songListEl || !songs) return

    songListEl.innerHTML = songs.map((song, index) => `
      <div class="song-item ${index === 0 ? 'active' : ''}" data-index="${index}">
        <div class="song-cover-mini" style="background: ${song.coverColor}" aria-hidden="true">
          <span class="cover-char">${song.title[0]}</span>
        </div>
        <div class="song-info">
          <div class="song-name">${song.title}</div>
          <div class="song-album">${song.album || '单曲'} · ${song.year}</div>
        </div>
        <span class="song-duration">${song.duration}</span>
      </div>
    `).join('')

    // 绑定歌曲点击事件
    songListEl.querySelectorAll('.song-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index)
        this.loadSong(index)
        this.play()
      })
    })
  }

  // ==================== 加载歌曲 ====================

  async loadSong(index) {
    if (!songs || !songs[index]) return

    this.currentSongIndex = index
    this.currentSong = songs[index]

    // 加载音频
    this.audioPlayer.loadSong(this.currentSong.audioSrc, this.currentSong.durationSec)

    // 更新歌曲列表高亮
    document.querySelectorAll('.song-item').forEach((item, i) => {
      item.classList.toggle('active', i === index)
    })

    // 更新Hero区封面
    this.updateHeroCover()

    // 更新播放栏封面
    this.updatePlayerCover()

    // 更新背景主题色
    this.updateThemeColors()

    // 更新Hero信息
    const heroTitle = document.getElementById('hero-title')
    if (heroTitle) heroTitle.textContent = this.currentSong.title

    const heroArtist = this.currentSong.querySelector?.('.hero-artist')
    const heroArtistEl = document.querySelector('.hero-artist')
    if (heroArtistEl) heroArtistEl.innerHTML = `<a href="#">本兮</a> · ${this.currentSong.year}`

    const timeTotal = document.getElementById('time-total')
    if (timeTotal) timeTotal.textContent = this.currentSong.duration

    // 更新播放栏信息
    const trackName = document.getElementById('player-track-name')
    if (trackName) trackName.textContent = this.currentSong.title

    const trackArtist = document.getElementById('player-track-artist')
    if (trackArtist) trackArtist.textContent = '本兮'

    // 重置进度
    this.updateProgress(0)

    // 加载歌词
    await this.loadLyrics()
  }

  // ==================== 封面更新 ====================

  /** 更新Hero区大封面 */
  updateHeroCover() {
    const artwork = document.getElementById('album-artwork')
    if (!artwork) return

    const placeholder = artwork.querySelector('.album-placeholder')
    if (placeholder) {
      placeholder.style.background = this.currentSong.coverColor
      placeholder.innerHTML = `<span class="cover-char-hero">${this.currentSong.title[0]}</span>`
    }
  }

  /** 更新播放栏小封面 */
  updatePlayerCover() {
    const cover = document.getElementById('player-cover')
    if (!cover) return

    const placeholder = cover.querySelector('.player-cover-placeholder')
    if (placeholder) {
      placeholder.style.background = this.currentSong.coverColor
      placeholder.innerHTML = `<span class="cover-char-small">${this.currentSong.title[0]}</span>`
    }
  }

  // ==================== 主题色联动 ====================

  /** 根据歌曲切换背景渐变和强调色 */
  updateThemeColors() {
    const moodConfig = getMoodConfig(this.currentSong.mood)
    const centerContent = document.querySelector('.center-content')
    if (centerContent && moodConfig) {
      centerContent.style.background = moodConfig.bg
    }

    // 更新CSS变量
    document.documentElement.style.setProperty('--accent-active', this.currentSong.themeColor)
  }

  // ==================== LRC歌词 ====================

  /** 加载当前歌曲的LRC歌词 */
  async loadLyrics() {
    if (!this.currentSong) return

    const lrcUrl = `./lyrics/${this.currentSong.id}.lrc`
    const result = await this.lrcParser.load(lrcUrl)
    this.currentLyrics = result.lyrics || []
    this.currentLyricIndex = -1

    // 如果当前歌词面板打开，刷新显示
    if (this.activePanel === 'lyrics') {
      this.renderLyricsPanel()
    }
  }

  /** 渲染歌词面板内容 */
  renderLyricsPanel() {
    const body = document.getElementById('panel-body')
    if (!body) return

    if (this.currentLyrics.length === 0) {
      body.innerHTML = `
        <div class="lyrics-container" id="lyrics-container">
          <div class="lyrics-line">暂无歌词</div>
        </div>`
      return
    }

    body.innerHTML = `
      <div class="lyrics-container" id="lyrics-container">
        ${this.currentLyrics.map((l, i) =>
          `<div class="lyrics-line${i === this.currentLyricIndex ? ' current' : ''}" data-index="${i}">${l.text}</div>`
        ).join('')}
      </div>`

    // 自动滚动到当前行
    this.scrollToCurrentLyric()
  }

  /** 更新歌词高亮 */
  updateLyricHighlight(currentTime) {
    if (!this.currentLyrics.length) return

    const newIndex = this.lrcParser.getCurrentIndex(currentTime)
    if (newIndex !== this.currentLyricIndex) {
      this.currentLyricIndex = newIndex
      // 更新DOM
      const container = document.getElementById('lyrics-container')
      if (container) {
        container.querySelectorAll('.lyrics-line').forEach((el, i) => {
          el.classList.toggle('current', i === newIndex)
        })
        this.scrollToCurrentLyric()
      }
    }
  }

  /** 滚动到当前歌词行 */
  scrollToCurrentLyric() {
    if (this.currentLyricIndex < 0) return
    const container = document.getElementById('lyrics-container')
    if (!container) return

    const currentLine = container.querySelector(`.lyrics-line[data-index="${this.currentLyricIndex}"]`)
    if (currentLine) {
      currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // ==================== 播放控制 ====================

  play() {
    this.isPlaying = true
    this.audioPlayer.play()
    this.updatePlayButton()
    document.getElementById('vinyl-record')?.classList.add('spinning')
  }

  pause() {
    this.isPlaying = false
    this.audioPlayer.pause()
    this.updatePlayButton()
    document.getElementById('vinyl-record')?.classList.remove('spinning')
  }

  toggle() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  updatePlayButton() {
    const btn = document.getElementById('btn-play')
    if (btn) {
      btn.textContent = this.isPlaying ? '❚❚' : '▶'
      btn.setAttribute('aria-label', this.isPlaying ? '暂停' : '播放')
    }
    const heroBtn = document.getElementById('btn-play-hero')
    if (heroBtn) {
      heroBtn.querySelector('span')?.remove()
      heroBtn.textContent = this.isPlaying ? '❚❚ 暂停' : '▶ 播放'
    }
  }

  next() {
    let nextIndex
    if (this.isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length)
      // 避免选到同一首
      if (songs.length > 1) {
        while (nextIndex === this.currentSongIndex) {
          nextIndex = Math.floor(Math.random() * songs.length)
        }
      }
    } else {
      nextIndex = (this.currentSongIndex + 1) % songs.length
    }
    this.loadSong(nextIndex)
    if (this.isPlaying) this.play()
  }

  prev() {
    const prevIndex = (this.currentSongIndex - 1 + songs.length) % songs.length
    this.loadSong(prevIndex)
    if (this.isPlaying) this.play()
  }

  toggleLike() {
    this.isLiked = !this.isLiked
    const btn = document.getElementById('player-like')
    if (btn) {
      btn.textContent = this.isLiked ? '♥' : '♡'
      btn.classList.toggle('liked', this.isLiked)
      btn.setAttribute('aria-label', this.isLiked ? '取消喜欢' : '喜欢')
    }
    const heroBtn = document.getElementById('btn-like-hero')
    if (heroBtn) {
      heroBtn.textContent = this.isLiked ? '♥' : '♡'
    }
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle
    const btn = document.getElementById('btn-shuffle')
    if (btn) {
      btn.style.color = this.isShuffle ? '#1DB954' : ''
      btn.classList.toggle('active', this.isShuffle)
      btn.setAttribute('aria-label', this.isShuffle ? '关闭随机' : '随机播放')
    }
  }

  toggleRepeat() {
    this.repeatMode = (this.repeatMode + 1) % 3
    const btn = document.getElementById('btn-repeat')
    if (btn) {
      btn.style.color = this.repeatMode > 0 ? '#1DB954' : ''
      btn.classList.toggle('active', this.repeatMode > 0)
      btn.textContent = this.repeatMode === 2 ? '🔂' : '🔁'
      const labels = ['关闭循环', '列表循环', '单曲循环']
      btn.setAttribute('aria-label', labels[this.repeatMode])
    }
  }

  // ==================== 进度更新 ====================

  updateProgress(percent) {
    const fill = document.getElementById('progress-fill')
    if (fill) {
      fill.style.width = `${Math.max(0, Math.min(100, percent))}%`
    }

    const current = document.getElementById('time-current')
    if (current) {
      const ct = this.audioPlayer.getCurrentTime()
      const minutes = Math.floor(ct / 60)
      const seconds = Math.floor(ct % 60)
      current.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }

  /** 播放时间更新回调 */
  onTimeUpdate(currentTime) {
    const duration = this.currentSong ? this.currentSong.durationSec : 212
    const percent = (currentTime / duration) * 100
    this.updateProgress(percent)
    this.updateLyricHighlight(currentTime)
  }

  /** 歌曲播放结束回调 */
  onSongEnded() {
    if (this.repeatMode === 2) {
      // 单曲循环
      this.audioPlayer.seek(0)
      this.play()
    } else if (this.repeatMode === 1 || this.currentSongIndex < songs.length - 1) {
      // 列表循环或还有下一首
      this.next()
    } else {
      // 播放结束
      this.pause()
      this.audioPlayer.seek(0)
      this.updateProgress(0)
    }
  }

  // ==================== 留言墙 ====================

  /** 从localStorage加载留言 */
  loadMessages() {
    try {
      const saved = localStorage.getItem('xijing_messages')
      if (saved) return JSON.parse(saved)
    } catch (e) { /* ignore */ }

    // 默认留言
    return [
      { author: '兮饭小忆', text: '这首歌陪我度过了整个高中时代，现在听到还是会流泪。本兮，你还好吗？', time: '3小时前', likes: 128 },
      { author: '音乐旅人', text: '每次听都会想起那个夏天，那些回不去的青春。谢谢你，本兮。', time: '昨天', likes: 256 },
      { author: '追光者', text: '10年了，依然会在深夜单曲循环。你的声音，是青春最美的注脚。', time: '2天前', likes: 512 }
    ]
  }

  /** 保存留言到localStorage */
  saveMessages() {
    try {
      localStorage.setItem('xijing_messages', JSON.stringify(this.messages))
    } catch (e) { /* ignore */ }
  }

  /** 发送留言 */
  sendMessage(text) {
    if (!text.trim()) return

    const nicknames = ['星辰', '微风', '月光', '晨露', '云朵', '彩虹', '暖阳', '清泉']
    const author = nicknames[Math.floor(Math.random() * nicknames.length)] + Math.floor(Math.random() * 100)

    this.messages.unshift({
      author,
      text: text.trim(),
      time: '刚刚',
      likes: 0
    })

    this.saveMessages()

    // 刷新留言面板
    if (this.activePanel === 'messages') {
      this.renderMessagesPanel()
    }
  }

  /** 渲染留言面板 */
  renderMessagesPanel() {
    const body = document.getElementById('panel-body')
    if (!body) return

    body.innerHTML = `
      <div class="message-list" id="message-list">
        ${this.messages.map(m => `
          <div class="message-item">
            <div class="message-header">
              <span class="message-author">${m.author}</span>
              <span class="message-time">${m.time}</span>
            </div>
            <div class="message-text">${m.text}</div>
            <div class="message-actions">
              <span class="message-action">♡ ${m.likes}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="message-input-area">
        <input type="text" class="message-input" id="message-input" placeholder="写下你想对本兮说的话..." maxlength="200" aria-label="留言输入">
        <button class="btn-primary" id="btn-send-message" style="padding: 12px 24px; font-size: 14px;" aria-label="发送留言">发送</button>
      </div>`

    // 绑定发送事件
    const input = document.getElementById('message-input')
    const sendBtn = document.getElementById('btn-send-message')

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        if (input && input.value.trim()) {
          this.sendMessage(input.value)
        }
      })
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
          this.sendMessage(input.value)
        }
      })
    }
  }

  // ==================== 面板系统 ====================

  openPanel(panelName) {
    const overlay = document.getElementById('panel-overlay')
    const title = document.getElementById('panel-title')
    const body = document.getElementById('panel-body')

    if (!overlay || !title || !body) return

    this.activePanel = panelName
    overlay.classList.add('active')

    switch (panelName) {
      case 'lyrics':
        title.textContent = '歌词'
        this.renderLyricsPanel()
        break

      case 'messages':
        title.textContent = '留言墙'
        this.renderMessagesPanel()
        break

      case 'ai':
        title.textContent = 'AI音质修复'
        this.renderAIPanel()
        break

      case 'duet':
        title.textContent = '虚拟对唱'
        this.renderDuetPanel()
        break

      case 'live':
        title.textContent = '永恒直播间'
        this.renderLivePanel()
        break

      case 'timeline':
        title.textContent = '音乐历程'
        this.renderTimelinePanel()
        break

      case 'search':
        title.textContent = '搜索'
        this.renderSearchPanel()
        break
    }
  }

  closePanel() {
    const overlay = document.getElementById('panel-overlay')
    if (overlay) {
      overlay.classList.remove('active')
      this.activePanel = null
    }
  }

  // ==================== AI功能面板（演示） ====================

  renderAIPanel() {
    const body = document.getElementById('panel-body')
    if (!body) return

    body.innerHTML = `
      <div class="ai-demo-panel">
        <div class="ai-demo-badge">演示功能</div>
        <div class="waveform-container" id="waveform-container">
          ${Array.from({length: 40}, (_, i) =>
            `<div class="waveform-bar" style="--delay: ${i * 0.05}s; --height: ${20 + Math.random() * 60}%"></div>`
          ).join('')}
        </div>
        <h3 class="ai-demo-title">AI音质增强</h3>
        <p class="ai-demo-desc">使用AI技术修复老旧音频，重现录音室音质<br>去除底噪、增强高频、修复失真</p>
        <div class="ai-demo-status">
          <span class="status-dot"></span>
          算法模型加载中...
        </div>
      </div>`
  }

  renderDuetPanel() {
    const body = document.getElementById('panel-body')
    if (!body) return

    body.innerHTML = `
      <div class="ai-demo-panel">
        <div class="ai-demo-badge">演示功能</div>
        <div class="duet-visual">
          <div class="duet-avatar">
            <span>本</span>
          </div>
          <div class="duet-wave">
            ${Array.from({length: 20}, (_, i) =>
              `<div class="duet-wave-bar" style="--delay: ${i * 0.08}s"></div>`
            ).join('')}
          </div>
          <div class="duet-avatar duet-me">
            <span>你</span>
          </div>
        </div>
        <h3 class="ai-demo-title">虚拟对唱间</h3>
        <p class="ai-demo-desc">与本兮隔空合唱，创造属于你们的音乐时刻<br>AI将实时匹配你的声线与节奏</p>
        <div class="ai-demo-status">
          <span class="status-dot"></span>
          等待麦克风授权...
        </div>
      </div>`
  }

  renderLivePanel() {
    const body = document.getElementById('panel-body')
    if (!body) return

    const danmakuMessages = [
      '好听！', '本兮永远在', '思念不会停', '青春的记忆',
      '循环播放中', '哭着听完', '想念你', '经典永不过时',
      '兮饭报到', '永远的歌姬', '听到了心碎的声音', '回忆杀'
    ]

    body.innerHTML = `
      <div class="ai-demo-panel live-panel">
        <div class="ai-demo-badge">演示功能 · 直播中 🔴</div>
        <div class="live-screen">
          <div class="live-visualizer">
            ${Array.from({length: 30}, (_, i) =>
              `<div class="live-bar" style="--delay: ${i * 0.1}s; --h: ${15 + Math.random() * 70}%"></div>`
            ).join('')}
          </div>
          <div class="live-info">
            <span class="live-viewers">👁 1,234 在看</span>
            <span class="live-song">${this.currentSong ? this.currentSong.title : '小三你好贱'}</span>
          </div>
          <div class="danmaku-container" id="danmaku-container">
            ${danmakuMessages.map(m => `<span class="danmaku" style="--offset: ${Math.random() * 100}%; --delay: ${Math.random() * 8}s; --duration: ${6 + Math.random() * 4}s">${m}</span>`).join('')}
          </div>
        </div>
        <h3 class="ai-demo-title">24小时直播中</h3>
        <p class="ai-demo-desc">与万千兮饭一起聆听本兮的音乐</p>
      </div>`
  }

  // ==================== 时间线面板 ====================

  renderTimelinePanel() {
    const body = document.getElementById('panel-body')
    if (!body) return

    const timeline = [
      { year: '2010', title: '出道', desc: '发布首支原创单曲《怎么办我爱你》，16岁的本兮开始在网络上崭露头角，清新的嗓音和真实的创作迅速吸引了大量关注。' },
      { year: '2012', title: '首张专辑', desc: '发行专辑《run away》，奠定了她作为90后网络歌手代表的地位，歌曲在各大平台广为传唱。' },
      { year: '2013-2015', title: '创作高峰', desc: '创作并发布大量作品，成为90后青春记忆。《海海海》等作品展现了她更加成熟的音乐风格与更深的情感表达。' },
      { year: '2016', title: '永恒纪念', desc: '2016年12月24日，本兮永远离开了我们。她的音乐和精神依然在无数粉丝心中延续，青春永不散场。', memorial: true }
    ]

    body.innerHTML = `
      <div class="timeline-container">
        <div class="timeline-track">
          ${timeline.map(t => `
            <div class="timeline-item">
              <div class="timeline-dot${t.memorial ? ' memorial' : ''}"></div>
              <div class="timeline-year${t.memorial ? ' memorial' : ''}">${t.year}</div>
              <div class="timeline-title${t.memorial ? ' memorial' : ''}">${t.title}</div>
              <div class="timeline-desc">${t.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>`
  }

  // ==================== 搜索面板 ====================

  renderSearchPanel() {
    const body = document.getElementById('panel-body')
    if (!body) return

    body.innerHTML = `
      <div class="search-panel">
        <div class="search-input-wrap">
          <input type="text" class="search-input" id="search-input" placeholder="搜索歌曲..." aria-label="搜索歌曲" autofocus>
        </div>
        <div class="search-results" id="search-results">
          ${songs.map((s, i) => `
            <div class="search-result-item" data-index="${i}">
              <div class="song-cover-mini" style="background: ${s.coverColor}">
                <span class="cover-char">${s.title[0]}</span>
              </div>
              <div class="song-info">
                <div class="song-name">${s.title}</div>
                <div class="song-album">${s.album} · ${s.year}</div>
              </div>
              <span class="song-duration">${s.duration}</span>
            </div>
          `).join('')}
        </div>
      </div>`

    // 绑定搜索
    const input = document.getElementById('search-input')
    const results = document.getElementById('search-results')

    if (input && results) {
      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase()
        results.querySelectorAll('.search-result-item').forEach(item => {
          const name = item.querySelector('.song-name')?.textContent.toLowerCase() || ''
          const album = item.querySelector('.song-album')?.textContent.toLowerCase() || ''
          item.style.display = (!q || name.includes(q) || album.includes(q)) ? '' : 'none'
        })
      })

      // 点击搜索结果播放
      results.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.dataset.index)
          this.loadSong(idx)
          this.play()
          this.closePanel()
        })
      })
    }
  }

  // ==================== 事件绑定 ====================

  bindEvents() {
    // 播放控制
    document.getElementById('btn-play')?.addEventListener('click', () => this.toggle())
    document.getElementById('btn-play-hero')?.addEventListener('click', () => this.toggle())
    document.getElementById('btn-next')?.addEventListener('click', () => this.next())
    document.getElementById('btn-prev')?.addEventListener('click', () => this.prev())
    document.getElementById('player-like')?.addEventListener('click', () => this.toggleLike())
    document.getElementById('btn-like-hero')?.addEventListener('click', () => this.toggleLike())
    document.getElementById('btn-shuffle')?.addEventListener('click', () => this.toggleShuffle())
    document.getElementById('btn-repeat')?.addEventListener('click', () => this.toggleRepeat())

    // 进度条 - 点击和拖拽
    this.bindProgressBar()

    // 音量控制
    document.getElementById('volume-slider')?.addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      this.audioPlayer.setVolume(percent)
      const fill = document.getElementById('volume-fill')
      if (fill) fill.style.width = `${Math.max(0, Math.min(1, percent)) * 100}%`
    })

    // 功能卡片
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('click', () => {
        const feature = card.dataset.feature
        const panelMap = {
          'lyrics': 'lyrics',
          'messages': 'messages',
          'ai': 'ai',
          'duet': 'duet',
          'live': 'live',
          'timeline': 'timeline'
        }
        if (panelMap[feature]) this.openPanel(panelMap[feature])
      })
    })

    // 导航标签
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'))
        tab.classList.add('active')

        const tabName = tab.dataset.tab
        const panelMap = {
          'home': null,
          'lyrics': 'lyrics',
          'messages': 'messages',
          'timeline': 'timeline'
        }

        if (panelMap[tabName]) {
          this.openPanel(panelMap[tabName])
        } else {
          this.closePanel()
        }
      })
    })

    // 关闭面板
    document.getElementById('panel-close')?.addEventListener('click', () => this.closePanel())
    document.getElementById('btn-lyrics')?.addEventListener('click', () => this.openPanel('lyrics'))

    // 导航栏按钮
    document.getElementById('btn-search')?.addEventListener('click', () => this.openPanel('search'))

    document.getElementById('btn-share-hero')?.addEventListener('click', () => this.shareSong())
    document.getElementById('btn-fullscreen')?.addEventListener('click', () => this.toggleFullscreen())

    // 即将推出按钮 - tooltip
    document.getElementById('btn-settings')?.addEventListener('click', () => this.showTooltip('设置功能即将推出'))
    document.getElementById('btn-user')?.addEventListener('click', () => this.showTooltip('个人中心即将推出'))
    document.getElementById('btn-queue')?.addEventListener('click', () => this.showTooltip('播放队列即将推出'))
    document.getElementById('btn-device')?.addEventListener('click', () => this.showTooltip('设备切换即将推出'))

    // 更多按钮
    document.getElementById('btn-more-hero')?.addEventListener('click', () => this.openPanel('search'))

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          this.toggle()
          break
        case 'ArrowLeft':
          if (e.ctrlKey) this.prev()
          else if (e.shiftKey) {
            // 快退5秒
            const ct = this.audioPlayer.getCurrentTime()
            this.audioPlayer.seek(ct - 5)
          }
          break
        case 'ArrowRight':
          if (e.ctrlKey) this.next()
          else if (e.shiftKey) {
            // 快进5秒
            const ct2 = this.audioPlayer.getCurrentTime()
            this.audioPlayer.seek(ct2 + 5)
          }
          break
        case 'Escape':
          this.closePanel()
          break
      }
    })
  }

  // ==================== 进度条拖拽 ====================

  bindProgressBar() {
    const bar = document.getElementById('progress-bar')
    if (!bar) return

    let isDragging = false

    const seekTo = (e) => {
      const rect = bar.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const duration = this.currentSong ? this.currentSong.durationSec : 212
      this.audioPlayer.seek(duration * percent)
      this.updateProgress(percent * 100)
    }

    bar.addEventListener('mousedown', (e) => {
      isDragging = true
      seekTo(e)
    })

    document.addEventListener('mousemove', (e) => {
      if (isDragging) seekTo(e)
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
    })

    // 触摸支持
    bar.addEventListener('touchstart', (e) => {
      isDragging = true
      const touch = e.touches[0]
      seekTo(touch)
    }, { passive: true })

    bar.addEventListener('touchmove', (e) => {
      if (isDragging) {
        const touch = e.touches[0]
        seekTo(touch)
      }
    }, { passive: true })

    bar.addEventListener('touchend', () => {
      isDragging = false
    })
  }

  // ==================== 分享功能 ====================

  async shareSong() {
    const text = `🎵 ${this.currentSong.title} - 本兮 | 兮·境音乐纪念空间`
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title: '兮·境', text, url })
      } catch (e) { /* 用户取消 */ }
    } else {
      // 复制链接
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        this.showTooltip('链接已复制到剪贴板')
      } catch (e) {
        this.showTooltip('分享功能暂不可用')
      }
    }
  }

  // ==================== 全屏 ====================

  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen().catch(() => {
        this.showTooltip('全屏模式不可用')
      })
    }
  }

  // ==================== Tooltip提示 ====================

  showTooltip(text) {
    // 移除已有tooltip
    document.querySelectorAll('.app-tooltip').forEach(t => t.remove())

    const tip = document.createElement('div')
    tip.className = 'app-tooltip'
    tip.textContent = text
    document.body.appendChild(tip)

    // 显示
    requestAnimationFrame(() => tip.classList.add('show'))

    // 3秒后移除
    setTimeout(() => {
      tip.classList.remove('show')
      setTimeout(() => tip.remove(), 300)
    }, 3000)
  }

  // ==================== 销毁 ====================

  destroy() {
    this.audioPlayer.destroy()
  }
}
