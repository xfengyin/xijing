// 本兮音乐历程时间轴
export class Timeline {
  constructor(container) {
    this.container = container
    this.events = [
      {
        year: '2010',
        age: '16',
        title: '网络初啼',
        desc: '在网络发布第一首原创歌曲《怎么办我爱你》，清新的嗓音迅速引起关注',
        songs: ['怎么办我爱你'],
        mood: '青涩'
      },
      {
        year: '2011',
        age: '17',
        title: '原创爆发',
        desc: '高产期到来，发表《小三你好贱》《你在看孤独的风景》等代表作，成为网络音乐红人',
        songs: ['小三你好贱', '你在看孤独的风景', '无语'],
        mood: '叛逆'
      },
      {
        year: '2012',
        age: '18',
        title: '风格成熟',
        desc: '音乐风格逐渐成熟，开始尝试更多元的曲风，粉丝群体持续扩大',
        songs: ['未成年', '奇怪，我不懂得爱'],
        mood: '成长'
      },
      {
        year: '2013',
        age: '19',
        title: '主流突破',
        desc: '《少儿不宜》等作品获得更广泛传播，从网络走向主流视野',
        songs: ['少儿不宜', '逢场作戏'],
        mood: '突破'
      },
      {
        year: '2014',
        age: '20',
        title: '沉淀转型',
        desc: '音乐风格转向更成熟的表达，开始探索 deeper 的情感主题',
        songs: ['表演时间', '某个心跳'],
        mood: '沉淀'
      },
      {
        year: '2015',
        age: '21',
        title: '回归之作',
        desc: '发表《海海海》等作品，展现更加成熟的音乐理念',
        songs: ['海海海', '摄影城市'],
        mood: '归来'
      },
      {
        year: '2016',
        age: '22',
        title: '永远的怀念',
        desc: '本兮离开了我们，但她的音乐永远留在粉丝心中，成为永恒的青春记忆',
        songs: ['我梦见我梦见我'],
        mood: '永恒'
      },
      {
        year: '2026',
        age: '-',
        title: '兮·境诞生',
        desc: '十年之后，我们创建了这个纪念空间，让她的歌声继续陪伴新一代的听众',
        songs: ['永恒的回响'],
        mood: '传承'
      }
    ]
  }

  init() {
    this.createTimelineUI()
    this.addScrollAnimation()
  }

  createTimelineUI() {
    const panel = document.createElement('div')
    panel.className = 'timeline-panel'
    panel.innerHTML = `
      <div class="timeline-header">
        <h2 class="timeline-title">🕐 本兮音乐历程</h2>
        <p class="timeline-subtitle">从网络新人到永恒经典，十六岁到二十二岁的青春印记</p>
      </div>
      <div class="timeline-line">
        ${this.events.map((event, index) => `
          <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}" data-index="${index}">
            <div class="timeline-dot mood-${event.mood}"></div>
            <div class="timeline-content">
              <div class="timeline-year">
                <span class="year-num">${event.year}</span>
                <span class="year-age">${event.age}岁</span>
              </div>
              <h3 class="timeline-event-title">${event.title}</h3>
              <p class="timeline-desc">${event.desc}</p>
              <div class="timeline-songs">
                ${event.songs.map(song => `<span class="song-tag">${song}</span>`).join('')}
              </div>
              <div class="timeline-mood mood-${event.mood}">
                <span class="mood-label">${event.mood}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="timeline-footer">
        <div class="memorial-stats">
          <div class="stat-item">
            <span class="stat-num">100+</span>
            <span class="stat-label">首原创歌曲</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">6</span>
            <span class="stat-label">年音乐生涯</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">∞</span>
            <span class="stat-label">永恒的记忆</span>
          </div>
        </div>
        <div class="memorial-quote">
          <p>"音乐是我生命的一部分，希望它能陪伴你们很久很久"</p>
          <span class="quote-author">— 本兮</span>
        </div>
      </div>
    `
    
    this.container.appendChild(panel)
  }

  addScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.3 })

    document.querySelectorAll('.timeline-item').forEach(item => {
      observer.observe(item)
    })
  }
}