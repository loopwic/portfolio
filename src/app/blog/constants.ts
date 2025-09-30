type BlogPost = {
  title: string;
  slug: string;
  date: string;
  summary: string;
  tags: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "从零开始构建Alacrity终端",
    slug: "/configure-alacritty-from-scratch",
    date: "2025-09-29",
    summary:
      "分享我如何从零开始配置Alacritty终端，包括字体、配色方案、快捷键等，让终端更高效美观。",
    tags: ["Alacritty", "Terminal", "Configuration"],
  },
  {
    title: "使用Next.js和MDX构建个人博客",
    slug: "/build-personal-blog-with-nextjs-and-mdx",
    date: "2025-08-15",
    summary:
      "介绍如何使用Next.js和MDX快速搭建一个功能完善的个人博客，支持Markdown写作和React组件。",
    tags: ["Next.js", "MDX", "Blog"],
  },
];
