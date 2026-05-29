import { createFileRoute } from "@tanstack/react-router";

import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/build-personal-blog-with-nextjs-and-mdx.mdx";
import { buildSeo } from "@/lib/seo";

const BuildBlogPost = () => (
  <BlogPostLayout>
    <Post />
  </BlogPostLayout>
);

export const Route = createFileRoute(
  "/blog/build-personal-blog-with-nextjs-and-mdx"
)({
  component: BuildBlogPost,
  head: () => {
    const seo = buildSeo({
      description:
        "把内容、组件和路由放进同一个工程节奏里，让个人站既能表达，也方便长期维护。",
      keywords: "Next.js, MDX, Blog",
      path: "/blog/build-personal-blog-with-nextjs-and-mdx",
      publishedTime: "2025-08-15",
      title: "使用 Next.js 和 MDX 构建个人博客",
      type: "article",
    });
    return { links: seo.links, meta: seo.meta };
  },
});
