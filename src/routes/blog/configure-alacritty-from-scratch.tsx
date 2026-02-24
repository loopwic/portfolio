import { createFileRoute } from "@tanstack/react-router";
import { BlogPostLayout } from "@/components/blog-post-layout";
import Post from "@/content/blog/configure-alacritty-from-scratch.mdx";

export const Route = createFileRoute("/blog/configure-alacritty-from-scratch")({
  head: () => ({
    meta: [
      {
        title: "从零开始配置 Alacritty",
      },
      {
        name: "description",
        content: "在 macOS 上配置 Alacritty。",
      },
      {
        name: "keywords",
        content: "alacritty, terminal, configuration",
      },
      {
        name: "author",
        content: "Loopwic",
      },
      {
        property: "og:title",
        content: "从零开始配置 Alacritty",
      },
    ],
  }),
  component: ConfigureAlacrittyPost,
});

function ConfigureAlacrittyPost() {
  return (
    <BlogPostLayout>
      <Post />
    </BlogPostLayout>
  );
}
