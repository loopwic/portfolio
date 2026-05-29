export const SITE = {
  description:
    "我主要做前端和交互实现，习惯先把状态和结构拆清楚，再做动效。这样页面既有表现力，也能长期维护。",
  email: "me@loopwic.com",
  locale: "zh_CN",
  name: "Loopwic",
  ogImage: "/og-default.jpg",
  subtitle: "Frontend / Interaction / Engineering",
  subtitleCN: "前端开发 / 交互实现",
  title: "LOOPWIC",
  twitter: "@loopwic",
  url: "https://loopwic.com",
} as const;

export const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/blog", label: "BLOG" },
] as const;

export const HOME_SECTIONS = [
  "hero",
  "about",
  "projects",
  "writing",
  "cta",
] as const;

export const SOCIAL_LINKS = [
  { label: "GITHUB", url: "https://github.com/loopwic" },
  { label: "X", url: "https://x.com/loopwic" },
  { label: "EMAIL", url: "mailto:me@loopwic.com" },
] as const;

export const PROFILE = {
  approach:
    "目标是让页面既有表现力，又不牺牲可维护性。交付时我会优先保证交互链路完整、状态可推导，再去打磨视觉细节。",
  highlights: [
    { label: "工程偏好", value: "简单、可维护" },
    { label: "交互原则", value: "反馈明确，不打断操作" },
    { label: "当前重心", value: "体验稳定和性能边界" },
    { label: "协作方式", value: "先对齐目标，再推进细节" },
  ],
  image: "https://cdn.loopwic.com/images/hero.webp",
  name: "Loopwic",
  role: "前端开发 / 交互实现",
  skills: ["TypeScript", "React", "Motion", "Expo", "Golang", "Docker"],
  summary:
    "我主要做前端和交互实现，习惯先把状态和结构拆清楚，再做动效。这样页面既有表现力，也能长期维护。",
  works: [
    {
      company: "kuaiqi Tech Co., Ltd.",
      description: "负责核心业务页面维护和新功能交付，保障线上稳定。",
      period: "2024.10 - 2025.07",
      role: "前端工程师",
      stack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    },
    {
      company: "MOONDROP Tech Co. Ltd.",
      description: "参与 AI 产品线前端架构和 CI/CD 流程优化。",
      period: "2025.08 - 至今",
      role: "前端工程师",
      stack: ["React", "TypeScript", "Expo", "GitHub Actions", "Docker"],
    },
  ],
} as const;

export const PROJECTS = [
  {
    detail:
      "已完成 Mod + Backend + Desktop 的一体化链路，正在持续迭代稳定性与规则精度。",
    focus: "规则可维护性、事件链路完整性、桌面运维体验打磨。",
    name: "Lattice",
    preview: "/images/lattice.webp",
    previewAlt: "Lattice desktop window",
    previewHeight: 1520,
    previewWidth: 2400,
    status: "SHIPPED" as const,
    subtitle: "Productionized full-stack monitoring toolkit",
    tags: ["Mod + Backend + Desktop", "Ops-ready", "Live iteration"],
  },
  {
    detail:
      "以播放器为核心，加入 AI 偏好分析与条件找歌，让「想听什么」可以被准确表达和快速命中。",
    milestones: [
      "Desktop-first player and queue UX",
      "AI taste profile from real listening behavior",
      "Condition-based song discovery (mood / bpm / language / era)",
    ],
    name: "LicMusic",
    note: "先把播放与推荐链路做准：用户输入条件 -> AI 解释偏好 -> 返回可验证的候选歌单，再逐步扩展跨端同步。",
    status: "PLANNED" as const,
    subtitle: "AI-powered music discovery player",
    tags: ["Desktop-first", "AI taste profile", "Condition-based discovery"],
  },
] as const;
