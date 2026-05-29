import { Plus } from "lucide-react";

import { HOME_SECTIONS, SITE, SOCIAL_LINKS } from "@/lib/site-data";

import { PixelSmiley } from "./pixel-smiley";
import { SectionHeader } from "./section-header";

export const CTASection = () => (
  <section
    className="scroll-section relative min-h-screen overflow-hidden bg-foreground px-5 py-24 text-background md:px-8 md:py-40"
    id={HOME_SECTIONS[4]}
  >
    <div className="relative z-10 mx-auto grid min-h-[70vh] max-w-[1240px] content-center">
      <SectionHeader index="04" inverse title="Ping" />
      <div className="mt-20 grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div className="scroll-fade grid justify-items-start">
          <h2 className="font-display text-hero-cta font-black uppercase leading-[0.8] tracking-tighter text-background">
            Send <br />
            Ideas.
          </h2>
          <PixelSmiley />
        </div>
        <div className="scroll-fade flex flex-col items-start justify-center lg:border-background/25 lg:border-l-4 lg:pl-16">
          <p className="mb-14 max-w-[42rem] text-lede-tight font-bold uppercase leading-relaxed tracking-widest text-background/72">
            Ready to build interactive systems or solidify a visual concept into
            code? Let's connect.
          </p>
          <a
            className="cta-email group inline-flex items-baseline gap-3 max-w-full break-all border-background/32 border-b-4 pb-2 text-left font-black font-display text-title-narrow leading-[0.92] transition-colors hover:border-background lg:whitespace-nowrap"
            data-magnetic
            href={`mailto:${SITE.email}`}
          >
            <span className="cta-email-text">{SITE.email}</span>
            <span
              aria-hidden="true"
              className="cta-email-arrow inline-block translate-x-[-0.4em] opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
            >
              →
            </span>
          </a>
          <div className="mt-16 flex flex-wrap gap-6">
            {SOCIAL_LINKS.map((link) => (
              <a
                className="flex items-center gap-2 border border-background/20 bg-background/5 px-4 py-2 font-black font-mono text-background/70 text-xs uppercase tracking-[0.25em] transition-colors hover:text-background"
                href={link.url}
                key={link.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Plus className="w-3 h-3" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
