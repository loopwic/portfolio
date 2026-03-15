"use client";

import { useEffect, useRef } from "react";

type BrutalMarqueeProps = {
  text: string;
  speed?: number;
  className?: string;
};

const REPEAT_COUNT = 8;

export function BrutalMarquee({
  text,
  speed = 40,
  className = "",
}: BrutalMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf: number;
    let offset = 0;

    const step = () => {
      offset -= speed / 60;
      const singleWidth = track.scrollWidth / REPEAT_COUNT;
      if (Math.abs(offset) >= singleWidth) {
        offset += singleWidth;
      }
      track.style.transform = `translateX(${offset}px)`;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return (
    <div
      aria-hidden
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <div className="inline-flex" ref={trackRef}>
        {Array.from({ length: REPEAT_COUNT }).map((_, i) => (
          <span
            className="mx-4 font-display font-bold text-lg uppercase tracking-[0.2em] md:text-xl"
            key={i}
          >
            {text} ·{" "}
          </span>
        ))}
      </div>
    </div>
  );
}
