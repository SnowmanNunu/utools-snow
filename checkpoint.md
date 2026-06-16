# 📝 项目Checkpoint — 满屏飘落

> 最后更新：2026-06-16

---

## 📌 项目概述

**项目名称**：满屏飘落  
**项目类型**：uTools 桌面粒子特效插件 + 独立桌面应用  
**当前版本**：v1.3.0（UI 已完成，功能开发中）  
**仓库地址**：
- GitHub：https://github.com/SnowmanNunu/utools-snow
- Gitee：https://gitee.com/SnowmanNunu/utools-snow

---

## ✅ 已发布 / 已打标签版本

### v1.0.0（已发布）
- [x] 7 种基础粒子图案：雪花、星星、爱心、花瓣、泡泡、枫叶、混合
- [x] 实时密度 / 风力调节，三档强度预设
- [x] uTools 版鼠标交互：鼠标推开 + 点击绽放
- [x] 独立桌面版（Electron）：双击运行，无需 uTools
- [x] 系统深色 / 浅色主题自适应
- [x] GitHub Actions CI 自动三平台打包

### v1.0.1（已撤回）
- [x] 新增 4 种粒子图案：音符、红包、蝴蝶、福字
- [x] 重新设计插件 Logo（极光渐变雪花风格，512×512 PNG）
- [x] 修复 uTools 发布时 Logo 尺寸提示
- [x] 更新 README 文档与版本历史

### v1.1.0（已发布）
- [x] 新增 5 种粒子图案：雨滴、金元宝、萤火虫、灯笼、蒲公英
- [x] 雨滴重绘为细长水滴，新增落地水花与涟漪效果
- [x] 金元宝采用中国传统元宝造型
- [x] 移除「混合」图案
- [x] 独立桌面版托盘菜单支持直接切换粒子图案

### v1.2.0（已发布）
- [x] 重新设计控制面板 UI，卡片式布局
- [x] 新增积雪效果：落底堆积，鼠标划过扫开/加速融化
- [x] 新增鼠标漩涡：按住左键吸引粒子形成漩涡
- [x] 精简交互开关为核心 4 个
- [x] 节日主题包：春节、圣诞、情人节一键切换

### v1.2.1（已打标签，暂不发布）
- [x] 高分屏/大屏适配：根据 DPR 和分辨率自动调整密度与大小
- [x] 图案切换平滑过渡：旧粒子确定性替换 + 随机抽取 + 兜底清理
- [x] 主题切换参数插值动画（密度/风力/透明度渐变）
- [x] 积雪更真实：边缘融化快、鼠标凹槽回填、风吹波浪
- [x] 鼠标漩涡手感优化：距离影响力度、避免粒子完全重叠
- [x] 爆发粒子对象池与积雪 offscreen 缓存性能优化
- [x] 动画循环优化：分离 update/draw，按 (layer, type) 排序，用 setTransform 替代 save/restore
- [x] 代码健壮性：麦克风权限拒绝自动降级、统一 sizeScale 工具函数、边界值保护

### v1.2.2（已打标签，暂不发布）
- [x] 模块化 `snow.js`：拆分为 particle / drawers / effects / audio
- [x] 配置集中化：颜色、速度、大小统一配置表

### v1.3.0（开发中）
- [x] UI 重设计：单页沉浸式控制面板，侧边栏移除，图案/主题/环境/交互一屏操作
- [x] 选中状态强化：图案卡片蓝色边框 + 阴影 + 对勾，主题卡片高亮
- [x] Hover 反馈与玻璃拟态卡片
- [x] 首次使用引导：3 步引导浮层，localStorage 记忆完成状态
- [x] 自定义 PatternIcon：图标更接近实际飘落粒子
- [x] 隐藏滚动条，整体压缩至一屏内
- [x] 修复 `snow/main.js` 缺失 `initSnowGround` 导入导致粒子不飘落的 bug
- [x] 新增节日主题：中秋、万圣节、元旦

---

## 🚀 发布状态

