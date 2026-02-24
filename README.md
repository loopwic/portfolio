<div align="center">

# Portfolio

沉浸式交互式作品集，采用 TanStack Start + TanStack Router 与 Framer Motion 打造整页动态滚动体验。

</div>

## ✨ 功能亮点

- **分屏滚动动画**：自定义 `usePageScroll` 钩子结合 Motion Values，实现滚轮/键盘驱动的整页翻动与平滑弹簧动画。
- **滚动阈值指示器**：`ScrollThresholdIndicator` 根据方向与滚动比例实时反馈，桌面与移动端拥有差异化动效。
- **全局滚动上下文**：`ScrollProvider` 向导航栏、页面组件提供当前分段、方向、进度等状态，保持 UI 一致响应。
- **交互细节**：自定义光标、渐变背景、按钮悬停动画等增强沉浸感。
- **自动化流程**：Biome 代码质量检查、lefthook 本地钩子、semantic-release 持续发布。

## 🧱 技术栈

- [TanStack Start](https://tanstack.com/start)（React 全栈框架）
- [TanStack Router](https://tanstack.com/router)
- [React 19](https://react.dev/)
- [Framer Motion (motion/react)](https://motion.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) & 自定义工具库
- [Biome](https://biomejs.dev/) 用于 Lint & Format

## 🚀 快速开始

### 环境要求

- Node.js ≥ 20
- [pnpm](https://pnpm.io/) ≥ 8（项目使用 `packageManager` 锁定版本）

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

默认访问地址：<http://localhost:3000>

### 构建与启动

```bash
pnpm build
pnpm start
```

### 代码质量

```bash
pnpm lint   # Biome 检查
pnpm format # Biome 自动格式化
```

### Git 钩子

项目集成了 [lefthook](https://github.com/evilmartians/lefthook)：

- `pre-commit`：执行 `pnpm lint-staged`（针对暂存区文件运行 Biome 修复）
- `commit-msg`：使用 `@commitlint/config-conventional` 校验提交信息
- `pre-push`：推送前运行 `pnpm lint`

首次克隆后运行一次：

```bash
pnpm dlx lefthook install
```

### 语义化发布

项目通过 [semantic-release](https://semantic-release.gitbook.io/) 自动生成版本与变更记录：

1. 使用 Conventional Commits 规则书写提交信息
2. 在 CI 中执行 `pnpm semantic-release`
3. 自动更新版本号、发布标签并写入 `CHANGELOG.md`

## 🗂️ 项目结构

```
src/
├─ routes/
│  ├─ __root.tsx        # Root shell，挂载 ThemeProvider 与 ScrollProvider
│  ├─ index.tsx         # 主页面，消费滚动上下文
│  └─ blog/*            # 博客列表与文章路由
├─ components/
│  ├─ cursor.tsx        # 自定义光标
│  ├─ navbar.tsx        # 顶部导航，监听滚动状态
│  ├─ scroll-view.tsx   # Banner 与按钮交互区
│  └─ scroll-threshold-indicator.tsx
├─ hooks/
│  └─ use-page-scroll.ts  # 分段滚动核心逻辑
├─ contexts/
│  └─ scroll-context.tsx
└─ content/
   └─ blog/*.mdx        # 博客文章
```

## 🧪 开发建议

- 修改滚动逻辑后，请同步更新关联组件的依赖状态（如 `ScrollProvider`）。
- 新增组件时遵守 Biome 规则，避免触发复杂度限制与嵌套三元运算符警告。
- 若需要扩展滚动段落，只需在 `src/components/providers/scroll-provider.tsx` 中扩充 `sections` 数组，并在 `src/routes/index.tsx` 中补充对应内容。

## 📄 协议

MIT License © Loopwic
