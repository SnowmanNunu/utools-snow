import { config, PATTERN_PROFILE } from './config.js'
import { ctx, width, height, canvasDpr, screenScale, getSnowGroundChunk, getSizeScale } from './viewport.js'
import { createParticle, particles } from './particle.js'
import { pick, resolvePattern } from './utils.js'

// === 爆发粒子 ===
let burstParticles = []
const burstPool = []

export function addBurst (cx, cy, count) {
  const sizeScale = getSizeScale()
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = (30 + Math.random() * 100) * sizeScale
    const pattern = resolvePattern()
    let p = burstPool.pop()
    if (!p) p = {}
    p.x = cx + Math.cos(angle) * dist * Math.random()
    p.y = cy + Math.sin(angle) * dist * Math.random()
    p.vx = Math.cos(angle) * (1 + Math.random() * 3)
    p.vy = Math.sin(angle) * (1 + Math.random() * 3)
    p.life = 1
    p.decay = 0.008 + Math.random() * 0.02
    p.r = (2 + Math.random() * 4) * sizeScale
    p.opacity = 0.6 + Math.random() * 0.4
    p.color = pick(PATTERN_PROFILE[pattern].colors)
    p.glow = PATTERN_PROFILE[pattern].glow
    burstParticles.push(p)
  }

  for (let i = 0; i < Math.floor(count * 0.4); i++) {
    const layer = Math.floor(Math.random() * 3)
    particles.push(createParticle(
      cx + (Math.random() - 0.5) * 80 * sizeScale,
      cy + (Math.random() - 0.5) * 40 * sizeScale,
      layer
    ))
  }
}

export function drawBursts (deltaSec) {
  if (burstParticles.length === 0) return
  for (let i = burstParticles.length - 1; i >= 0; i--) {
    const p = burstParticles[i]
    p.x += p.vx * 60 * deltaSec
    p.y += p.vy * 60 * deltaSec
    p.life -= p.decay
    if (p.life <= 0) {
      burstPool.push(p)
      burstParticles.splice(i, 1)
      continue
    }
    ctx.globalAlpha = p.life * p.opacity
    ctx.fillStyle = p.color
    ctx.shadowColor = p.glow || 'rgba(255, 255, 255, 0.8)'
    ctx.shadowBlur = p.r * 2
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
    ctx.fill()
  }
}

// === 雨滴特效：水花、涟漪、闪电 ===
let splashes = []
let ripples = []
let lightningAlpha = 0
let nextLightning = 3000 + Math.random() * 5000
let lightningTimer = 0

