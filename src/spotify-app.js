/**
 * 兮·境 UI 3.0 — 主应用调度器
 * Spotify Design System 规范
 * 架构：状态管理 + 音频引擎 + UI控制器 三层分离
 */

import { store } from './modules/state-manager.js'
import { AudioPlayer } from './modules/audio-player.js'
import { LrcParser } from './utils/lrcParser.js'
import { UIController } from './modules/ui-controller.js'
import { songs } from './data/songs.js'

class XijingSpotifyApp {
  constructor() {
    this.audioPlayer = new AudioPlayer()
    this.lrcParser = new LrcParser()
    this.ui = new UIController(store, this.audioPlayer, this.lrcParser)
  }

  init() {
    // 初始化音频引擎
    this.audioPlayer.init()
    this.audioPlayer.onTimeUpdate = (time) => this._onTimeUpdate(time)
    this.audioPlayer.onEnded = () => this._onSongEnded()
    this.audioPlayer.onModeChange = (sim) => store.set('isSimulationMode', sim)

    // 订阅状态变化，统一驱动UI更新
    store.subscribe('isPlaying', (isPlaying) => this.ui.updatePlayButton())
    store.subscribe('currentSong', () => this._onSongChanged())
    store.subscribe('currentLyricIndex', () => this._onLyricIndexChanged())

    // 绑定所有UI事件
    this.ui.bindEvents()

    // 渲染歌曲列表
    this.ui.renderSongList()

    // 加载第一首歌
    store.loadSong(0)
    store.set('isPlaying', false)

    // 初始化控制台欢迎
    console.log('%c兮·境', 'font-size:48px;font-weight:bold;color:#1DB954;')
    console.log('%c本兮音乐纪念空间 - 让青春永不散场', 'font-size:14px;color:#1DB954;')
    console.log('%cUI 3.0 — 模块化重构版', 'font-size:12px;color:#b3b3b3;')

    window.xijingApp = this
  }

  _onTimeUpdate(currentTime) {
    const song = store.get('currentSong')
    const duration = song ? song.durationSec : 212
    const percent = (currentTime / duration) * 100
    this.ui.updateProgress(percent)
    this.ui.updateLyricHighlight(currentTime)
  }

  _onSongEnded() {
    const { repeatMode, currentSongIndex } = store.state
    if (repeatMode === 2) {
      this.audioPlayer.seek(0)
      store.set('isPlaying', true)
      this.audioPlayer.play()
    } else if (repeatMode === 1 || currentSongIndex < songs.length - 1) {
      store.next()
      store.set('isPlaying', true)
      const song = store.get('currentSong')
      if (song) {
        this.audioPlayer.loadSong(song.audioSrc, song.durationSec)
        this.audioPlayer.play()
      }
    } else {
      store.set('isPlaying', false)
      this.audioPlayer.seek(0)
      this.ui.updateProgress(0)
    }
  }

  _onSongChanged() {
    const song = store.get('currentSong')
    if (!song) return

    this.ui.updateHeroCover()
    this.ui.updatePlayerCover()
    this.ui.updateThemeColors()
    this.ui.updateHeroInfo()

    // 加载音频
    this.audioPlayer.loadSong(song.audioSrc, song.durationSec)

    // 加载歌词
    this._loadLyrics()

    // 重置进度
    this.ui.updateProgress(0)
  }

  async _loadLyrics() {
    const song = store.get('currentSong')
    if (!song) return
    const result = await this.lrcParser.load(`./lyrics/${song.id}.lrc`)
    store.set('currentLyrics', result.lyrics || [])
  }

  _onLyricIndexChanged() {
    if (store.get('activePanel') === 'lyrics') {
      this.ui.renderLyricsPanel()
    }
  }
}

// 等待DOM加载
window.addEventListener('DOMContentLoaded', () => {
  const app = new XijingSpotifyApp()
  app.init()
})

// 全局错误处理
window.addEventListener('error', (e) => console.error('[App Error]', e.error))
window.addEventListener('unhandledrejection', (e) => console.error('[Unhandled Rejection]', e.reason))
