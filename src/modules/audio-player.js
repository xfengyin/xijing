/**
 * 兮·境 — 音频播放器模块
 * 支持真实音频 + 模拟降级双模式
 */

export class AudioPlayer {
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
    /** @type {number|null} 模拟模式超时ID */
    this._simulationTimeout = null
  }

  /** 初始化音频元素 */
  init() {
    this.audio = new Audio()
    this.audio.volume = this.volume
    this.audio.preload = 'auto'

    this.audio.addEventListener('timeupdate', () => {
      if (!this.simulationMode && this.onTimeUpdate) {
        this.onTimeUpdate(this.audio.currentTime)
      }
    })

    this.audio.addEventListener('ended', () => {
      if (this.onEnded) this.onEnded()
    })

    this.audio.addEventListener('error', () => {
      console.log('[AudioPlayer] 音频加载失败，切换到模拟模式')
      this.switchToSimulation()
    })

    this.audio.addEventListener('play', () => {
      this.isPlaying = true
    })

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false
    })
  }

  /** 加载音频文件 */
  loadSong(src, duration) {
    this.duration = duration
    this.simulatedTime = 0
    this.stopSimulation()
    this._clearTimeout()

    if (this.audio && src) {
      this.simulationMode = false
      this.audio.src = src
      this.audio.load()

      // 设置超时检测：3秒内无法播放则切换模拟
      this._simulationTimeout = setTimeout(() => {
        if (!this.simulationMode && this.audio.readyState < 2) {
          this.switchToSimulation()
        }
      }, 3000)

      this.audio.addEventListener('canplay', () => this._clearTimeout(), { once: true })
    } else {
      this.switchToSimulation()
    }
  }

  /** 切换到模拟模式 */
  switchToSimulation() {
    this.simulationMode = true
    this._clearTimeout()
    if (this.audio) {
      this.audio.pause()
      this.audio.src = ''
    }
    if (this.onModeChange) {
      this.onModeChange(true)
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

  /** 获取播放状态 */
  getIsPlaying() {
    return this.isPlaying
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

  _clearTimeout() {
    if (this._simulationTimeout) {
      clearTimeout(this._simulationTimeout)
      this._simulationTimeout = null
    }
  }

  /** 销毁 */
  destroy() {
    this.stopSimulation()
    this._clearTimeout()
    if (this.audio) {
      this.audio.pause()
      this.audio.src = ''
      this.audio = null
    }
  }
}
