// 虚拟对唱间 - 与本兮"合唱"
export class DuetRoom {
  constructor(container, onEvent) {
    this.container = container
    this.onEvent = onEvent
    this.isRecording = false
    this.countdown = 0
  }

  init() {
    this.createDuetUI()
  }

  createDuetUI() {
    const panel = document.createElement('div')
    panel.className = 'duet-room glass-panel'
    panel.innerHTML = `
      <div class="duet-header">
        <span class="duet-title">🎤 虚拟对唱间</span>
        <span class="duet-subtitle">跨越时空的合唱</span>
      </div>
      <div class="duet-stage">
        <div class="stage-avatar">
          <div class="avatar-benxi">
            <div class="avatar-glow"></div>
            <span class="avatar-name">本兮</span>
            <span class="avatar-status">✨ 人声已提取</span>
          </div>
          <div class="stage-connector">+</div>
          <div class="avatar-user">
            <div class="avatar-placeholder">你</div>
            <span class="avatar-name">你</span>
            <span class="avatar-status" id="user-status">等待加入...</span>
          </div>
        </div>
        <div class="stage-visualizer">
          <div class="viz-bar" style="--delay:0s"></div>
          <div class="viz-bar" style="--delay:0.1s"></div>
          <div class="viz-bar" style="--delay:0.2s"></div>
          <div class="viz-bar" style="--delay:0.3s"></div>
          <div class="viz-bar" style="--delay:0.4s"></div>
          <div class="viz-bar" style="--delay:0.5s"></div>
          <div class="viz-bar" style="--delay:0.6s"></div>
          <div class="viz-bar" style="--delay:0.7s"></div>
        </div>
      </div>
      <div class="duet-song-select">
        <label>选择合唱歌曲：</label>
        <select id="duet-song">
          <option value="1">小三你好贱</option>
          <option value="2">你在看孤独的风景</option>
          <option value="3">无语</option>
          <option value="4">未成年</option>
        </select>
      </div>
      <div class="duet-controls">
        <button class="duet-btn primary" id="start-duet">
          <span class="btn-icon">🎵</span>
          <span class="btn-text">开始对唱</span>
        </button>
        <button class="duet-btn secondary" id="preview-voice" disabled>
          <span class="btn-icon">👂</span>
          <span class="btn-text">试听效果</span>
        </button>
      </div>
      <div class="duet-recording" id="recording-panel" style="display:none;">
        <div class="recording-indicator">
          <span class="rec-dot"></span>
          <span class="rec-text">录制中...</span>
          <span class="rec-timer" id="rec-timer">00:00</span>
        </div>
        <button class="duet-btn stop" id="stop-recording">
          <span class="btn-icon">⏹</span>
          <span class="btn-text">结束录制</span>
        </button>
      </div>
      <div class="duet-result" id="duet-result" style="display:none;">
        <div class="result-header">🎉 对唱完成！</div>
        <div class="result-waveform">
          <div class="waveform-bars">
            ${Array(30).fill(0).map((_, i) => 
              `<div class="wave-bar" style="height:${20 + Math.random() * 60}px;animation-delay:${i * 0.05}s"></div>`
            ).join('')}
          </div>
        </div>
        <div class="result-actions">
          <button class="duet-btn" id="play-result">
            <span class="btn-icon">▶</span> 播放
          </button>
          <button class="duet-btn" id="save-result">
            <span class="btn-icon">💾</span> 保存
          </button>
          <button class="duet-btn" id="share-result">
            <span class="btn-icon">📤</span> 分享
          </button>
        </div>
        <div class="result-info">
          <span>混音完成度: 98%</span>
          <span>同步精度: ±15ms</span>
        </div>
      </div>
      <div class="duet-tips">
        <p>💡 提示：本兮的人声已通过AI技术分离，你可以跟着伴奏一起唱</p>
      </div>
    `
    
    this.container.appendChild(panel)
    
    // 绑定事件
    document.getElementById('start-duet').addEventListener('click', () => {
      this.startDuet()
    })
    
    document.getElementById('stop-recording').addEventListener('click', () => {
      this.stopRecording()
    })
    
    document.getElementById('play-result').addEventListener('click', () => {
      this.playResult()
    })
    
    document.getElementById('save-result').addEventListener('click', () => {
      this.saveResult()
    })
    
    document.getElementById('share-result').addEventListener('click', () => {
      this.shareResult()
    })
  }

  startDuet() {
    const btn = document.getElementById('start-duet')
    const recordingPanel = document.getElementById('recording-panel')
    
    btn.style.display = 'none'
    recordingPanel.style.display = 'block'
    
    this.isRecording = true
    this.startTimer()
    
    // 更新状态
    document.getElementById('user-status').textContent = '🎤 正在演唱...'
    
    // 激活可视化
    const vizBars = document.querySelectorAll('.viz-bar')
    vizBars.forEach(bar => bar.classList.add('active'))
  }

  startTimer() {
    let seconds = 0
    const timerEl = document.getElementById('rec-timer')
    
    this.timerInterval = setInterval(() => {
      seconds++
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
      const secs = (seconds % 60).toString().padStart(2, '0')
      timerEl.textContent = `${mins}:${secs}`
    }, 1000)
  }

  stopRecording() {
    this.isRecording = false
    clearInterval(this.timerInterval)
    
    document.getElementById('recording-panel').style.display = 'none'
    document.getElementById('duet-result').style.display = 'block'
    document.getElementById('user-status').textContent = '✅ 已完成'
    
    // 停止可视化
    const vizBars = document.querySelectorAll('.viz-bar')
    vizBars.forEach(bar => bar.classList.remove('active'))
  }

  playResult() {
    // 模拟播放
    const btn = document.getElementById('play-result')
    btn.innerHTML = '<span class="btn-icon">⏸</span> 暂停'
    
    setTimeout(() => {
      btn.innerHTML = '<span class="btn-icon">▶</span> 播放'
    }, 3000)
  }

  saveResult() {
    // 生成纪念卡片
    const card = document.createElement('div')
    card.className = 'duet-memorial-card'
    card.innerHTML = `
      <div class="card-date">2026.04.01</div>
      <div class="card-title">与兮合唱 · 小三你好贱</div>
      <div class="card-wave">〰️ 〰️ 〰️</div>
      <div class="card-footer">兮·境 纪念空间</div>
    `
    
    document.body.appendChild(card)
    
    // 下载动画
    setTimeout(() => {
      card.remove()
      this.showNotification('💾 已保存到本地纪念册')
    }, 2000)
  }

  shareResult() {
    // 复制分享链接
    const shareText = '我在「兮·境」与本兮隔空对唱了《小三你好贱》，快来试试吧！'
    
    if (navigator.share) {
      navigator.share({
        title: '与兮合唱',
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.href)
      this.showNotification('📋 分享文案已复制')
    }
  }

  showNotification(text) {
    const notif = document.createElement('div')
    notif.className = 'duet-notification'
    notif.textContent = text
    document.body.appendChild(notif)
    
    setTimeout(() => notif.remove(), 3000)
  }
}