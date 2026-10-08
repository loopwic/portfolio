export const SITE = {
  description:
    "Kieran Ming 的个人主页，主要做前端与交互，也在做一款中英双语 iOS 输入法。",
  email: "me@loopwic.com",
  locale: "zh_CN",
  name: "Kieran Ming",
  ogImage: "/og-default.jpg",
  subtitle: "Independent Developer · Privacy-first iOS Software",
  subtitleCN: "独立开发者 · 隐私优先的 iOS 软件",
  title: "KIERAN MING",
  twitter: "@loopwic",
  url: "https://loopwic.com",
} as const;

export const HOME_SECTIONS = [
  "profile",
  "projects",
  "experience",
  "switch",
] as const;

export const PROFILE = {
  avatar: "https://avatars.githubusercontent.com/u/157279205",
  independentProject: {
    company: "Lotli / 洛缇",
    period: "个人项目",
    role: "独立开发 · iOS / macOS",
  },
  location: "Japan · UTC+9",
  works: [
    {
      company: "Huivo Tech Co., Ltd.",
      period: "2026.03",
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
    description:
      "由 Kieran Ming 独立开发，目前处于原型阶段。Lotli 是一款离线中英双语 iOS 键盘，提供本地拼音候选与词序学习，并配有 iOS / macOS 原生伴随 App；输入处理与学习数据仅保留在设备本地。",
    name: "Lotli / 洛缇",
    status: "PROTOTYPE" as const,
    tags: ["iOS + macOS", "中英双语", "本地拼音与学习"],
  },
] as const;
