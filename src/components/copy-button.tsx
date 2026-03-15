"use client";

import React from "react";
import { Button } from "./ui/button";

const COPY_TIMEOUT = 2000;
const STATUS_LABELS = {
  idle: "复制",
  copied: "已复制",
  error: "复制失败",
} as const;

type CopyButtonProps = {
  value: string;
};

export function CopyButton({ value }: CopyButtonProps) {
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
      className="h-6 border-border/70 bg-background/75 px-2 text-[0.68rem] text-muted-foreground hover:bg-background"
      onClick={handleCopy}
      size="sm"
      type="button"
      variant="ghost"
    >
      {STATUS_LABELS[status]}
    </Button>
  );
}
