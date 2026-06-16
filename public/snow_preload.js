/**
 * 大雪纷飞独立窗口 preload
 * 接收主窗口发送的配置更新
 */
const { ipcRenderer } = require('electron')

// 接收主窗口的配置信息
ipcRenderer.on('snow-config', (event, config) => {
  window.postMessage({ type: 'snow-config', config }, '*')
})

// 监听窗口关闭请求
ipcRenderer.on('close-snow', () => {
  window.close()
})

// 暂停 / 继续动画（不关闭窗口）
ipcRenderer.on('pause-snow', () => {
  if (window.snowControl && window.snowControl.pause) {
    window.snowControl.pause()
  }
})

ipcRenderer.on('resume-snow', () => {
  if (window.snowControl && window.snowControl.resume) {
    window.snowControl.resume()
  }
})
