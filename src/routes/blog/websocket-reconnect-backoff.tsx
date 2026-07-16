import { createFileRoute } from "@tanstack/react-router";

import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/websocket-reconnect-backoff.mdx";
import { buildSeo } from "@/lib/seo";

const WebSocketReconnectPost = () => (
  <BlogPostLayout>
    <Post />
  </BlogPostLayout>
);

export const Route = createFileRoute("/blog/websocket-reconnect-backoff")({
  component: WebSocketReconnectPost,
  head: () => {
    const seo = buildSeo({
      description:
        "一份浏览器 WebSocket 断线重连实现，包含指数退避、full jitter、应用层心跳、离线恢复和 bfcache。",
      keywords:
        "WebSocket, reconnect, exponential backoff, jitter, heartbeat, bfcache",
      path: "/blog/websocket-reconnect-backoff",
      publishedTime: "2026-07-11",
      title: "浏览器 WebSocket 断线重连怎么写",
      type: "article",
    });
    return { links: seo.links, meta: seo.meta };
  },
});
