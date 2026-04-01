export class SongList {
  constructor(container, songs, onSelect) {
    this.container = container
    this.songs = songs
    this.onSelect = onSelect
    this.activeId = null
    this.listElement = null
  }

  init() {
    this.createListUI()
    this.bindEvents()
  }

  createListUI() {
    const listPanel = document.createElement('div')
    listPanel.className = 'song-list glass-panel'
    
    const title = document.createElement('div')
    title.style.cssText = 'font-size:14px;font-weight:600;margin-bottom:12px;color:#ffb6c1;'
    title.textContent = '歌曲列表'
    listPanel.appendChild(title)
    
    this.listElement = document.createElement('div')
    this.listElement.className = 'song-list-container'
    
    this.songs.forEach((song, index) => {
      const item = this.createSongItem(song, index + 1)
      this.listElement.appendChild(item)
    })
    
    listPanel.appendChild(this.listElement)
    this.container.appendChild(listPanel)
  }

  createSongItem(song, number) {
    const item = document.createElement('div')
    item.className = 'song-item'
    item.dataset.id = song.id
    
    item.innerHTML = `
      <span class="song-number">${number}</span>
      <div class="song-info">
        <div class="song-name">${song.title}</div>
        <div class="song-album">${song.album}</div>
      </div>
      <span class="song-duration">${song.duration}</span>
    `
    
    item.addEventListener('click', () => {
      this.onSelect(song)
    })
    
    return item
  }

  bindEvents() {
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        this.navigate(e.key === 'ArrowUp' ? -1 : 1)
      } else if (e.key === 'Enter' && this.activeId) {
        const song = this.songs.find(s => s.id === this.activeId)
        if (song) this.onSelect(song)
      }
    })
  }

  navigate(direction) {
    const currentIndex = this.songs.findIndex(s => s.id === this.activeId)
    let newIndex = currentIndex + direction
    
    if (newIndex < 0) newIndex = this.songs.length - 1
    if (newIndex >= this.songs.length) newIndex = 0
    
    this.setActive(this.songs[newIndex].id)
  }

  setActive(id) {
    // 移除之前的激活状态
    const prevActive = this.listElement.querySelector('.active')
    if (prevActive) {
      prevActive.classList.remove('active')
    }
    
    // 设置新的激活状态
    const newActive = this.listElement.querySelector(`[data-id="${id}"]`)
    if (newActive) {
      newActive.classList.add('active')
      this.activeId = id
      
      // 滚动到可视区域
      newActive.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }
}