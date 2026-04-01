// 照片画廊组件
export class PhotoGallery {
  constructor(container) {
    this.container = container
    this.photos = [
      {
        id: 1,
        title: '青春年华',
        desc: '2011年，本兮的第一张专辑宣传照',
        color: '#ffb6c1',
        year: '2011'
      },
      {
        id: 2,
        title: '音乐梦想',
        desc: '在录音棚创作歌曲的日子',
        color: '#87ceeb',
        year: '2012'
      },
      {
        id: 3,
        title: '舞台光芒',
        desc: '第一次大型演出，闪耀全场',
        color: '#ffd700',
        year: '2013'
      },
      {
        id: 4,
        title: '创作时刻',
        desc: '深夜写歌，记录青春心事',
        color: '#ff69b4',
        year: '2014'
      },
      {
        id: 5,
        title: '粉丝见面会',
        desc: '与兮饭们的珍贵合影',
        color: '#dda0dd',
        year: '2015'
      },
      {
        id: 6,
        title: '永恒的记忆',
        desc: '永远留在我们心中的笑容',
        color: '#90ee90',
        year: ' Forever'
      }
    ]
  }

  init() {
    this.createGalleryUI()
  }

  createGalleryUI() {
    const panel = document.createElement('div')
    panel.className = 'photo-gallery glass-panel'
    panel.innerHTML = `
      <div class="gallery-header">
        <h2 class="gallery-title">📸 珍贵瞬间</h2>
        <p class="gallery-subtitle">点击照片查看回忆详情</p>
      </div>
      <div class="gallery-grid">
        ${this.photos.map(photo => `
          <div class="gallery-item" data-id="${photo.id}" style="--photo-color: ${photo.color}">
            <div class="photo-placeholder" style="background: linear-gradient(135deg, ${photo.color}40, ${photo.color}20)">
              <span class="photo-year">${photo.year}</span>
              <div class="photo-glow"></div>
            </div>
            <div class="photo-info">
              <h3 class="photo-title">${photo.title}</h3>
              <p class="photo-desc">${photo.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="gallery-detail" id="gallery-detail" style="display:none;">
        <div class="detail-content">
          <button class="detail-close" id="detail-close">×</button>
          <div class="detail-placeholder" id="detail-image"></div>
          <div class="detail-text">
            <h3 id="detail-title"></h3>
            <p id="detail-desc"></p>
            <div class="detail-year" id="detail-year"></div>
          </div>
        </div>
      </div>
    `

    this.container.appendChild(panel)

    // 绑定事件
    panel.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.id)
        this.showDetail(id)
      })
    })

    document.getElementById('detail-close').addEventListener('click', () => {
      this.hideDetail()
    })

    // 点击背景关闭
    document.getElementById('gallery-detail').addEventListener('click', (e) => {
      if (e.target.id === 'gallery-detail') {
        this.hideDetail()
      }
    })
  }

  showDetail(id) {
    const photo = this.photos.find(p => p.id === id)
    if (!photo) return

    const detail = document.getElementById('gallery-detail')
    const image = document.getElementById('detail-image')
    const title = document.getElementById('detail-title')
    const desc = document.getElementById('detail-desc')
    const year = document.getElementById('detail-year')

    image.style.background = `linear-gradient(135deg, ${photo.color}60, ${photo.color}30)`
    title.textContent = photo.title
    desc.textContent = photo.desc
    year.textContent = photo.year
    year.style.color = photo.color

    detail.style.display = 'flex'
    
    // 动画
    setTimeout(() => {
      detail.classList.add('show')
    }, 10)
  }

  hideDetail() {
    const detail = document.getElementById('gallery-detail')
    detail.classList.remove('show')
    
    setTimeout(() => {
      detail.style.display = 'none'
    }, 300)
  }
}