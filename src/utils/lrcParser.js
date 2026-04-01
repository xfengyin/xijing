// LRC歌词解析器
export class LrcParser {
  constructor() {
    this.lyrics = []
    this.metadata = {}
  }

  // 解析LRC文本
  parse(lrcText) {
    this.lyrics = []
    this.metadata = {}
    
    const lines = lrcText.split('\n')
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue
      
      // 解析元数据 [ti:标题] [ar:艺术家] 等
      const metaMatch = trimmedLine.match(/^\[(\w+):(.*)\]$/)
      if (metaMatch) {
        this.metadata[metaMatch[1]] = metaMatch[2]
        continue
      }
      
      // 解析歌词行 [mm:ss.xx]歌词内容
      const lyricMatches = trimmedLine.matchAll(/\[(\d{2}):(\d{2})\.(\d{2,3})\]([^\[]*)/g)
      
      for (const match of lyricMatches) {
        const minutes = parseInt(match[1])
        const seconds = parseInt(match[2])
        const milliseconds = parseInt(match[3].padEnd(3, '0'))
        const text = match[4].trim()
        
        const time = minutes * 60 + seconds + milliseconds / 1000
        
        if (text) {
          this.lyrics.push({
            time,
            text,
            index: this.lyrics.length
          })
        }
      }
    }
    
    // 按时间排序
    this.lyrics.sort((a, b) => a.time - b.time)
    
    return {
      metadata: this.metadata,
      lyrics: this.lyrics
    }
  }

  // 根据时间获取当前歌词索引
  getCurrentIndex(currentTime) {
    if (!this.lyrics.length) return -1
    
    for (let i = this.lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= this.lyrics[i].time) {
        return i
      }
    }
    
    return -1
  }

  // 获取当前及后续歌词
  getLyricsAround(currentTime, count = 5) {
    const currentIndex = this.getCurrentIndex(currentTime)
    if (currentIndex === -1) return this.lyrics.slice(0, count)
    
    const start = Math.max(0, currentIndex - 2)
    const end = Math.min(this.lyrics.length, start + count)
    
    return this.lyrics.slice(start, end).map((lyric, i) => ({
      ...lyric,
      isCurrent: start + i === currentIndex
    }))
  }

  // 加载LRC文件
  async load(url) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to load LRC: ${response.status}`)
      }
      const text = await response.text()
      return this.parse(text)
    } catch (error) {
      console.error('Error loading LRC file:', error)
      return { metadata: {}, lyrics: [] }
    }
  }
}