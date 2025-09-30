# [1.2.0](https://github.com/loopwic/portfolio/compare/v1.1.0...v1.2.0) (2025-09-30)


### Features

* enhance blog functionality and styling ([e4f714e](https://github.com/loopwic/portfolio/commit/e4f714e236691f9787fc2b0ba6af89f9e879169f))
* 添加 @vercel/speed-insights 依赖并在布局中集成，优化页面性能 ([166c8a6](https://github.com/loopwic/portfolio/commit/166c8a6c7afe88d57007fb9570001a7ef37fa039))

# [1.2.0](https://github.com/loopwic/portfolio/compare/v1.1.0...v1.2.0) (2025-09-29)


### Features

* 添加 @vercel/speed-insights 依赖并在布局中集成，优化页面性能 ([166c8a6](https://github.com/loopwic/portfolio/commit/166c8a6c7afe88d57007fb9570001a7ef37fa039))

# [1.1.0](https://github.com/loopwic/portfolio/compare/v1.0.0...v1.1.0) (2025-09-29)


### Features

* add work experience section to About component with animations ([3520f04](https://github.com/loopwic/portfolio/commit/3520f043d41f42a15f66ae3af3a4591a60670688))
* 使用 Canvas 渲染图像，优化滚动视图性能和响应性 ([3e17a77](https://github.com/loopwic/portfolio/commit/3e17a77c7f86d700a1241233e911a951902dc9e5))

# 1.0.0 (2025-09-29)


### Features

* enhance hero section responsiveness and animations ([5d0a55b](https://github.com/loopwic/portfolio/commit/5d0a55bbb8f0b5110042cdc88f79aff490a102a4))

# Changelog

All notable changes to this project will be documented in this file by [semantic-release](https://github.com/semantic-release/semantic-release).

## [1.0.0] - 2025-09-28

### Added

- 全新的 Next.js 作品集首页，结合 Framer Motion 打造分屏滚动动画体验。
- `usePageScroll` 自定义钩子与 `ScrollProvider` 上下文，支持滚轮、键盘驱动的分段切换与全局进度同步。
- `ScrollThresholdIndicator` 组件，可根据滚动方向与设备类型展示动态进度条与指示箭头。
- 自定义交互组件（导航栏、滚动视图、光标、悬停按钮动画）及渐变视觉效果。
- Biome 代码质量工具链、lefthook Git 钩子与 semantic-release 自动化发布配置。
