import { createFileRoute } from "@tanstack/react-router";

import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/react-fetch-race-condition.mdx";
import { buildSeo } from "@/lib/seo";

const ReactFetchRacePost = () => (
  <BlogPostLayout>
    <Post />
  </BlogPostLayout>
);

export const Route = createFileRoute("/blog/react-fetch-race-condition")({
  component: ReactFetchRacePost,
  head: () => {
    const seo = buildSeo({
      description:
        "搜索连续触发 fetch 时，使用 AbortController 和 requestId 取消旧请求、识别超时，并避免旧响应覆盖新结果。",
      keywords:
        "React, fetch, race condition, AbortController, AbortSignal, useEffect",
      path: "/blog/react-fetch-race-condition",
      publishedTime: "2026-07-16",
      title: "React 搜索结果被旧请求覆盖了，怎么处理",
      type: "article",
    });
    return { links: seo.links, meta: seo.meta };
  },
});
