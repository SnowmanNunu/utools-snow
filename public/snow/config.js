export const PATTERNS = ['snow', 'star', 'heart', 'petal', 'bubble', 'maple', 'note', 'packet', 'butterfly', 'text', 'rain', 'pumpkin', 'firefly', 'lantern', 'dandelion']

export const PATTERN_PROFILE = {
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
  pumpkin: {
    colors: ['#ff7f00', '#ff9a3c', '#e65100'],
    glow: 'rgba(255, 127, 0, 0.65)',
    speed: 0.68,
    size: 1.35,
    opacity: 0.92,
    sway: 1.15,
    rotation: 0.4
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

export const THEMES = {
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
  },
  midAutumn: {
    label: '中秋',
    pattern: 'star',
    density: 140,
    wind: 0.25,
    opacityMin: 0.5,
    opacityMax: 0.95
  },
  halloween: {
    label: '万圣节',
    pattern: 'pumpkin',
    density: 160,
    wind: 0.6,
    opacityMin: 0.45,
    opacityMax: 0.9
  },
  newYear: {
    label: '元旦',
    pattern: 'packet',
    density: 170,
    wind: 0.5,
    opacityMin: 0.5,
    opacityMax: 1
  }
}

export const config = {
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
  audioReactive: false,
  snowAccumulation: true,
  mouseVortex: true,
  keyFeedback: true
}

// 可插值参数的目标值（用于主题切换平滑过渡）
export let targetDensity = config.density
export let targetWind = config.wind
export let targetOpacityMin = config.opacityMin
export let targetOpacityMax = config.opacityMax

export let patternTransitionFrames = 0
export let transitionTargetPattern = null

export function setTransitionTarget (pattern) {
  transitionTargetPattern = pattern
}

export function setPatternTransitionFrames (frames) {
  patternTransitionFrames = frames
}

export function setTargetDensity (value) {
  targetDensity = value
}

export function setTargetWind (value) {
  targetWind = value
}

export function setTargetOpacityMin (value) {
  targetOpacityMin = value
}

export function setTargetOpacityMax (value) {
  targetOpacityMax = value
}

export function lerpConfigValues (deltaSec) {
  const speed = Math.min(1, 6 * deltaSec)
  if (Math.abs(targetDensity - config.density) > 0.5) {
    config.density += (targetDensity - config.density) * speed
  } else {
    config.density = targetDensity
  }
  if (Math.abs(targetWind - config.wind) > 0.01) {
    config.wind += (targetWind - config.wind) * speed
  } else {
    config.wind = targetWind
  }
  if (Math.abs(targetOpacityMin - config.opacityMin) > 0.005) {
    config.opacityMin += (targetOpacityMin - config.opacityMin) * speed
  } else {
    config.opacityMin = targetOpacityMin
  }
  if (Math.abs(targetOpacityMax - config.opacityMax) > 0.005) {
    config.opacityMax += (targetOpacityMax - config.opacityMax) * speed
  } else {
    config.opacityMax = targetOpacityMax
  }
}
