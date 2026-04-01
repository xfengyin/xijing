import * as THREE from 'three'

export class RecordStoreScene {
  constructor(container) {
    this.container = container
    this.scene = null
    this.camera = null
    this.renderer = null
    this.vinylGroup = null
    this.particles = null
    this.isRotating = false
    this.rotationSpeed = 0
    this.clock = new THREE.Clock()
    this.mouse = new THREE.Vector2()
    this.targetRotation = new THREE.Vector2()
  }

  init() {
    // 场景
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x1a1a2e)
    this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.02)

    // 相机
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 5, 10)
    this.camera.lookAt(0, 0, 0)

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.container.appendChild(this.renderer.domElement)

    // 灯光
    this.setupLights()

    // 创建唱片机
    this.createRecordPlayer()

    // 创建粒子效果
    this.createParticles()

    // 创建背景装饰
    this.createBackgroundElements()

    // 鼠标交互
    this.setupInteraction()
  }

  setupLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    this.scene.add(ambientLight)

    // 主光源（粉色氛围）
    const mainLight = new THREE.PointLight(0xffb6c1, 1, 100)
    mainLight.position.set(5, 10, 5)
    mainLight.castShadow = true
    this.scene.add(mainLight)

    // 补光（蓝色氛围）
    const fillLight = new THREE.PointLight(0x87ceeb, 0.5, 100)
    fillLight.position.set(-5, 5, -5)
    this.scene.add(fillLight)

    // 聚光灯照亮唱片
    const spotLight = new THREE.SpotLight(0xffffff, 0.8)
    spotLight.position.set(0, 15, 0)
    spotLight.angle = Math.PI / 6
    spotLight.penumbra = 0.3
    spotLight.castShadow = true
    this.scene.add(spotLight)
  }

  createRecordPlayer() {
    this.vinylGroup = new THREE.Group()

    // 底座
    const baseGeometry = new THREE.BoxGeometry(8, 0.5, 8)
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a4a,
      roughness: 0.3,
      metalness: 0.7
    })
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    base.position.y = -0.25
    base.receiveShadow = true
    this.vinylGroup.add(base)

    // 转盘
    const platterGeometry = new THREE.CylinderGeometry(3.5, 3.5, 0.2, 64)
    const platterMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.2,
      metalness: 0.9
    })
    this.platter = new THREE.Mesh(platterGeometry, platterMaterial)
    this.platter.position.y = 0.1
    this.platter.receiveShadow = true
    this.vinylGroup.add(this.platter)

    // 唱片
    const vinylGeometry = new THREE.CylinderGeometry(3, 3, 0.05, 64)
    const vinylMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.1,
      metalness: 0.1
    })
    this.vinyl = new THREE.Mesh(vinylGeometry, vinylMaterial)
    this.vinyl.position.y = 0.25
    this.vinyl.castShadow = true
    this.vinylGroup.add(this.vinyl)

    // 唱片标签（可变色）
    const labelGeometry = new THREE.CylinderGeometry(1, 1, 0.06, 32)
    const labelMaterial = new THREE.MeshStandardMaterial({
      color: 0xffb6c1,
      roughness: 0.4,
      emissive: 0xffb6c1,
      emissiveIntensity: 0.2
    })
    this.label = new THREE.Mesh(labelGeometry, labelMaterial)
    this.label.position.y = 0.25
    this.vinylGroup.add(this.label)

    // 唱片纹路（用圆环模拟）
    for (let i = 0; i < 5; i++) {
      const ringGeometry = new THREE.RingGeometry(1.2 + i * 0.4, 1.25 + i * 0.4, 64)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = -Math.PI / 2
      ring.position.y = 0.26
      this.vinylGroup.add(ring)
    }

    // 唱臂
    const armGroup = new THREE.Group()
    
    // 唱臂支柱
    const pivotGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 16)
    const pivotMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.9,
      roughness: 0.2
    })
    const pivot = new THREE.Mesh(pivotGeometry, pivotMaterial)
    pivot.position.set(4, 1, -2)
    armGroup.add(pivot)

    // 唱臂杆
    const armGeometry = new THREE.BoxGeometry(0.15, 0.15, 5)
    const arm = new THREE.Mesh(armGeometry, pivotMaterial)
    arm.position.set(3, 2, 0.5)
    arm.rotation.y = -Math.PI / 6
    armGroup.add(arm)

    this.vinylGroup.add(armGroup)
    this.tonearm = armGroup

    this.scene.add(this.vinylGroup)
  }

  getParticleCount() {
    // 根据设备性能动态调整粒子数量
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
    
    if (isMobile || isLowPower) return 50
    if (window.innerWidth < 768) return 80
    return 200
  }

  createParticles() {
    const particleCount = this.getParticleCount()
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = Math.random() * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30

      // 粉色和蓝色粒子
      const isPink = Math.random() > 0.5
      colors[i * 3] = isPink ? 1 : 0.5
      colors[i * 3 + 1] = isPink ? 0.7 : 0.8
      colors[i * 3 + 2] = isPink ? 0.8 : 1
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

  createBackgroundElements() {
    // 背景音波可视化（环状）
    const waveCount = 8
    this.waves = []

    for (let i = 0; i < waveCount; i++) {
      const radius = 6 + i * 0.8
      const geometry = new THREE.RingGeometry(radius, radius + 0.05, 64)
      const material = new THREE.MeshBasicMaterial({
        color: 0xffb6c1,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      })
      const wave = new THREE.Mesh(geometry, material)
      wave.rotation.x = -Math.PI / 2
      wave.position.y = -1
      this.scene.add(wave)
      this.waves.push({ mesh: wave, baseRadius: radius, phase: i * 0.5 })
    }
  }

  setupInteraction() {
    this._mouseHandler = (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', this._mouseHandler)
  }

  destroy() {
    // 清理事件监听
    window.removeEventListener('mousemove', this._mouseHandler)
    window.removeEventListener('resize', this.onResize)
    
    // 停止动画
    this.isRotating = false
    
    // 释放Three.js资源
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
    
    this.renderer.dispose()
    this.container.removeChild(this.renderer.domElement)
  }

  setVinylColor(colorHex) {
    const color = new THREE.Color(colorHex)
    this.label.material.color = color
    this.label.material.emissive = color
    
    // 更新粒子颜色
    const colors = this.particles.geometry.attributes.color.array
    for (let i = 0; i < colors.length; i += 3) {
      const isPrimary = Math.random() > 0.5
      if (isPrimary) {
        colors[i] = color.r
        colors[i + 1] = color.g
        colors[i + 2] = color.b
      }
    }
    this.particles.geometry.attributes.color.needsUpdate = true
  }

  startVinylRotation() {
    this.isRotating = true
  }

  stopVinylRotation() {
    this.isRotating = false
  }

  update() {
    const delta = this.clock.getDelta()
    const time = this.clock.getElapsedTime()

    // 唱片旋转
    if (this.isRotating) {
      this.rotationSpeed = Math.min(this.rotationSpeed + delta * 2, 3)
    } else {
      this.rotationSpeed = Math.max(this.rotationSpeed - delta * 2, 0)
    }
    
    this.vinyl.rotation.y += this.rotationSpeed * delta
    this.label.rotation.y += this.rotationSpeed * delta

    // 唱臂动画
    if (this.tonearm) {
      const targetRotation = this.isRotating ? -Math.PI / 12 : -Math.PI / 6
      this.tonearm.rotation.y += (targetRotation - this.tonearm.rotation.y) * delta * 2
    }

    // 粒子浮动
    if (this.particles) {
      this.particles.rotation.y = time * 0.05
      const positions = this.particles.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.01
      }
      this.particles.geometry.attributes.position.needsUpdate = true
    }

    // 音波动画
    if (this.waves && this.isRotating) {
      this.waves.forEach((wave, i) => {
        const scale = 1 + Math.sin(time * 3 + wave.phase) * 0.1 * (this.rotationSpeed / 3)
        wave.mesh.scale.set(scale, scale, 1)
        wave.mesh.material.opacity = 0.1 + Math.sin(time * 2 + wave.phase) * 0.05
      })
    }

    // 相机轻微跟随鼠标
    this.targetRotation.x = this.mouse.y * 0.1
    this.targetRotation.y = this.mouse.x * 0.1
    this.camera.position.x += (this.targetRotation.y * 5 - this.camera.position.x) * delta * 2
    this.camera.position.y += (5 + this.targetRotation.x * 2 - this.camera.position.y) * delta * 2
    this.camera.lookAt(0, 0, 0)

    // 渲染
    this.renderer.render(this.scene, this.camera)
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}