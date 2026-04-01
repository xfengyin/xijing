// 页面切换动画管理器
export class TransitionManager {
  constructor() {
    this.isTransitioning = false
    this.duration = 400
  }

  // 创建过渡遮罩
  createOverlay() {
    let overlay = document.getElementById('transition-overlay')
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = 'transition-overlay'
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: opacity ${this.duration}ms ease;
        display: flex;
        align-items: center;
        justify-content: center;
      `
      
      // 添加过渡图标
      overlay.innerHTML = `
        <div class="transition-icon" style="
          width: 60px;
          height: 60px;
          border: 3px solid rgba(255,182,193,0.3);
          border-top-color: #ffb6c1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
      `
      
      document.body.appendChild(overlay)
    }
    return overlay
  }

  // 切换场景
  async transition(fromElement, toElement, type = 'fade') {
    if (this.isTransitioning) return
    this.isTransitioning = true

    const overlay = this.createOverlay()

    // 显示遮罩
    overlay.style.opacity = '1'
    overlay.style.pointerEvents = 'auto'

    await this.delay(this.duration)

    // 切换元素
    if (fromElement) fromElement.style.display = 'none'
    if (toElement) {
      toElement.style.display = 'block'
      toElement.classList.add('scene-enter')
      
      setTimeout(() => {
        toElement.classList.remove('scene-enter')
      }, this.duration)
    }

    // 隐藏遮罩
    overlay.style.opacity = '0'
    overlay.style.pointerEvents = 'none'

    await this.delay(this.duration)
    this.isTransitioning = false
  }

  // 元素淡入
  fadeIn(element, duration = 400) {
    if (!element) return
    
    element.style.opacity = '0'
    element.style.display = 'block'
    element.style.transition = `opacity ${duration}ms ease`
    
    requestAnimationFrame(() => {
      element.style.opacity = '1'
    })
  }

  // 元素淡出
  fadeOut(element, duration = 400) {
    if (!element) return Promise.resolve()
    
    return new Promise(resolve => {
      element.style.transition = `opacity ${duration}ms ease`
      element.style.opacity = '0'
      
      setTimeout(() => {
        element.style.display = 'none'
        resolve()
      }, duration)
    })
  }

  // 滑动切换
  slide(fromEl, toEl, direction = 'left') {
    if (this.isTransitioning) return
    this.isTransitioning = true

    const translateOut = direction === 'left' ? '-100%' : '100%'
    const translateIn = direction === 'left' ? '100%' : '-100%'

    // 准备目标元素
    toEl.style.display = 'block'
    toEl.style.transform = `translateX(${translateIn})`
    toEl.style.transition = `transform ${this.duration}ms ease`

    // 动画
    requestAnimationFrame(() => {
      fromEl.style.transform = `translateX(${translateOut})`
      toEl.style.transform = 'translateX(0)'
    })

    setTimeout(() => {
      fromEl.style.display = 'none'
      fromEl.style.transform = ''
      toEl.style.transition = ''
      this.isTransitioning = false
    }, this.duration)
  }

  // 缩放切换
  zoom(fromEl, toEl) {
    if (this.isTransitioning) return
    this.isTransitioning = true

    fromEl.style.transition = `transform ${this.duration}ms ease, opacity ${this.duration}ms ease`
    toEl.style.display = 'block'
    toEl.style.transform = 'scale(0.8)'
    toEl.style.opacity = '0'
    toEl.style.transition = `transform ${this.duration}ms ease, opacity ${this.duration}ms ease`

    requestAnimationFrame(() => {
      fromEl.style.transform = 'scale(1.2)'
      fromEl.style.opacity = '0'
      toEl.style.transform = 'scale(1)'
      toEl.style.opacity = '1'
    })

    setTimeout(() => {
      fromEl.style.display = 'none'
      fromEl.style.transform = ''
      fromEl.style.opacity = ''
      toEl.style.transition = ''
      this.isTransitioning = false
    }, this.duration)
  }

  // 延迟辅助
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}