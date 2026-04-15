/**
 * 兮·境 — UI 控制器模块
 * 负责所有 DOM 操作与用户交互绑定
 */

import { songs, getMoodConfig } from '../data/songs.js'

export class UIController {
  constructor(store, audioPlayer, lrcParser) {
    this.store = store
    this.audioPlayer = audioPlayer
    this.lrcParser = lrcParser
  }

  // ==================== 初始化绑定 ====================

  bindEvents() {
    this._bindPlayControls()
    this._bindProgressBar()
    this._bindVolume()
    this._bindKeyboardShortcuts()
    this._bindPanelOverlay()
    this._bindHeroActions()
    this._bindNavButtons()
  }

  // ==================== 播放控制按钮 ====================

  _bindPlayControls() {
    const btn = document.getElementById('btn-play')
    if (btn) btn.addEventListener('click', () => this.store.toggle())

    const vinyl = document.getElementById('vinyl-record')
    if (vinyl) vinyl.addEventListener('click', () => this.store.toggle())

    document.getElementById('btn-prev')?.addEventListener('click', () => this.store.prev())
    document.getElementById('btn-next')?.addEventListener('click', () => this.store.next())
    document.getElementById('btn-shuffle')?.addEventListener('click', () => {
      this.store.set('isShuffle', !this.store.get('isShuffle'))
    })
    document.getElementById('btn-repeat')?.addEventListener('click', () => {
      this.store.set('repeatMode', (this.store.get('repeatMode') + 1) % 3)
    })
    document.getElementById('player-like')?.addEventListener('click', () => {
      this.store.set('isLiked', !this.store.get('isLiked'))
    })
  }

  // ==================== 进度条 ====================

