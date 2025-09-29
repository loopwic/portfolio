"use client";

import { motion } from "motion/react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";

type ScrollThresholdIndicatorProps = {
  progress: number;
  isVisible: boolean;
  direction: "up" | "down" | null;
};

const ANIMATION_OFFSET = 4;
const PERCENTAGE_MULTIPLIER = 100;

export const ScrollThresholdIndicator = ({
  progress,
  isVisible,
  direction,
}: ScrollThresholdIndicatorProps) => {
  const isMobile = useIsMobile();

  if (!isVisible) {
    return null;
  }

  if (!direction) {
    return null;
  }

  let transformOrigin = "top";

  if (isMobile) {
    transformOrigin = direction === "up" ? "right" : "left";
  } else if (direction === "up") {
    transformOrigin = "bottom";
  }

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "-translate-y-1/2 fixed z-99",
        isMobile ? "inset-x-0 top-18" : "top-1/2 right-8"
      )}
      exit={{ opacity: 0, scale: 0.8 }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center gap-2">
        {/* 方向指示器 */}
        <motion.div
          animate={{
            y: direction === "up" ? -ANIMATION_OFFSET : ANIMATION_OFFSET,
          }}
          className="font-mono text-sm text-white/80"
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {direction === "up" ? "↑" : "↓"}
        </motion.div>

        {/* 进度条 */}
        <div
          className={cn(
            "h-20 w-1 rounded-full bg-foreground/10",
            isMobile && "h-1 w-full"
          )}
        >
          <motion.div
            className="h-full w-full rounded-full bg-foreground"
            style={{
              scaleY: isMobile ? undefined : progress,
              scaleX: isMobile ? progress : undefined,
              transformOrigin,
            }}
          />
        </div>

        {/* 进度文字 */}
        <div className="font-mono text-foreground/60 text-xs">
          {Math.round(progress * PERCENTAGE_MULTIPLIER)}%
        </div>
      </div>
    </motion.div>
  );
};
