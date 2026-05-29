import { cn } from "@/lib/utils";

import type { TECH_LOGOS } from "./constants";

interface TechLogoProps {
  logo: (typeof TECH_LOGOS)[number];
}

export const TechLogo = ({ logo }: TechLogoProps) => (
  <div
    aria-hidden="true"
    className={cn(
      "absolute grid aspect-square -translate-x-1/2 -translate-y-1/2 place-items-center",
      logo.size,
      logo.x,
      logo.y,
      logo.rotate
    )}
  >
    <div className="tech-sticker h-full w-full [transform-style:preserve-3d]">
      <img
        alt=""
        className="tech-logo-img h-full w-full object-contain opacity-95 dark:opacity-100"
        decoding="async"
        draggable={false}
        height={160}
        loading="lazy"
        src={logo.src}
        width={160}
      />
    </div>
  </div>
);
