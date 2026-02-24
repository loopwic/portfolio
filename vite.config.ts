import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"], loose: true }),
    tailwindcss(),
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
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
      }),
    },
    tanstackStart(),
    viteReact({
      include: /\.(mdx|js|jsx|ts|tsx)$/,
    }),
    cloudflare({
      viteEnvironment: {
        name: "ssr"
      }
    })
  ],
});