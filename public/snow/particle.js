import { config, PATTERN_PROFILE } from './config.js'
import { width, height, screenScale, getSizeScale } from './viewport.js'
import { pick, resolvePattern, particlePattern } from './utils.js'

export let particles = []

function makeClusterDots (baseSize) {
  return Array.from({ length: 3 + Math.floor(Math.random() * 4) }, function () {
    return {
      x: (Math.random() - 0.5) * baseSize * 2,
      y: (Math.random() - 0.5) * baseSize * 2,
      r: 0.22 + Math.random() * 0.18
    }
  })
}

export function createParticle (x, y, layer) {
  const pattern = resolvePattern()
  const profile = PATTERN_PROFILE[pattern]
  const sizeScale = getSizeScale()
  const baseSize = Math.max(0.5, config.minSize + Math.random() * (config.maxSize - config.minSize))
  const layerScale = 0.4 + layer * 0.4
  const speedScale = 0.5 + layer * 0.35
  const opacityScale = 0.5 + layer * 0.35

  return {
    x: x !== undefined ? x : Math.random() * width,
    y: y !== undefined ? y : -Math.random() * height - 20,
    r: Math.max(0.3, baseSize * layerScale * profile.size * sizeScale),
    speed: Math.max(0.05, (config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed)) * speedScale * profile.speed * sizeScale),
    swaySpeed: 0.3 + Math.random() * 0.7,
    swayOffset: Math.random() * Math.PI * 2,
    swayAmount: config.swayAmount * (0.5 + Math.random()) * profile.sway,
    opacity: Math.max(0.05, Math.min(1, (config.opacityMin + Math.random() * (config.opacityMax - config.opacityMin)) * profile.opacity)),
    opacityScale: Math.max(0.1, Math.min(1, opacityScale)),
    layer: layer,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * profile.rotation,
    type: pattern === 'snow' ? Math.floor(Math.random() * 3) : pattern,
    color: pick(profile.colors),
    glow: profile.glow,
    twinkle: 0.82 + Math.random() * 0.22,
    stretch: 0.75 + Math.random() * 0.7,
    detail: Math.random(),
    clusterDots: makeClusterDots(baseSize * sizeScale),
    text: pattern === 'text' ? pick(['福', '吉', '喜', '财', '乐', '安']) : undefined
  }
}

export function initParticles () {
  particles = []
  const scaledDensity = Math.max(30, Math.floor(config.density * screenScale))
  const layers = [
    { count: Math.floor(scaledDensity * 0.3), layer: 0 },
    { count: Math.floor(scaledDensity * 0.4), layer: 1 },
    { count: Math.floor(scaledDensity * 0.3), layer: 2 }
  ]
  for (const l of layers) {
    for (let i = 0; i < l.count; i++) {
      particles.push(createParticle(undefined, Math.random() * height, l.layer))
    }
  }
}

export function updateParticle (particle, windForce, deltaSec, timeSec, audioBoost, mouseState) {
  const speedMul = 1 + (audioBoost || 0) * 0.6
  const swayMul = 1 + (audioBoost || 0) * 1.2
  particle.y += particle.speed * 60 * deltaSec * speedMul
  const sway = Math.sin(timeSec * particle.swaySpeed + particle.swayOffset)
  let effectiveWind = windForce

  if (mouseState.active && config.interaction) {
    const dx = particle.x - mouseState.x
    const dy = particle.y - mouseState.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const influenceRadius = 250 * screenScale
    if (dist < influenceRadius) {
      const strength = 1 - dist / influenceRadius
      effectiveWind += (dx / Math.max(dist, 1)) * strength * 2
      particle.y += (dy / Math.max(dist, 1)) * strength * 20 * deltaSec
    }
  }

  // 鼠标引力漩涡：按住左键吸引粒子旋转
  if (mouseState.down && config.mouseVortex && mouseState.downButton === 0) {
    const dx = mouseState.x - particle.x
    const dy = mouseState.y - particle.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const vortexRadius = 320 * screenScale
    const minOrbitRadius = 42 * screenScale
    if (dist < vortexRadius && dist > minOrbitRadius * 0.5) {
      const t = dist / vortexRadius
      const strength = Math.max(0, 1 - t)
      const nx = dx / dist
      const ny = dy / dist

      // 近距离以环绕为主，避免粒子全部叠到鼠标中心
      const orbitFactor = dist < minOrbitRadius ? 1 : 0.55 + 0.45 * (dist - minOrbitRadius) / (vortexRadius - minOrbitRadius)
      const attractFactor = dist < minOrbitRadius ? 0.08 : 0.55 * strength

      // 向心力
      particle.x += nx * attractFactor * 100 * deltaSec
      particle.y += ny * attractFactor * 100 * deltaSec
      // 切向旋转力
      particle.x += -ny * orbitFactor * 85 * deltaSec
      particle.y += nx * orbitFactor * 85 * deltaSec
    }
  }

  particle.x += sway * particle.swayAmount * swayMul * 30 * deltaSec + effectiveWind * 40 * deltaSec
  particle.rotation += particle.rotationSpeed * deltaSec * (1 + (audioBoost || 0) * 0.5)
  particle.twinkle = 0.82 + Math.sin(timeSec * 1.5 + particle.swayOffset) * 0.08 + particle.detail * 0.08

  if (particle.x > width + 70 * screenScale) particle.x = -70 * screenScale
  if (particle.x < -70 * screenScale) particle.x = width + 70 * screenScale
}

export function maintainDensity () {
  const targetCount = Math.max(30, Math.floor(config.density * screenScale))
  if (particles.length < targetCount) {
    const toAdd = Math.min(targetCount - particles.length, 4)
    for (let i = 0; i < toAdd; i++) {
      particles.push(createParticle(undefined, -Math.random() * 20, Math.floor(Math.random() * 3)))
    }
  } else if (particles.length > targetCount + 10) {
    const trimIndex = Math.max(0, Math.min(targetCount, particles.length))
    particles.splice(trimIndex)
  }
}

export function replaceParticle (index, x, y) {
  if (index >= 0 && index < particles.length) {
    Object.assign(particles[index], createParticle(x, y, particles[index].layer))
  }
}

export function trimParticles (targetCount) {
  const trimIndex = Math.max(0, Math.min(targetCount, particles.length))
  particles.splice(trimIndex)
}
