# 📝 项目Checkpoint — 满屏飘落

> 最后更新：2026-06-12

---

## 📌 项目概述

**项目名称**：满屏飘落  
**项目类型**：uTools 桌面粒子特效插件 + 独立桌面应用  
**当前版本**：v1.0.1（uTools 审核中）  
**仓库地址**：
- GitHub：https://github.com/SnowmanNunu/utools-snow
- Gitee：https://gitee.com/SnowmanNunu/utools-snow

---

## ✅ 已完成内容

### v1.0.0（已发布）
- [x] 7 种基础粒子图案：雪花、星星、爱心、花瓣、泡泡、枫叶、混合
- [x] 实时密度 / 风力调节，三档强度预设
- [x] uTools 版鼠标交互：鼠标推开 + 点击绽放
- [x] 独立桌面版（Electron）：双击运行，无需 uTools
- [x] 系统深色 / 浅色主题自适应
- [x] GitHub Actions CI 自动三平台打包（Windows/macOS/Linux）

### v1.0.1（已提交，uTools 审核中）
- [x] 新增 4 种粒子图案：音符、红包、蝴蝶、福字
- [x] 重新设计插件 Logo（极光渐变雪花风格，512×512 PNG）
- [x] 修复 uTools 发布时 Logo 尺寸提示（发布目录使用 256×256）
- [x] 更新 README 文档与版本历史
- [x] 独立版版本号统一为 1.0.1
- [x] GitHub Release v1.0.1 已自动生成

---

## 🚀 发布状态

| 平台 | 状态 | 版本 |
|------|------|------|
| uTools 插件市场 | 🟡 审核中 | v1.0.1 |
| GitHub Release | ✅ 已发布 | v1.0.1 |
| Gitee Tag | ✅ 已推送 | v1.0.1 |

### GitHub Release 下载地址

```
https://github.com/SnowmanNunu/utools-snow/releases/tag/v1.0.1
```

独立桌面版安装包：
- Windows：`snow-desktop-1.0.1-x64.exe`
- macOS：`snow-desktop-1.0.1-arm64.dmg`
- Linux：`snow-desktop-1.0.1-x64.AppImage`

---

## 🛠️ 技术栈

- **设置面板**：React 19 + MUI 7 + Emotion
- **粒子渲染**：原生 Canvas 2D API
- **构建工具**：Webpack 5 + Babel 7
- **独立版框架**：Electron 31
- **CI/CD**：GitHub Actions + electron-builder

---

## 📁 项目结构

```
utools-snow-src/
├── public/                 # 静态资源（复制到 dist）
│   ├── index.html          # 设置面板入口
│   ├── snow.html           # 粒子飘落窗口
│   ├── snow.js             # Canvas 粒子核心动画
│   ├── snow_preload.js     # 飘落窗口 preload
│   ├── plugin.json         # uTools 插件配置
│   └── logo.*              # 插件图标
├── src/                    # React 设置面板源码
│   ├── App.js              # 主界面
│   ├── index.js            # React 入口
│   └── index.less          # 样式
├── bridge/
│   └── preload.js          # uTools 版 preload
├── standalone/             # 独立桌面版
│   ├── main.js             # Electron 主进程
│   ├── preload.js          # 模拟 uTools API
│   ├── package.json        # 独立版打包配置
│   └── README.md
├── .github/workflows/
│   └── release.yml         # GitHub Actions 自动发布
├── webpack.config.js
├── README.md
└── package.json
```

---

## 🎯 当前可用粒子图案（11 种）

| 图案 | 说明 |
|------|------|
| ❄️ 雪花 | 经典六角冰晶与圆点簇 |
| ⭐ 星星 | 温暖闪烁的五角星 |
| 💗 爱心 | 浪漫粉色爱心 |
| 🌸 花瓣 | 轻盈飘落的花瓣 |
| 🫧 泡泡 | 透明光泽气泡 |
| 🍁 枫叶 | 秋日感枫叶 |
| 🎵 音符 | 金色八分音符 |
| 🧧 红包 | 红色长方形红包 + 金色「福」字 |
| 🦋 蝴蝶 | 粉紫淡蓝彩色蝴蝶 |
| 📝 福字 | 随机显示 福/吉/喜/财/乐/安 |
| 🎲 混合 | 多种粒子随机混合 |

---

## ⚠️ 已知问题

1. **雨滴 / 金元宝图案已临时下架**
   - 原因：绘制效果不够逼真，用户反馈不像
   - 状态：代码保留在 `public/snow.js` 中，未从 `PATTERNS` 数组移除
   - 后续：需要重新设计更逼真的绘制方案后再上架

2. **独立桌面版暂不支持鼠标交互**
   - 原因：为保证桌面操作不被遮挡，设置了鼠标穿透
   - 后续可考虑：按住某个键临时关闭穿透，或提供「交互模式」开关

3. **独立桌面版体积较大**
   - 原因：内置 Electron 运行时（约 60-70MB 底座）
   - 现状：属于 Electron 应用共性，已开启 maximum 压缩

---

## 📋 后续开发计划

### 短期（v1.1.0）
- [ ] 重新设计并上架雨滴图案（参考 rain-animation.html，带水花/涟漪/闪电）
- [ ] 重新设计并上架金元宝图案
- [ ] 独立版支持托盘菜单直接切换图案

### 中期（v1.2.0）
- [ ] 音效联动：粒子随音乐节奏或白噪音互动
- [ ] 节日主题包：春节、圣诞、情人节一键切换
- [ ] 开机自启支持

### 长期（v2.0.0）
- [ ] 粒子编辑器：用户自定义图案/颜色
- [ ] 社区分享粒子特效
- [ ] 多屏显示器支持

---

## 💡 近期踩坑记录

1. **GitHub Actions 打包失败**
   - 原因：`npm ci` 需要 `package-lock.json`，但 `standalone/package-lock.json` 未提交
   - 解决：改用 `npm install`，并增加 `dist/` / `public/` 复制步骤

2. **macOS 打包图标尺寸不足**
   - 原因：macOS dmg 需要图标至少 512×512
   - 解决：`public/logo.png` 更新为 512×512

3. **uTools 发布提示 Logo 过大**
   - 原因：uTools 建议 Logo 不超过 256×256
   - 解决：uTools 发布目录单独使用 256×256 logo，源码保留 512×512

4. **GitHub Release 文件名中文被过滤**
   - 原因：`productName` 为中文字符，electron-builder 过滤后只剩版本号
   - 解决：在 `standalone/package.json` 中显式设置英文 `artifactName`

---

## 🔗 常用链接

- GitHub Actions：https://github.com/SnowmanNunu/utools-snow/actions
- GitHub Releases：https://github.com/SnowmanNunu/utools-snow/releases
- uTools 开发者后台：等待审核结果

---

## 🎯 下一步行动

1. 等待 uTools v1.0.1 审核结果
2. 根据审核反馈修复问题
3. 继续开发 v1.1.0（重点：雨滴、金元宝重绘）

---

> 愿你的桌面四季有景，心中有光 ❄️
