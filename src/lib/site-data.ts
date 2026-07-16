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

export const HOME_SECTIONS = ["profile", "projects", "experience"] as const;

export const PROFILE = {
  avatar: "https://avatars.githubusercontent.com/u/157279205",
  location: "China · UTC+8",
  works: [
    {
      company: "Huivo Tech Co., Ltd.",
      period: "2026.03 - 至今",
      role: "研发工程师",
    },
    {
      company: "MOONDROP Tech Co. Ltd.",
      period: "2025.08 - 2025.12",
      role: "前端工程师",
    },
    {
      company: "kuaiqi Tech Co., Ltd.",
      period: "2024.10 - 2025.07",
      role: "前端工程师",
    },
  ],
} as const;

export const PROJECTS = [
  {
    name: "Lattice",
    preview: "/images/lattice.webp",
    previewAlt: "Lattice desktop window",
    previewHeight: 1520,
    previewWidth: 2400,
    status: "SHIPPED" as const,
    tags: ["Mod + Backend + Desktop", "Ops-ready", "Live iteration"],
  },
  {
    name: "LicMusic",
    status: "PLANNED" as const,
    tags: ["Desktop-first", "AI taste profile", "Condition-based discovery"],
  },
] as const;
