export const BLOG_POSTS = [
  {
    date: "2026-07-16",
    slug: "react-fetch-race-condition",
    summary:
      "搜索连续触发 fetch 时，怎么取消旧请求、识别超时，并避免较慢响应覆盖最新结果。",
    tags: ["React", "Fetch", "AbortController"],
    title: "React 搜索结果被旧请求覆盖了，怎么处理",
    to: "/blog/react-fetch-race-condition",
  },
  {
    date: "2026-07-11",
    slug: "websocket-reconnect-backoff",
    summary:
      "一份浏览器端重连实现，包含退避、full jitter、心跳、离线恢复和后台页面处理。",
    tags: ["WebSocket", "Backoff", "Reliability"],
    title: "浏览器 WebSocket 断线重连怎么写",
    to: "/blog/websocket-reconnect-backoff",
  },
  {
    date: "2026-07-06",
    slug: "tanstack-router-url-state",
    summary:
      "用 Zod 校验 search 参数，让筛选、分页、loader 和浏览器历史共用 URL 状态。",
    tags: ["TanStack Router", "URL State", "Zod"],
    title: "用 TanStack Router 管理筛选和分页 URL",
    to: "/blog/tanstack-router-url-state",
  },
] as const;

export type BlogPost = (typeof BLOG_POSTS)[number];
