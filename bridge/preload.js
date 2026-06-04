/**
 * preload.js - 大雪纷飞插件应用预加载脚本
 */
const { ipcRenderer } = require('electron')

let snowWindow = null

function isSnowWindowAlive () {
  return snowWindow !== null &&
    (typeof snowWindow.isDestroyed !== 'function' || !snowWindow.isDestroyed())
}

function sendSnowConfig (config) {
  if (!config || !isSnowWindowAlive()) return
  if (snowWindow.webContents && typeof snowWindow.webContents.send === 'function') {
    snowWindow.webContents.send('snow-config', config)
  }
}

window.services = {
  /**
   * 创建/显示雪景独立窗口
   */
  createSnowWindow: function (config) {
    if (isSnowWindowAlive()) {
      if (typeof snowWindow.focus === 'function') {
        snowWindow.focus()
      }
      sendSnowConfig(config)
      return
    }

    const cursorPoint = utools.getCursorScreenPoint()
    const currentDisplay = utools.getDisplayNearestPoint(cursorPoint)
    const displayBounds = currentDisplay.bounds
    const fullscreenable = utools.isWindows()

    const createdWindow = utools.createBrowserWindow(
      'snow.html',
      {
        show: true,
        x: displayBounds.x,
        y: displayBounds.y,
        width: displayBounds.width,
        height: displayBounds.height,
        backgroundColor: '#00000000',
        thickFrame: false,
        resizable: false,
        fullscreenable: fullscreenable,
        fullscreen: fullscreenable,
        minimizable: false,
        maximizable: false,
        movable: false,
        autoHideMenuBar: true,
        frame: false,
        transparent: true,
        skipTaskbar: true,
        enableLargerThanScreen: true,
        alwaysOnTop: true,
        roundedCorners: false,
        hasShadow: false,
        closable: true,
        webPreferences: {
          preload: 'snow_preload.js'
        }
      },
      function (browserWindow) {
        if (browserWindow) {
          snowWindow = browserWindow
        }

        try {
          if (snowWindow && typeof snowWindow.setAlwaysOnTop === 'function') {
            snowWindow.setAlwaysOnTop(true, 'screen-saver')
          }
        } catch (e) {}

        sendSnowConfig(config)
      }
    )

    if (createdWindow) {
      snowWindow = createdWindow
    }

    if (snowWindow && typeof snowWindow.on === 'function') {
      snowWindow.on('closed', function () {
        snowWindow = null
      })
    }
  },

  /**
   * 更新雪景配置
   */
  updateSnowConfig: function (config) {
    sendSnowConfig(config)
  },

  /**
   * 关闭雪景窗口
   */
  closeSnowWindow: function () {
    if (isSnowWindowAlive() && typeof snowWindow.close === 'function') {
      snowWindow.close()
    }
    snowWindow = null
  },

  /**
   * 检查雪景是否正在运行
   */
  isSnowRunning: function () {
    return isSnowWindowAlive()
  }
}
