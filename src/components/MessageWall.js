// 粉丝留言墙
export class MessageWall {
  constructor(container) {
    this.container = container
    this.messages = this.loadMessages()
    this.wallElement = null
  }

  init() {
    this.createWallUI()
    this.renderMessages()
  }

  createWallUI() {
    const wallPanel = document.createElement('div')
    wallPanel.className = 'message-wall glass-panel'
    wallPanel.innerHTML = `
      <div class="wall-header">
        <span class="wall-title">💌 回忆便签</span>
        <span class="wall-count">${this.messages.length} 条留言</span>
      </div>
      <div class="wall-content" id="wall-content">
        <!-- 留言列表 -->
      </div>
      <div class="wall-input-area">
        <input type="text" id="wall-input" placeholder="写下你的回忆..." maxlength="100">
        <button id="wall-submit">发送</button>
      </div>
    `
    
    this.container.appendChild(wallPanel)
    this.wallElement = document.getElementById('wall-content')
    
    // 绑定提交
    document.getElementById('wall-submit').addEventListener('click', () => {
      this.submitMessage()
    })
    
    document.getElementById('wall-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.submitMessage()
    })
  }

  loadMessages() {
    // 从localStorage加载或初始化默认留言
    const saved = localStorage.getItem('xijing_messages')
    if (saved) {
      return JSON.parse(saved)
    }
    
    // 默认留言
    return [
      { id: 1, text: '小学时第一次听本兮的歌，现在已经工作了...', time: '2024-01-15', likes: 128 },
      { id: 2, text: '谢谢你陪伴了我的青春', time: '2024-02-20', likes: 256 },
      { id: 3, text: '每次听《小三你好贱》都会想起初中同桌', time: '2024-03-08', likes: 89 },
      { id: 4, text: '你的歌声永远留在了我们心里', time: '2024-04-01', likes: 512 }
    ]
  }

  saveMessages() {
    localStorage.setItem('xijing_messages', JSON.stringify(this.messages))
  }

  submitMessage() {
    const input = document.getElementById('wall-input')
    const text = input.value.trim()
    
    if (!text) return
    
    const newMessage = {
      id: Date.now(),
      text,
      time: new Date().toISOString().split('T')[0],
      likes: 0
    }
    
    this.messages.unshift(newMessage)
    this.saveMessages()
    this.renderMessages()
    input.value = ''
    
    // 显示感谢动画
    this.showThanksAnimation()
  }

  showThanksAnimation() {
    const thanks = document.createElement('div')
    thanks.className = 'thanks-animation'
    thanks.textContent = '✨ 感谢你的回忆'
    this.container.appendChild(thanks)
    
    setTimeout(() => thanks.remove(), 2000)
  }

  likeMessage(id) {
    const message = this.messages.find(m => m.id === id)
    if (message) {
      message.likes++
      this.saveMessages()
      this.renderMessages()
    }
  }

  renderMessages() {
    if (!this.wallElement) return
    
    this.wallElement.innerHTML = this.messages.map(msg => `
      <div class="message-item">
        <div class="message-text">${this.escapeHtml(msg.text)}</div>
        <div class="message-meta">
          <span class="message-time">${msg.time}</span>
          <button class="message-like" data-id="${msg.id}">
            ❤️ ${msg.likes}
          </button>
        </div>
      </div>
    `).join('')
    
    // 绑定点赞
    this.wallElement.querySelectorAll('.message-like').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id)
        this.likeMessage(id)
      })
    })
    
    // 更新计数
    const countEl = this.container.querySelector('.wall-count')
    if (countEl) countEl.textContent = `${this.messages.length} 条留言`
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}