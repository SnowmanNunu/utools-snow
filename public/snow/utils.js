import { PATTERNS, PATTERN_PROFILE, config } from './config.js'

export function pick (list) {
  return list[Math.floor(Math.random() * list.length)]
}

export function resolvePattern () {
  return config.pattern === 'mix'
    ? pick(PATTERNS)
    : (PATTERN_PROFILE[config.pattern] ? config.pattern : 'snow')
}

export function particlePattern (p) {
  // snow 粒子内部用 0/1/2 表示三种雪花形态
  if (p.type === 0 || p.type === 1 || p.type === 2) return 'snow'
  return p.type
}

export function updateScreenScale (width, height) {
  const area = width * height
  const baseArea = 1920 * 1080
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  // 面积越大、DPR 越高，粒子密度/大小/速度适度提升
  return Math.max(0.8, Math.min(1.5, Math.sqrt(area / baseArea) * (0.85 + dpr * 0.15)))
}
