# 🔄 项目开发工作流

> 本仓库版本管理、分支策略与发布流程的实操指南。  
> 适用项目：满屏飘落（utools-snow）

---

## 1. 仓库与分支总览

### 1.1 远程仓库

| 远端名 | 地址 | 用途 |
|--------|------|------|
| `github` | `git@github.com:SnowmanNunu/utools-snow.git` | 主仓库，CI/CD、Release 来源 |
| `gitee` | `git@gitee.com:SnowmanNunu/utools-snow.git` | 国内镜像，同步 tag 与主分支 |

### 1.2 核心分支

| 分支 | 说明 | 谁可以改 |
|------|------|---------|
| `main` | 线上最新稳定版，永远可构建、可发布 | 仅通过 release/hotfix 合并 |
| `dev/v{版本}` | 当前版本的长期开发分支 | 日常开发在此 |
| `release/v{版本}` | 版本冻结、测试、修 bug、准备发布 | 从 dev 切出 |
| `hotfix/v{版本}` | 线上紧急修复 | 从 main 切出 |
| `feature/{功能}` | 单个功能开发（可选） | 从 dev 切出 |

---

## 2. 版本号规则（SemVer）

```
v{主版本}.{次版本}.{修订号}
```

| 场景 | 版本变化 | 示例 |
|------|---------|------|
| 修复线上 bug | 修订号 +1 | `v1.3.0` → `v1.3.1` |
| 新增功能，向后兼容 | 次版本 +1 | `v1.2.0` → `v1.3.0` |
| 破坏性更新或大重构 | 主版本 +1 | `v1.x.x` → `v2.0.0` |

---

## 3. 正常开发流程（以 v1.3.0 为例）

### 3.1 从 main 切出开发分支

```bash
git checkout main
git pull github main

git checkout -b dev/v1.3.0

git push github dev/v1.3.0
git push gitee  dev/v1.3.0
```

### 3.2 开发单个功能（可选 feature 分支）

```bash
# 从 dev 切出功能分支
git checkout -b feature/mid-autumn-theme dev/v1.3.0

# 开发...
git add .
git commit -m "feat: 新增中秋主题"

# 推送并合并回 dev
git push github feature/mid-autumn-theme

git checkout dev/v1.3.0
git merge feature/mid-autumn-theme

git push github dev/v1.3.0
git push gitee  dev/v1.3.0
```

### 3.3 功能完成，切 release 分支冻结

```bash
git checkout -b release/v1.3.0 dev/v1.3.0

git push github release/v1.3.0
git push gitee  release/v1.3.0
```

release 分支只做：
- 修测试发现的 bug
- 更新 `package.json`、`standalone/package.json`、`plugin.json` 版本号
- 更新 `README.md`、`checkpoint.md`、`CHANGELOG.md`
- **不再新增功能**

---

## 4. 发布流程

### 4.1 打 tag 并推送

```bash
# 确保在 release 分支上
git checkout release/v1.3.0

# 更新版本号（已做则跳过）
# npm version 1.3.0 --no-git-tag-version
# 或手动修改 package.json / standalone/package.json / plugin.json

git add .
git commit -m "chore(release): v1.3.0"

# 打附注标签
git tag -a v1.3.0 -m "release: v1.3.0 沉浸式控制面板"

# 推送分支和标签
git push github release/v1.3.0
git push gitee  release/v1.3.0

git push github v1.3.0
git push gitee  v1.3.0
```

### 4.2 合并回 main

```bash
git checkout main
git merge release/v1.3.0

git push github main
git push gitee  main
```

### 4.3 CI 自动构建

GitHub Actions 监听 `v*` 标签，自动：
- 三平台打包（Windows / macOS / Linux）
- 生成 GitHub Release
- 上传安装包

### 4.4 uTools 插件市场

1. 本地执行构建：
   ```bash
   npm run build
   ```
2. 登录 [uTools 开发者后台](https://developer.u-tools.cn/)
3. 上传 `dist/` 或指定插件包
4. 提交审核

---

## 5. 线上紧急修复（Hotfix）

假设 `v1.3.0` 线上出现崩溃，需发 `v1.3.1`：

```bash
# 从 main 切出 hotfix
git checkout main
git pull github main

git checkout -b hotfix/v1.3.1

# 修复 bug
git add .
git commit -m "fix: 修复 xxx 导致的崩溃"

# 更新版本号
git add .
git commit -m "chore(release): v1.3.1"

# 打 tag
git tag -a v1.3.1 -m "hotfix: v1.3.1"

# 推送
git push github hotfix/v1.3.1
git push gitee  hotfix/v1.3.1

git push github v1.3.1
git push gitee  v1.3.1

# 合并回 main
git checkout main
git merge hotfix/v1.3.1

git push github main
git push gitee  main
```

**注意**：hotfix 只修紧急 bug，不引入新功能。

---

## 6. 版本回滚

如果某个版本发布后发现严重问题，可以立即回滚到上一个稳定 tag：

```bash
# 本地回滚到 v1.2.0
git checkout v1.2.0

# 或者基于 v1.2.0 切一个修复分支
git checkout -b hotfix/v1.2.0-rollback v1.2.0
```

线上回滚一般通过重新发布一个稳定的旧版本安装包实现，Git 历史保持不动。

---

## 7. 双远端同步

日常以 GitHub 为主，发布时同步 Gitee。

```bash
# 查看远端
git remote -v

# 拉取更新
git pull github main
git pull gitee  main

# 推送当前分支到双远端
git push github <branch>
git push gitee  <branch>

# 推送所有标签
git push github --tags
git push gitee  --tags
```

---

## 8. 提交信息规范

| 类型 | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具/依赖 |
| `release` | 版本发布 |

示例：

```bash
git commit -m "feat: 新增万圣节主题"
git commit -m "fix: 修复独立版托盘菜单无法暂停"
git commit -m "docs: 更新 checkpoint 开发计划"
git commit -m "chore(release): v1.3.0"
```

---

## 9. 当前项目状态速查

| 版本 | 状态 | 代码位置 |
|------|------|---------|
| v1.2.0 | 已发布 | `tag v1.2.0` |
| v1.2.1 | 已打标签，暂不发布 | `tag v1.2.1` |
| v1.2.2 | 已打标签，暂不发布 | `tag v1.2.2` |
| v1.3.0 | 开发中，UI 已完成 | `dev/v1.3.0` |

### 下一步

1. 在 `dev/v1.3.0` 完成剩余功能
2. 切 `release/v1.3.0` 测试冻结
3. 打 `v1.3.0` tag，合并回 `main`
4. GitHub Actions 自动构建 Release
5. 提交 uTools 审核

---

## 10. 常用命令速查

```bash
# 查看当前状态
git status

# 查看分支
git branch -a

# 查看标签
git tag -l

# 查看某 tag 的代码
git checkout v1.2.0

# 基于某个 tag 切分支
git checkout -b fix-from-v1.2.0 v1.2.0

# 删除本地分支
git branch -d feature/xxx

# 删除远程分支
git push github --delete feature/xxx
```

---

> 保持简单、可回滚、可追踪。每次发布都对应一个 tag，每个 tag 都能从 `main` 找到。 ❄️
