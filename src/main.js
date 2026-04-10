/**
 * 兮·境 - 主入口文件
 * UI 2.0 - Spotify x QQ音乐风格
 */

import { XijingSpotifyApp } from './spotify-app.js'

// 等待DOM加载
window.addEventListener('DOMContentLoaded', () => {
  // 初始化应用
  const app = new XijingSpotifyApp()
  app.init()
  
  // 控制台欢迎信息
  console.log('%c兮·境', 'font-size: 48px; font-weight: bold; color: #1DB954;')
  console.log('%c本兮音乐纪念空间 - 让青春永不散场', 'font-size: 14px; color: #1DB954;')
  console.log('%cUI 3.0 - Spotify Design System', 'font-size: 12px; color: #b3b3b3;')
  
  // 暴露到全局方便调试
  window.xijingApp = app
})

// 错误处理
window.addEventListener('error', (e) => {
  console.error('[App Error]', e.error)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Promise Rejection]', e.reason)
})
