import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      // Without options
      "remark-gfm",
    ],
    rehypePlugins: [
      // Without options
      "rehype-slug",
      // With options
      [
        "rehype-pretty-code",
        {
          theme: {
            dark: "github-dark-dimmed",
            light: "gruvbox-light-soft",
          },
          keepBackground: false,
          defaultLang: "plaintext",
        },
      ],
    ],
  },
});
export default withMDX(nextConfig);
