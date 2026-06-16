import { ctx, canvasDpr } from './viewport.js'

export function drawFivePointStar (r) {
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

export function drawHeart (r) {
  const s = r * 0.18
  ctx.beginPath()
  ctx.moveTo(0, r * 1.35)
  ctx.bezierCurveTo(-16 * s, -4 * s, -12 * s, -18 * s, 0, -8 * s)
  ctx.bezierCurveTo(12 * s, -18 * s, 16 * s, -4 * s, 0, r * 1.35)
  ctx.closePath()
  ctx.fill()
}

export function drawPetal (r, particle) {
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

export function drawBubble (r) {
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

export function drawMaple (r) {
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

export function drawNote (r) {
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

export function drawPacket (r) {
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

export function drawRain (r, particle) {
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

export function drawDandelion (r) {
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

export function drawButterfly (r) {
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

export function drawPumpkin (r) {
  // 🎃 南瓜灯：圆润主体 + 瓜蒂 + 三角眼/鼻 + 锯齿微笑嘴
  const bodyGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.1, 0, 0, r * 1.5)
  bodyGrad.addColorStop(0, '#ffab5c')
  bodyGrad.addColorStop(0.5, '#ff7f00')
  bodyGrad.addColorStop(1, '#cc5500')
  ctx.fillStyle = bodyGrad

  // 主体
  ctx.beginPath()
  ctx.arc(0, r * 0.05, r * 1.15, 0, Math.PI * 2)
  ctx.fill()

  // 纵向肋骨
  ctx.strokeStyle = 'rgba(160, 65, 0, 0.4)'
  ctx.lineWidth = Math.max(0.8, r * 0.15)
  for (let i = -1; i <= 1; i++) {
    if (i === 0) continue
    ctx.beginPath()
    ctx.ellipse(i * r * 0.5, r * 0.05, r * 0.45, r * 1.05, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 外轮廓
  ctx.strokeStyle = 'rgba(130, 55, 0, 0.75)'
  ctx.lineWidth = Math.max(1, r * 0.18)
  ctx.beginPath()
  ctx.arc(0, r * 0.05, r * 1.15, 0, Math.PI * 2)
  ctx.stroke()

  // 瓜蒂
  ctx.fillStyle = '#4a7c2a'
  ctx.beginPath()
  ctx.ellipse(0, -r * 1.1, r * 0.22, r * 0.22, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(-r * 0.1, -r * 1.35, r * 0.2, r * 0.4)

  // 表情（尺寸足够大时绘制）
  if (r > 2) {
    ctx.fillStyle = 'rgba(50, 20, 0, 0.92)'

    // 左眼
    ctx.beginPath()
    ctx.moveTo(-r * 0.32, -r * 0.12)
    ctx.lineTo(-r * 0.18, -r * 0.38)
    ctx.lineTo(-r * 0.04, -r * 0.12)
    ctx.closePath()
    ctx.fill()

    // 右眼
    ctx.beginPath()
    ctx.moveTo(r * 0.32, -r * 0.12)
    ctx.lineTo(r * 0.18, -r * 0.38)
    ctx.lineTo(r * 0.04, -r * 0.12)
    ctx.closePath()
    ctx.fill()

    // 鼻子
    ctx.beginPath()
    ctx.moveTo(0, -r * 0.02)
    ctx.lineTo(-r * 0.08, r * 0.18)
    ctx.lineTo(r * 0.08, r * 0.18)
    ctx.closePath()
    ctx.fill()

    // 微笑嘴
    ctx.beginPath()
    ctx.moveTo(-r * 0.45, r * 0.22)
    ctx.lineTo(-r * 0.3, r * 0.42)
    ctx.lineTo(-r * 0.15, r * 0.28)
    ctx.lineTo(0, r * 0.45)
    ctx.lineTo(r * 0.15, r * 0.28)
    ctx.lineTo(r * 0.3, r * 0.42)
    ctx.lineTo(r * 0.45, r * 0.22)
    ctx.quadraticCurveTo(0, r * 0.78, -r * 0.45, r * 0.22)
    ctx.fill()
  }
}

export function drawText (r, particle) {
  ctx.font = `bold ${Math.floor(r * 2.8)}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(particle.text || '福', 0, r * 0.2)
}

export function drawFirefly (r, particle) {
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

export function drawLantern (r) {
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

export function drawSnowCrystal (r) {
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

export function applyParticleContext (particle) {
  const c = Math.cos(particle.rotation)
  const s = Math.sin(particle.rotation)
  ctx.setTransform(canvasDpr * c, canvasDpr * s, -canvasDpr * s, canvasDpr * c, canvasDpr * particle.x, canvasDpr * particle.y)
  ctx.globalAlpha = particle.opacity * particle.opacityScale * particle.twinkle
  ctx.fillStyle = particle.color
  ctx.strokeStyle = particle.color
  ctx.shadowColor = particle.glow
}

export function resetParticleTransform () {
  ctx.setTransform(canvasDpr, 0, 0, canvasDpr, 0, 0)
}

export const PARTICLE_DRAWERS = {
  0: function (p) {
    ctx.shadowBlur = p.r * 1.5
    ctx.beginPath()
    ctx.arc(0, 0, p.r, 0, Math.PI * 2)
    ctx.fill()
  },
  1: function (p) {
    ctx.shadowBlur = p.r * 2
    drawSnowCrystal(p.r)
  },
  2: function (p) {
    ctx.shadowBlur = p.r * 0.8
    for (const dot of p.clusterDots) {
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, p.r * dot.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(0, 0, p.r * 0.4, 0, Math.PI * 2)
    ctx.fill()
  },
  star: function (p) {
    ctx.shadowBlur = p.r * 2.5
    drawFivePointStar(p.r)
  },
  heart: function (p) {
    ctx.shadowBlur = p.r * 2
    drawHeart(p.r)
  },
  petal: function (p) {
    ctx.shadowBlur = p.r * 1.7
    drawPetal(p.r, p)
  },
  bubble: function (p) {
    ctx.shadowBlur = p.r * 2.8
    drawBubble(p.r)
  },
  maple: function (p) {
    ctx.shadowBlur = p.r * 1.6
    drawMaple(p.r)
  },
  note: function (p) {
    ctx.shadowBlur = p.r * 2.5
    drawNote(p.r)
  },
  packet: function (p) {
    ctx.shadowBlur = p.r * 1.8
    drawPacket(p.r)
  },
  dandelion: function (p) {
    ctx.shadowBlur = p.r * 1.8
    drawDandelion(p.r)
  },
  butterfly: function (p) {
    ctx.shadowBlur = p.r * 2.2
    drawButterfly(p.r)
  },
  rain: function (p) {
    ctx.shadowBlur = p.r * 1.2
    drawRain(p.r, p)
  },
  pumpkin: function (p) {
    ctx.shadowBlur = p.r * 2.2
    drawPumpkin(p.r)
  },
  text: function (p) {
    ctx.shadowBlur = p.r * 2
    drawText(p.r, p)
  },
  firefly: function (p) {
    ctx.shadowBlur = p.r * 4.5
    drawFirefly(p.r, p)
  },
  lantern: function (p) {
    ctx.shadowBlur = p.r * 2.2
    drawLantern(p.r)
  }
}

function particleSortKey (p) {
  const typeKey = typeof p.type === 'number' ? 'n' + p.type : p.type
  return p.layer + '|' + typeKey
}

export function drawParticles (particles) {
  const sorted = particles.slice().sort(function (a, b) {
    const ka = particleSortKey(a)
    const kb = particleSortKey(b)
    return ka < kb ? -1 : (ka > kb ? 1 : 0)
  })
  for (const p of sorted) {
    const drawer = PARTICLE_DRAWERS[p.type]
    if (!drawer) continue
    applyParticleContext(p)
    drawer(p)
  }
  resetParticleTransform()
}
