import { config } from './config.js'
import { updateScreenScale as updateScale } from './utils.js'

export const canvas = document.getElementById('snowCanvas')
export const ctx = canvas.getContext('2d')

export let width = 0
export let height = 0
export let screenScale = 1
export let canvasDpr = 1

let snowGroundChunk = 6

export function getSnowGroundChunk () {
  return snowGroundChunk
}

export function updateScreenScale () {
  screenScale = updateScale(width, height)
}

export function getSizeScale () {
  return Math.min(Math.max(Math.sqrt(screenScale), 0.85), 1.35)
}

export function resize (initSnowGroundCallback) {
  width = window.innerWidth
  height = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvasDpr = dpr
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  updateScreenScale()
  snowGroundChunk = 6 * Math.min(Math.max(screenScale, 0.7), 1.5)
  if (initSnowGroundCallback) initSnowGroundCallback()
}
