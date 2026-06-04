# ❄️ 满屏飘落 — uTools 桌面粒子特效插件

一款唯美治愈的 uTools 桌面粒子飘落插件，让你的屏幕随时上演大雪纷飞、樱花飘落、星光闪烁的浪漫场景。

![logo](public/logo.svg)

## ✨ 功能特性

- **7 种精美粒子图案**
  - ❄️ 雪花 — 经典六角冰晶与圆点簇
  - ⭐ 星星 — 温暖闪烁的五角星
  - 💗 爱心 — 浪漫粉色爱心
  - 🌸 花瓣 — 轻盈飘落的花瓣
  - 🫧 泡泡 — 透明光泽气泡
  - 🍁 枫叶 — 秋日感枫叶
  - 🎲 混合 — 多种粒子随机混合

- **实时参数调节**
  - 密度：从稀稀落落到大雪纷飞（30 ~ 380 片）
  - 风力：无风微风到强风（0 ~ 3 级）
  - 强度预设：小雪 / 中雪 / 大雪一键切换

- **趣味交互**
  - 🖱️ **鼠标推开** — 粒子会感应鼠标位置并温柔避让
  - ✨ **点击绽放** — 在屏幕上点击会爆开一团粒子

- **视觉体验**
  - 三层景深粒子，近大远小，营造立体空间感
  - 发光辉光与闪烁动画
  - 支持系统深色/浅色模式自动适配

## 🖼️ 预览

进入插件后，默认自动开始飘落。点击界面中的「开始飘落」/「停止飘落」按钮随时控制。

## 🚀 部署安装

### 前置要求

- [uTools](https://www.u.tools/) 已安装（Windows / macOS / Linux）
- [Node.js](https://nodejs.org/) ≥ 18

### 本地构建

```bash
# 1. 克隆仓库
git clone <仓库地址>
cd utools-snow-src

# 2. 安装依赖
npm install

# 3. 构建插件
npm run build
```

构建完成后，会在项目根目录生成 `dist/` 文件夹，包含完整的插件文件。

### 开发模式（热更新）

```bash
npm run dev
```

webpack 会监视文件变化并自动重新构建，方便开发调试。

### uTools 中加载

1. 打开 uTools，输入「插件管理」或进入「开发者工具」
2. 选择「新建项目」→「本地导入」
3. 选择构建后的 `dist/` 目录
4. 项目会出现在「我的插件」中，点击即可运行

> 提示：uTools 插件开发详情可参考 [官方文档](https://u.tools/docs/)。

## 📁 项目结构

```
utools-snow-src/
├── public/                 # 静态资源（直接复制到 dist）
│   ├── index.html          # 设置面板入口
│   ├── snow.html           # 飘落窗口页面
│   ├── snow.js             # Canvas 粒子核心动画
│   ├── snow_preload.js     # 飘落窗口 preload
│   ├── plugin.json         # uTools 插件配置
│   └── logo.*              # 插件图标
├── src/                    # React 设置面板源码
│   ├── App.js              # 主界面（密度/风力/图案控制）
│   ├── index.js            # React 入口
│   └── index.less          # 样式
├── bridge/
│   └── preload.js          # 主窗口 preload（暴露 services API）
├── webpack.config.js       # 构建配置
└── package.json
```

## 🛠️ 技术栈

- **设置面板**：React 19 + MUI 7 + Emotion
- **粒子渲染**：原生 Canvas 2D API，无需任何图形库
- **构建工具**：Webpack 5 + Babel 7
- **插件框架**：uTools Plugin API

## 📝 配置说明

`public/plugin.json` 是 uTools 的插件配置文件：

```json
{
  "main": "index.html",
  "logo": "logo.png",
  "preload": "preload.js",
  "features": [
    {
      "code": "snow",
      "explain": "满屏飘落 - 唯美治愈桌面粒子特效",
      "icon": "logo.svg",
      "cmds": ["满屏飘落", "大雪纷飞", "下雪", "xiaxue", "snow"]
    }
  ]
}
```

你可以通过修改 `cmds` 来添加自己喜欢的呼出关键词。

## 🤝 参与贡献

欢迎提交 Issue 和 PR！如果你有任何新点子（比如新增粒子图案、更多交互效果），随时来聊。

## 📄 License

[MIT](LICENSE)

---

> 愿你的桌面四季有雪，心中有光 ❄️
