// 音效管理器
export class SoundManager {
  constructor() {
    this.enabled = true
    this.volume = 0.3
    this.sounds = {}
    this.context = null
  }

  init() {
    // 尝试创建音频上下文
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }

  // 创建简单的音效
  createTone(frequency, duration, type = 'sine') {
    if (!this.context || !this.enabled) return

    const oscillator = this.context.createOscillator()
    const gainNode = this.context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.context.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(this.volume, this.context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration)

    oscillator.start(this.context.currentTime)
    oscillator.stop(this.context.currentTime + duration)
  }

  // 播放点击音效
  playClick() {
    this.createTone(800, 0.1, 'sine')
  }

  // 播放切换音效
  playSwitch() {
    this.createTone(600, 0.15, 'triangle')
    setTimeout(() => this.createTone(800, 0.15, 'triangle'), 50)
  }

  // 播放悬停音效
  playHover() {
    this.createTone(400, 0.05, 'sine')
  }

  // 播放成功音效
  playSuccess() {
    this.createTone(523.25, 0.1, 'sine') // C5
    setTimeout(() => this.createTone(659.25, 0.1, 'sine'), 100) // E5
    setTimeout(() => this.createTone(783.99, 0.2, 'sine'), 200) // G5
  }

  // 播放发送音效
  playSend() {
    this.createTone(440, 0.1, 'sine')
    setTimeout(() => this.createTone(554, 0.1, 'sine'), 50)
    setTimeout(() => this.createTone(659, 0.15, 'sine'), 100)
  }

  // 播放礼物音效
  playGift() {
    const notes = [523.25, 659.25, 783.99, 1046.50]
    notes.forEach((note, i) => {
      setTimeout(() => this.createTone(note, 0.1, 'sine'), i * 80)
    })
  }

  // 启用/禁用音效
  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }

  // 设置音量
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
  }
}