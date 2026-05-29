"use client";

import type React from "react";

import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  children: React.ReactNode;
  raw?: string;
  language?: string;
}

export const CodeBlock = ({ children, raw, language }: CodeBlockProps) => (
  <figure className="code-panel not-prose relative my-12 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.015]">
    <div className="flex h-11 items-center justify-between border-foreground/5 border-b bg-foreground/[0.02] px-4">
      <figcaption className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/10" />
        </div>
        <span className="font-medium font-mono text-2xs text-foreground/40 tracking-[0.1em]">
          {language || "code"}
        </span>
      </figcaption>
      {raw && <CopyButton value={raw} />}
    </div>
    <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-foreground/20 hover:scrollbar-thumb-foreground/40 scrollbar-thumb-rounded-full overflow-x-auto px-5 py-5">
      <pre className="m-0 min-w-full bg-transparent p-0 font-mono text-code text-foreground/70 leading-[1.8]">
        {children}
      </pre>
    </div>
  </figure>
);