| 平台 | 状态 | 版本 |
|------|------|------|
| uTools 插件市场 | ✅ 已发布 v1.2.0，v1.2.1/v1.2.2 暂不发布 | v1.2.0 |
| GitHub Release | ✅ 已发布 v1.2.0，v1.2.1/v1.2.2 已打标签未发 Release | v1.2.2 |
| Gitee Tag | ✅ 已推送 v1.2.0/v1.2.1/v1.2.2 | v1.2.2 |

独立桌面版安装包（v1.2.0）：
- Windows：`snow-desktop-1.2.0-x64.exe`
- macOS：`snow-desktop-1.2.0-arm64.dmg`
- Linux：`snow-desktop-1.2.0-x64.AppImage`

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
├── public/                 # 静态资源
│   ├── index.html          # 设置面板入口
│   ├── snow.html           # 粒子飘落窗口
│   ├── snow/               # 粒子核心（已模块化）
│   ├── plugin.json         # uTools 插件配置
│   └── logo.*              # 插件图标
├── src/                    # React 设置面板源码
│   ├── App.js              # 主界面
│   ├── index.js            # React 入口
│   ├── index.less          # 样式
│   └── components/         # 面板组件
├── bridge/                 # uTools 版 preload
├── standalone/             # 独立桌面版
│   ├── main.js             # Electron 主进程
│   ├── preload.js          # 模拟 uTools API
│   └── package.json        # 独立版打包配置
├── .github/workflows/
│   └── release.yml         # GitHub Actions 自动发布
├── webpack.config.js
├── README.md
└── package.json
```

---

## 🎯 当前可用粒子图案（15 种）

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
| 💧 雨滴 | 逼真雨滴下落，触地溅起水花与涟漪，偶现闪电 |
| 🎃 南瓜 | 圆润橙色南瓜，万圣节氛围 |
| ✨ 萤火虫 | 黄绿色发光小虫，带尾迹缓缓飘飞 |
| 🏮 灯笼 | 中国传统红灯笼，喜庆节日氛围 |
| 🌼 蒲公英 | 白色绒球，放射状绒毛轻盈飘飞 |

---

## ⚠️ 已知问题

1. **独立桌面版暂不支持鼠标交互**
   - 原因：为保证桌面操作不被遮挡，设置了鼠标穿透
   - 后续方案：按住某个键临时关闭穿透，或提供「交互模式」开关

2. **独立桌面版体积较大**
   - 原因：内置 Electron 运行时（约 60-70MB 底座）
   - 现状：属于 Electron 应用共性，已开启 maximum 压缩

---

## 📋 后续开发计划

### v1.3.0（当前迭代）
- [x] 更多节日主题：中秋（star）、万圣节（pumpkin）、元旦（packet）
- [x] 独立版托盘菜单增强：暂停/继续、密度预设、主题切换
- [x] 控制面板窗口位置记忆

### v1.4.0（近期）
- [ ] 独立桌面版临时鼠标交互：按住指定键（如 Ctrl / Shift）关闭鼠标穿透

### v2.0.0（长期）
- [ ] 粒子图案自定义：支持用户上传图片或输入文字作为粒子
- [ ] 粒子编辑器：可视化编辑粒子图案、颜色、大小、速度等
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
   - 解决：源码保留 512×512 的 `public/logo.png` 用于桌面版打包；新增 `public/logo-256.png`，并通过 `npm run build:utools` 自动替换 `dist/logo.png`

4. **GitHub Release 文件名中文被过滤**
   - 原因：`productName` 为中文字符，electron-builder 过滤后只剩版本号
   - 解决：在 `standalone/package.json` 中显式设置英文 `artifactName`

5. **`snow/main.js` 缺失 `initSnowGround` 导入**
   - 现象：模块化后粒子不飘落
   - 解决：补全 `initSnowGround` 导入与初始化调用

---

## 🔗 常用链接

- GitHub Actions：https://github.com/SnowmanNunu/utools-snow/actions
- GitHub Releases：https://github.com/SnowmanNunu/utools-snow/releases
- uTools 开发者后台：等待审核结果

---

## 🎯 下一步行动

1. v1.3.0 UI 已完成，继续开发节日主题、粒子自定义、独立版托盘增强等功能
2. v1.3.0 功能完成后发布 GitHub Release、提交 uTools 市场审核

---

> 愿你的桌面四季有景，心中有光 ❄️
