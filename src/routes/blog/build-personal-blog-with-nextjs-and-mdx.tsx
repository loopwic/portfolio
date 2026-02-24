import { createFileRoute } from "@tanstack/react-router";
import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/build-personal-blog-with-nextjs-and-mdx.mdx";

export const Route = createFileRoute(
  "/blog/build-personal-blog-with-nextjs-and-mdx"
)({
  head: () => ({
    meta: [
      {
        title: "使用Next.js和MDX构建个人博客",
      },
      {
        name: "description",
        content:
          "介绍如何使用Next.js和MDX快速搭建一个功能完善的个人博客，支持Markdown写作和React组件。",
      },
      {
        name: "keywords",
        content: "Next.js, MDX, Blog",
      },
      {
        name: "author",
        content: "Loopwic",
      },
      {
        property: "og:title",
        content: "使用Next.js和MDX构建个人博客",
      },
    ],
  }),
  component: BuildBlogPost,
});

function BuildBlogPost() {
  return (
    <BlogPostLayout>
      <Post />
    </BlogPostLayout>
  );
}
