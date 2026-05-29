export const BLOG_POSTS = [
  {
    date: "2026-05-28",
    slug: "liquid-image-webgl-preview",
    summary:
      "拆解项目列表上的 LiquidImage 组件：DOM 兜底 + WebGL 叠层、UV cover、ripple、RGB shift、grain、DPR 与卸载释放，以及 hover 的插值取舍。",
    tags: ["WebGL", "Shader", "GLSL", "Interaction"],
    title: "液态图片预览：让项目图在 hover 时变成可触碰的表面",
    to: "/blog/liquid-image-webgl-preview",
  },
  {
    date: "2026-04-30",
    slug: "pixel-fusion-portfolio-redesign",
    summary:
      "一次完整的个人站技术重构记录：像素边界、Three.js shader cube、标题 mask、GSAP pinned section 和 WebGL 图片预览如何组合成稳定的视觉系统。",
    tags: ["Design System", "Shader", "GSAP", "WebGL"],
    title: "像素融合风格的个人站重构：从视觉系统到滚动叙事",
    to: "/blog/pixel-fusion-portfolio-redesign",
  },
  {
    date: "2025-09-29",
    slug: "configure-alacritty-from-scratch",
    summary:
      "从字体、主题到快捷键，记录我如何把日常开发入口做得顺手、克制、可复用。",
    tags: ["Alacritty", "Terminal", "Configuration"],
    title: "把终端调成工作台",
    to: "/blog/configure-alacritty-from-scratch",
  },
  {
    date: "2025-08-15",
    slug: "build-personal-blog-with-nextjs-and-mdx",
    summary:
      "把内容、组件和路由放进同一个工程节奏里，让个人站既能表达，也方便长期维护。",
    tags: ["Next.js", "MDX", "Blog"],
    title: "用 MDX 做写作系统",
    to: "/blog/build-personal-blog-with-nextjs-and-mdx",
  },
  {
    date: "2026-02-24",
    slug: "lattice-backend-ddd-refactor",
    summary:
      "拆解我在 Lattice 中处理事件可靠性、告警降噪、扫描稳定和权限追踪的真实做法。",
    tags: ["Lattice", "Minecraft", "Rust", "Tauri", "Ops"],
    title: "Lattice 风控系统拆解",
    to: "/blog/lattice-backend-ddd-refactor",
  },
] as const;

export type BlogPost = (typeof BLOG_POSTS)[number];
