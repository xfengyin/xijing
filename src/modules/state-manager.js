/**
 * 兮·境 — 状态管理模块
 * 集中管理应用状态，组件间通信
 */

import { songs } from '../data/songs.js'

class StateManager {
  constructor() {
    this.state = {
      // 播放状态
      isPlaying: false,
      isLiked: false,
      isShuffle: false,
      repeatMode: 0, // 0: off, 1: all, 2: one

      // 当前歌曲
      currentSongIndex: 0,
      currentSong: null,

      // 歌词
      currentLyrics: [],
      currentLyricIndex: -1,

      // 音频
      isSimulationMode: true,

      // 面板
      activePanel: null,

      // 留言
      messages: this._loadMessages(),

      // 搜索
      searchQuery: '',
      filteredSongs: [...songs]
    }

    // 订阅者回调
    this._listeners = {}
  }

  // ==================== 状态读写 ====================

  get(key) {
    return this.state[key]
  }

  set(key, value) {
    const oldValue = this.state[key]
    this.state[key] = value
    if (oldValue !== value) {
      this._notify(key, value, oldValue)
    }
  }

  // ==================== 播放控制 ====================

  toggle() {
    this.set('isPlaying', !this.state.isPlaying)
  }

  next() {
    const { isShuffle, currentSongIndex } = this.state
    if (isShuffle) {
      let next = Math.floor(Math.random() * songs.length)
      while (next === currentSongIndex && songs.length > 1) {
        next = Math.floor(Math.random() * songs.length)
      }
      this.set('currentSongIndex', next)
    } else {
      this.set('currentSongIndex', (currentSongIndex + 1) % songs.length)
    }
    this.set('currentSong', songs[this.state.currentSongIndex])
  }

  prev() {
    const newIndex = (this.state.currentSongIndex - 1 + songs.length) % songs.length
    this.set('currentSongIndex', newIndex)
    this.set('currentSong', songs[newIndex])
  }

  loadSong(index) {
    if (!songs[index]) return
    this.set('currentSongIndex', index)
    this.set('currentSong', songs[index])
    this.set('currentLyricIndex', -1)
  }

  // ==================== 订阅系统 ====================

  subscribe(key, callback) {
    if (!this._listeners[key]) this._listeners[key] = []
    this._listeners[key].push(callback)
    // 返回取消订阅函数
    return () => {
      this._listeners[key] = this._listeners[key].filter(cb => cb !== callback)
    }
  }

  _notify(key, newValue, oldValue) {
    const cbs = this._listeners[key] || []
    cbs.forEach(cb => cb(newValue, oldValue, key))
    // 触发通配订阅
    ;(this._listeners['*'] || []).forEach(cb => cb(key, newValue, oldValue))
  }

  // ==================== 留言 ====================

  _loadMessages() {
    try {
      const saved = localStorage.getItem('xijing_messages')
      if (saved) return JSON.parse(saved)
    } catch (e) { /* ignore */ }
    return [
      { author: '兮饭小忆', text: '这首歌陪我度过了整个高中时代，现在听到还是会流泪。本兮，你还好吗？', time: '3小时前', likes: 128 },
      { author: '音乐旅人', text: '每次听都会想起那个夏天，那些回不去的青春。谢谢你，本兮。', time: '昨天', likes: 256 },
      { author: '追光者', text: '10年了，依然会在深夜单曲循环。你的声音，是青春最美的注脚。', time: '2天前', likes: 512 }
    ]
  }

  sendMessage(text) {
    if (!text.trim()) return
    const nicknames = ['星辰', '微风', '月光', '晨露', '云朵', '彩虹', '暖阳', '清泉']
    const author = nicknames[Math.floor(Math.random() * nicknames.length)] + Math.floor(Math.random() * 100)
    const messages = this.state.messages
    messages.unshift({ author, text: text.trim(), time: '刚刚', likes: 0 })
    this.set('messages', messages)
    try {
      localStorage.setItem('xijing_messages', JSON.stringify(messages))
    } catch (e) { /* ignore */ }
  }

  // ==================== 搜索 ====================

  search(query) {
    this.set('searchQuery', query)
    if (!query.trim()) {
      this.set('filteredSongs', [...songs])
      return
    }
    const q = query.toLowerCase()
    this.set('filteredSongs', songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      s.mood.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    ))
  }
}

// 单例导出
export const store = new StateManager()
