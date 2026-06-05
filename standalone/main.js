/**
 * 满屏飘落 — 独立桌面版主进程
 * 不依赖 uTools，纯 Electron 运行
 */
const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')

let controlWindow = null
let snowWindow = null

const DIST_DIR = path.join(__dirname, 'dist')

function createControlWindow () {
  controlWindow = new BrowserWindow({
    width: 400,
    height: 680,
    resizable: true,
    minWidth: 360,
    minHeight: 600,
    title: '满屏飘落',
    icon: path.join(DIST_DIR, 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: false
    }
  })

  controlWindow.loadFile(path.join(DIST_DIR, 'index.html'))

  controlWindow.on('closed', function () {
    controlWindow = null
    if (snowWindow && !snowWindow.isDestroyed()) {
      snowWindow.close()
    }
  })
}

function createSnowWindow (config) {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { x, y, width, height } = primaryDisplay.bounds

  snowWindow = new BrowserWindow({
    x: x,
    y: y,
    width: width,
    height: height,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    fullscreen: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    hasShadow: false,
    roundedCorners: false,
    webPreferences: {
      preload: path.join(DIST_DIR, 'snow_preload.js'),
      contextIsolation: false,
      nodeIntegration: false
    }
  })

  snowWindow.loadFile(path.join(DIST_DIR, 'snow.html'))

  snowWindow.once('ready-to-show', function () {
    snowWindow.show()
    snowWindow.setAlwaysOnTop(true, 'screen-saver')
    if (config) {
      snowWindow.webContents.send('snow-config', config)
    }
  })

  snowWindow.on('closed', function () {
    snowWindow = null
    if (controlWindow && !controlWindow.isDestroyed()) {
      controlWindow.webContents.send('snow-status', false)
    }
  })
}

// IPC: 创建/显示下雪窗口
ipcMain.on('create-snow', function (event, config) {
  if (!snowWindow || snowWindow.isDestroyed()) {
    createSnowWindow(config)
  } else {
    snowWindow.webContents.send('snow-config', config)
    snowWindow.focus()
  }
})

// IPC: 更新配置
ipcMain.on('update-snow-config', function (event, config) {
  if (snowWindow && !snowWindow.isDestroyed()) {
    snowWindow.webContents.send('snow-config', config)
  }
})

// IPC: 关闭下雪窗口
ipcMain.on('close-snow', function () {
  if (snowWindow && !snowWindow.isDestroyed()) {
    snowWindow.close()
  }
  snowWindow = null
})

// IPC: 查询运行状态
ipcMain.handle('is-snow-running', function () {
  return snowWindow !== null && !snowWindow.isDestroyed()
})

app.whenReady().then(function () {
  createControlWindow()

  app.on('activate', function () {
    if (controlWindow === null) {
      createControlWindow()
    }
  })
})

app.on('window-all-closed', function () {
  app.quit()
})
