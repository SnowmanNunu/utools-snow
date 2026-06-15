import { config } from './config.js'

let audioContext = null
let audioAnalyser = null
let audioSource = null
let audioDataArray = null
let audioLevel = 0
export let audioLevelSmooth = 0

export function initAudioReactive () {
  if (audioContext || !navigator.mediaDevices) return
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    audioAnalyser = audioContext.createAnalyser()
    audioAnalyser.fftSize = 256
    audioSource = audioContext.createMediaStreamSource(stream)
    audioSource.connect(audioAnalyser)
    audioDataArray = new Uint8Array(audioAnalyser.frequencyBinCount)
  }).catch(function (err) {
    config.audioReactive = false
    console.warn('无法获取麦克风权限，音效联动不可用:', err)
  })
}

export function stopAudioReactive () {
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

export function updateAudioLevel () {
  if (!audioAnalyser || !audioDataArray || audioAnalyser.frequencyBinCount === 0) {
    audioLevel = 0
    audioLevelSmooth = 0
    return
  }
  try {
    audioAnalyser.getByteFrequencyData(audioDataArray)
  } catch (e) {
    audioLevel = 0
    audioLevelSmooth = 0
    return
  }
  let sum = 0
  for (let i = 0; i < audioDataArray.length; i++) {
    sum += audioDataArray[i]
  }
  audioLevel = (sum / audioDataArray.length) / 255
  audioLevelSmooth = audioLevelSmooth * 0.85 + audioLevel * 0.15
}
