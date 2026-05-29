import { createFileRoute } from "@tanstack/react-router";

import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/configure-alacritty-from-scratch.mdx";
import { buildSeo } from "@/lib/seo";

const ConfigureAlacrittyPost = () => (
  <BlogPostLayout>
    <Post />
  </BlogPostLayout>
);

export const Route = createFileRoute("/blog/configure-alacritty-from-scratch")({
  component: ConfigureAlacrittyPost,
  head: () => {
    const seo = buildSeo({
      description:
        "从字体、主题到快捷键，记录我如何把日常开发入口做得顺手、克制、可复用。",
      keywords: "alacritty, terminal, configuration",
      path: "/blog/configure-alacritty-from-scratch",
      publishedTime: "2025-09-29",
      title: "从零开始配置 Alacritty",
      type: "article",
    });
    return { links: seo.links, meta: seo.meta };
  },
});
