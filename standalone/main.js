/**
 * 满屏飘落 — 独立桌面版主进程
 * 不依赖 uTools，纯 Electron 运行
 */
const { app, BrowserWindow, ipcMain, screen, Tray, Menu, globalShortcut } = require('electron')
const path = require('path')

let controlWindow = null
let snowWindow = null
let tray = null

const DIST_DIR = path.join(__dirname, 'dist')

const DEFAULT_CONFIG = {
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
  interaction: true
}

let currentConfig = { ...DEFAULT_CONFIG }

const PATTERN_LABELS = {
  snow: '❄️ 雪花',
  star: '⭐ 星星',
  heart: '💗 爱心',
  petal: '🌸 花瓣',
  bubble: '🫧 泡泡',
  maple: '🍁 枫叶',
  note: '🎵 音符',
  packet: '🧧 红包',
  butterfly: '🦋 蝴蝶',
  text: '📝 福字',
  rain: '💧 雨滴',
  gold: '🪙 金元宝',
  firefly: '✨ 萤火虫',
  lantern: '🏮 灯笼',
  dandelion: '🌼 蒲公英'
}

function createControlWindow () {
  if (controlWindow && !controlWindow.isDestroyed()) {
    controlWindow.focus()
    controlWindow.show()
    return
  }

  controlWindow = new BrowserWindow({
    width: 400,
    height: 680,
    resizable: true,
    minWidth: 360,
    minHeight: 600,
    title: '满屏飘落',
    icon: path.join(DIST_DIR, 'logo.png'),
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: false
    }
  })

  controlWindow.loadFile(path.join(DIST_DIR, 'index.html'))

  controlWindow.on('closed', function () {
    controlWindow = null
    closeSnowWindow()
  })
}

function createSnowWindow (config) {
  if (config) {
    currentConfig = { ...currentConfig, ...config }
  }
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
    // 关键修复 1：禁用全屏独占，改用普通窗口铺满屏幕
    fullscreen: false,
    // 关键修复 2：禁止获取焦点，避免抢占键盘输入
    focusable: false,
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
    // 关键修复 3：鼠标穿透到下层桌面，只在有粒子的局部区域响应
    // forward: true 会把事件继续传递给下层窗口
    snowWindow.setIgnoreMouseEvents(true, { forward: true })
    if (currentConfig) {
      snowWindow.webContents.send('snow-config', currentConfig)
    }
  })

  snowWindow.on('closed', function () {
    snowWindow = null
    if (controlWindow && !controlWindow.isDestroyed()) {
      controlWindow.webContents.send('snow-status', false)
    }
  })
}

function closeSnowWindow () {
  if (snowWindow && !snowWindow.isDestroyed()) {
    snowWindow.close()
  }
  snowWindow = null
}

function createTray () {
  tray = new Tray(path.join(DIST_DIR, 'logo.png'))
  updateTrayMenu()
  tray.setToolTip('满屏飘落')
  tray.on('click', function () {
    if (controlWindow && !controlWindow.isDestroyed()) {
      controlWindow.focus()
      controlWindow.show()
    } else {
      createControlWindow()
    }
  })
}

function updateTrayMenu () {
  const running = snowWindow !== null && !snowWindow.isDestroyed()
  const patternMenu = Object.keys(PATTERN_LABELS).map(function (pattern) {
    return {
      label: PATTERN_LABELS[pattern],
      type: 'checkbox',
      checked: currentConfig.pattern === pattern,
      click: function () {
        currentConfig.pattern = pattern
        if (running) {
          snowWindow.webContents.send('snow-config', { pattern: pattern })
        } else {
          createSnowWindow(currentConfig)
        }
        updateTrayMenu()
      }
    }
  })

  const contextMenu = Menu.buildFromTemplate([
    {
      label: running ? '❄️ 正在飘落' : '⏹️ 已停止',
      enabled: false
    },
    { type: 'separator' },
    {
      label: '打开控制面板',
      click: function () {
        createControlWindow()
      }
    },
    {
      label: running ? '停止飘落' : '开始飘落',
      click: function () {
        if (running) {
          closeSnowWindow()
        } else {
          createSnowWindow(currentConfig)
        }
        updateTrayMenu()
      }
    },
    { type: 'separator' },
    {
      label: '🎨 切换图案',
      submenu: patternMenu
    },
    { type: 'separator' },
    {
      label: '退出',
      click: function () {
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
}

// IPC handlers
ipcMain.on('create-snow', function (event, config) {
  if (!snowWindow || snowWindow.isDestroyed()) {
    createSnowWindow(config)
    updateTrayMenu()
  } else {
    snowWindow.webContents.send('snow-config', config)
  }
})

ipcMain.on('update-snow-config', function (event, config) {
  if (config) {
    currentConfig = { ...currentConfig, ...config }
  }
  if (snowWindow && !snowWindow.isDestroyed()) {
    snowWindow.webContents.send('snow-config', currentConfig)
  }
  updateTrayMenu()
})

ipcMain.on('close-snow', function () {
  closeSnowWindow()
  updateTrayMenu()
})

ipcMain.handle('is-snow-running', function () {
  return snowWindow !== null && !snowWindow.isDestroyed()
})

app.whenReady().then(function () {
  createControlWindow()
  createTray()

  // 全局快捷键 Ctrl+Shift+S：显示/隐藏控制面板
  globalShortcut.register('CommandOrControl+Shift+S', function () {
    if (controlWindow && !controlWindow.isDestroyed()) {
      if (controlWindow.isVisible()) {
        controlWindow.hide()
      } else {
        controlWindow.show()
        controlWindow.focus()
      }
    }
  })

  app.on('activate', function () {
    if (controlWindow === null) {
      createControlWindow()
    }
  })
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', function () {
  // 控制面板关闭后自动退出整个应用
  app.quit()
})
