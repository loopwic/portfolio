export const BLOG_POSTS = [
  {
    title: "把终端调成工作台",
    slug: "configure-alacritty-from-scratch",
    to: "/blog/configure-alacritty-from-scratch",
    date: "2025-09-29",
    summary:
      "从字体、主题到快捷键，记录我如何把日常开发入口做得顺手、克制、可复用。",
    tags: ["Alacritty", "Terminal", "Configuration"],
  },
  {
    title: "用 MDX 做写作系统",
    slug: "build-personal-blog-with-nextjs-and-mdx",
    to: "/blog/build-personal-blog-with-nextjs-and-mdx",
    date: "2025-08-15",
    summary:
      "把内容、组件和路由放进同一个工程节奏里，让个人站既能表达，也方便长期维护。",
    tags: ["Next.js", "MDX", "Blog"],
  },
  {
    title: "Lattice 风控系统拆解",
    slug: "lattice-backend-ddd-refactor",
    to: "/blog/lattice-backend-ddd-refactor",
    date: "2026-02-24",
    summary:
      "拆解我在 Lattice 中处理事件可靠性、告警降噪、扫描稳定和权限追踪的真实做法。",
    tags: ["Lattice", "Minecraft", "Rust", "Tauri", "Ops"],
  },
] as const;

export type BlogPost = (typeof BLOG_POSTS)[number];
