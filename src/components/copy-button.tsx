"use client";

import React from "react";
import { Button } from "./ui/button";

const COPY_TIMEOUT = 2000;

type CopyButtonProps = {
  value: string;
};

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_TIMEOUT);
  }, [value]);

  return (
    <Button
      className="h-6 px-2 text-xs"
      onClick={handleCopy}
      size="sm"
      type="button"
      variant="ghost"
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
