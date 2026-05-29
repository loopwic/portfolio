import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type HeroHeadlineProps = HTMLAttributes<HTMLHeadingElement> & {
  animated?: boolean;
};

export const HeroHeadline = ({
  animated = true,
  className,
  ...props
}: HeroHeadlineProps) => {
  const lineClassName = animated
    ? "intro-line inline-block origin-bottom-left"
    : "inline-block origin-bottom-left";
  const dotClassName = animated
    ? "fade-in mb-[2vw] h-4 w-4 bg-current md:h-8 md:w-8"
    : "mb-[2vw] h-4 w-4 bg-current md:h-8 md:w-8";

  return (
    <h1
      className={cn(
        "font-display text-hero font-black uppercase leading-[0.86] tracking-tight",
        className
      )}
      {...props}
    >
      <span className="-my-[0.07em] block overflow-hidden py-[0.07em]">
        <span className={lineClassName}>VISUAL</span>
      </span>
      <span className="-my-[0.07em] flex items-end gap-4 overflow-hidden py-[0.07em]">
        <span className={lineClassName}>SYSTEMS</span>
        <span className={dotClassName} />
      </span>
    </h1>
  );
};
