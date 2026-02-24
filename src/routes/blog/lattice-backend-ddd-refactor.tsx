import { createFileRoute } from "@tanstack/react-router";
import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/lattice-backend-ddd-refactor.mdx";

export const Route = createFileRoute("/blog/lattice-backend-ddd-refactor")({
  head: () => ({
    meta: [
      {
        title: "Lattice 项目全景：Mod + Backend + Desktop 的一体化风控系统",
      },
      {
        name: "description",
        content:
          "从开发者日常实践出发，讲清楚 Lattice 的真实工作流：事件上报、规则判断、扫描执行、权限门禁和配置发布回执。",
      },
      {
        name: "keywords",
        content: "Lattice, Minecraft, Rust, Tauri, Monitoring, Security",
      },
      {
        name: "author",
        content: "Loopwic",
      },
      {
        property: "og:title",
        content: "Lattice 项目全景：Mod + Backend + Desktop 的一体化风控系统",
      },
    ],
  }),
  component: LatticeDddPost,
});

function LatticeDddPost() {
  return (
    <BlogPostLayout>
      <Post />
    </BlogPostLayout>
  );
}