  _bindProgressBar() {
    const progressBar = document.getElementById('progress-bar')
    if (!progressBar) return

    const handleSeek = (e) => {
      const rect = progressBar.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const time = percent * (this.store.get('currentSong')?.durationSec || 212)
      this.audioPlayer.seek(time)
    }

    progressBar.addEventListener('click', handleSeek)
    progressBar.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0]
      handleSeek({ clientX: touch.clientX })
    })
  }

  // ==================== 音量 ====================

  _bindVolume() {
    const volumeBar = document.getElementById('volume-bar')
    const volumeSlider = document.getElementById('volume-bar-fill')
    if (!volumeBar) return

    volumeBar.addEventListener('click', (e) => {
      const rect = volumeBar.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      this.audioPlayer.setVolume(percent)
      if (volumeSlider) volumeSlider.style.width = `${percent * 100}%`
    })

    // 初始化音量显示
    if (volumeSlider) volumeSlider.style.width = `${this.audioPlayer.volume * 100}%`
  }

  // ==================== 键盘快捷键 ====================

  _bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // ESC 关闭面板
      if (e.key === 'Escape') {
        const overlay = document.getElementById('panel-overlay')
        if (overlay?.classList.contains('active')) {
          this.closePanel()
          return
        }
      }

      // 空格暂停/播放（不在输入框中）
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.code === 'Space') {
          e.preventDefault()
          this.store.toggle()
        }
        if (e.ctrlKey && e.key === 'ArrowRight') {
          e.preventDefault()
          this.store.next()
        }
        if (e.ctrlKey && e.key === 'ArrowLeft') {
          e.preventDefault()
          this.store.prev()
        }
        if (e.shiftKey && e.key === 'ArrowRight') {
          e.preventDefault()
          this.audioPlayer.seek(this.audioPlayer.getCurrentTime() + 5)
        }
        if (e.shiftKey && e.key === 'ArrowLeft') {
          e.preventDefault()
          this.audioPlayer.seek(this.audioPlayer.getCurrentTime() - 5)
        }
      }
    })
  }

  // ==================== 面板系统 ====================

  _bindPanelOverlay() {
    const overlay = document.getElementById('panel-overlay')
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.closePanel()
    })
    document.getElementById('panel-close')?.addEventListener('click', () => this.closePanel())
  }

  _bindHeroActions() {
    document.getElementById('btn-play-hero')?.addEventListener('click', () => this.store.toggle())
    document.getElementById('btn-like-hero')?.addEventListener('click', () => {
      this.store.set('isLiked', !this.store.get('isLiked'))
    })
    document.getElementById('btn-share')?.addEventListener('click', () => this._handleShare())
    document.getElementById('btn-fullscreen')?.addEventListener('click', () => this._handleFullscreen())
  }

  _bindNavButtons() {
    const panelButtons = {
      'btn-lyrics': 'lyrics',
      'btn-messages': 'messages',
      'btn-ai': 'ai',
      'btn-duet': 'duet',
      'btn-live': 'live',
      'btn-timeline': 'timeline',
      'btn-search': 'search'
    }

    Object.entries(panelButtons).forEach(([id, panel]) => {
      document.getElementById(id)?.addEventListener('click', () => this.openPanel(panel))
    })
  }

  openPanel(panelName) {
    const overlay = document.getElementById('panel-overlay')
    const title = document.getElementById('panel-title')
    const body = document.getElementById('panel-body')
    if (!overlay || !title || !body) return

    this.store.set('activePanel', panelName)
    overlay.classList.add('active')
    title.textContent = this._getPanelTitle(panelName)

    const renderMap = {
      lyrics: () => this.renderLyricsPanel(),
      messages: () => this.renderMessagesPanel(),
      ai: () => this.renderAIPanel(),
      duet: () => this.renderDuetPanel(),
      live: () => this.renderLivePanel(),
      timeline: () => this.renderTimelinePanel(),
      search: () => this.renderSearchPanel()
    }

    if (renderMap[panelName]) renderMap[panelName]()
  }

  closePanel() {
    document.getElementById('panel-overlay')?.classList.remove('active')
    this.store.set('activePanel', null)
  }

  _getPanelTitle(name) {
    const titles = {
      lyrics: '歌词', messages: '留言墙', ai: 'AI音质修复',
      duet: '虚拟对唱', live: '永恒直播间', timeline: '音乐历程', search: '搜索'
    }
    return titles[name] || ''
  }

  // ==================== 歌曲列表渲染 ====================

  renderSongList() {
    const songListEl = document.getElementById('song-list')
    if (!songListEl) return

    const filtered = this.store.get('filteredSongs')
    const currentIndex = this.store.get('currentSongIndex')

    songListEl.innerHTML = filtered.map((song, displayIdx) => {
      const realIndex = songs.indexOf(song)
      return `
      <div class="song-item ${realIndex === currentIndex ? 'active' : ''}" data-index="${realIndex}">
        <div class="song-cover-mini" style="background: ${song.coverColor}" aria-hidden="true">
          <span class="cover-char">${song.title[0]}</span>
        </div>
        <div class="song-info">
          <div class="song-name">${song.title}</div>
          <div class="song-album">${song.album || '单曲'} · ${song.year}</div>
        </div>
        <span class="song-duration">${song.duration}</span>
      </div>`
    }).join('')

    songListEl.querySelectorAll('.song-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index)
        this.store.loadSong(index)
        this.store.set('isPlaying', true)
        this.audioPlayer.loadSong(songs[index].audioSrc, songs[index].durationSec)
        this.audioPlayer.play()
        this._updateAll()
      })
    })
  }

  // ==================== 面板渲染 ====================

  renderLyricsPanel() {
    const body = document.getElementById('panel-body')
    if (!body) return
    const lyrics = this.store.get('currentLyrics')
    const idx = this.store.get('currentLyricIndex')

    body.innerHTML = `<div class="lyrics-container" id="lyrics-container">
      ${lyrics.length === 0 ? '<div class="lyrics-line">暂无歌词</div>' :
        lyrics.map((l, i) => `<div class="lyrics-line${i === idx ? ' current' : ''}" data-index="${i}">${l.text}</div>`).join('')}
    </div>`
  }

  renderMessagesPanel() {
    const body = document.getElementById('panel-body')
    if (!body) return
    const messages = this.store.get('messages')

    body.innerHTML = `
      <div class="message-list" id="message-list">
        ${messages.map(m => `
          <div class="message-item">
            <div class="message-header">
              <span class="message-author">${m.author}</span>
              <span class="message-time">${m.time}</span>
            </div>
            <div class="message-text">${m.text}</div>
            <div class="message-actions"><span class="message-action">♡ ${m.likes}</span></div>
          </div>`).join('')}
      </div>
      <div class="message-input-area">
        <input type="text" class="message-input" id="message-input" placeholder="写下你想对本兮说的话..." maxlength="200" aria-label="留言输入">
        <button class="btn-primary" id="btn-send-message" style="padding: 12px 24px; font-size: 14px;" aria-label="发送留言">发送</button>
      </div>`

    const input = document.getElementById('message-input')
    const sendBtn = document.getElementById('btn-send-message')
    sendBtn?.addEventListener('click', () => {
      if (input?.value.trim()) this.store.sendMessage(input.value)
      if (input) input.value = ''
      this.renderMessagesPanel()
    })
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.store.sendMessage(input.value)
        if (input) input.value = ''
        this.renderMessagesPanel()
      }
    })
  }

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
        <div class="ai-demo-status"><span class="status-dot"></span>算法模型加载中...</div>
      </div>`
  }

  renderDuetPanel() {
    const body = document.getElementById('panel-body')
    if (!body) return
    body.innerHTML = `
      <div class="ai-demo-panel">
        <div class="ai-demo-badge">演示功能</div>
        <div class="duet-visual">
          <div class="duet-avatar"><span>本</span></div>
          <div class="duet-wave">${Array.from({length: 20}, (_, i) =>
            `<div class="duet-wave-bar" style="--delay: ${i * 0.08}s"></div>`
          ).join('')}</div>
          <div class="duet-avatar duet-me"><span>你</span></div>
        </div>
        <h3 class="ai-demo-title">虚拟对唱间</h3>
        <p class="ai-demo-desc">与本兮隔空合唱，创造属于你们的音乐时刻<br>AI将实时匹配你的声线与节奏</p>
        <div class="ai-demo-status"><span class="status-dot"></span>等待麦克风授权...</div>
      </div>`
  }

  renderLivePanel() {
    const body = document.getElementById('panel-body')
    if (!body) return
    const danmaku = ['好听！', '本兮永远在', '思念不会停', '青春的记忆', '循环播放中', '哭着听完', '想念你', '经典永不过时', '兮饭报到', '永远的本兮']
    body.innerHTML = `
      <div class="live-panel">
        <div class="live-badge"><span class="live-dot"></span>直播中</div>
        <p class="live-desc">本兮永恒直播间 — 歌声穿越时空，永不谢幕</p>
        <div class="danmaku-container" id="danmaku-container">
          ${danmaku.map((d, i) => `<div class="danmaku-item" style="animation-delay: ${i * 0.8}s">${d}</div>`).join('')}
        </div>
      </div>`
  }

  renderTimelinePanel() {
    const body = document.getElementById('panel-body')
    if (!body) return
    const events = [
      { year: '2010', event: '首支原创单曲《怎么办我爱你》发布，正式出道' },
      { year: '2011', event: '《小三你好贱》《你在看孤独的风景》走红网络' },
      { year: '2012', event: '专辑《未成年》发布，代表作诞生' },
      { year: '2013', event: '全国巡回演唱会，场场爆满' },
      { year: '2014', event: '获得多项音乐大奖认可' },
      { year: '2015', event: '《海海海》发布，音乐风格更加成熟' },
      { year: '2016', event: '最后一张专辑《本兮》发行' }
    ]
    body.innerHTML = `
      <div class="timeline-container">
        ${events.map((e, i) => `
          <div class="timeline-item">
            <div class="timeline-year">${e.year}</div>
            <div class="timeline-dot"></div>
            <div class="timeline-content">${e.event}</div>
          </div>`).join('')}
      </div>`
  }

  renderSearchPanel() {
    const body = document.getElementById('panel-body')
    if (!body) return
    body.innerHTML = `
      <div class="search-panel">
        <input type="text" class="search-input" id="search-input" placeholder="搜索歌曲、情绪、专辑..." aria-label="搜索">
        <div class="search-results" id="search-results">
          <p style="color: #b3b3b3; text-align: center; margin-top: 20px;">输入关键词搜索歌曲</p>
        </div>
      </div>`
    const input = document.getElementById('search-input')
    input?.addEventListener('input', (e) => {
      this.store.search(e.target.value)
      this._renderSearchResults()
    })
  }

  _renderSearchResults() {
    const results = document.getElementById('search-results')
    if (!results) return
    const filtered = this.store.get('filteredSongs')
    const currentIndex = this.store.get('currentSongIndex')

    if (filtered.length === 0) {
      results.innerHTML = '<p style="color: #b3b3b3; text-align: center; margin-top: 20px;">没有找到匹配的歌曲</p>'
      return
    }

    results.innerHTML = filtered.map(song => {
      const realIndex = songs.indexOf(song)
      return `
        <div class="song-item ${realIndex === currentIndex ? 'active' : ''}" data-index="${realIndex}">
          <div class="song-cover-mini" style="background: ${song.coverColor}">
            <span class="cover-char">${song.title[0]}</span>
          </div>
          <div class="song-info">
            <div class="song-name">${song.title}</div>
            <div class="song-album">${song.album} · ${song.year} · ${song.mood}</div>
          </div>
          <span class="song-duration">${song.duration}</span>
        </div>`
    }).join('')

    results.querySelectorAll('.song-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index)
        this.store.loadSong(index)
        this.store.set('isPlaying', true)
        this.audioPlayer.loadSong(songs[index].audioSrc, songs[index].durationSec)
        this.audioPlayer.play()
        this._updateAll()
        this.closePanel()
      })
    })
  }

  // ==================== 全量更新 ====================

  _updateAll() {
    this.updatePlayButton()
    this.updateHeroCover()
    this.updatePlayerCover()
    this.updateThemeColors()
    this.updateHeroInfo()
    this.renderSongList()
  }

  // ==================== 播放状态更新 ====================

  updatePlayButton() {
    const isPlaying = this.store.get('isPlaying')
    const btn = document.getElementById('btn-play')
    if (btn) {
      btn.textContent = isPlaying ? '❚❚' : '▶'
      btn.setAttribute('aria-label', isPlaying ? '暂停' : '播放')
    }
    const heroBtn = document.getElementById('btn-play-hero')
    if (heroBtn) heroBtn.textContent = isPlaying ? '❚❚ 暂停' : '▶ 播放'

    const vinyl = document.getElementById('vinyl-record')
    if (vinyl) vinyl.classList.toggle('spinning', isPlaying)

    const isLiked = this.store.get('isLiked')
    const playerLikeBtn = document.getElementById('player-like')
    if (playerLikeBtn) {
      playerLikeBtn.classList.toggle('liked', isLiked)
      playerLikeBtn.textContent = isLiked ? '♥' : '♡'
    }
    const heroLikeBtn = document.getElementById('btn-like-hero')
    if (heroLikeBtn) heroLikeBtn.textContent = isLiked ? '♥' : '♡'

    const isShuffle = this.store.get('isShuffle')
    const shuffleBtn = document.getElementById('btn-shuffle')
    if (shuffleBtn) {
      shuffleBtn.style.color = isShuffle ? '#1DB954' : ''
      shuffleBtn.classList.toggle('active', isShuffle)
    }

    const repeatMode = this.store.get('repeatMode')
    const repeatBtn = document.getElementById('btn-repeat')
    if (repeatBtn) {
      repeatBtn.style.color = repeatMode > 0 ? '#1DB954' : ''
      repeatBtn.classList.toggle('active', repeatMode > 0)
      repeatBtn.textContent = repeatMode === 2 ? '🔂' : '🔁'
    }
  }

  updateProgress(percent) {
    const fill = document.getElementById('progress-fill')
    if (fill) fill.style.width = `${Math.max(0, Math.min(100, percent))}%`

    const current = document.getElementById('time-current')
    if (current) {
      const ct = this.audioPlayer.getCurrentTime()
      current.textContent = `${Math.floor(ct / 60)}:${Math.floor(ct % 60).toString().padStart(2, '0')}`
    }
  }

  updateHeroCover() {
    const song = this.store.get('currentSong')
    if (!song) return
    const placeholder = document.querySelector('#album-artwork .album-placeholder')
    if (placeholder) {
      placeholder.style.background = song.coverColor
      placeholder.innerHTML = `<span class="cover-char-hero">${song.title[0]}</span>`
    }
  }

  updatePlayerCover() {
    const song = this.store.get('currentSong')
    if (!song) return
    const placeholder = document.querySelector('#player-cover .player-cover-placeholder')
    if (placeholder) {
      placeholder.style.background = song.coverColor
      placeholder.innerHTML = `<span class="cover-char-small">${song.title[0]}</span>`
    }
  }

  updateThemeColors() {
    const song = this.store.get('currentSong')
    if (!song) return
    const moodConfig = getMoodConfig(song.mood)
    const centerContent = document.querySelector('.center-content')
    if (centerContent && moodConfig) {
      centerContent.style.background = moodConfig.bg
    }
    document.documentElement.style.setProperty('--accent-active', song.themeColor)
  }

  updateHeroInfo() {
    const song = this.store.get('currentSong')
    if (!song) return
    const heroTitle = document.getElementById('hero-title')
    if (heroTitle) heroTitle.textContent = song.title
    const heroArtistEl = document.querySelector('.hero-artist')
    if (heroArtistEl) heroArtistEl.innerHTML = `<a href="#">本兮</a> · ${song.year}`
    const timeTotal = document.getElementById('time-total')
    if (timeTotal) timeTotal.textContent = song.duration
    const trackName = document.getElementById('player-track-name')
    if (trackName) trackName.textContent = song.title
    const trackArtist = document.getElementById('player-track-artist')
    if (trackArtist) trackArtist.textContent = '本兮'
  }

  updateLyricHighlight(currentTime) {
    const lyrics = this.store.get('currentLyrics')
    const newIndex = this.lrcParser.getCurrentIndex(currentTime)
    if (newIndex === this.store.get('currentLyricIndex')) return

    this.store.set('currentLyricIndex', newIndex)
    if (this.store.get('activePanel') === 'lyrics') {
      const container = document.getElementById('lyrics-container')
      if (container) {
        container.querySelectorAll('.lyrics-line').forEach((el, i) => {
          el.classList.toggle('current', i === newIndex)
        })
        const currentLine = container.querySelector(`[data-index="${newIndex}"]`)
        currentLine?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  // ==================== 分享 & 全屏 ====================

  async _handleShare() {
    const song = this.store.get('currentSong')
    const shareData = {
      title: `兮·境 | ${song?.title || '本兮音乐纪念空间'}`,
      text: '沉浸式本兮音乐纪念空间，让青春永不散场',
      url: window.location.href
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch (e) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板！')
    }
  }

  _handleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }
}
