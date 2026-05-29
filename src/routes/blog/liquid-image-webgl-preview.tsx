import { createFileRoute } from "@tanstack/react-router";

import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/liquid-image-webgl-preview.mdx";
import { buildSeo } from "@/lib/seo";

const LiquidImagePost = () => (
  <BlogPostLayout>
    <Post />
  </BlogPostLayout>
);

export const Route = createFileRoute("/blog/liquid-image-webgl-preview")({
  component: LiquidImagePost,
  head: () => {
    const seo = buildSeo({
      description:
        "拆解项目列表上的 LiquidImage 组件：DOM 兜底 + WebGL 叠层、UV cover、ripple、RGB shift、grain、DPR 与卸载释放，以及 hover 的插值取舍。",
      keywords: "WebGL, Shader, GLSL, Hover, Portfolio, Interaction",
      path: "/blog/liquid-image-webgl-preview",
      publishedTime: "2026-05-28",
      title: "液态图片预览：让项目图在 hover 时变成可触碰的表面",
      type: "article",
    });
    return { links: seo.links, meta: seo.meta };
  },
});
