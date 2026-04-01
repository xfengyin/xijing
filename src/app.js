import { RecordStoreScene } from './scenes/RecordStoreScene.js'
import { GalleryScene } from './scenes/GalleryScene.js'
import { MusicPlayer } from './components/MusicPlayer.js'
import { SongList } from './components/SongList.js'
import { LyricsDisplay } from './components/LyricsDisplay.js'
import { MessageWall } from './components/MessageWall.js'
import { AIEnhancer } from './components/AIEnhancer.js'
import { DuetRoom } from './components/DuetRoom.js'
import { LiveStream } from './components/LiveStream.js'
import { Timeline } from './components/Timeline.js'
import { PhotoGallery } from './components/PhotoGallery.js'
import { EmotionAnalyzer } from './components/EmotionAnalyzer.js'
import { SoundManager } from './utils/SoundManager.js'
import { TransitionManager } from './utils/TransitionManager.js'
import { songs } from './data/songs.js'

export class XijingApp {
  constructor() {
    this.scene = null
    this.galleryScene = null
    this.player = null
    this.songList = null
    this.lyrics = null
    this.messageWall = null
    this.aiEnhancer = null
    this.duetRoom = null
    this.liveStream = null
    this.timeline = null
    this.photoGallery = null
    this.emotionAnalyzer = null
    this.soundManager = null
    this.transitionManager = null
    this.currentSong = null
    this._resizeHandler = null
    this.activePanel = null
    this.currentScene = 'recordStore'
    
    // 暴露全局引用
    window.xijingApp = this
  }

  init() {
    try {
      // 创建容器
      const app = document.getElementById('app')
      if (!app) throw new Error('App container not found')
      
      // 3D场景容器
      const canvasContainer = document.createElement('div')
      canvasContainer.id = 'canvas-container'
      app.appendChild(canvasContainer)
      
      // UI层
      const uiLayer = document.createElement('div')
      uiLayer.id = 'ui-layer'
      app.appendChild(uiLayer)
      
      // 初始化3D场景
      this.scene = new RecordStoreScene(canvasContainer)
      const sceneInitSuccess = this.scene.init()
      if (!sceneInitSuccess) {
        console.warn('3D scene initialization may have issues, falling back to 2D mode')
      }
      
      // 初始化音乐播放器
      this.player = new MusicPlayer(uiLayer, this.onPlayerEvent.bind(this))
      this.player.init()
      
      // 初始化歌曲列表
      this.songList = new SongList(uiLayer, songs, this.onSongSelect.bind(this))
      this.songList.init()
      
      // 初始化歌词显示
      this.lyrics = new LyricsDisplay(uiLayer, this.onLyricEvent.bind(this))
      this.lyrics.init()
      
      // 初始化留言墙
      this.messageWall = new MessageWall(uiLayer)
      this.messageWall.init()
      
      // 初始化AI音质修复
      this.aiEnhancer = new AIEnhancer(uiLayer)
      this.aiEnhancer.init()
      
      // 初始化虚拟对唱间
      this.duetRoom = new DuetRoom(uiLayer, this.onDuetEvent.bind(this))
      this.duetRoom.init()
      
      // 初始化永恒直播间
      this.liveStream = new LiveStream(uiLayer)
      this.liveStream.init()
      
      // 初始化时间轴
      this.timeline = new Timeline(uiLayer)
      this.timeline.init()
      
      // 初始化情感分析器
      this.emotionAnalyzer = new EmotionAnalyzer(this.scene)
      
      // 添加标题
      this.createHeader(uiLayer)
      
      // 加载第一首歌
      if (songs.length > 0) {
        this.loadSong(songs[0])
      }
      
      // 添加切换按钮
      this.createToggleButtons(uiLayer)
      
      // 默认隐藏部分面板
      this.hideAllPanels()
      
      // 开始动画循环
      this.animate()
      
      // 窗口大小变化处理
      this._resizeHandler = this.onResize.bind(this)
      window.addEventListener('resize', this._resizeHandler)
      
      // 页面卸载时清理
      window.addEventListener('beforeunload', () => this.destroy())
      
    } catch (error) {
      console.error('Failed to initialize XijingApp:', error)
      this.showErrorMessage('初始化失败，请刷新页面重试')
    }
  }

