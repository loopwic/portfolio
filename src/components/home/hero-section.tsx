"use client";

import { lazy, Suspense, useRef } from "react";
import { KineticText } from "@/components/home/kinetic-text";
import { HOME_SECTIONS } from "@/lib/site-data";
import { STYLE_MARKS } from "./constants";
import { HeroHeadline } from "./hero-headline";
import { useCubeTitleMask } from "./use-cube-title-mask";

const HeroTitleObject = lazy(() => import("./hero-title-object"));

export function HeroSection() {
  const cubeRef = useRef<HTMLDivElement>(null);
  const titleMaskRef = useRef<HTMLDivElement>(null);

  useCubeTitleMask(titleMaskRef, cubeRef);

  return (
    <section
      className="hero-panel relative z-10 min-h-screen pt-32 pb-16 px-5 md:px-8 pointer-events-none"
      id={HOME_SECTIONS[0]}
    >
      <Suspense fallback={null}>
        <HeroTitleObject objectRef={cubeRef} />
      </Suspense>
      <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-[1440px] content-center pointer-events-auto">
        <div className="max-w-6xl relative z-10 text-foreground">
          <KineticText
            className="relative z-30 mb-8 block font-mono font-black text-xs uppercase tracking-[0.3em] opacity-70"
            mode="typewriter"
            text="> INIT_SEQUENCE"
          />
          <div className="relative z-10" ref={titleMaskRef}>
            <HeroHeadline />
            <HeroHeadline
              animated={false}
              aria-hidden
              className="hero-title-reaction pointer-events-none absolute inset-0 z-20"
            />
          </div>
          <div className="relative z-30 mt-16 max-w-4xl border-foreground/30 border-l pl-6">
            <KineticText
              className="block text-xl md:text-3xl font-black uppercase tracking-widest leading-relaxed opacity-90"
              mode="typewriter"
              text="Engineered aesthetics. Pixel-perfect implementations powered by mathematics and motion."
            />
          </div>

          <div className="fade-in relative z-30 mt-16 flex flex-wrap gap-4">
            {STYLE_MARKS.map((mark) => (
              <span
                className="cursor-default border border-foreground/20 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:bg-foreground hover:text-background"
                key={mark}
              >
                {mark}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
