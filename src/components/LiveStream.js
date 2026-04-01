// 永恒直播间 - 永远在线的演唱会
export class LiveStream {
  constructor(container) {
    this.container = container
    this.viewers = 0
    this.messages = []
    this.isLive = true
  }

  init() {
    this.createLiveUI()
    this.startSimulation()
  }

  createLiveUI() {
    const panel = document.createElement('div')
    panel.className = 'live-stream glass-panel'
    panel.innerHTML = `
      <div class="live-header">
        <div class="live-badge">
          <span class="live-dot"></span>
          <span class="live-text">LIVE</span>
        </div>
        <div class="live-info">
          <span class="live-title">本兮的永恒演唱会</span>
          <span class="live-stats">
            <span id="viewer-count">1,234</span> 人正在观看
          </span>
        </div>
        <div class="live-timer">
          已直播 <span id="live-days">2,847</span> 天
        </div>
      </div>
      <div class="live-stage">
        <div class="stage-screen">
          <div class="screen-content">
            <div class="now-playing">
              <div class="album-art">
                <div class="album-disc">
                  <div class="disc-label">兮</div>
                </div>
              </div>
              <div class="song-info">
                <div class="song-name" id="live-song">正在播放：小三你好贱</div>
                <div class="song-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" id="live-progress"></div>
                  </div>
                  <span class="time">01:23 / 03:45</span>
                </div>
              </div>
            </div>
          </div>
          <div class="screen-effects">
            <div class="spotlight"></div>
            <div class="particles"></div>
          </div>
        </div>
        <div class="stage-danmu" id="danmu-container">
          <!-- 弹幕将动态添加 -->
        </div>
      </div>
      <div class="live-chat">
        <div class="chat-messages" id="chat-messages">
          <div class="chat-message system">
            <span class="msg-time">19:45</span>
            <span class="msg-content">欢迎来到本兮的永恒直播间 ✨</span>
          </div>
        </div>
        <div class="chat-input-area">
          <input type="text" id="chat-input" placeholder="发送弹幕..." maxlength="30">
          <button id="send-danmu">
            <span>发送</span>
          </button>
        </div>
      </div>
      <div class="live-gifts">
        <button class="gift-btn" data-gift="rose">
          <span class="gift-icon">🌹</span>
          <span class="gift-name">玫瑰</span>
        </button>
        <button class="gift-btn" data-gift="star">
          <span class="gift-icon">⭐</span>
          <span class="gift-name">星星</span>
        </button>
        <button class="gift-btn" data-gift="microphone">
          <span class="gift-icon">🎤</span>
          <span class="gift-name">话筒</span>
        </button>
        <button class="gift-btn" data-gift="heart">
          <span class="gift-icon">💖</span>
          <span class="gift-name">爱心</span>
        </button>
      </div>
    `
    
    this.container.appendChild(panel)
    
    // 绑定事件
    document.getElementById('send-danmu').addEventListener('click', () => {
      this.sendDanmu()
    })
    
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendDanmu()
    })
    
    // 礼物按钮
    document.querySelectorAll('.gift-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const gift = btn.dataset.gift
        this.sendGift(gift)
      })
    })
  }

  startSimulation() {
    // 模拟观众数变化
    setInterval(() => {
      this.viewers += Math.floor(Math.random() * 10) - 5
      this.viewers = Math.max(1000, this.viewers)
      document.getElementById('viewer-count').textContent = this.viewers.toLocaleString()
    }, 5000)
    
    // 模拟弹幕
    const danmuTexts = [
      '又来看兮了',
      '想你了',
      '这首歌是我的青春',
      '永远怀念',
      '谢谢你的歌声',
      '晚安本兮',
      '今天心情好差，来听兮的歌',
      '2026年了，还有人听吗？',
      '有的！',
      '永远支持本兮',
      '这音质修复得好棒',
      '泪目了',
      '从小学听到工作',
      '从未忘记'
    ]
    
    setInterval(() => {
      if (Math.random() > 0.6) {
        const text = danmuTexts[Math.floor(Math.random() * danmuTexts.length)]
        this.addDanmu(text)
      }
    }, 2000)
    
    // 模拟聊天消息
    const chatUsers = ['小兮迷', '听歌的人', '怀念青春', '深夜失眠', '音乐治愈']
    
    setInterval(() => {
      if (Math.random() > 0.7) {
        const user = chatUsers[Math.floor(Math.random() * chatUsers.length)]
        const text = danmuTexts[Math.floor(Math.random() * danmuTexts.length)]
        this.addChatMessage(user, text)
      }
    }, 8000)
    
    // 歌曲进度
    let progress = 30
    setInterval(() => {
      progress += 0.5
      if (progress > 100) progress = 0
      document.getElementById('live-progress').style.width = `${progress}%`
    }, 1000)
  }

  addDanmu(text) {
    const container = document.getElementById('danmu-container')
    const danmu = document.createElement('div')
    danmu.className = 'danmu-item'
    danmu.textContent = text
    danmu.style.top = `${Math.random() * 80 + 10}%`
    danmu.style.animationDuration = `${8 + Math.random() * 4}s`
    
    container.appendChild(danmu)
    
    setTimeout(() => danmu.remove(), 12000)
  }

  addChatMessage(user, text) {
    const container = document.getElementById('chat-messages')
    const msg = document.createElement('div')
    msg.className = 'chat-message'
    
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    msg.innerHTML = `
      <span class="msg-time">${time}</span>
      <span class="msg-user">${user}:</span>
      <span class="msg-content">${text}</span>
    `
    
    container.appendChild(msg)
    container.scrollTop = container.scrollHeight
    
    // 限制消息数量
    while (container.children.length > 50) {
      container.removeChild(container.firstChild)
    }
  }

  sendDanmu() {
    const input = document.getElementById('chat-input')
    const text = input.value.trim()
    
    if (!text) return
    
    this.addDanmu(text)
    this.addChatMessage('你', text)
    input.value = ''
  }

  sendGift(giftType) {
    const gifts = {
      rose: { icon: '🌹', name: '玫瑰' },
      star: { icon: '⭐', name: '星星' },
      microphone: { icon: '🎤', name: '话筒' },
      heart: { icon: '💖', name: '爱心' }
    }
    
    const gift = gifts[giftType]
    
    // 创建礼物动画
    const giftEl = document.createElement('div')
    giftEl.className = 'gift-animation'
    giftEl.innerHTML = `
      <span class="gift-big">${gift.icon}</span>
      <span class="gift-text">送出 ${gift.name}</span>
    `
    
    this.container.appendChild(giftEl)
    
    setTimeout(() => giftEl.remove(), 2000)
    
    // 系统消息
    this.addChatMessage('系统', `你送出了 ${gift.icon} ${gift.name}`)
  }
}