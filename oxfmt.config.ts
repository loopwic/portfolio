import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    "node_modules",
    ".claude",
    ".tanstack",
    "dist",
    "build",
    "reference",
    "src/components/scrollytelling",
    "src/routeTree.gen.ts",
    "src/components/ui",
    "src/content",
    "CHANGELOG.md",
    ".impeccable.md",
  ],
});
