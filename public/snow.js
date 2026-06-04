/**
 * Full-screen falling particle animation.
 * Supports snow, stars, hearts, petals, bubbles, maple leaves, and mixed mode.
 */
(function () {
  'use strict'

  const canvas = document.getElementById('snowCanvas')
  const ctx = canvas.getContext('2d')

  const PATTERNS = ['snow', 'star', 'heart', 'petal', 'bubble', 'maple']
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
    interaction: true
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
      clusterDots: makeClusterDots(baseSize)
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
    }
    ctx.restore()
  }

  function updateParticle (particle, windForce, deltaSec, timeSec) {
    particle.y += particle.speed * 60 * deltaSec
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

    particle.x += sway * particle.swayAmount * 30 * deltaSec + effectiveWind * 40 * deltaSec
    particle.rotation += particle.rotationSpeed * deltaSec
    particle.twinkle = 0.82 + Math.sin(timeSec * 1.5 + particle.swayOffset) * 0.08 + particle.detail * 0.08

    if (particle.y > height + 40) {
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
    drawBursts(deltaSec)

    const windVariation = Math.sin(timestamp * 0.0003) * 0.3 +
      Math.sin(timestamp * 0.0007) * 0.2 +
      Math.cos(timestamp * 0.0011) * 0.15
    const windForce = config.wind + windVariation

    for (const particle of particles) {
      updateParticle(particle, windForce, deltaSec, timeSec)
      drawParticle(particle)
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
      newConfig.maxSize !== undefined
    Object.assign(config, newConfig)

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
