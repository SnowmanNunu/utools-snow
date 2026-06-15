import { config, THEMES, lerpConfigValues, patternTransitionFrames, setPatternTransitionFrames, transitionTargetPattern, setTransitionTarget, targetDensity, setTargetDensity, targetWind, setTargetWind, targetOpacityMin, setTargetOpacityMin, targetOpacityMax, setTargetOpacityMax } from './config.js'
import { canvas, ctx, width, height, resize, screenScale } from './viewport.js'
import { initParticles, updateParticle, maintainDensity, particles, replaceParticle, trimParticles } from './particle.js'
import { drawParticles } from './drawers.js'
import { addBurst, drawBursts, updateLightning, drawLightning, updateRainEffects, drawRainEffects, meltSnowGround, drawSnowGround, addSplash, addRipple, addSnowToGround } from './effects.js'
import { initAudioReactive, stopAudioReactive, updateAudioLevel, audioLevelSmooth } from './audio.js'
import { setupInputListeners, triggerKeyFeedback, mouseState } from './input.js'
import { particlePattern } from './utils.js'

let animId = null
let lastTime = 0

function onResize () {
  resize(initSnowGround)
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

  // 参数平滑插值（主题切换时的密度/风力/透明度渐变）
  lerpConfigValues(deltaSec)

  // 更新阶段：先更新所有粒子状态
  for (const particle of particles) {
    updateParticle(particle, windForce, deltaSec, timeSec, audioBoost, mouseState)
  }

  // 处理落底粒子（水花、积雪、重置）
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i]
    if (particle.y > height + 40) {
      // 雨滴碰底产生水花和涟漪
      if (particle.type === 'rain' && Math.random() < 0.28) {
        addSplash(particle.x, height, particle.r)
        addRipple(particle.x, height, particle.r)
      }
      // 雪花模式积雪
      if (particle.type === 'snow' || particle.type === 0 || particle.type === 1 || particle.type === 2) {
        addSnowToGround(particle.x, particle.r * 0.35)
      }
      replaceParticle(i, Math.random() * width, -Math.random() * height * 0.55)
    }
  }

  // 绘制阶段：按 (layer, type) 排序后批量绘制
  drawParticles(particles)

  // 雨滴碰底水花和涟漪
  if (config.pattern === 'rain') {
    updateRainEffects(deltaSec)
    drawRainEffects()
  }

  // 积雪融化与绘制
  meltSnowGround(mouseState)
  drawSnowGround(timeSec)

  // 图案切换平滑过渡：逐步替换旧粒子为新图案
  if (patternTransitionFrames > 0) {
    setPatternTransitionFrames(patternTransitionFrames - 1)
    const target = transitionTargetPattern
    const oldParticles = particles.map(function (p, i) { return { p: p, i: i } })
      .filter(function (item) { return particlePattern(item.p) !== target })
    if (oldParticles.length > 0) {
      const remainingFrames = Math.max(1, patternTransitionFrames)
      const replaceCount = Math.max(1, Math.ceil(oldParticles.length / remainingFrames))
      for (let i = 0; i < Math.min(replaceCount, oldParticles.length); i++) {
        const pickIdx = Math.floor(Math.random() * oldParticles.length)
        const idx = oldParticles[pickIdx].i
        oldParticles.splice(pickIdx, 1)
        replaceParticle(idx, Math.random() * width, -Math.random() * height * 0.55)
      }
    }
  }

  // 兜底清理：若过渡已结束但仍有旧图案粒子，立即全部替换
  if (patternTransitionFrames === 0 && transitionTargetPattern) {
    const target = transitionTargetPattern
    let hasOld = false
    for (let i = 0; i < particles.length; i++) {
      if (particlePattern(particles[i]) !== target) {
        hasOld = true
        replaceParticle(i, Math.random() * width, -Math.random() * height * 0.55)
      }
    }
    if (!hasOld) setTransitionTarget(null)
  }

  maintainDensity()
}

