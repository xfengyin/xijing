import { XijingApp } from './app.js'
import './styles/main.css'

// 等待DOM加载
window.addEventListener('DOMContentLoaded', () => {
  // 初始化应用
  const app = new XijingApp()
  app.init()
  
  // 隐藏加载动画
  setTimeout(() => {
    const loading = document.getElementById('loading')
    if (loading) {
      loading.classList.add('hidden')
      setTimeout(() => loading.remove(), 800)
    }
  }, 2000)
  
  // 添加全局音效反馈
  addSoundFeedback(app)
  
  // 添加键盘快捷键
  addKeyboardShortcuts(app)
  
  // 控制台欢迎信息
  console.log('%c兮·境', 'font-size: 48px; font-weight: bold; background: linear-gradient(135deg, #ffb6c1, #87ceeb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;')
  console.log('%c本兮音乐纪念空间 - 让青春永不散场', 'font-size: 14px; color: #ffb6c1;')
  console.log('%c版本: 1.0.0 | 作者: 兮·境团队', 'font-size: 12px; color: #888;')
})

// 添加音效反馈
function addSoundFeedback(app) {
  // 为所有按钮添加音效
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      app.soundManager?.playClick()
    }
  })
  
  // 为可悬停元素添加音效
  let lastHovered = null
  document.addEventListener('mouseover', (e) => {
    const hoverable = e.target.closest('.song-item, .gallery-item, .message-item')
    if (hoverable && hoverable !== lastHovered) {
      lastHovered = hoverable
      app.soundManager?.playHover()
    }
  })
}

// 添加键盘快捷键
function addKeyboardShortcuts(app) {
  document.addEventListener('keydown', (e) => {
    // 空格键: 播放/暂停
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
      e.preventDefault()
      if (app.player?.isPlaying) {
        app.player.pause()
      } else {
        app.player?.play()
      }
    }
    
    // 左右箭头: 上一首/下一首
    if (e.code === 'ArrowLeft' && e.ctrlKey) {
      e.preventDefault()
      app.playPrev()
    }
    if (e.code === 'ArrowRight' && e.ctrlKey) {
      e.preventDefault()
      app.playNext()
    }
    
    // L键: 切换歌词
    if (e.code === 'KeyL' && !e.target.matches('input, textarea')) {
      e.preventDefault()
      app.togglePanel('lyrics')
    }
    
    // M键: 切换留言墙
    if (e.code === 'KeyM' && !e.target.matches('input, textarea')) {
      e.preventDefault()
      app.togglePanel('messageWall')
    }
    
    // T键: 切换时间轴
    if (e.code === 'KeyT' && !e.target.matches('input, textarea')) {
      e.preventDefault()
      app.togglePanel('timeline')
    }
    
    // ESC键: 关闭所有面板
    if (e.code === 'Escape') {
      app.hideAllPanels()
    }
  })
}

// 性能监控
if ('PerformanceObserver' in window) {
  const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`[Performance] ${entry.name}: ${entry.duration.toFixed(2)}ms`)
    }
  })
  perfObserver.observe({ entryTypes: ['measure', 'navigation'] })
}

// 错误处理
window.addEventListener('error', (e) => {
  console.error('[App Error]', e.error)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Promise Rejection]', e.reason)
})