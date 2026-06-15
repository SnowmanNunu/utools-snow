import { config } from './config.js'
import { canvas, width, height, getSizeScale } from './viewport.js'
import { addBurst } from './effects.js'
import { createParticle, particles } from './particle.js'

export const mouseState = {
  x: -1000,
  y: -1000,
  active: false,
  down: false,
  downButton: 0
}

let mouseTimer = null

export function setupInputListeners () {
  canvas.addEventListener('mousemove', function (e) {
    mouseState.x = e.clientX
    mouseState.y = e.clientY
    mouseState.active = true
    clearTimeout(mouseTimer)
    mouseTimer = setTimeout(function () {
      mouseState.active = false
    }, 2000)
  })

  canvas.addEventListener('mousedown', function (e) {
    mouseState.down = true
    mouseState.downButton = e.button
  })

  canvas.addEventListener('mouseup', function () {
    mouseState.down = false
  })

  canvas.addEventListener('mouseleave', function () {
    mouseState.down = false
    mouseState.active = false
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
}

export function triggerKeyFeedback () {
  if (!config.keyFeedback) return
  const sizeScale = getSizeScale()
  const x = Math.random() * width
  const y = height - 10 - Math.random() * 40
  addBurst(x, y, 5)
  for (let i = 0; i < 3; i++) {
    particles.push(createParticle(x + (Math.random() - 0.5) * 60 * sizeScale, y - Math.random() * 30 * sizeScale, Math.floor(Math.random() * 3)))
  }
}