export function addSplash (x, y, r) {
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

export function addRipple (x, y, r) {
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

export function updateSplashes (deltaSec) {
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

export function updateRipples (deltaSec) {
  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i]
    rp.radius += (rp.maxRadius - rp.radius) * 0.08
    rp.life -= rp.decay
    if (rp.life <= 0) {
      ripples.splice(i, 1)
    }
  }
}

export function drawSplashes () {
  for (const s of splashes) {
    ctx.fillStyle = 'rgba(210, 240, 255, ' + (s.life * 0.7) + ')'
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function drawRipples () {
  const lineScale = getSizeScale()
  for (const rp of ripples) {
    const alpha = rp.life * 0.35
    ctx.strokeStyle = 'rgba(160, 210, 245, ' + alpha + ')'
    ctx.lineWidth = 0.8 * lineScale
    for (let i = 0; i < rp.rings; i++) {
      const ringRadius = rp.radius * (1 - i * 0.28)
      if (ringRadius <= 0) continue
      ctx.beginPath()
      ctx.ellipse(rp.x, rp.y, ringRadius, ringRadius * 0.22, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
  }
}

export function updateLightning (deltaSec) {
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

export function drawLightning () {
  if (lightningAlpha <= 0) return
  ctx.fillStyle = 'rgba(255, 255, 255, ' + lightningAlpha + ')'
  ctx.fillRect(0, 0, width, height)
}

export function updateRainEffects (deltaSec) {
  updateSplashes(deltaSec)
  updateRipples(deltaSec)
}

export function drawRainEffects () {
  drawSplashes()
  drawRipples()
}

// === 积雪效果 ===
let snowGround = []
let snowGroundDirty = true
let snowGroundCanvas = null
let snowGroundCtx = null

function ensureSnowGroundCanvas () {
  if (!snowGroundCanvas) {
    snowGroundCanvas = document.createElement('canvas')
    snowGroundCtx = snowGroundCanvas.getContext('2d')
  }
  if (snowGroundCanvas.width !== Math.floor(width * canvasDpr) || snowGroundCanvas.height !== Math.floor(height * canvasDpr)) {
    snowGroundCanvas.width = Math.floor(width * canvasDpr)
    snowGroundCanvas.height = Math.floor(height * canvasDpr)
    snowGroundCanvas.style.width = width + 'px'
    snowGroundCanvas.style.height = height + 'px'
    snowGroundCtx.setTransform(canvasDpr, 0, 0, canvasDpr, 0, 0)
    snowGroundDirty = true
  }
}

export function initSnowGround () {
  const chunk = getSnowGroundChunk()
  const chunks = Math.ceil(width / chunk) + 1
  snowGround = new Array(chunks).fill(0)
  snowGroundDirty = true
}

export function addSnowToGround (x, amount) {
  if (config.pattern !== 'snow' || !config.snowAccumulation) return
  const chunk = getSnowGroundChunk()
  const center = Math.floor(x / chunk)
  const radius = 2
  let changed = false
  for (let i = center - radius; i <= center + radius; i++) {
    if (i >= 0 && i < snowGround.length) {
      const dist = Math.abs(i - center)
      const falloff = 1 - dist / (radius + 1)
      const before = snowGround[i]
      snowGround[i] = Math.min(snowGround[i] + amount * falloff * 3.5, 90)
      if (snowGround[i] !== before) changed = true
    }
  }
  if (changed) snowGroundDirty = true
}

export function meltSnowGround (mouseState) {
  if (config.pattern !== 'snow' || !config.snowAccumulation || snowGround.length === 0) return
  const chunk = getSnowGroundChunk()
  const mouseIdx = Math.floor(mouseState.x / chunk)
  const clearRadius = 10
  const center = snowGround.length / 2
  let changed = false
  for (let i = 0; i < snowGround.length; i++) {
    let meltRate = 0.012

    // 边缘融化更快
    const distFromCenter = Math.abs(i - center) / center
    meltRate += distFromCenter * 0.018

    // 鼠标划过加速融化/扫出凹槽
    if (mouseState.active) {
      const dist = Math.abs(i - mouseIdx)
      if (dist < clearRadius) {
        meltRate += (clearRadius - dist) * 0.55
      }
    }

    const before = snowGround[i]
    snowGround[i] = Math.max(0, snowGround[i] - meltRate)

    // 凹槽回填：如果当前位置明显低于周围平均，缓慢恢复
    if (!mouseState.active || Math.abs(i - mouseIdx) >= clearRadius) {
      let localSum = 0
      let localCount = 0
      const range = 4
      for (let j = Math.max(0, i - range); j <= Math.min(snowGround.length - 1, i + range); j++) {
        localSum += snowGround[j]
        localCount++
      }
      const localAvg = localSum / localCount
      if (snowGround[i] < localAvg * 0.65 && localAvg > 5) {
        snowGround[i] += (localAvg * 0.85 - snowGround[i]) * 0.035
      }
    }

    if (snowGround[i] !== before) changed = true
  }
  if (changed) snowGroundDirty = true
}

function renderSnowGroundShape (targetCtx, heightFn) {
  targetCtx.save()
  targetCtx.fillStyle = 'rgba(255, 255, 255, 0.98)'
  targetCtx.shadowColor = 'rgba(180, 220, 255, 0.65)'
  targetCtx.shadowBlur = 14
  targetCtx.beginPath()
  targetCtx.moveTo(0, height)
  const chunk = getSnowGroundChunk()
  for (let i = 0; i < snowGround.length; i++) {
    const x = i * chunk
    const h = snowGround[i]
    const prevH = i > 0 ? snowGround[i - 1] : h
    const nextH = i < snowGround.length - 1 ? snowGround[i + 1] : h
    const smoothH = (prevH + h * 2 + nextH) / 4
    targetCtx.lineTo(x, height - heightFn(i, smoothH))
  }
  targetCtx.lineTo(width, height)
  targetCtx.closePath()
  targetCtx.fill()

  // 顶部高光边线
  targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
  targetCtx.lineWidth = 2
  targetCtx.shadowBlur = 0
  targetCtx.beginPath()
  for (let i = 0; i < snowGround.length; i++) {
    const x = i * chunk
    const h = snowGround[i]
    const prevH = i > 0 ? snowGround[i - 1] : h
    const nextH = i < snowGround.length - 1 ? snowGround[i + 1] : h
    const smoothH = (prevH + h * 2 + nextH) / 4
    if (i === 0) targetCtx.moveTo(x, height - heightFn(i, smoothH))
    else targetCtx.lineTo(x, height - heightFn(i, smoothH))
  }
  targetCtx.stroke()
  targetCtx.restore()
}

export function drawSnowGround (timeSec) {
  if (config.pattern !== 'snow' || !config.snowAccumulation || snowGround.length === 0) return
  // 只绘制高度大于 2 的积雪，避免空区域干扰
  let maxH = 0
  for (const h of snowGround) {
    if (h > maxH) maxH = h
  }
  if (maxH < 3) return

  // 风力较大时（>0.3）禁用缓存，实时绘制风吹波浪
  const useCache = config.wind <= 0.3

  function getDrawHeight (i, baseH) {
    if (config.wind <= 0.05) return baseH
    const windWave = Math.sin(i * 0.12 + timeSec * 1.5 + config.wind * 2) * config.wind * 4
    return baseH + windWave
  }

  if (useCache) {
    ensureSnowGroundCanvas()
    if (snowGroundDirty) {
      snowGroundCtx.clearRect(0, 0, width, height)
      renderSnowGroundShape(snowGroundCtx, getDrawHeight)
      snowGroundDirty = false
    }
    ctx.drawImage(snowGroundCanvas, 0, 0, width, height)
  } else {
    renderSnowGroundShape(ctx, getDrawHeight)
  }
}
