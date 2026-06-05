# ❄️ 满屏飘落 — 独立桌面版

不依赖 uTools，直接作为 Electron 桌面应用运行，保留全部功能。

## 🚀 快速开始

### 1. 确保源码已构建

在**项目根目录**执行：

```bash
cd ..
npm install
npm run build
```

构建完成后会生成 `dist/` 目录。

### 2. 安装 Electron

```bash
cd standalone
npm install
```

如果网络慢，可使用淘宝镜像：

```bash
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
npm install
```

### 3. 启动应用

```bash
npm start
```

运行后会弹出**控制面板窗口**，点击「开始飘落」即可在桌面开启全屏粒子特效。

---

## 📁 文件说明

| 文件 | 作用 |
|------|------|
| `main.js` | Electron 主进程，管理控制面板 + 下雪窗口 |
| `preload.js` | 控制面板 preload，模拟 uTools API |
| `package.json` | 独立版依赖与打包配置 |

---

## 📦 打包成可执行文件（可选）

```bash
npm run build
```

打包完成后在 `release/` 目录生成：
- Windows: `满屏飘落.exe`（便携版）
- macOS: `满屏飘落.dmg`
- Linux: `满屏飘落.AppImage`

---

## 🖥️ 与 uTools 版的区别

| 功能 | uTools 版 | 独立桌面版 |
|------|-----------|-----------|
| 呼出方式 | uTools 搜索关键词 | 双击运行程序 |
| 设置面板 | 嵌入 uTools 窗口 | 独立控制面板窗口 |
| 下雪窗口 | 同 uTools 版 | 全屏置顶透明窗口 |
| 鼠标交互 | ✅ | ✅ |
| 图案/密度/风力调节 | ✅ | ✅ |
| 系统主题适配 | ✅ | ✅ |

---

## ⚠️ 注意事项

- 控制面板关闭时，下雪窗口会自动关闭
- 下雪窗口为**全屏置顶透明窗口**，不会拦截你操作背后的软件（但鼠标事件会透传给粒子）
- 如需在其他显示器上运行，可自行修改 `main.js` 中的 `screen.getPrimaryDisplay()`
