"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const COPY_TIMEOUT = 2000;
const STATUS_LABELS = {
  idle: "复制",
  copied: "已复制",
  error: "复制失败",
} as const;

type CopyButtonProps = {
  value: string;
  variant?: "default" | "inverted";
};

export function CopyButton({ value, variant = "default" }: CopyButtonProps) {
  const [status, setStatus] =
    React.useState<keyof typeof STATUS_LABELS>("idle");
  const timeoutRef = React.useRef<number | null>(null);

  const resetStatus = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
      timeoutRef.current = null;
    }, COPY_TIMEOUT);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = React.useCallback(async () => {
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(value);
      } else {
        throw new Error("Clipboard API unavailable");
      }

      setStatus("copied");
    } catch {
      setStatus("error");
    }

    resetStatus();
  }, [resetStatus, value]);

  return (
    <Button
      aria-live="polite"
      className={cn(
        "h-6 rounded-md px-2.5 font-medium font-mono text-3xs tracking-[0.08em] transition-colors duration-200",
        variant === "inverted"
          ? "border border-background/20 bg-transparent text-background/70 hover:bg-background/10 hover:text-background"
          : "border border-foreground/10 bg-transparent text-foreground/40 hover:bg-foreground/5 hover:text-foreground"
      )}
      onClick={handleCopy}
      size="sm"
      type="button"
      variant="ghost"
    >
      {STATUS_LABELS[status]}
    </Button>
  );
}
