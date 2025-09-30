"use client";

import type React from "react";
import { CopyButton } from "./copy-button";

type CodeBlockProps = {
  children: React.ReactNode;
  raw?: string;
  language?: string;
};

export function CodeBlock({ children, raw, language }: CodeBlockProps) {
  return (
    <div className="relative overflow-hidden rounded-md border bg-muted/50">
      <div className="flex items-center justify-between border-b bg-muted/80 px-4 py-2">
        <span className="font-mono text-muted-foreground text-xs">
          {language || "code"}
        </span>
        {raw && <CopyButton value={raw} />}
      </div>
      <div className="overflow-x-auto">
        <pre className="m-0 bg-transparent p-0">{children}</pre>
      </div>
    </div>
  );
}
