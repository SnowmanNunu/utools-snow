/**
 * Full-screen falling particle animation.
 * Supports snow, stars, hearts, petals, bubbles, maple leaves, and mixed mode.
 */
(function () {
  'use strict'

  const canvas = document.getElementById('snowCanvas')
  const ctx = canvas.getContext('2d')

  const PATTERNS = ['snow', 'star', 'heart', 'petal', 'bubble', 'maple', 'note', 'packet', 'butterfly', 'text', 'rain', 'gold', 'firefly', 'lantern', 'dandelion']
  const PATTERN_PROFILE = {
    snow: {
      colors: ['#ffffff', '#f7fbff', '#dff2ff'],
      glow: 'rgba(210, 235, 255, 0.72)',
      speed: 1,
      size: 1,
      opacity: 1,
      sway: 1,
      rotation: 0.5
    },
    star: {
      colors: ['#fff8c7', '#ffe98a', '#ffffff'],
      glow: 'rgba(255, 237, 138, 0.82)',
      speed: 0.82,
      size: 1.15,
      opacity: 0.92,
      sway: 1.25,
      rotation: 0.9
    },
    heart: {
      colors: ['#ff7aa8', '#ff9fbd', '#ffd1df'],
      glow: 'rgba(255, 122, 168, 0.68)',
      speed: 0.72,
      size: 1.25,
      opacity: 0.9,
      sway: 1.35,
      rotation: 0.75
    },
    petal: {
      colors: ['#ffd4e5', '#ffc0d8', '#fff0f7'],
      glow: 'rgba(255, 192, 216, 0.58)',
      speed: 0.58,
      size: 1.4,
      opacity: 0.82,
      sway: 1.8,
      rotation: 1.2
    },
    bubble: {
      colors: ['rgba(210, 246, 255, 0.72)', 'rgba(255, 255, 255, 0.58)', 'rgba(188, 233, 255, 0.66)'],
      glow: 'rgba(172, 230, 255, 0.56)',
      speed: 0.46,
      size: 1.7,
      opacity: 0.62,
      sway: 1.5,
      rotation: 0.2
    },
    maple: {
      colors: ['#ffb15c', '#ff7f50', '#ffd166'],
      glow: 'rgba(255, 151, 84, 0.58)',
      speed: 0.7,
      size: 1.5,
      opacity: 0.9,
      sway: 1.65,
      rotation: 1.35
    },
    note: {
      colors: ['#ffd700', '#ffec8b', '#fff8dc'],
      glow: 'rgba(255, 215, 0, 0.72)',
      speed: 0.9,
      size: 1.2,
      opacity: 0.92,
      sway: 1.3,
      rotation: 0.8
    },
    packet: {
      colors: ['#ff4444', '#ff6b6b', '#ffd700'],
      glow: 'rgba(255, 68, 68, 0.58)',
      speed: 0.65,
      size: 1.3,
      opacity: 0.9,
      sway: 1.2,
      rotation: 0.6
    },
    dandelion: {
      colors: ['#ffffff', '#fffef8', '#f5f5f0'],
      glow: 'rgba(255, 255, 255, 0.55)',
      speed: 0.38,
      size: 1.45,
      opacity: 0.82,
      sway: 2.4,
      rotation: 0.45
    },
    butterfly: {
      colors: ['#ff9ff3', '#f368e0', '#ffcccc', '#a29bfe', '#74b9ff'],
      glow: 'rgba(255, 159, 243, 0.52)',
      speed: 0.55,
      size: 1.3,
      opacity: 0.85,
      sway: 1.4,
      rotation: 0.7
    },
    rain: {
      colors: ['rgba(200, 230, 250, 0.95)', 'rgba(160, 210, 240, 0.9)', 'rgba(120, 190, 230, 0.85)'],
      glow: 'rgba(180, 220, 255, 0.25)',
      speed: 3.2,
      size: 0.6,
      opacity: 0.55,
      sway: 0.05,
      rotation: 0
    },
    gold: {
      colors: ['#ffd700', '#ffec8b', '#daa520', '#fff8dc'],
      glow: 'rgba(255, 215, 0, 0.72)',
      speed: 0.75,
      size: 1.35,
      opacity: 0.92,
      sway: 1.1,
      rotation: 0.5
    },
    text: {
      colors: ['#ffd700', '#ff8c00', '#ff4444'],
      glow: 'rgba(255, 215, 0, 0.68)',
      speed: 0.85,
      size: 1.4,
      opacity: 0.9,
      sway: 1.1,
      rotation: 0.3
    },
    firefly: {
      colors: ['#ccff00', '#a8e600', '#f0ff66', '#88cc00'],
      glow: 'rgba(200, 255, 50, 0.9)',
      speed: 0.35,
      size: 0.8,
      opacity: 0.85,
      sway: 2.2,
      rotation: 0.15
    },
    lantern: {
      colors: ['#ff3333', '#ff5c5c', '#ff1a1a', '#ff7575'],
      glow: 'rgba(255, 80, 80, 0.72)',
      speed: 0.55,
      size: 1.6,
      opacity: 0.92,
      sway: 0.9,
      rotation: 0.25
    }
  }

  const THEMES = {
    spring: {
      label: '春节',
      pattern: 'lantern',
      density: 180,
      wind: 0.4,
      opacityMin: 0.55,
      opacityMax: 1
    },
    christmas: {
      label: '圣诞',
      pattern: 'snow',
      density: 160,
      wind: 0.7,
      opacityMin: 0.45,
      opacityMax: 0.95
    },
    valentine: {
      label: '情人节',
      pattern: 'heart',
      density: 150,
      wind: 0.3,
      opacityMin: 0.4,
      opacityMax: 0.9
    }
  }

  let config = {
    density: 150,
    wind: 0.5,
    pattern: 'snow',
    minSize: 2,
    maxSize: 6,
    minSpeed: 0.3,
    maxSpeed: 1.8,
    swayAmount: 0.8,
    opacityMin: 0.3,
    opacityMax: 0.9,
    burstOnClick: true,
    interaction: true,
    audioReactive: false
  }

  let particles = []
  let burstParticles = []
  let animId = null
  let mouseX = -1000
  let mouseY = -1000
  let mouseActive = false
  let mouseTimer = null
  let width = 0
  let height = 0
  let lastTime = 0

  // 雨滴特效：水花、涟漪、闪电
  let splashes = []
  let ripples = []
  let lightningAlpha = 0
  let nextLightning = 3000 + Math.random() * 5000
  let lightningTimer = 0

  // 音效联动：麦克风音频分析
  let audioContext = null
  let audioAnalyser = null
  let audioSource = null
  let audioDataArray = null
  let audioLevel = 0
  let audioLevelSmooth = 0

  function initAudioReactive () {
    if (audioContext || !navigator.mediaDevices) return
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
      audioAnalyser = audioContext.createAnalyser()
      audioAnalyser.fftSize = 256
      audioSource = audioContext.createMediaStreamSource(stream)
      audioSource.connect(audioAnalyser)
      audioDataArray = new Uint8Array(audioAnalyser.frequencyBinCount)
    }).catch(function (err) {
      console.warn('无法获取麦克风权限，音效联动不可用:', err)
    })
  }

  function stopAudioReactive () {
    if (audioSource) {
      audioSource.disconnect()
      audioSource = null
    }
    if (audioContext) {
      audioContext.close()
      audioContext = null
    }
    audioAnalyser = null
    audioDataArray = null
    audioLevel = 0
    audioLevelSmooth = 0
  }

  function updateAudioLevel () {
    if (!audioAnalyser || !audioDataArray) {
      audioLevel = 0
      audioLevelSmooth = 0
      return
    }
    audioAnalyser.getByteFrequencyData(audioDataArray)
    let sum = 0
    for (let i = 0; i < audioDataArray.length; i++) {
      sum += audioDataArray[i]
    }
    audioLevel = (sum / audioDataArray.length) / 255
    audioLevelSmooth = audioLevelSmooth * 0.85 + audioLevel * 0.15
  }

  function pick (list) {
    return list[Math.floor(Math.random() * list.length)]
  }

  function resolvePattern () {
    return config.pattern === 'mix'
      ? pick(PATTERNS)
      : (PATTERN_PROFILE[config.pattern] ? config.pattern : 'snow')
  }

  function resize () {
    width = window.innerWidth
    height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function makeClusterDots (baseSize) {
    return Array.from({ length: 3 + Math.floor(Math.random() * 4) }, function () {
      return {
        x: (Math.random() - 0.5) * baseSize * 2,
        y: (Math.random() - 0.5) * baseSize * 2,
        r: 0.22 + Math.random() * 0.18
      }
    })
  }

  function createParticle (x, y, layer) {
    const pattern = resolvePattern()
    const profile = PATTERN_PROFILE[pattern]
    const baseSize = config.minSize + Math.random() * (config.maxSize - config.minSize)
    const layerScale = 0.4 + layer * 0.4
    const speedScale = 0.5 + layer * 0.35
    const opacityScale = 0.5 + layer * 0.35

    return {
      x: x !== undefined ? x : Math.random() * width,
      y: y !== undefined ? y : -Math.random() * height - 20,
      r: baseSize * layerScale * profile.size,
      speed: (config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed)) * speedScale * profile.speed,
      swaySpeed: 0.3 + Math.random() * 0.7,
      swayOffset: Math.random() * Math.PI * 2,
      swayAmount: config.swayAmount * (0.5 + Math.random()) * profile.sway,
      opacity: (config.opacityMin + Math.random() * (config.opacityMax - config.opacityMin)) * profile.opacity,
      opacityScale: opacityScale,
      layer: layer,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * profile.rotation,
      type: pattern === 'snow' ? Math.floor(Math.random() * 3) : pattern,
      color: pick(profile.colors),
      glow: profile.glow,
      twinkle: 0.82 + Math.random() * 0.22,
      stretch: 0.75 + Math.random() * 0.7,
      detail: Math.random(),
      clusterDots: makeClusterDots(baseSize),
      text: pattern === 'text' ? pick(['福', '吉', '喜', '财', '乐', '安']) : undefined
    }
  }

  function initParticles () {
    particles = []
    const layers = [
      { count: Math.floor(config.density * 0.3), layer: 0 },
      { count: Math.floor(config.density * 0.4), layer: 1 },
      { count: Math.floor(config.density * 0.3), layer: 2 }
    ]
    for (const l of layers) {
      for (let i = 0; i < l.count; i++) {
        particles.push(createParticle(undefined, Math.random() * height, l.layer))
      }
    }
  }

  function addBurst (cx, cy, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 30 + Math.random() * 100
      const pattern = resolvePattern()
      burstParticles.push({
        x: cx + Math.cos(angle) * dist * Math.random(),
        y: cy + Math.sin(angle) * dist * Math.random(),
        vx: Math.cos(angle) * (1 + Math.random() * 3),
        vy: Math.sin(angle) * (1 + Math.random() * 3),
        life: 1,
        decay: 0.008 + Math.random() * 0.02,
        r: 2 + Math.random() * 4,
        opacity: 0.6 + Math.random() * 0.4,
        color: pick(PATTERN_PROFILE[pattern].colors),
        glow: PATTERN_PROFILE[pattern].glow
      })
    }

    for (let i = 0; i < Math.floor(count * 0.4); i++) {
      const layer = Math.floor(Math.random() * 3)
      particles.push(createParticle(
        cx + (Math.random() - 0.5) * 80,
        cy + (Math.random() - 0.5) * 40,
        layer
      ))
    }
  }

  function drawFivePointStar (r) {
    const outer = r * 1.8
    const inner = outer * 0.45
    ctx.beginPath()
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + i * Math.PI / 5
      const radius = i % 2 === 0 ? outer : inner
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()
  }

  function drawHeart (r) {
    const s = r * 0.18
    ctx.beginPath()
    ctx.moveTo(0, r * 1.35)
    ctx.bezierCurveTo(-16 * s, -4 * s, -12 * s, -18 * s, 0, -8 * s)
    ctx.bezierCurveTo(12 * s, -18 * s, 16 * s, -4 * s, 0, r * 1.35)
    ctx.closePath()
    ctx.fill()
  }

  function drawPetal (r, particle) {
    ctx.scale(0.75, particle.stretch)
    ctx.beginPath()
    ctx.moveTo(0, -r * 2.1)
    ctx.bezierCurveTo(r * 1.35, -r * 0.8, r * 1.05, r * 1.25, 0, r * 1.9)
    ctx.bezierCurveTo(-r * 1.05, r * 1.25, -r * 1.35, -r * 0.8, 0, -r * 2.1)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha *= 0.45
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = Math.max(0.6, r * 0.12)
    ctx.beginPath()
    ctx.moveTo(0, -r * 1.35)
    ctx.quadraticCurveTo(-r * 0.25, 0, 0, r * 1.35)
    ctx.stroke()
  }

  function drawBubble (r) {
    const gradient = ctx.createRadialGradient(-r * 0.5, -r * 0.6, r * 0.2, 0, 0, r * 2)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.72)')
    gradient.addColorStop(0.45, 'rgba(200, 240, 255, 0.18)')
    gradient.addColorStop(1, 'rgba(160, 220, 255, 0.05)')
    ctx.fillStyle = gradient
    ctx.strokeStyle = 'rgba(235, 250, 255, 0.78)'
    ctx.lineWidth = Math.max(1, r * 0.16)
    ctx.beginPath()
    ctx.arc(0, 0, r * 1.75, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'
    ctx.beginPath()
    ctx.arc(-r * 0.55, -r * 0.65, r * 0.28, 0, Math.PI * 2)
    ctx.fill()
  }

  function drawMaple (r) {
    const pts = [
      [0, -2.2], [0.35, -1.1], [1.25, -1.65], [0.9, -0.55],
      [1.95, -0.45], [0.85, 0.1], [1.35, 1.05], [0.3, 0.62],
      [0.18, 1.9], [-0.18, 1.9], [-0.3, 0.62], [-1.35, 1.05],
      [-0.85, 0.1], [-1.95, -0.45], [-0.9, -0.55], [-1.25, -1.65],
      [-0.35, -1.1]
    ]
    ctx.beginPath()
    pts.forEach(function (p, index) {
      const x = p[0] * r
      const y = p[1] * r
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 245, 210, 0.46)'
    ctx.lineWidth = Math.max(0.6, r * 0.12)
    ctx.beginPath()
    ctx.moveTo(0, -r * 1.25)
    ctx.lineTo(0, r * 1.7)
    ctx.moveTo(0, -r * 0.2)
    ctx.lineTo(r * 1.1, -r * 0.75)
    ctx.moveTo(0, -r * 0.2)
    ctx.lineTo(-r * 1.1, -r * 0.75)
    ctx.stroke()
  }

  function drawNote (r) {
    ctx.beginPath()
    ctx.ellipse(r * 0.4, r * 1.2, r * 0.55, r * 0.35, Math.PI / 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(r * 0.75, -r * 1.6, r * 0.18, r * 2.9)
    ctx.beginPath()
    ctx.moveTo(r * 0.93, -r * 1.6)
    ctx.quadraticCurveTo(r * 1.8, -r * 1.3, r * 1.6, -r * 0.6)
    ctx.lineTo(r * 0.93, -r * 0.9)
    ctx.fill()
  }

  function drawPacket (r) {
    const w = r * 1.6
    const h = r * 2.2
    ctx.beginPath()
    ctx.moveTo(-w, -h)
    ctx.lineTo(w, -h)
    ctx.lineTo(w, h)
    ctx.lineTo(-w, h)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(-w, -h)
    ctx.quadraticCurveTo(0, -h * 0.4, w, -h)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)'
    ctx.lineWidth = Math.max(1, r * 0.2)
    ctx.beginPath()
    ctx.moveTo(0, -h * 0.25)
    ctx.lineTo(0, h * 0.7)
    ctx.stroke()
    ctx.fillStyle = '#ffd700'
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ff4444'
    ctx.font = `bold ${Math.floor(r * 0.5)}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('福', 0, 0)
  }

  function drawRain (r, particle) {
    // 真实雨滴：细长泪滴形，垂直下落，不受旋转影响
    ctx.rotate(-particle.rotation)

    const len = r * (4.2 + particle.stretch * 1.8)
    const headR = Math.max(1.6, r * 0.6)
    const bodyW = Math.max(0.7, r * 0.22)

    // 从圆头到尖尾的蓝色渐变
    const grad = ctx.createLinearGradient(0, -len * 0.55, 0, len * 0.75)
    grad.addColorStop(0, 'rgba(245, 252, 255, 0.95)')
    grad.addColorStop(0.25, 'rgba(200, 235, 255, 0.9)')
    grad.addColorStop(0.6, 'rgba(150, 205, 240, 0.7)')
    grad.addColorStop(0.9, 'rgba(120, 185, 225, 0.25)')
    grad.addColorStop(1, 'rgba(120, 185, 225, 0.02)')

    ctx.fillStyle = grad
    ctx.beginPath()
    // 圆头部
    ctx.arc(0, -len * 0.35, headR, 0, Math.PI * 2)
    // 尖尾部
    ctx.moveTo(-headR * 0.65, -len * 0.35)
    ctx.quadraticCurveTo(-bodyW, len * 0.1, 0, len * 0.75)
    ctx.quadraticCurveTo(bodyW, len * 0.1, headR * 0.65, -len * 0.35)
    ctx.closePath()
    ctx.fill()

    // 顶部高光，增强立体感
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
    ctx.beginPath()
    ctx.arc(-headR * 0.25, -len * 0.45, headR * 0.22, 0, Math.PI * 2)
    ctx.fill()
  }

  function drawDandelion (r) {
    // 蒲公英种子：细长茎 + 顶端绒球
    const stemLen = r * 3.2
    const headR = r * 1.5

    ctx.lineCap = 'round'

    // 茎：轻微弯曲的细白线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)'
    ctx.lineWidth = Math.max(0.5, r * 0.12)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(-r * 0.25, stemLen * 0.55, 0, stemLen)
    ctx.stroke()

    // 顶端绒球位置
    ctx.save()
    ctx.translate(0, stemLen)

    // 绒毛放射线
    const strands = 12
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)'
    ctx.lineWidth = Math.max(0.5, r * 0.1)
    for (let i = 0; i < strands; i++) {
      const baseAngle = (Math.PI * 2 / strands) * i + 0.2
      const len = headR * (0.75 + Math.random() * 0.35)
      const angle = baseAngle + (Math.random() - 0.5) * 0.12
      const endX = Math.cos(angle) * len
      const endY = Math.sin(angle) * len

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(
        Math.cos(angle + 0.1) * len * 0.45,
        Math.sin(angle + 0.1) * len * 0.45,
        endX, endY
      )
      ctx.stroke()

      // 绒毛顶端小白点
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
      ctx.beginPath()
      ctx.arc(endX, endY, Math.max(0.5, r * 0.14), 0, Math.PI * 2)
      ctx.fill()
    }

    // 绒球中心
    ctx.fillStyle = 'rgba(255, 255, 245, 0.95)'
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(210, 200, 175, 0.55)'
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.15, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  function drawButterfly (r) {
    // 蝴蝶：对称翅膀 + 身体
    const s = r * 0.9
    // 左上翅
    ctx.beginPath()
    ctx.moveTo(0, -r * 0.3)
    ctx.bezierCurveTo(-s * 1.8, -s * 2.2, -s * 2.2, -s * 0.3, -s * 0.9, r * 0.4)
    ctx.bezierCurveTo(-s * 0.4, r * 0.2, -s * 0.2, -r * 0.1, 0, r * 0.6)
    ctx.fill()
    // 右上翅
    ctx.beginPath()
    ctx.moveTo(0, -r * 0.3)
    ctx.bezierCurveTo(s * 1.8, -s * 2.2, s * 2.2, -s * 0.3, s * 0.9, r * 0.4)
    ctx.bezierCurveTo(s * 0.4, r * 0.2, s * 0.2, -r * 0.1, 0, r * 0.6)
    ctx.fill()
    // 左下翅
    ctx.beginPath()
    ctx.moveTo(0, r * 0.5)
    ctx.bezierCurveTo(-s * 1.2, r * 1.2, -s * 1.0, r * 2.0, -s * 0.3, r * 1.8)
    ctx.bezierCurveTo(-s * 0.1, r * 1.4, -s * 0.05, r * 0.9, 0, r * 0.8)
    ctx.fill()
    // 右下翅
    ctx.beginPath()
    ctx.moveTo(0, r * 0.5)
    ctx.bezierCurveTo(s * 1.2, r * 1.2, s * 1.0, r * 2.0, s * 0.3, r * 1.8)
    ctx.bezierCurveTo(s * 0.1, r * 1.4, s * 0.05, r * 0.9, 0, r * 0.8)
    ctx.fill()
    // 身体
    ctx.fillStyle = 'rgba(80, 60, 40, 0.8)'
    ctx.beginPath()
    ctx.ellipse(0, r * 0.5, r * 0.15, r * 0.9, 0, 0, Math.PI * 2)
    ctx.fill()
    // 触角
    ctx.strokeStyle = 'rgba(80, 60, 40, 0.6)'
    ctx.lineWidth = Math.max(0.5, r * 0.1)
    ctx.beginPath()
    ctx.moveTo(0, -r * 0.5)
    ctx.quadraticCurveTo(-r * 0.5, -r * 1.4, -r * 0.7, -r * 1.6)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, -r * 0.5)
    ctx.quadraticCurveTo(r * 0.5, -r * 1.4, r * 0.7, -r * 1.6)
    ctx.stroke()
  }

  function drawGold (r) {
    // 中国传统金元宝：中间鼓起、两头翘起
    const grad = ctx.createLinearGradient(-r, -r, r, r)
    grad.addColorStop(0, '#b8860b')
    grad.addColorStop(0.35, '#ffd700')
    grad.addColorStop(0.65, '#ffec8b')
    grad.addColorStop(1, '#b8860b')
    ctx.fillStyle = grad

    ctx.beginPath()
    ctx.moveTo(-r * 1.55, r * 0.35)
    ctx.quadraticCurveTo(-r * 1.35, -r * 0.75, -r * 0.55, -r * 0.55)
    ctx.quadraticCurveTo(0, -r * 0.15, r * 0.55, -r * 0.55)
    ctx.quadraticCurveTo(r * 1.35, -r * 0.75, r * 1.55, r * 0.35)
    ctx.quadraticCurveTo(r * 0.85, r * 0.95, 0, r * 1.05)
    ctx.quadraticCurveTo(-r * 0.85, r * 0.95, -r * 1.55, r * 0.35)
    ctx.closePath()
    ctx.fill()

    // 元宝口（凹槽）
    ctx.fillStyle = 'rgba(140, 105, 15, 0.58)'
    ctx.beginPath()
    ctx.ellipse(0, -r * 0.22, r * 0.5, r * 0.2, 0, 0, Math.PI * 2)
    ctx.fill()

    // 外轮廓描边，增强立体感
    ctx.strokeStyle = 'rgba(180, 140, 30, 0.75)'
    ctx.lineWidth = Math.max(0.6, r * 0.12)
    ctx.beginPath()
    ctx.moveTo(-r * 1.55, r * 0.35)
    ctx.quadraticCurveTo(-r * 1.35, -r * 0.75, -r * 0.55, -r * 0.55)
    ctx.quadraticCurveTo(0, -r * 0.15, r * 0.55, -r * 0.55)
    ctx.quadraticCurveTo(r * 1.35, -r * 0.75, r * 1.55, r * 0.35)
    ctx.quadraticCurveTo(r * 0.85, r * 0.95, 0, r * 1.05)
    ctx.quadraticCurveTo(-r * 0.85, r * 0.95, -r * 1.55, r * 0.35)
    ctx.stroke()

    // 高光
    ctx.fillStyle = 'rgba(255, 255, 235, 0.72)'
    ctx.beginPath()
    ctx.ellipse(-r * 0.25, -r * 0.12, r * 0.28, r * 0.1, -Math.PI / 10, 0, Math.PI * 2)
    ctx.fill()
  }

  function drawText (r, particle) {
    ctx.font = `bold ${Math.floor(r * 2.8)}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(particle.text || '福', 0, r * 0.2)
  }

  function drawFirefly (r, particle) {
    // 萤火虫：发光身体 + 尾部拖尾
    const tailLen = r * (2.5 + particle.stretch * 1.5)
    const tailGrad = ctx.createLinearGradient(0, 0, 0, tailLen)
    tailGrad.addColorStop(0, 'rgba(200, 255, 50, 0.85)')
    tailGrad.addColorStop(0.5, 'rgba(170, 230, 40, 0.35)')
    tailGrad.addColorStop(1, 'rgba(170, 230, 40, 0)')

    ctx.fillStyle = tailGrad
    ctx.beginPath()
    ctx.moveTo(-r * 0.25, 0)
    ctx.quadraticCurveTo(-r * 0.1, tailLen * 0.5, 0, tailLen)
    ctx.quadraticCurveTo(r * 0.1, tailLen * 0.5, r * 0.25, 0)
    ctx.closePath()
    ctx.fill()

    // 发光身体
    ctx.shadowBlur = r * 4
    ctx.fillStyle = particle.color
    ctx.beginPath()
    ctx.ellipse(0, -r * 0.15, r * 0.55, r * 0.7, 0, 0, Math.PI * 2)
    ctx.fill()

    // 内部亮核
    ctx.fillStyle = 'rgba(255, 255, 220, 0.95)'
    ctx.beginPath()
    ctx.arc(0, -r * 0.25, r * 0.25, 0, Math.PI * 2)
    ctx.fill()
  }

  function drawLantern (r) {
    // 红灯笼：椭圆主体 + 上下盖 + 流苏
    const grad = ctx.createLinearGradient(-r, -r, r, r)
    grad.addColorStop(0, '#cc0000')
    grad.addColorStop(0.4, '#ff4d4d')
    grad.addColorStop(0.6, '#ff3333')
    grad.addColorStop(1, '#990000')
    ctx.fillStyle = grad

    // 主体
    ctx.beginPath()
    ctx.ellipse(0, 0, r * 1.2, r * 1.55, 0, 0, Math.PI * 2)
    ctx.fill()

    // 灯笼骨架线条
    ctx.strokeStyle = 'rgba(180, 40, 40, 0.55)'
    ctx.lineWidth = Math.max(0.8, r * 0.15)
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath()
      ctx.moveTo(-r * 1.1, i * r * 0.75)
      ctx.quadraticCurveTo(0, i * r * 0.85, r * 1.1, i * r * 0.75)
      ctx.stroke()
    }

    // 上下盖子
    ctx.fillStyle = '#b8860b'
    ctx.fillRect(-r * 0.7, -r * 1.7, r * 1.4, r * 0.25)
    ctx.fillRect(-r * 0.7, r * 1.45, r * 1.4, r * 0.25)

    // 上提手
    ctx.strokeStyle = '#b8860b'
    ctx.lineWidth = Math.max(1, r * 0.18)
    ctx.beginPath()
    ctx.moveTo(-r * 0.2, -r * 1.7)
    ctx.quadraticCurveTo(0, -r * 2.1, r * 0.2, -r * 1.7)
    ctx.stroke()

    // 流苏
    ctx.strokeStyle = '#ffd700'
    ctx.lineWidth = Math.max(0.6, r * 0.1)
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath()
      ctx.moveTo(i * r * 0.18, r * 1.7)
      ctx.lineTo(i * r * 0.22, r * 2.2 + Math.abs(i) * r * 0.15)
      ctx.stroke()
    }

    // 福字
    ctx.fillStyle = '#ffd700'
    ctx.font = `bold ${Math.floor(r * 0.9)}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('福', 0, 0)
  }

  function drawSnowCrystal (r) {
    ctx.lineWidth = r * 0.5
    ctx.lineCap = 'round'
    const arms = 6
    const armLen = r * 2.5
    for (let i = 0; i < arms; i++) {
      const angle = (Math.PI * 2 / arms) * i
      const branchStart = armLen * 0.55
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(angle) * armLen, Math.sin(angle) * armLen)
      ctx.moveTo(Math.cos(angle) * branchStart, Math.sin(angle) * branchStart)
      ctx.lineTo(Math.cos(angle + Math.PI / 8) * armLen * 0.65, Math.sin(angle + Math.PI / 8) * armLen * 0.65)
      ctx.moveTo(Math.cos(angle) * branchStart, Math.sin(angle) * branchStart)
      ctx.lineTo(Math.cos(angle - Math.PI / 8) * armLen * 0.65, Math.sin(angle - Math.PI / 8) * armLen * 0.65)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2)
    ctx.fill()
  }

  function drawParticle (particle) {
    ctx.save()
    ctx.translate(particle.x, particle.y)
    ctx.rotate(particle.rotation)
    ctx.globalAlpha = particle.opacity * particle.opacityScale * particle.twinkle
    ctx.fillStyle = particle.color
    ctx.strokeStyle = particle.color
    ctx.shadowColor = particle.glow

    const r = particle.r
    switch (particle.type) {
      case 0:
        ctx.shadowBlur = r * 1.5
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.fill()
        break
      case 1:
        ctx.shadowBlur = r * 2
        drawSnowCrystal(r)
        break
      case 2:
        ctx.shadowBlur = r * 0.8
        for (const dot of particle.clusterDots) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, r * dot.r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'star':
        ctx.shadowBlur = r * 2.5
        drawFivePointStar(r)
        break
      case 'heart':
        ctx.shadowBlur = r * 2
        drawHeart(r)
        break
      case 'petal':
        ctx.shadowBlur = r * 1.7
        drawPetal(r, particle)
        break
      case 'bubble':
        ctx.shadowBlur = r * 2.8
        drawBubble(r)
        break
      case 'maple':
        ctx.shadowBlur = r * 1.6
        drawMaple(r)
        break
      case 'note':
        ctx.shadowBlur = r * 2.5
        drawNote(r)
        break
      case 'packet':
        ctx.shadowBlur = r * 1.8
        drawPacket(r)
        break
      case 'dandelion':
        ctx.shadowBlur = r * 1.8
        drawDandelion(r)
        break
      case 'butterfly':
        ctx.shadowBlur = r * 2.2
        drawButterfly(r)
        break
      case 'rain':
        ctx.shadowBlur = r * 1.2
        drawRain(r, particle)
        break
      case 'gold':
        ctx.shadowBlur = r * 2.2
        drawGold(r)
        break
      case 'text':
        ctx.shadowBlur = r * 2
        drawText(r, particle)
        break
      case 'firefly':
        ctx.shadowBlur = r * 4.5
        drawFirefly(r, particle)
        break
      case 'lantern':
        ctx.shadowBlur = r * 2.2
        drawLantern(r)
        break
    }
    ctx.restore()
  }

  function updateParticle (particle, windForce, deltaSec, timeSec, audioBoost) {
    const speedMul = 1 + (audioBoost || 0) * 0.6
    const swayMul = 1 + (audioBoost || 0) * 1.2
    particle.y += particle.speed * 60 * deltaSec * speedMul
    const sway = Math.sin(timeSec * particle.swaySpeed + particle.swayOffset)
    let effectiveWind = windForce

    if (mouseActive && config.interaction) {
      const dx = particle.x - mouseX
      const dy = particle.y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const influenceRadius = 250
      if (dist < influenceRadius) {
        const strength = 1 - dist / influenceRadius
        effectiveWind += (dx / Math.max(dist, 1)) * strength * 2
        particle.y += (dy / Math.max(dist, 1)) * strength * 20 * deltaSec
      }
    }

    particle.x += sway * particle.swayAmount * swayMul * 30 * deltaSec + effectiveWind * 40 * deltaSec
    particle.rotation += particle.rotationSpeed * deltaSec * (1 + (audioBoost || 0) * 0.5)
    particle.twinkle = 0.82 + Math.sin(timeSec * 1.5 + particle.swayOffset) * 0.08 + particle.detail * 0.08

    if (particle.y > height + 40) {
      // 雨滴碰底产生水花和涟漪
      if (particle.type === 'rain' && Math.random() < 0.28) {
        addSplash(particle.x, height, particle.r)
        addRipple(particle.x, height, particle.r)
      }
      Object.assign(particle, createParticle(Math.random() * width, -40, particle.layer))
    }
    if (particle.x > width + 70) particle.x = -70
    if (particle.x < -70) particle.x = width + 70
  }

  function drawBursts (deltaSec) {
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const p = burstParticles[i]
      p.x += p.vx * 60 * deltaSec
      p.y += p.vy * 60 * deltaSec
      p.life -= p.decay
      if (p.life <= 0) {
        burstParticles.splice(i, 1)
        continue
      }
      ctx.save()
      ctx.globalAlpha = p.life * p.opacity
      ctx.fillStyle = p.color
      ctx.shadowColor = p.glow || 'rgba(255, 255, 255, 0.8)'
      ctx.shadowBlur = p.r * 2
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  // === 雨滴特效：水花、涟漪、闪电 ===
  function addSplash (x, y, r) {
    const count = 4 + Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI * 0.55 + (Math.random() - 0.5) * Math.PI * 0.7
      const speed = 1.2 + Math.random() * r * 0.6
      splashes.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.018 + Math.random() * 0.022,
        size: 0.6 + Math.random() * r * 0.35
      })
    }
  }

  function addRipple (x, y, r) {
    const maxR = 6 + r * 2.2
    ripples.push({
      x: x,
      y: y,
      radius: 1,
      maxRadius: maxR,
      life: 1,
      decay: 0.012 + Math.random() * 0.012,
      rings: 2 + Math.floor(Math.random() * 2)
    })
  }

  function updateSplashes (deltaSec) {
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i]
      s.x += s.vx
      s.y += s.vy
      s.vy += 0.18
      s.life -= s.decay
      if (s.life <= 0) {
        splashes.splice(i, 1)
      }
    }
  }

  function updateRipples (deltaSec) {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i]
      rp.radius += (rp.maxRadius - rp.radius) * 0.08
      rp.life -= rp.decay
      if (rp.life <= 0) {
        ripples.splice(i, 1)
      }
    }
  }

  function drawSplashes () {
    for (const s of splashes) {
      ctx.fillStyle = 'rgba(210, 240, 255, ' + (s.life * 0.7) + ')'
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function drawRipples () {
    for (const rp of ripples) {
      const alpha = rp.life * 0.35
      ctx.strokeStyle = 'rgba(160, 210, 245, ' + alpha + ')'
      ctx.lineWidth = 0.8
      for (let i = 0; i < rp.rings; i++) {
        const ringRadius = rp.radius * (1 - i * 0.28)
        if (ringRadius <= 0) continue
        ctx.beginPath()
        ctx.ellipse(rp.x, rp.y, ringRadius, ringRadius * 0.22, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
  }

  function updateLightning (deltaSec) {
    lightningTimer += deltaSec * 1000
    if (lightningTimer > nextLightning) {
      lightningAlpha = 0.25 + Math.random() * 0.25
      lightningTimer = 0
      nextLightning = 4000 + Math.random() * 8000
    }
    if (lightningAlpha > 0) {
      lightningAlpha -= deltaSec * 1.2
      if (lightningAlpha < 0) lightningAlpha = 0
    }
  }

  function drawLightning () {
    if (lightningAlpha <= 0) return
    ctx.fillStyle = 'rgba(255, 255, 255, ' + lightningAlpha + ')'
    ctx.fillRect(0, 0, width, height)
  }

  function maintainDensity () {
    if (particles.length < config.density) {
      const toAdd = Math.min(config.density - particles.length, 4)
      for (let i = 0; i < toAdd; i++) {
        particles.push(createParticle(undefined, -Math.random() * 20, Math.floor(Math.random() * 3)))
      }
    } else if (particles.length > config.density + 10) {
      particles.splice(config.density)
    }
  }

  function animate (timestamp) {
    animId = requestAnimationFrame(animate)
    if (lastTime === 0) {
      lastTime = timestamp
      return
    }

    let deltaSec = (timestamp - lastTime) / 1000
    if (deltaSec > 0.1) deltaSec = 0.1
    lastTime = timestamp
    const timeSec = timestamp * 0.001

    ctx.clearRect(0, 0, width, height)

    // 音效联动：分析麦克风音量
    updateAudioLevel()
    let audioBoost = 0
    if (config.audioReactive && audioLevelSmooth > 0.12) {
      audioBoost = (audioLevelSmooth - 0.12) * 2.5
      // 音量大时随机爆发粒子
      if (Math.random() < audioBoost * 0.2) {
        addBurst(
          Math.random() * width,
          Math.random() * height * 0.6,
          4 + Math.floor(audioBoost * 8)
        )
      }
    }

    // 雨夜闪电效果（仅在雨滴模式下）
    if (config.pattern === 'rain') {
      updateLightning(deltaSec)
    }
    drawLightning()

    drawBursts(deltaSec)

    const windVariation = Math.sin(timestamp * 0.0003) * 0.3 +
      Math.sin(timestamp * 0.0007) * 0.2 +
      Math.cos(timestamp * 0.0011) * 0.15
    const windForce = config.wind + windVariation + audioBoost * 0.8

    for (const particle of particles) {
      updateParticle(particle, windForce, deltaSec, timeSec, audioBoost)
      drawParticle(particle)
    }

    // 雨滴碰底水花和涟漪
    if (config.pattern === 'rain') {
      updateSplashes(deltaSec)
      updateRipples(deltaSec)
      drawSplashes()
      drawRipples()
    }

    maintainDensity()
  }

  canvas.addEventListener('mousemove', function (e) {
    mouseX = e.clientX
    mouseY = e.clientY
    mouseActive = true
    clearTimeout(mouseTimer)
    mouseTimer = setTimeout(function () {
      mouseActive = false
    }, 2000)
  })

  canvas.addEventListener('click', function (e) {
    if (config.burstOnClick) {
      addBurst(e.clientX, e.clientY, 12)
    }
  })

  canvas.addEventListener('touchstart', function (e) {
    if (config.burstOnClick && e.touches.length > 0) {
      for (const touch of e.touches) {
        addBurst(touch.clientX, touch.clientY, 8)
      }
    }
  })

  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'snow-config') return
    const newConfig = event.data.config
    if (!newConfig) return

    const shouldRefresh = newConfig.pattern !== undefined ||
      newConfig.minSize !== undefined ||
      newConfig.maxSize !== undefined ||
      newConfig.theme !== undefined
    Object.assign(config, newConfig)

    // 音效联动开关
    if (newConfig.audioReactive !== undefined) {
      if (config.audioReactive) {
        initAudioReactive()
      } else {
        stopAudioReactive()
      }
    }

    // 节日主题包
    if (newConfig.theme !== undefined && THEMES[newConfig.theme]) {
      const theme = THEMES[newConfig.theme]
      Object.assign(config, {
        pattern: theme.pattern,
        density: theme.density,
        wind: theme.wind,
        opacityMin: theme.opacityMin,
        opacityMax: theme.opacityMax
      })
    } else if (newConfig.theme === null) {
      // 取消主题，保留用户当前其他配置
    }

    if (shouldRefresh) {
      initParticles()
    } else if (newConfig.density !== undefined && particles.length > config.density) {
      particles.splice(config.density)
    }
  })

  function start () {
    resize()
    initParticles()
    lastTime = 0
    if (animId) cancelAnimationFrame(animId)
    animId = requestAnimationFrame(animate)
    window.addEventListener('resize', resize)
  }

  function stop () {
    if (animId) {
      cancelAnimationFrame(animId)
      animId = null
    }
    window.removeEventListener('resize', resize)
  }

  window.snowControl = {
    start: start,
    stop: stop,
    setConfig: function (cfg) {
      const shouldRefresh = cfg && (cfg.pattern !== undefined || cfg.minSize !== undefined || cfg.maxSize !== undefined)
      Object.assign(config, cfg)
      if (shouldRefresh) initParticles()
    }
  }

  start()
})()
