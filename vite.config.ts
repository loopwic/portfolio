import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths({ loose: true, projects: ["./tsconfig.json"] }),
    tailwindcss(),
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              defaultLang: "plaintext",
              keepBackground: false,
              theme: {
                dark: "github-dark-dimmed",
                light: "gruvbox-light-soft",
              },
            },
          ],
        ],
        remarkPlugins: [remarkGfm],
      }),
    },
    tanstackStart(),
    viteReact({
      include: /\.(mdx|js|jsx|ts|tsx)$/u,
    }),
    cloudflare({
      viteEnvironment: {
        name: "ssr",
      },
    }),
  ],
});
