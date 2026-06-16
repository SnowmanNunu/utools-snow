const fs = require('fs')
const path = require('path')

/**
 * uTools 发布前置脚本
 *
 * uTools 插件市场要求 logo.png 不超过 256x256，
 * 但独立桌面版（macOS dmg 等）需要 512x512 的图标。
 * 因此源码保留 512x512 的 public/logo.png，
 * 发布 uTools 时用这个脚本把 dist/logo.png 替换为 256x256 版本。
 */

const source = path.join(__dirname, '..', 'public', 'logo-256.png')
const target = path.join(__dirname, '..', 'dist', 'logo.png')

if (!fs.existsSync(source)) {
  console.error('Error: public/logo-256.png not found')
  process.exit(1)
}

fs.copyFileSync(source, target)
console.log('Replaced dist/logo.png with 256x256 version for uTools publishing')
