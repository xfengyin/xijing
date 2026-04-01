import { LrcParser } from '../utils/lrcParser.js'

export class LyricsDisplay {
  constructor(container, onEvent) {
    this.container = container
    this.onEvent = onEvent
    this.parser = new LrcParser()
    this.currentLyrics = []
    this.currentIndex = -1
    this.lyricsElement = null
  }

  init() {
    this.createLyricsUI()
  }

  createLyricsUI() {
    const lyricsPanel = document.createElement('div')
    lyricsPanel.className = 'lyrics-panel glass-panel'
    lyricsPanel.innerHTML = `
      <div class="lyrics-header">
        <span class="lyrics-title">歌词</span>
        <button class="lyrics-close" id="lyrics-close">×</button>
      </div>
      <div class="lyrics-content" id="lyrics-content">
        <div class="lyrics-placeholder">选择歌曲开始播放</div>
      </div>
    `
    
    this.container.appendChild(lyricsPanel)
    this.lyricsElement = document.getElementById('lyrics-content')
    
    // 绑定关闭按钮
    document.getElementById('lyrics-close').addEventListener('click', () => {
      lyricsPanel.style.display = 'none'
    })
  }

  async loadLyrics(songId) {
    try {
      const result = await this.parser.load(`/lyrics/${songId}.lrc`)
      this.currentLyrics = result.lyrics
      this.currentIndex = -1
      this.renderLyrics()
      return true
    } catch (error) {
      console.error('Failed to load lyrics:', error)
      this.showPlaceholder('暂无歌词')
      return false
    }
  }

  showPlaceholder(text) {
    if (this.lyricsElement) {
      this.lyricsElement.innerHTML = `<div class="lyrics-placeholder">${text}</div>`
    }
  }

  renderLyrics() {
    if (!this.lyricsElement || !this.currentLyrics.length) return
    
    this.lyricsElement.innerHTML = this.currentLyrics.map((lyric, index) => `
      <div class="lyrics-line ${index === this.currentIndex ? 'current' : ''}" data-index="${index}">
        ${this.highlightText(lyric.text, index === this.currentIndex)}
      </div>
    `).join('')
    
    this.scrollToCurrent()
  }

  highlightText(text, isCurrent) {
    if (!isCurrent) return text
    
    // 逐字高亮效果
    return text.split('').map((char, i) => 
      `<span class="char" style="animation-delay: ${i * 0.05}s">${char}</span>`
    ).join('')
  }

  update(currentTime) {
    if (!this.currentLyrics.length) return
    
    const newIndex = this.parser.getCurrentIndex(currentTime)
    
    if (newIndex !== this.currentIndex && newIndex !== -1) {
      this.currentIndex = newIndex
      this.renderLyrics()
      
      // 触发歌词变化事件
      if (this.onEvent) {
        this.onEvent('lyricChange', {
          index: newIndex,
          text: this.currentLyrics[newIndex]?.text,
          time: currentTime
        })
      }
    }
  }

  scrollToCurrent() {
    const currentLine = this.lyricsElement?.querySelector('.lyrics-line.current')
    if (currentLine) {
      currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  show() {
    const panel = this.container.querySelector('.lyrics-panel')
    if (panel) panel.style.display = 'block'
  }

  hide() {
    const panel = this.container.querySelector('.lyrics-panel')
    if (panel) panel.style.display = 'none'
  }
}