  showErrorMessage(message) {
    const app = document.getElementById('app')
    if (app) {
      app.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;color:#ffb6c1;text-align:center;padding:20px;">
          <div style="font-size:48px;margin-bottom:20px;">😔</div>
          <div style="font-size:18px;margin-bottom:10px;">${message}</div>
          <button onclick="location.reload()" style="padding:10px 20px;background:#ffb6c1;border:none;border-radius:20px;color:#1a1a2e;cursor:pointer;margin-top:20px;">重新加载</button>
        </div>
      `
    }
  }

  destroy() {
    // 清理事件监听
    window.removeEventListener('resize', this._resizeHandler)
    
    // 清理3D场景
    if (this.scene) {
      this.scene.destroy()
    }
  }

  createHeader(container) {
    const header = document.createElement('div')
    header.className = 'header'
    header.innerHTML = `
      <h1 class="logo">兮·境</h1>
      <p class="subtitle">本兮音乐纪念空间</p>
    `
    container.appendChild(header)
  }

  createToggleButtons(container) {
    const toggleBar = document.createElement('div')
    toggleBar.className = 'toggle-bar'
    toggleBar.style.cssText = `
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 100;
      flex-wrap: wrap;
      justify-content: center;
    `
    
    const buttons = [
      { icon: '🎵', text: '歌词', panel: 'lyrics' },
      { icon: '💌', text: '留言', panel: 'messageWall' },
      { icon: '🤖', text: 'AI修复', panel: 'aiEnhancer' },
      { icon: '🎤', text: '对唱', panel: 'duetRoom' },
      { icon: '📺', text: '直播间', panel: 'liveStream' },
      { icon: '🕐', text: '历程', panel: 'timeline' }
    ]
    
    buttons.forEach(({ icon, text, panel }) => {
      const btn = document.createElement('button')
      btn.className = 'toggle-btn'
      btn.innerHTML = `${icon} ${text}`
      btn.style.cssText = this.getToggleBtnStyle()
      btn.addEventListener('click', () => {
        this.togglePanel(panel)
      })
      toggleBar.appendChild(btn)
    })
    
    container.appendChild(toggleBar)
  }

  hideAllPanels() {
    const panels = ['.lyrics-panel', '.message-wall', '.ai-enhancer', '.duet-room', '.live-stream', '.timeline-panel']
    panels.forEach(selector => {
      const panel = document.querySelector(selector)
      if (panel) panel.style.display = 'none'
    })
  }

  togglePanel(panelName) {
    const panelMap = {
      'lyrics': '.lyrics-panel',
      'messageWall': '.message-wall',
      'aiEnhancer': '.ai-enhancer',
      'duetRoom': '.duet-room',
      'liveStream': '.live-stream',
      'timeline': '.timeline-panel'
    }
    
    const selector = panelMap[panelName]
    if (!selector) return
    
    const panel = document.querySelector(selector)
    if (!panel) return
    
    // 如果点击的是当前激活的面板，则关闭它
    if (this.activePanel === panelName) {
      panel.style.display = 'none'
      this.activePanel = null
      return
    }
    
    // 否则隐藏所有面板，显示选中的
    this.hideAllPanels()
    panel.style.display = panelName === 'timeline' ? 'block' : (panelName === 'lyrics' ? 'flex' : 'block')
    this.activePanel = panelName
  }

  onDuetEvent(event, data) {
    console.log('Duet event:', event, data)
  }

  getToggleBtnStyle() {
    return `
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 20px;
      padding: 8px 16px;
      color: #fff;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    `
  }

  async loadSong(song) {
    this.currentSong = song
    this.player.load(song)
    this.songList.setActive(song.id)
    
    // 更新3D场景中的唱片
    this.scene?.setVinylColor(song.themeColor)
    
    // 加载歌词
    if (this.lyrics) {
      await this.lyrics.loadLyrics(song.id)
    }
    
    // 分析歌曲情感并应用主题
    if (this.emotionAnalyzer) {
      this.emotionAnalyzer.analyzeCurrentSong(song)
    }
  }

  onSongSelect(song) {
    this.loadSong(song)
    this.player.play()
  }

  onPlayerEvent(event, data) {
    switch (event) {
      case 'play':
        this.scene?.startVinylRotation()
        break
      case 'pause':
        this.scene?.stopVinylRotation()
        break
      case 'next':
        this.playNext()
        break
      case 'prev':
        this.playPrev()
        break
      case 'progress':
        // 歌词同步
        if (data?.currentTime !== undefined) {
          this.lyrics?.update(data.currentTime)
        }
        break
    }
  }

  onLyricEvent(event, data) {
    if (event === 'lyricChange') {
      // 可以根据歌词情感调整场景氛围
      console.log('Lyric changed:', data.text)
    }
  }

  playNext() {
    const currentIndex = songs.findIndex(s => s.id === this.currentSong?.id)
    const nextIndex = (currentIndex + 1) % songs.length
    this.loadSong(songs[nextIndex])
    this.player.play()
  }

  playPrev() {
    const currentIndex = songs.findIndex(s => s.id === this.currentSong?.id)
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length
    this.loadSong(songs[prevIndex])
    this.player.play()
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.scene?.update()
  }

  onResize() {
    this.scene?.onResize()
  }

  // 显示加载画面
  showLoadingScreen() {
    const loading = document.createElement('div')
    loading.id = 'loading-screen'
    loading.className = 'loading-screen'
    loading.innerHTML = `
      <div class="loading-logo">兮·境</div>
      <div class="loading-spinner"></div>
      <div class="loading-text">正在加载纪念空间...</div>
    `
    document.body.appendChild(loading)

    // 3秒后隐藏
    setTimeout(() => {
      loading.classList.add('hidden')
      setTimeout(() => loading.remove(), 500)
    }, 2000)
  }

  // 显示照片详情
  showPhotoDetail(id) {
    if (this.photoGallery) {
      this.photoGallery.showDetail(id)
    }
  }

  // 切换3D场景
  switchScene(sceneName) {
    if (this.currentScene === sceneName) return

    const container = document.getElementById('canvas-container')
    if (!container) return

    // 使用过渡效果
    this.transitionManager?.fadeOut(container, 300).then(() => {
      // 清理当前场景
      if (this.scene) {
        this.scene.destroy()
      }

      // 创建新场景
      if (sceneName === 'gallery') {
        this.galleryScene = new GalleryScene(container)
        this.galleryScene.init()
      } else {
        this.scene = new RecordStoreScene(container)
        this.scene.init()
      }

      this.currentScene = sceneName

      // 淡入
      this.transitionManager?.fadeIn(container, 300)
    })
  }

  // 显示提示
  showToast(message) {
    const toast = document.createElement('div')
    toast.className = 'toast-notification'
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => toast.classList.add('show'), 10)
    setTimeout(() => {
      toast.classList.remove('show')
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }
}