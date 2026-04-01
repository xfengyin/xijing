// 情感分析器 - 根据歌词自动切换主题
export class EmotionAnalyzer {
  constructor(scene) {
    this.scene = scene
    this.currentEmotion = 'neutral'
    this.emotionThemes = {
      joyful: {
        name: '欢快',
        colors: ['#FFD700', '#FFA500', '#FF6347'],
        particleColor: 0xFFD700,
        lightColor: 0xFFA500,
        description: '充满活力的旋律，让人忍不住想跟着摇摆'
      },
      melancholy: {
        name: '忧伤',
        colors: ['#4A90E2', '#7B68EE', '#6A5ACD'],
        particleColor: 0x4A90E2,
        lightColor: 0x7B68EE,
        description: '温柔的忧伤，像雨天的窗前'
      },
      rebellious: {
        name: '叛逆',
        colors: ['#FF1493', '#DC143C', '#8B008B'],
        particleColor: 0xFF1493,
        lightColor: 0xDC143C,
        description: '不羁的态度，勇敢做真实的自己'
      },
      nostalgic: {
        name: '怀旧',
        colors: ['#DEB887', '#D2691E', '#CD853F'],
        particleColor: 0xDEB887,
        lightColor: 0xD2691E,
        description: '回忆里的温暖，像旧照片的泛黄'
      },
      romantic: {
        name: '浪漫',
        colors: ['#FFB6C1', '#FF69B4', '#FFC0CB'],
        particleColor: 0xFFB6C1,
        lightColor: 0xFF69B4,
        description: '粉色的梦境，关于爱与被爱'
      },
      neutral: {
        name: '平静',
        colors: ['#87CEEB', '#B0E0E6', '#E0FFFF'],
        particleColor: 0x87CEEB,
        lightColor: 0xB0E0E6,
        description: '宁静的时刻，适合静静聆听'
      }
    }
  }

  // 根据歌词文本分析情感
  analyzeLyrics(lyrics) {
    const emotionKeywords = {
      joyful: ['开心', '快乐', '笑', '阳光', '夏天', '朋友', '一起', '快乐'],
      melancholy: ['难过', '哭', '泪', '孤独', '寂寞', '失去', '离开', '回忆', '忘'],
      rebellious: ['贱', '滚', '恨', '不服', '不要', '讨厌', '愤怒', '叛逆'],
      nostalgic: ['过去', '曾经', '小时候', '青春', '怀念', '以前', '时光'],
      romantic: ['爱', '喜欢', '心', '情', '你', '他', '她', '思念', '恋']
    }

    const scores = {}
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      scores[emotion] = 0
      for (const keyword of keywords) {
        const regex = new RegExp(keyword, 'g')
        const matches = lyrics.match(regex)
        if (matches) {
          scores[emotion] += matches.length
        }
      }
    }

    // 找出得分最高的情感
    let maxEmotion = 'neutral'
    let maxScore = 0
    
    for (const [emotion, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score
        maxEmotion = emotion
      }
    }

    // 只有当分数足够高时才切换
    if (maxScore >= 2) {
      return maxEmotion
    }
    
    return 'neutral'
  }

  // 应用情感主题
  applyTheme(emotion) {
    if (emotion === this.currentEmotion) return
    
    this.currentEmotion = emotion
    const theme = this.emotionThemes[emotion]
    
    // 更新3D场景
    if (this.scene) {
      this.scene.setEmotionTheme(theme)
    }
    
    // 更新UI主题
    this.updateUITheme(theme)
    
    // 显示情感提示
    this.showEmotionNotification(theme)
    
    console.log(`[EmotionAnalyzer] 切换到主题: ${theme.name}`)
  }

  updateUITheme(theme) {
    // 更新CSS变量
    const root = document.documentElement
    root.style.setProperty('--theme-primary', theme.colors[0])
    root.style.setProperty('--theme-secondary', theme.colors[1])
    root.style.setProperty('--theme-tertiary', theme.colors[2])
    
    // 添加过渡动画
    document.body.classList.add('theme-transition')
    setTimeout(() => {
      document.body.classList.remove('theme-transition')
    }, 500)
  }

  showEmotionNotification(theme) {
    const notif = document.createElement('div')
    notif.className = 'emotion-notification'
    notif.innerHTML = `
      <div class="emotion-icon" style="background: ${theme.colors[0]}">
        ${this.getEmotionEmoji(theme.name)}
      </div>
      <div class="emotion-info">
        <span class="emotion-name">${theme.name}</span>
        <span class="emotion-desc">${theme.description}</span>
      </div>
    `
    
    document.body.appendChild(notif)
    
    setTimeout(() => {
      notif.classList.add('show')
    }, 100)
    
    setTimeout(() => {
      notif.classList.remove('show')
      setTimeout(() => notif.remove(), 300)
    }, 4000)
  }

  getEmotionEmoji(name) {
    const emojis = {
      '欢快': '😊',
      '忧伤': '😢',
      '叛逆': '😈',
      '怀旧': '📷',
      '浪漫': '💕',
      '平静': '😌'
    }
    return emojis[name] || '🎵'
  }

  // 自动分析当前歌曲情感
  analyzeCurrentSong(song) {
    // 根据歌曲标题和已知信息判断
    const songEmotions = {
      '小三你好贱': 'rebellious',
      '你在看孤独的风景': 'melancholy',
      '无语': 'rebellious',
      '未成年': 'rebellious',
      '怎么办我爱你': 'romantic',
      '奇怪，我不懂得爱': 'melancholy',
      '逢场作戏': 'melancholy',
      '表演时间': 'joyful',
      '某个心跳': 'romantic',
      '海海海': 'nostalgic',
      '摄影城市': 'nostalgic'
    }

    const emotion = songEmotions[song.title] || 'neutral'
    this.applyTheme(emotion)
    
    return emotion
  }
}