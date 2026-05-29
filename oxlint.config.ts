import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, react],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    ".claude",
    "src/routeTree.gen.ts",
    "src/components/ui",
    "src/components/scrollytelling",
    "src/content",
  ],
});