function handleConfigMessage (newConfig) {
  const patternChanged = newConfig.pattern !== undefined && newConfig.pattern !== config.pattern
  const themeChanged = newConfig.theme !== undefined
  const sizeChanged = newConfig.minSize !== undefined || newConfig.maxSize !== undefined
  const isTransition = newConfig.transition === true

  // 可插值参数：transition 模式只改目标值，否则直接到位
  if (newConfig.density !== undefined) {
    if (isTransition) setTargetDensity(newConfig.density)
    else { config.density = newConfig.density; setTargetDensity(newConfig.density) }
  }
  if (newConfig.wind !== undefined) {
    if (isTransition) setTargetWind(newConfig.wind)
    else { config.wind = newConfig.wind; setTargetWind(newConfig.wind) }
  }
  if (newConfig.opacityMin !== undefined) {
    if (isTransition) setTargetOpacityMin(newConfig.opacityMin)
    else { config.opacityMin = newConfig.opacityMin; setTargetOpacityMin(newConfig.opacityMin) }
  }
  if (newConfig.opacityMax !== undefined) {
    if (isTransition) setTargetOpacityMax(newConfig.opacityMax)
    else { config.opacityMax = newConfig.opacityMax; setTargetOpacityMax(newConfig.opacityMax) }
  }

  // 移除已处理的字段，避免 Object.assign 覆盖
  const cleanConfig = { ...newConfig }
  delete cleanConfig.transition
  delete cleanConfig.density
  delete cleanConfig.wind
  delete cleanConfig.opacityMin
  delete cleanConfig.opacityMax
  Object.assign(config, cleanConfig)

  // 音效联动开关
  if (newConfig.audioReactive !== undefined) {
    if (config.audioReactive) {
      initAudioReactive()
    } else {
      stopAudioReactive()
    }
  }

  // 节日主题包：设置目标值，让 lerp 完成平滑过渡
  if (newConfig.theme !== undefined && THEMES[newConfig.theme]) {
    const theme = THEMES[newConfig.theme]
    config.pattern = theme.pattern
    setTargetDensity(theme.density)
    setTargetWind(theme.wind)
    setTargetOpacityMin(theme.opacityMin)
    setTargetOpacityMax(theme.opacityMax)
  } else if (newConfig.theme === null) {
    // 取消主题，保留用户当前其他配置
  }

  // 图案切换平滑过渡：不立即刷新，而是逐步替换
  if (patternChanged && !themeChanged && !sizeChanged) {
    setPatternTransitionFrames(55)
    setTransitionTarget(config.pattern)
  }

  if (themeChanged || sizeChanged) {
    initParticles()
    setPatternTransitionFrames(0)
    setTransitionTarget(null)
  } else if (newConfig.density !== undefined && particles.length > Math.floor(config.density * screenScale)) {
    trimParticles(Math.floor(config.density * screenScale))
  }
}

function setupMessageHandler () {
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'key-feedback') {
      triggerKeyFeedback()
      return
    }
    if (!event.data || event.data.type !== 'snow-config') return
    const newConfig = event.data.config
    if (!newConfig) return
    handleConfigMessage(newConfig)
  })
}

export function start () {
  resize(initSnowGround)
  setupInputListeners()
  setupMessageHandler()
  initParticles()
  canvas.focus()
  lastTime = 0
  if (animId) cancelAnimationFrame(animId)
  animId = requestAnimationFrame(animate)
  window.addEventListener('resize', onResize)
}

export function stop () {
  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }
  window.removeEventListener('resize', onResize)
}

export function setConfig (cfg) {
  const shouldRefresh = cfg && (cfg.pattern !== undefined || cfg.minSize !== undefined || cfg.maxSize !== undefined)
  Object.assign(config, cfg)
  if (shouldRefresh) {
    initParticles()
    setPatternTransitionFrames(0)
    setTransitionTarget(null)
  }
}

window.snowControl = {
  start: start,
  stop: stop,
  setConfig: setConfig
}
