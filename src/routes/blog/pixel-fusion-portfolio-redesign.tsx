import { createFileRoute } from "@tanstack/react-router";
import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/pixel-fusion-portfolio-redesign.mdx";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/blog/pixel-fusion-portfolio-redesign")({
  head: () => {
    const seo = buildSeo({
      title: "像素融合风格的个人站重构：从视觉系统到滚动叙事",
      description:
        "一次完整的个人站技术重构记录：像素边界、Three.js shader cube、标题 mask、GSAP pinned section 和 WebGL 图片预览如何组合成稳定的视觉系统。",
      path: "/blog/pixel-fusion-portfolio-redesign",
      type: "article",
      publishedTime: "2026-04-30",
      keywords: "Pixel Fusion, Three.js, Shader, GSAP, WebGL, Portfolio",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: PixelFusionPortfolioPost,
});

function PixelFusionPortfolioPost() {
  return (
    <BlogPostLayout>
      <Post />
    </BlogPostLayout>
  );
}
