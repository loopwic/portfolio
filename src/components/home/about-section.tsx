import { HOME_SECTIONS, PROFILE } from "@/lib/site-data";

import { PRINCIPLES, TECH_LOGOS } from "./constants";
import { SectionHeader } from "./section-header";
import { TechLogo } from "./tech-logo";

export const AboutSection = () => (
  <section
    className="scroll-section relative overflow-hidden bg-background px-5 py-20 md:px-8 md:py-28"
    id={HOME_SECTIONS[1]}
  >
    <div className="absolute top-0 right-0 h-full w-px bg-foreground/10" />
    <div className="absolute bottom-0 left-0 w-full h-px bg-foreground/10" />

    <div className="pointer-events-none absolute -left-10 top-20 z-0 select-none text-watermark font-display font-black leading-none text-foreground/[0.03] uppercase whitespace-nowrap">
      Protocol
    </div>

    <div className="protocol-pin mx-auto min-h-screen max-w-[1240px] relative z-10 grid content-center">
      <SectionHeader index="01" title="Protocol" />

      <div className="relative mt-12 min-h-[68vh] overflow-hidden border border-foreground/10">
        <div className="protocol-copy grid h-full min-h-[68vh] gap-10 p-6 md:p-10 lg:grid-cols-[0.86fr_1fr] lg:items-center">
          <h2 className="scroll-fade font-display text-section font-black uppercase leading-[0.8] tracking-tight">
            Structure <br />
            <span className="opacity-30">First.</span>
            <br />
            Motion <br />
            <span className="opacity-30">Next.</span>
          </h2>
          <div className="scroll-fade self-center lg:border-foreground/20 lg:border-l lg:pl-10">
            <p className="text-xl font-black uppercase leading-snug tracking-wide text-foreground/80 md:text-2xl">
              Rigid systems enable playful interfaces. By tearing down
              structural noise, we allow true design intent to surface.
            </p>
          </div>
        </div>

        <div className="sticker-field pointer-events-none absolute inset-0">
          {TECH_LOGOS.map((logo) => (
            <TechLogo key={logo.label} logo={logo} />
          ))}
        </div>
      </div>
    </div>

    <div className="mx-auto max-w-[1240px] relative z-10">
      <div className="mt-10 grid overflow-hidden border border-foreground/20 lg:grid-cols-[0.36fr_1fr]">
        <div className="scroll-fade border-foreground/20 border-b p-6 md:p-8 lg:border-r lg:border-b-0">
          <p className="font-mono text-2xs font-black uppercase tracking-[0.28em] text-foreground/45">
            Protocol Index
          </p>
          <div className="mt-8 grid gap-5">
            {PRINCIPLES.map(([label, copy]) => (
              <div
                className="grid grid-cols-[4.5rem_1fr] items-baseline gap-4 border-foreground/10 border-b pb-5 last:border-b-0 last:pb-0"
                key={label}
              >
                <p className="font-mono text-3xs font-black uppercase tracking-[0.2em] text-foreground/35">
                  {label}
                </p>
                <p className="font-display text-lede font-black uppercase leading-tight tracking-widest">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid">
          <div className="scroll-fade flex items-center justify-between border-foreground/10 border-b px-6 py-4 md:px-8">
            <p className="font-mono text-2xs font-black uppercase tracking-[0.28em] text-foreground/45">
              History Log
            </p>
            <span className="h-2 w-2 bg-foreground" />
          </div>
          {PROFILE.works.map((work) => (
            <article
              className="scroll-fade group grid gap-4 border-foreground/10 border-b px-6 py-5 last:border-b-0 md:grid-cols-[0.2fr_1fr] md:px-8"
              key={work.company}
            >
              <p className="pt-1 font-mono text-2xs font-black text-foreground/50 uppercase tracking-widest">
                {work.period}
              </p>
              <div>
                <h3 className="flex flex-col gap-2 font-black text-meta-lg uppercase tracking-widest md:flex-row md:items-center md:gap-4">
                  {work.company}
                  <span className="hidden md:inline-block text-foreground/20">
                    /
                  </span>
                  <span className="font-mono text-2xs tracking-[0.2em] text-background bg-foreground px-3 py-1">
                    {work.role}
                  </span>
                </h3>
                <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-foreground/60">
                  {work.description}
                </p>
                {work.stack ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {work.stack.map((item) => (
                      <span
                        className="border border-foreground/18 px-3 py-1.5 font-mono text-3xs font-black uppercase tracking-[0.18em] text-foreground/55"
                        key={item}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);
