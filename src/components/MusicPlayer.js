export class MusicPlayer {
  constructor(container, onEvent) {
    this.container = container
    this.onEvent = onEvent
    this.audio = null
    this.isPlaying = false
    this.currentTime = 0
    this.duration = 0
    this.progressInterval = null
    this.currentSong = null
  }

  init() {
    this.createPlayerUI()
    this.bindEvents()
  }

  createPlayerUI() {
    const player = document.createElement('div')
    player.className = 'music-player glass-panel'
    player.innerHTML = `
      <div class="player-info">
        <div class="player-cover" id="player-cover">🎵</div>
        <div class="player-meta">
          <div class="player-title" id="player-title">选择一首歌</div>
          <div class="player-artist" id="player-artist">本兮</div>
        </div>
      </div>
      
      <div class="progress-bar" id="progress-bar">
        <div class="progress-fill" id="progress-fill"></div>
        <div class="progress-handle" id="progress-handle"></div>
      </div>
      
      <div class="time-display">
        <span id="current-time">0:00</span>
        <span id="duration">0:00</span>
      </div>
      
      <div class="player-controls">
        <button class="control-btn" id="btn-prev" title="上一首">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        
        <button class="control-btn play" id="btn-play" title="播放/暂停">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" id="play-icon">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" id="pause-icon" style="display:none">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
        
        <button class="control-btn" id="btn-next" title="下一首">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>
    `
    
    this.container.appendChild(player)
    this.ui = {
      cover: document.getElementById('player-cover'),
      title: document.getElementById('player-title'),
      artist: document.getElementById('player-artist'),
      progressBar: document.getElementById('progress-bar'),
      progressFill: document.getElementById('progress-fill'),
      progressHandle: document.getElementById('progress-handle'),
      currentTime: document.getElementById('current-time'),
      duration: document.getElementById('duration'),
      playBtn: document.getElementById('btn-play'),
      prevBtn: document.getElementById('btn-prev'),
      nextBtn: document.getElementById('btn-next'),
      playIcon: document.getElementById('play-icon'),
      pauseIcon: document.getElementById('pause-icon')
    }
  }

  bindEvents() {
    // 播放/暂停
    this.ui.playBtn.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause()
      } else {
        this.play()
      }
    })

    // 上一首/下一首
    this.ui.prevBtn.addEventListener('click', () => {
      this.onEvent('prev')
    })

    this.ui.nextBtn.addEventListener('click', () => {
      this.onEvent('next')
    })

    // 进度条拖拽
    let isDragging = false
    
    this.ui.progressBar.addEventListener('mousedown', (e) => {
      isDragging = true
      this.seek(e)
    })

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        this.seek(e)
      }
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
    })

    // 点击进度条
    this.ui.progressBar.addEventListener('click', (e) => {
      if (!isDragging) {
        this.seek(e)
      }
    })
  }

  seek(e) {
    const rect = this.ui.progressBar.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    this.currentTime = percent * this.duration
    this.updateProgress()
    
    // 模拟音频跳转
    if (this.progressInterval) {
      clearInterval(this.progressInterval)
      if (this.isPlaying) {
        this.startProgressTimer()
      }
    }
  }

  load(song) {
    this.currentSong = song
    this.ui.title.textContent = song.title
    this.ui.artist.textContent = `${song.album} · ${song.year}`
    this.ui.cover.textContent = this.getSongEmoji(song.mood)
    this.ui.cover.style.background = `linear-gradient(135deg, ${song.themeColor}, #87ceeb)`
    
    // 解析时长
    const [min, sec] = song.duration.split(':').map(Number)
    this.duration = min * 60 + sec
    this.currentTime = 0
    
    this.updateProgress()
    this.ui.duration.textContent = song.duration
    
    // 重置播放状态
    this.isPlaying = false
    this.updatePlayButton()
  }

  getSongEmoji(mood) {
    const emojis = {
      叛逆: '🎸',
      忧伤: '🌧️',
      青春: '☀️',
      温柔: '🌸',
      思念: '🌙',
      活力: '⚡',
      迷茫: '🌫️',
      俏皮: '😜'
    }
    return emojis[mood] || '🎵'
  }

  play() {
    this.isPlaying = true
    this.updatePlayButton()
    this.onEvent('play')
    this.startProgressTimer()
  }

  pause() {
    this.isPlaying = false
    this.updatePlayButton()
    this.onEvent('pause')
    this.stopProgressTimer()
  }

  updatePlayButton() {
    if (this.isPlaying) {
      this.ui.playIcon.style.display = 'none'
      this.ui.pauseIcon.style.display = 'block'
    } else {
      this.ui.playIcon.style.display = 'block'
      this.ui.pauseIcon.style.display = 'none'
    }
  }

  startProgressTimer() {
    this.progressInterval = setInterval(() => {
      this.currentTime += 1
      if (this.currentTime >= this.duration) {
        this.currentTime = 0
        this.pause()
        this.onEvent('next')
      }
      this.updateProgress()
      
      // 触发进度事件，包含当前时间和总时长
      if (this.onEvent) {
        this.onEvent('progress', { 
          currentTime: this.currentTime, 
          duration: this.duration 
        })
      }
    }, 1000)
  }

  stopProgressTimer() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval)
      this.progressInterval = null
    }
  }

  updateProgress() {
    const percent = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0
    this.ui.progressFill.style.width = `${percent}%`
    this.ui.progressHandle.style.left = `${percent}%`
    this.ui.currentTime.textContent = this.formatTime(this.currentTime)
  }

  formatTime(seconds) {
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec.toString().padStart(2, '0')}`
  }
}