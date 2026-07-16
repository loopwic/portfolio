import { createFileRoute } from "@tanstack/react-router";

import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/tanstack-router-url-state.mdx";
import { buildSeo } from "@/lib/seo";

const TanStackRouterUrlStatePost = () => (
  <BlogPostLayout>
    <Post />
  </BlogPostLayout>
);

export const Route = createFileRoute("/blog/tanstack-router-url-state")({
  component: TanStackRouterUrlStatePost,
  head: () => {
    const seo = buildSeo({
      description:
        "用 TanStack Router 和 Zod v4 管理筛选与分页 URL，并处理参数校验、loaderDeps 重载和浏览器历史。",
      keywords:
        "TanStack Router, search params, URL state, Zod, loaderDeps, React",
      path: "/blog/tanstack-router-url-state",
      publishedTime: "2026-07-06",
      title: "用 TanStack Router 管理筛选和分页 URL",
      type: "article",
    });
    return { links: seo.links, meta: seo.meta };
  },
});
