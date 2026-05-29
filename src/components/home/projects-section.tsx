"use client";

import { lazy, Suspense } from "react";

import { HOME_SECTIONS, PROJECTS } from "@/lib/site-data";

import { PixelGrid } from "./pixel-grid";
import { SectionHeader } from "./section-header";

const LiquidImage = lazy(async () => {
  const mod = await import("@/components/ui/liquid-image");
  return { default: mod.LiquidImage };
});

export const ProjectsSection = () => (
  <section
    className="scroll-section relative bg-background px-5 py-20 text-foreground md:px-8 md:py-28"
    id={HOME_SECTIONS[2]}
  >
    <div className="mx-auto max-w-[1240px]">
      <SectionHeader index="02" title="Output" />

      <div className="mt-16 grid gap-12 lg:grid-cols-[0.36fr_1fr]">
        <div className="scroll-fade lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-section-wide font-black uppercase leading-[0.82] tracking-tight">
            Signal
            <br />
            <span className="text-foreground/28">Noise</span>
          </h2>
          <p className="mt-8 max-w-sm font-mono text-xs font-black uppercase leading-loose tracking-[0.18em] text-foreground/45">
            Selected builds, compressed into proof surfaces. Less poster, more
            signal.
          </p>
        </div>

        <div className="grid border-foreground/10 border-t">
          {PROJECTS.map((project, index) => (
            <article
              className="project-item scroll-fade group grid gap-6 border-foreground/10 border-b py-8 md:grid-cols-[minmax(18rem,24rem)_minmax(0,1fr)] md:items-stretch"
              key={project.name}
            >
              <div className="flex min-h-64 min-w-0 flex-col justify-between gap-8">
                <div className="min-w-0">
                  <div className="mb-5 flex items-center justify-between gap-4 font-mono text-2xs font-black uppercase tracking-[0.24em] text-foreground/45">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{project.status}</span>
                  </div>
                  <h3 className="max-w-full overflow-hidden text-wrap break-words font-display text-title font-black uppercase leading-[0.9] tracking-tight">
                    {project.name}
                  </h3>
                  <p className="mt-5 text-base font-semibold leading-relaxed text-foreground/62 md:text-lg">
                    {project.detail}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      className="border border-foreground/18 px-3 py-1.5 font-mono text-3xs font-black uppercase tracking-[0.18em] text-foreground/55 transition-colors group-hover:border-foreground/35 group-hover:text-foreground"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="relative aspect-[16/10] w-full min-w-0 overflow-hidden border border-foreground/35 bg-foreground/5 md:min-h-64"
                data-magnetic
              >
                {"preview" in project ? (
                  <Suspense fallback={<PixelGrid />}>
                    <LiquidImage
                      alt={project.previewAlt}
                      className="project-img absolute inset-0 h-full w-full"
                      height={project.previewHeight}
                      src={project.preview}
                      width={project.previewWidth}
                    />
                  </Suspense>
                ) : (
                  <PixelGrid />
                )}
                <div className="absolute top-0 right-0 bg-background/85 px-3 py-2 font-mono text-3xs font-black uppercase tracking-[0.2em] text-foreground/55">
                  {project.subtitle}
                </div>
                <div className="absolute bottom-0 left-0 h-6 w-6 border-foreground border-b-2 border-l-2" />
                <div className="absolute top-0 right-0 h-6 w-6 border-foreground border-t-2 border-r-2" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);
