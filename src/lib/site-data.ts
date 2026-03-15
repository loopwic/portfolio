export const SITE = {
  name: "Loopwic",
  title: "LOOPWIC",
  subtitle: "Frontend / Interaction / Engineering",
  subtitleCN: "前端开发 / 交互实现",
  description:
    "我主要做前端和交互实现，习惯先把状态和结构拆清楚，再做动效。这样页面既有表现力，也能长期维护。",
  email: "me@loopwic.com",
} as const;

export const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "BLOG", href: "/blog" },
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
  name: "Loopwic",
  role: "前端开发 / 交互实现",
  image: "https://cdn.loopwic.com/images/hero.webp",
  summary:
    "我主要做前端和交互实现，习惯先把状态和结构拆清楚，再做动效。这样页面既有表现力，也能长期维护。",
  approach:
    "目标是让页面既有表现力，又不牺牲可维护性。交付时我会优先保证交互链路完整、状态可推导，再去打磨视觉细节。",
  highlights: [
    { label: "工程偏好", value: "简单、可维护" },
    { label: "交互原则", value: "反馈明确，不打断操作" },
    { label: "当前重心", value: "体验稳定和性能边界" },
    { label: "协作方式", value: "先对齐目标，再推进细节" },
  ],
  skills: ["TypeScript", "React", "Motion", "Expo", "Golang", "Docker"],
  works: [
    {
      company: "kuaiqi Tech Co., Ltd.",
      role: "前端工程师",
      period: "2024.10 - 2025.07",
      description: "负责核心业务页面维护和新功能交付，保障线上稳定。",
    },
    {
      company: "MOONDROP Tech Co. Ltd.",
      role: "前端工程师",
      period: "2025.08 - 至今",
      description: "参与 AI 产品线前端架构和 CI/CD 流程优化。",
    },
  ],
} as const;

export const PROJECTS = [
  {
    name: "Lattice",
    status: "SHIPPED" as const,
    detail:
      "已完成 Mod + Backend + Desktop 的一体化链路，正在持续迭代稳定性与规则精度。",
    subtitle: "Productionized full-stack monitoring toolkit",
    tags: ["Mod + Backend + Desktop", "Ops-ready", "Live iteration"],
    focus: "规则可维护性、事件链路完整性、桌面运维体验打磨。",
    preview: "/images/lattice.png",
    previewAlt: "Lattice desktop window",
  },
  {
    name: "LicMusic",
    status: "PLANNED" as const,
    detail:
      "以播放器为核心，加入 AI 偏好分析与条件找歌，让「想听什么」可以被准确表达和快速命中。",
    subtitle: "AI-powered music discovery player",
    tags: ["Desktop-first", "AI taste profile", "Condition-based discovery"],
    milestones: [
      "Desktop-first player and queue UX",
      "AI taste profile from real listening behavior",
      "Condition-based song discovery (mood / bpm / language / era)",
    ],
    note: "先把播放与推荐链路做准：用户输入条件 -> AI 解释偏好 -> 返回可验证的候选歌单，再逐步扩展跨端同步。",
  },
] as const;
