// 照片画廊场景 - 展示本兮照片墙
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0'

export class GalleryScene {
  constructor(container) {
    this.container = container
    this.scene = null
    this.camera = null
    this.renderer = null
    this.photos = []
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.hoveredPhoto = null
  }

  init() {
    this.setupScene()
    this.createPhotoWall()
    this.addLighting()
    this.animate()
    this.addEventListeners()
  }

  setupScene() {
    // 场景
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x1a1a2e)
    this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50)

    // 相机
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 0, 15)

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.container.appendChild(this.renderer.domElement)
  }

  createPhotoWall() {
    // 创建照片墙布局
    const photoConfigs = [
      { pos: [-5, 3, 0], size: [3, 4], color: 0xffb6c1 },
      { pos: [0, 3, 0], size: [4, 3], color: 0x87ceeb },
      { pos: [5, 3, 0], size: [3, 4], color: 0xffd700 },
      { pos: [-6, -2, 1], size: [3, 3], color: 0xff69b4 },
      { pos: [-2, -2, 0], size: [4, 4], color: 0xdda0dd },
      { pos: [3, -2, 1], size: [3, 4], color: 0x90ee90 },
      { pos: [6.5, -1, 2], size: [2, 3], color: 0xffa500 },
    ]

    photoConfigs.forEach((config, index) => {
      const photo = this.createPhotoFrame(config, index)
      this.photos.push(photo)
      this.scene.add(photo.mesh)
    })

    // 添加飘浮粒子
    this.createFloatingParticles()
  }

  createPhotoFrame(config, index) {
    const group = new THREE.Group()

    // 相框
    const frameGeometry = new THREE.BoxGeometry(config.size[0] + 0.2, config.size[1] + 0.2, 0.1)
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.7
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    group.add(frame)

    // 照片（用彩色平面代替，实际可贴图）
    const photoGeometry = new THREE.PlaneGeometry(config.size[0], config.size[1])
    const photoMaterial = new THREE.MeshStandardMaterial({
      color: config.color,
      emissive: config.color,
      emissiveIntensity: 0.1,
      metalness: 0.1,
      roughness: 0.8
    })
    const photo = new THREE.Mesh(photoGeometry, photoMaterial)
    photo.position.z = 0.06
    photo.userData = { id: index, type: 'photo' }
    group.add(photo)

    // 添加文字标签
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(0, 0, 256, 64)
    ctx.fillStyle = '#ffffff'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`回忆 ${index + 1}`, 128, 40)

    const texture = new THREE.CanvasTexture(canvas)
    const labelGeometry = new THREE.PlaneGeometry(2, 0.5)
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    })
    const label = new THREE.Mesh(labelGeometry, labelMaterial)
    label.position.set(0, -config.size[1] / 2 - 0.5, 0.1)
    group.add(label)

    group.position.set(...config.pos)
    
    // 添加初始动画
    group.scale.set(0, 0, 0)
    group.userData = {
      targetScale: 1,
      originalY: config.pos[1],
      floatOffset: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.002
    }

    // 延迟出现动画
    setTimeout(() => {
      this.animateAppear(group)
    }, index * 200)

    return { mesh: group, id: index }
  }

  animateAppear(group) {
    const startTime = Date.now()
    const duration = 800

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      group.scale.set(easeProgress, easeProgress, easeProgress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  createFloatingParticles() {
    const geometry = new THREE.BufferGeometry()
    const count = 100
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorPalette = [
      new THREE.Color(0xffb6c1),
      new THREE.Color(0x87ceeb),
      new THREE.Color(0xffd700),
      new THREE.Color(0xff69b4)
    ]

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })

    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)
  }

  addLighting() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(ambientLight)

    // 主光源
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
    mainLight.position.set(5, 10, 7)
    this.scene.add(mainLight)

    // 彩色点光源
    const colors = [0xffb6c1, 0x87ceeb, 0xffd700]
    colors.forEach((color, i) => {
      const light = new THREE.PointLight(color, 0.5, 20)
      light.position.set(
        (i - 1) * 8,
        5,
        5
      )
      this.scene.add(light)
    })
  }

  addEventListeners() {
    // 鼠标移动
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect()
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      this.checkIntersection()
    })

    // 点击
    this.container.addEventListener('click', () => {
      if (this.hoveredPhoto) {
        this.onPhotoClick(this.hoveredPhoto)
      }
    })
  }

  checkIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera)

    const photoMeshes = this.photos.map(p => p.mesh.children.find(c => c.userData.type === 'photo'))
    const intersects = this.raycaster.intersectObjects(photoMeshes)

    if (intersects.length > 0) {
      const photo = intersects[0].object
      if (this.hoveredPhoto !== photo) {
        this.hoveredPhoto = photo
        this.onPhotoHover(photo)
      }
    } else {
      if (this.hoveredPhoto) {
        this.onPhotoLeave(this.hoveredPhoto)
        this.hoveredPhoto = null
      }
    }
  }

  onPhotoHover(photo) {
    const group = photo.parent
    group.userData.isHovered = true
    document.body.style.cursor = 'pointer'
  }

  onPhotoLeave(photo) {
    const group = photo.parent
    group.userData.isHovered = false
    document.body.style.cursor = 'default'
  }

  onPhotoClick(photo) {
    const id = photo.userData.id
    console.log('Photo clicked:', id)
    // 触发事件显示大图
    if (window.xijingApp) {
      window.xijingApp.showPhotoDetail(id)
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate())

    const time = Date.now() * 0.001

    // 照片浮动动画
    this.photos.forEach(photo => {
      const group = photo.mesh
      const data = group.userData

      // 上下浮动
      group.position.y = data.originalY + Math.sin(time + data.floatOffset) * 0.2

      // 轻微旋转
      group.rotation.y += data.rotationSpeed

      // 悬停效果
      if (data.isHovered) {
        group.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1)
        group.rotation.y += 0.01
      } else {
        group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    })

    // 粒子旋转
    if (this.particles) {
      this.particles.rotation.y = time * 0.05
      this.particles.rotation.x = Math.sin(time * 0.1) * 0.1
    }

    // 相机缓慢移动
    this.camera.position.x = Math.sin(time * 0.2) * 0.5
    this.camera.position.y = Math.cos(time * 0.15) * 0.3
    this.camera.lookAt(0, 0, 0)

    this.renderer.render(this.scene, this.camera)
  }

  destroy() {
    this.container.removeEventListener('mousemove', this.checkIntersection)
    this.container.removeEventListener('click', this.onPhotoClick)
    
    if (this.renderer) {
      this.renderer.dispose()
      this.container.removeChild(this.renderer.domElement)
    }
  }
}