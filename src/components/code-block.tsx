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
    <div className="not-prose relative my-6 overflow-hidden rounded-xl border border-border/80 bg-muted/30">
      <div className="flex items-center justify-between border-border/70 border-b bg-muted/60 px-3 py-2">
        <span className="font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.1em]">
          {language || "code"}
        </span>
        {raw && <CopyButton value={raw} />}
      </div>
      <div className="overflow-x-auto px-1 py-1">
        <pre className="m-0 bg-transparent p-0 text-[0.88rem] leading-relaxed">
          {children}
        </pre>
      </div>
    </div>
  );
}
