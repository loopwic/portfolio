import { createFileRoute } from "@tanstack/react-router";

import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/lattice-backend-ddd-refactor.mdx";
import { buildSeo } from "@/lib/seo";

const LatticeDddPost = () => (
  <BlogPostLayout>
    <Post />
  </BlogPostLayout>
);

export const Route = createFileRoute("/blog/lattice-backend-ddd-refactor")({
  component: LatticeDddPost,
  head: () => {
    const seo = buildSeo({
      description:
        "从开发者日常实践出发，讲清楚 Lattice 的真实工作流：事件上报、规则判断、扫描执行、权限门禁和配置发布回执。",
      keywords: "Lattice, Minecraft, Rust, Tauri, Monitoring, Security",
      path: "/blog/lattice-backend-ddd-refactor",
      publishedTime: "2026-02-24",
      title: "Lattice 项目全景：Mod + Backend + Desktop 的一体化风控系统",
      type: "article",
    });
    return { links: seo.links, meta: seo.meta };
  },
});
