/**
 * 兮·境 UI 2.0 - Spotify x QQ音乐风格
 * 现代音乐播放器界面
 */

import { songs } from './data/songs.js'

export class XijingSpotifyApp {
  constructor() {
    this.currentSong = null
    this.currentSongIndex = 0
    this.isPlaying = false
    this.currentTime = 0
    this.duration = 212 // 3:32 in seconds
    this.volume = 0.7
    this.isLiked = false
    this.isShuffle = false
    this.repeatMode = 0 // 0: off, 1: all, 2: one
    this.activePanel = null
  }

  init() {
    this.loadSongs()
    this.bindEvents()
    this.loadSong(0)
    this.startProgressSimulation()
  }

  loadSongs() {
    const songListEl = document.getElementById('song-list')
    if (!songListEl || !songs) return

    songListEl.innerHTML = songs.map((song, index) => `
      <div class="song-item ${index === 0 ? 'active' : ''}" data-index="${index}">
        <span class="song-number">${index + 1}</span>
        <div class="song-info">
          <div class="song-name">${song.title}</div>
          <div class="song-album">${song.album || '单曲'}</div>
        </div>
        <span class="song-duration">${song.duration || '3:32'}</span>
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

  loadSong(index) {
    if (!songs || !songs[index]) return
    
    this.currentSongIndex = index
    this.currentSong = songs[index]
    this.currentTime = 0
    
    // 更新歌曲列表高亮
    document.querySelectorAll('.song-item').forEach((item, i) => {
      item.classList.toggle('active', i === index)
    })
    
    // 更新封面区
    document.getElementById('hero-title').textContent = this.currentSong.title
    document.getElementById('time-total').textContent = this.currentSong.duration || '3:32'
    
    // 更新播放栏
    document.getElementById('player-track-name').textContent = this.currentSong.title
    document.getElementById('player-track-artist').textContent = '本兮'
    
    // 重置进度
    this.updateProgress(0)
  }

  play() {
    this.isPlaying = true
    this.updatePlayButton()
    document.getElementById('vinyl-record')?.classList.add('spinning')
  }

  pause() {
    this.isPlaying = false
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
    }
  }

  next() {
    const nextIndex = (this.currentSongIndex + 1) % songs.length
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
    }
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle
    const btn = document.getElementById('btn-shuffle')
    if (btn) {
      btn.style.color = this.isShuffle ? '#ff6b9d' : ''
    }
  }

  toggleRepeat() {
    this.repeatMode = (this.repeatMode + 1) % 3
    const btn = document.getElementById('btn-repeat')
    if (btn) {
      btn.style.color = this.repeatMode > 0 ? '#ff6b9d' : ''
      btn.textContent = this.repeatMode === 2 ? '🔂' : '🔁'
    }
  }

  updateProgress(percent) {
    const fill = document.getElementById('progress-fill')
    if (fill) {
      fill.style.width = `${percent}%`
    }
    
    const current = document.getElementById('time-current')
    if (current) {
      const minutes = Math.floor(this.currentTime / 60)
      const seconds = Math.floor(this.currentTime % 60)
      current.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }

  startProgressSimulation() {
    setInterval(() => {
      if (this.isPlaying && this.currentTime < this.duration) {
        this.currentTime += 1
        const percent = (this.currentTime / this.duration) * 100
        this.updateProgress(percent)
        
        if (this.currentTime >= this.duration) {
          if (this.repeatMode === 2) {
            this.currentTime = 0
          } else {
            this.next()
          }
        }
      }
    }, 1000)
  }

  openPanel(panelName) {
    const overlay = document.getElementById('panel-overlay')
    const title = document.getElementById('panel-title')
    const body = document.getElementById('panel-body')
    
    if (!overlay || !title || !body) return
    
    this.activePanel = panelName
    overlay.classList.add('active')
    
    // 根据面板类型设置内容
    switch (panelName) {
      case 'lyrics':
        title.textContent = '歌词'
        body.innerHTML = `
          <div class="lyrics-container" id="lyrics-container">
            <div class="lyrics-line">♪ ♪ ♪</div>
            <div class="lyrics-line">小三你好贱</div>
            <div class="lyrics-line">本兮</div>
            <div class="lyrics-line"></div>
            <div class="lyrics-line current">我承认我犯贱 我承认我不要脸</div>
            <div class="lyrics-line">不用你指指点点 在一边装可怜</div>
            <div class="lyrics-line">我承认我犯贱 我承认我不要脸</div>
            <div class="lyrics-line">不用你假情假意 在一边装纯洁</div>
            <div class="lyrics-line"></div>
            <div class="lyrics-line">别说你的爱 只是敷衍</div>
            <div class="lyrics-line">别说你的情 都是谎言</div>
            <div class="lyrics-line">我不想再听 你的辩解</div>
            <div class="lyrics-line">就让我们从此 互不相欠</div>
          </div>
        `
        break
        
      case 'messages':
        title.textContent = '留言墙'
        body.innerHTML = `
          <div class="message-list">
            <div class="message-item">
              <div class="message-header">
                <span class="message-author">兮饭小忆</span>
                <span class="message-time">3小时前</span>
              </div>
              <div class="message-text">这首歌陪我度过了整个高中时代，现在听到还是会流泪。本兮，你还好吗？</div>
              <div class="message-actions">
                <span class="message-action">♡ 128</span>
                <span class="message-action">💬 回复</span>
              </div>
            </div>
            <div class="message-item">
              <div class="message-header">
                <span class="message-author">音乐旅人</span>
                <span class="message-time">昨天</span>
              </div>
              <div class="message-text">每次听都会想起那个夏天，那些回不去的青春。谢谢你，本兮。</div>
              <div class="message-actions">
                <span class="message-action">♡ 256</span>
                <span class="message-action">💬 回复</span>
              </div>
            </div>
            <div class="message-item">
              <div class="message-header">
                <span class="message-author">追光者</span>
                <span class="message-time">2天前</span>
              </div>
              <div class="message-text">10年了，依然会在深夜单曲循环。你的声音，是青春最美的注脚。</div>
              <div class="message-actions">
                <span class="message-action">♡ 512</span>
                <span class="message-action">💬 回复</span>
              </div>
            </div>
          </div>
          <div class="message-input-area">
            <input type="text" class="message-input" placeholder="写下你想对本兮说的话...">
            <button class="btn-primary" style="padding: 12px 24px; font-size: 14px;">发送</button>
          </div>
        `
        break
        
      case 'ai':
        title.textContent = 'AI音质修复'
        body.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 24px;">✨</div>
            <h3 style="font-size: 24px; margin-bottom: 16px;">AI音质增强</h3>
            <p style="color: #6a6a6a; margin-bottom: 32px;">使用AI技术修复老旧音频，重现录音室音质</p>
            <button class="btn-primary" style="padding: 16px 48px; font-size: 16px;">
              开始修复
            </button>
          </div>
        `
        break
        
      case 'duet':
        title.textContent = '虚拟对唱'
        body.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 24px;">🎤</div>
            <h3 style="font-size: 24px; margin-bottom: 16px;">虚拟对唱间</h3>
            <p style="color: #6a6a6a; margin-bottom: 32px;">与本兮隔空合唱，创造属于你们的音乐时刻</p>
            <button class="btn-primary" style="padding: 16px 48px; font-size: 16px;">
              进入对唱间
            </button>
          </div>
        `
        break
        
      case 'live':
        title.textContent = '永恒直播间'
        body.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 24px;">📺</div>
            <h3 style="font-size: 24px; margin-bottom: 16px;">24小时直播中</h3>
            <p style="color: #6a6a6a; margin-bottom: 32px;">与万千兮饭一起聆听本兮的音乐</p>
            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
              <button class="btn-primary" style="padding: 16px 48px; font-size: 16px;">
                进入直播间
              </button>
              <button class="btn-secondary" style="width: auto; padding: 16px 32px;">
                🔴 直播中
              </button>
            </div>
          </div>
        `
        break
        
      case 'timeline':
        title.textContent = '音乐历程'
        body.innerHTML = `
          <div style="padding: 24px;">
            <div style="border-left: 2px solid #ff6b9d; padding-left: 24px;">
              <div style="margin-bottom: 32px; position: relative;">
                <div style="position: absolute; left: -33px; width: 16px; height: 16px; background: #ff6b9d; border-radius: 50%;"></div>
                <div style="font-size: 14px; color: #ff6b9d; margin-bottom: 4px;">2011</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">出道</div>
                <div style="color: #6a6a6a;">发布首支单曲《小三你好贱》，迅速走红网络</div>
              </div>
              <div style="margin-bottom: 32px; position: relative;">
                <div style="position: absolute; left: -33px; width: 16px; height: 16px; background: #ff6b9d; border-radius: 50%;"></div>
                <div style="font-size: 14px; color: #ff6b9d; margin-bottom: 4px;">2012</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">首张专辑</div>
                <div style="color: #6a6a6a;">发行专辑《run away》，奠定网络歌手地位</div>
              </div>
              <div style="position: relative;">
                <div style="position: absolute; left: -33px; width: 16px; height: 16px; background: #ff6b9d; border-radius: 50%;"></div>
                <div style="font-size: 14px; color: #ff6b9d; margin-bottom: 4px;">2013-2016</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">创作高峰</div>
                <div style="color: #6a6a6a;">创作并发布大量作品，成为90后青春记忆</div>
              </div>
            </div>
          </div>
        `
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
    
    // 进度条点击
    document.getElementById('progress-bar')?.addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      this.currentTime = Math.floor(this.duration * percent)
      this.updateProgress(percent * 100)
    })
    
    // 音量控制
    document.getElementById('volume-slider')?.addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      this.volume = Math.max(0, Math.min(1, percent))
      const fill = document.getElementById('volume-fill')
      if (fill) {
        fill.style.width = `${this.volume * 100}%`
      }
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
        if (panelMap[feature]) {
          this.openPanel(panelMap[feature])
        }
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
          break
        case 'ArrowRight':
          if (e.ctrlKey) this.next()
          break
        case 'Escape':
          this.closePanel()
          break
      }
    })
  }
}
