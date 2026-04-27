"use client";

import { useGSAP } from "@gsap/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import {
  type HTMLAttributes,
  lazy,
  type RefObject,
  Suspense,
  useEffect,
  useRef,
} from "react";
import { KineticText } from "@/components/home/kinetic-text";
import {
  HOME_SECTIONS,
  PROFILE,
  PROJECTS,
  SITE,
  SOCIAL_LINKS,
} from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { BLOG_POSTS } from "./blog/-constants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const HeroTitleObject = lazy(
  () => import("@/components/home/hero-title-object")
);
const LiquidImage = lazy(() =>
  import("@/components/ui/liquid-image").then((module) => ({
    default: module.LiquidImage,
  }))
);

export const Route = createFileRoute("/")({
  component: HomePage,
});

const PRINCIPLES = [
  ["01. State", "Data flows. UI reacts."],
  ["02. Motion", "Explain with easing, not words."],
  ["03. Taste", "Pixel perfect down to the wire."],
] as const;

const TECH_LOGOS = [
  {
    label: "React",
    src: "https://cdn.simpleicons.org/react?viewbox=auto",
    size: "w-[clamp(2.4rem,4.6vw,4rem)]",
    x: "left-[27%]",
    y: "top-[48%]",
    rotate: "-rotate-6",
  },
  {
    label: "TypeScript",
    src: "https://cdn.simpleicons.org/typescript?viewbox=auto",
    size: "w-[clamp(2.2rem,4.1vw,3.5rem)]",
    x: "left-[38%]",
    y: "top-[35%]",
    rotate: "rotate-3",
  },
  {
    label: "JavaScript",
    src: "https://cdn.simpleicons.org/javascript?viewbox=auto",
    size: "w-[clamp(2.2rem,4.1vw,3.5rem)]",
    x: "left-[50%]",
    y: "top-[52%]",
    rotate: "-rotate-2",
  },
  {
    label: "GSAP",
    src: "https://cdn.simpleicons.org/gsap?viewbox=auto",
    size: "w-[clamp(2.7rem,5vw,4.3rem)]",
    x: "left-[68%]",
    y: "top-[43%]",
    rotate: "rotate-5",
  },
  {
    label: "Three.js",
    src: "https://cdn.simpleicons.org/threedotjs/049EF4?viewbox=auto",
    size: "w-[clamp(2.3rem,4.3vw,3.7rem)]",
    x: "left-[33%]",
    y: "top-[62%]",
    rotate: "rotate-2",
  },
  {
    label: "Docker",
    src: "https://cdn.simpleicons.org/docker?viewbox=auto",
    size: "w-[clamp(2.4rem,4.6vw,3.9rem)]",
    x: "left-[61%]",
    y: "top-[65%]",
    rotate: "-rotate-5",
  },
  {
    label: "Rust",
    src: "https://cdn.simpleicons.org/rust/B7410E?viewbox=auto",
    size: "w-[clamp(2.1rem,3.8vw,3.3rem)]",
    x: "left-[50%]",
    y: "top-[30%]",
    rotate: "rotate-6",
  },
  {
    label: "Go",
    src: "https://cdn.simpleicons.org/go?viewbox=auto",
    size: "w-[clamp(2.3rem,4.3vw,3.7rem)]",
    x: "left-[44%]",
    y: "top-[69%]",
    rotate: "-rotate-3",
  },
  {
    label: "Node.js",
    src: "https://cdn.simpleicons.org/nodedotjs?viewbox=auto",
    size: "w-[clamp(2.3rem,4.1vw,3.6rem)]",
    x: "left-[73%]",
    y: "top-[56%]",
    rotate: "rotate-2",
  },
  {
    label: "Hono",
    src: "https://cdn.simpleicons.org/hono/E36002?viewbox=auto",
    size: "w-[clamp(2.1rem,3.9vw,3.4rem)]",
    x: "left-[57%]",
    y: "top-[36%]",
    rotate: "-rotate-8",
  },
  {
    label: "Expo",
    src: "https://cdn.simpleicons.org/expo/635BFF?viewbox=auto",
    size: "w-[clamp(2rem,3.7vw,3.2rem)]",
    x: "left-[52%]",
    y: "top-[75%]",
    rotate: "rotate-4",
  },
] as const;

const PIXEL_SMILEY_CANVAS_SIZE = 96;
const PIXEL_SMILEY_GRID = 32;
const PIXEL_GRID_BRIGHT_THRESHOLD = 7;
const SMILEY_DRAW_DURATION_MS = 940;
const SMILEY_DRAW_DELAY_MS = 360;

const SMILEY_EYE_CELLS = [
  [11, 10],
  [12, 10],
  [13, 10],
  [10, 11],
  [11, 11],
  [12, 11],
  [11, 12],
  [12, 12],
  [13, 12],
  [12, 13],
  [13, 13],
  [14, 13],
  [11, 14],
  [12, 14],
  [13, 14],
  [10, 15],
  [11, 15],
  [12, 15],
  [19, 10],
  [20, 10],
  [21, 10],
  [18, 11],
  [19, 11],
  [20, 11],
  [19, 12],
  [20, 12],
  [21, 12],
  [20, 13],
  [21, 13],
  [22, 13],
  [19, 14],
  [20, 14],
  [21, 14],
  [18, 15],
  [19, 15],
  [20, 15],
] as const;

const SMILEY_MOUTH_CELLS = [
  [9, 19],
  [10, 20],
  [11, 21],
  [12, 22],
  [13, 22],
  [14, 23],
  [15, 23],
  [16, 24],
  [17, 24],
  [18, 24],
  [19, 24],
  [20, 23],
  [21, 23],
  [22, 22],
  [23, 21],
  [24, 20],
  [25, 19],
  [10, 21],
  [11, 22],
  [12, 23],
  [13, 23],
  [14, 24],
  [20, 24],
  [21, 24],
  [22, 23],
  [23, 22],
  [24, 21],
  [9, 20],
  [25, 18],
  [26, 18],
  [26, 19],
] as const;

const STYLE_MARKS = [
  "React",
  "GSAP",
  "Three.js",
  "TypeScript",
  "Shader UI",
  "Pixel Arts",
] as const;

function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.set(".intro-line", { yPercent: 110, opacity: 0, skewY: 10 });
      gsap.set(".fade-in", { y: 24, opacity: 0 });

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .to(".intro-line", {
          yPercent: 0,
          opacity: 1,
          skewY: 0,
          duration: reduceMotion ? 0.2 : 1.4,
          stagger: 0.15,
        })
        .to(
          ".fade-in",
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.2 : 1.0,
            stagger: 0.1,
          },
          "-=1.0"
        );

      if (reduceMotion) {
        gsap.set(".scroll-fade", { clearProps: "all" });
        gsap.set(".tech-sticker", { clearProps: "all" });
        return;
      }

      gsap.set(".tech-sticker", {
        filter: "blur(10px) saturate(1.35)",
        opacity: 0,
        rotateX: -82,
        rotateY: 54,
        rotateZ: -24,
        scale: 0.16,
        transformOrigin: "50% 50%",
        transformPerspective: 900,
        y: 140,
        z: -160,
      });
      gsap.set(".tech-sticker img", {
        transformOrigin: "50% 50%",
        transformPerspective: 900,
      });

      const protocolTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".protocol-pin",
          start: "top top",
          end: "+=1700",
          pin: true,
          scrub: 0.8,
        },
      });

      protocolTimeline
        .to(".protocol-copy", {
          opacity: 0.24,
          scale: 0.96,
          duration: 0.8,
          ease: "none",
        })
        .to(
          ".tech-sticker",
          {
            filter: "blur(0px) saturate(1)",
            opacity: 1,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            y: 0,
            z: 0,
            stagger: { each: 0.12, from: "center" },
            duration: 0.95,
            ease: "back.out(1.6)",
          },
          0.15
        )
        .to(
          ".sticker-field",
          {
            rotate: 1.5,
            scale: 1.02,
            duration: 1.4,
            ease: "none",
          },
          0.25
        );

      // Section reveal animations
      for (const section of gsap.utils.toArray<HTMLElement>(
        ".scroll-section"
      )) {
        gsap.fromTo(
          section.querySelectorAll(".scroll-fade"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Project item hover
      for (const item of gsap.utils.toArray<HTMLElement>(".project-item")) {
        const projectImage = item.querySelector(".project-img");
        const pixelDecs = item.querySelectorAll(".pixel-dec");
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });

        if (projectImage) {
          tl.to(projectImage, {
            scale: 1.05,
            duration: 0.8,
          });
        }

        if (pixelDecs.length > 0) {
          tl.to(
            pixelDecs,
            { opacity: 1, y: -4, stagger: 0.05, duration: 0.4 },
            0
          );
        }

        item.addEventListener("mouseenter", () => tl.play());
        item.addEventListener("mouseleave", () => tl.reverse());
      }

      // Magnetic Effect
      const magneticCleanups: Array<() => void> = [];
      for (const target of gsap.utils.toArray<HTMLElement>("[data-magnetic]")) {
        const onMove = (event: MouseEvent) => {
          const rect = target.getBoundingClientRect();
          gsap.to(target, {
            x: (event.clientX - rect.left - rect.width / 2) * 0.1,
            y: (event.clientY - rect.top - rect.height / 2) * 0.1,
            duration: 0.4,
            ease: "power2.out",
          });
        };
        const onLeave = () => {
          gsap.to(target, {
            x: 0,
            y: 0,
            duration: 0.32,
            ease: "power3.out",
          });
        };
        target.addEventListener("mousemove", onMove);
        target.addEventListener("mouseleave", onLeave);
        magneticCleanups.push(() => {
          target.removeEventListener("mousemove", onMove);
          target.removeEventListener("mouseleave", onLeave);
        });
      }

      return () => {
        for (const cleanup of magneticCleanups) {
          cleanup();
        }
      };
    },
    { scope: rootRef }
  );

  return (
    <div
      className="relative text-foreground selection:bg-foreground selection:text-background"
      ref={rootRef}
    >
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <WritingSection />
      <CTASection />
    </div>
  );
}

function HeroSection() {
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
            className="fade-in relative z-30 mb-8 block font-mono font-black text-xs uppercase tracking-[0.3em] opacity-70"
            mode="scatter"
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
          <div className="fade-in relative z-30 mt-16 max-w-4xl border-foreground/30 border-l pl-6">
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

function useCubeTitleMask(
  titleRef: RefObject<HTMLElement | null>,
  cubeRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    let frame = 0;

    const syncMask = () => {
      const cube = cubeRef.current;
      const title = titleRef.current;

      if (!(cube && title)) {
        return;
      }

      const cubeRect = cube.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const centerX = cubeRect.left + cubeRect.width / 2 - titleRect.left;
      const centerY = cubeRect.top + cubeRect.height / 2 - titleRect.top;
      const radiusX = cubeRect.width * 0.36;
      const radiusY = cubeRect.height * 0.43;

      title.style.setProperty("--hero-mask-x", `${centerX}px`);
      title.style.setProperty("--hero-mask-y", `${centerY}px`);
      title.style.setProperty("--hero-mask-rx", `${radiusX}px`);
      title.style.setProperty("--hero-mask-ry", `${radiusY}px`);
    };

    const tick = () => {
      syncMask();
      frame = window.requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("resize", syncMask);
    window.addEventListener("scroll", syncMask, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", syncMask);
      window.removeEventListener("scroll", syncMask);
    };
  }, [cubeRef, titleRef]);
}

function HeroHeadline({
  animated = true,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { animated?: boolean }) {
  const lineClassName = animated
    ? "intro-line inline-block origin-bottom-left"
    : "inline-block origin-bottom-left";
  const dotClassName = animated
    ? "fade-in mb-[2vw] h-4 w-4 animate-pulse bg-current md:h-8 md:w-8"
    : "mb-[2vw] h-4 w-4 animate-pulse bg-current md:h-8 md:w-8";

  return (
    <h1
      className={cn(
        "font-display text-[clamp(4rem,14.2vw,13rem)] font-black uppercase leading-[0.86] tracking-tight",
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
}

function AboutSection() {
  return (
    <section
      className="scroll-section relative overflow-hidden bg-background px-5 py-20 md:px-8 md:py-28"
      id={HOME_SECTIONS[1]}
    >
      <div className="absolute top-0 right-0 h-full w-[1px] bg-foreground/10" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground/10" />

      {/* Visual Conflict: Massive Background Typography */}
      <div className="pointer-events-none absolute -left-10 top-20 z-0 select-none text-[clamp(10rem,30vw,25rem)] font-display font-black leading-none text-foreground/[0.03] uppercase whitespace-nowrap">
        Protocol
      </div>

      <div className="protocol-pin mx-auto min-h-screen max-w-[1240px] relative z-10 grid content-center">
        <SectionHeader index="01" title="Protocol" />

        <div className="relative mt-12 min-h-[68vh] overflow-hidden border border-foreground/10">
          <div className="protocol-copy grid h-full min-h-[68vh] gap-10 p-6 md:p-10 lg:grid-cols-[0.86fr_1fr] lg:items-center">
            <h2 className="scroll-fade font-display text-[clamp(3.5rem,8vw,7rem)] font-black uppercase leading-[0.8] tracking-tight">
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
            <p className="font-mono text-[0.65rem] font-black uppercase tracking-[0.28em] text-foreground/45">
              Protocol Index
            </p>
            <div className="mt-8 grid gap-5">
              {PRINCIPLES.map(([label, copy]) => (
                <div
                  className="grid grid-cols-[4.5rem_1fr] items-baseline gap-4 border-foreground/10 border-b pb-5 last:border-b-0 last:pb-0"
                  key={label}
                >
                  <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.2em] text-foreground/35">
                    {label}
                  </p>
                  <p className="font-display text-[clamp(1.15rem,2vw,1.55rem)] font-black uppercase leading-tight tracking-widest">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid">
            <div className="scroll-fade flex items-center justify-between border-foreground/10 border-b px-6 py-4 md:px-8">
              <p className="font-mono text-[0.65rem] font-black uppercase tracking-[0.28em] text-foreground/45">
                History Log
              </p>
              <span className="h-2 w-2 bg-foreground" />
            </div>
            {PROFILE.works.map((work) => (
              <article
                className="scroll-fade group grid gap-4 border-foreground/10 border-b px-6 py-5 last:border-b-0 md:grid-cols-[0.2fr_1fr] md:px-8"
                key={work.company}
              >
                <p className="pt-1 font-mono text-[0.7rem] font-black text-foreground/50 uppercase tracking-widest">
                  {work.period}
                </p>
                <div>
                  <h3 className="flex flex-col gap-2 font-black text-[clamp(1.05rem,1.85vw,1.45rem)] uppercase tracking-widest md:flex-row md:items-center md:gap-4">
                    {work.company}
                    <span className="hidden md:inline-block text-foreground/20">
                      /
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-[0.2em] text-background bg-foreground px-3 py-1">
                      {work.role}
                    </span>
                  </h3>
                  <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-foreground/60">
                    {work.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechLogo({ logo }: { logo: (typeof TECH_LOGOS)[number] }) {
  return (
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
          draggable={false}
          height={160}
          src={logo.src}
          width={160}
        />
      </div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section
      className="scroll-section relative bg-background px-5 py-20 text-foreground md:px-8 md:py-28"
      id={HOME_SECTIONS[2]}
    >
      <div className="mx-auto max-w-[1240px]">
        <SectionHeader index="02" title="Output" />

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.36fr_1fr]">
          <div className="scroll-fade lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-[clamp(3.2rem,8vw,7.5rem)] font-black uppercase leading-[0.82] tracking-tight">
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
                    <div className="mb-5 flex items-center justify-between gap-4 font-mono text-[0.65rem] font-black uppercase tracking-[0.24em] text-foreground/45">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>{project.status}</span>
                    </div>
                    <h3 className="max-w-full overflow-hidden text-wrap break-words font-display text-[clamp(2.2rem,4.4vw,4.2rem)] font-black uppercase leading-[0.9] tracking-tight">
                      {project.name}
                    </h3>
                    <p className="mt-5 text-base font-semibold leading-relaxed text-foreground/62 md:text-lg">
                      {project.detail}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        className="border border-foreground/18 px-3 py-1.5 font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-foreground/55 transition-colors group-hover:border-foreground/35 group-hover:text-foreground"
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
                        className="project-img absolute inset-0 h-full w-full"
                        src={project.preview}
                      />
                    </Suspense>
                  ) : (
                    <PixelGrid />
                  )}
                  <div className="absolute top-0 right-0 bg-background/85 px-3 py-2 font-mono text-[0.58rem] font-black uppercase tracking-[0.2em] text-foreground/55">
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
}

function WritingSection() {
  const latestPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section
      className="scroll-section px-5 py-24 md:px-8 md:py-32 border-t border-foreground/10 bg-background"
      id={HOME_SECTIONS[3]}
    >
      <div className="mx-auto max-w-[1240px]">
        <SectionHeader index="03" title="Log" />

        <div className="mt-20 grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="scroll-fade font-display text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[0.9]">
            Field <br />
            <span className="text-foreground/30">Notes.</span>
          </h2>
          <div className="grid gap-0 border-t border-foreground/10">
            {latestPosts.map((post, index) => (
              <Link
                className="scroll-fade group grid gap-6 border-b border-foreground/10 py-12 transition-colors hover:border-foreground/30 md:grid-cols-[0.15fr_1fr] items-baseline"
                key={post.slug}
                to={post.to}
              >
                <span className="font-mono font-black text-xs uppercase tracking-[0.25em] text-foreground/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-mono text-xs text-foreground/40 uppercase tracking-widest mb-4">
                    {post.date}
                  </p>
                  <h3 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-black uppercase leading-[1.1] tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
            <div className="mt-16 scroll-fade">
              <Link
                className="inline-flex items-center gap-3 font-mono font-black text-sm uppercase tracking-[0.2em] text-foreground hover:opacity-60 transition-opacity"
                to="/blog"
              >
                [ Read Archive ]
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      className="scroll-section relative min-h-screen overflow-hidden bg-foreground px-5 py-24 text-background md:px-8 md:py-40"
      id={HOME_SECTIONS[4]}
    >
      <div className="relative z-10 mx-auto grid min-h-[70vh] max-w-[1240px] content-center">
        <SectionHeader index="04" inverse title="Ping" />
        <div className="mt-20 grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="scroll-fade grid justify-items-start">
            <h2 className="font-display text-[clamp(4.5rem,10vw,11rem)] font-black uppercase leading-[0.8] tracking-tighter text-background">
              Send <br />
              Ideas.
            </h2>
            <PixelSmiley />
          </div>
          <div className="scroll-fade flex flex-col items-start justify-center lg:border-background/25 lg:border-l-4 lg:pl-16">
            <p className="mb-14 max-w-[42rem] text-[clamp(1.15rem,1.7vw,1.45rem)] font-bold uppercase leading-relaxed tracking-widest text-background/72">
              Ready to build interactive systems or solidify a visual concept
              into code? Let's connect.
            </p>
            <a
              className="inline-block max-w-full break-all border-background/32 border-b-4 pb-2 text-left font-black font-display text-[clamp(2.25rem,3.35vw,4.1rem)] leading-[0.92] transition-colors hover:border-background lg:whitespace-nowrap"
              data-magnetic
              href={`mailto:${SITE.email}`}
            >
              {SITE.email}
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
}

function PixelSmiley() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const context = canvas?.getContext("2d");

    if (!(canvas && context && wrapper)) {
      return;
    }

    const cellSize = PIXEL_SMILEY_CANVAS_SIZE / PIXEL_SMILEY_GRID;
    let lineColor = getComputedStyle(wrapper).color || "#f4efe7";

    const resetCanvas = () => {
      canvas.width = PIXEL_SMILEY_CANVAS_SIZE;
      canvas.height = PIXEL_SMILEY_CANVAS_SIZE;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(
        0,
        0,
        PIXEL_SMILEY_CANVAS_SIZE,
        PIXEL_SMILEY_CANVAS_SIZE
      );
      context.imageSmoothingEnabled = false;
    };

    const paintCell = (x: number, y: number, color: string) => {
      context.fillStyle = color;
      context.fillRect(
        Math.round(x * cellSize),
        Math.round(y * cellSize),
        Math.ceil(cellSize),
        Math.ceil(cellSize)
      );
    };

    const allCells = [...SMILEY_EYE_CELLS, ...SMILEY_MOUTH_CELLS];
    let frame = 0;
    let startedAt = 0;
    let drawCount = 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const syncColor = () => {
      lineColor = getComputedStyle(wrapper).color || lineColor;
    };

    const paintCells = (cells: readonly (readonly [number, number])[]) => {
      syncColor();
      for (const [x, y] of cells) {
        paintCell(x, y, lineColor);
      }
    };

    const draw = (now: number) => {
      if (startedAt === 0) {
        startedAt = now;
      }

      const progress = Math.min(
        1,
        reduceMotion
          ? 1
          : Math.max(
              0,
              (now - startedAt - SMILEY_DRAW_DELAY_MS) / SMILEY_DRAW_DURATION_MS
            )
      );
      const visibleCount = Math.ceil(allCells.length * progress);

      context.clearRect(0, 0, canvas.width, canvas.height);
      paintCells(allCells.slice(0, visibleCount));

      if (progress < 1) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const startDrawing = () => {
      if (drawCount > 0) {
        return;
      }

      drawCount += 1;
      wrapper.classList.add("is-drawing");
      frame = window.requestAnimationFrame(draw);
    };

    resetCanvas();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startDrawing();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(wrapper);

    const themeObserver = new MutationObserver(() => {
      if (drawCount === 0) {
        return;
      }

      resetCanvas();
      paintCells(allCells);
    });
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => {
      observer.disconnect();
      themeObserver.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pixel-smiley pointer-events-none mt-4 h-[clamp(8rem,12vw,11rem)] w-[clamp(8rem,12vw,11rem)] text-current opacity-90 md:mt-2"
      ref={wrapperRef}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full fill-none stroke-current"
        viewBox="0 0 96 96"
      >
        <path
          className="pixel-smiley-outline"
          d="M44 8 C55 7 67 12 75 20 C83 28 87 41 84 53 C82 66 74 78 62 84 C49 91 34 87 24 80 C17 74 15 67 10 60 C6 54 12 47 9 40 C6 31 12 23 21 17 C28 12 35 9 44 8 Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5.5"
        />
      </svg>
      <canvas
        className="absolute inset-0 block h-full w-full [image-rendering:pixelated]"
        height={PIXEL_SMILEY_CANVAS_SIZE}
        ref={canvasRef}
        width={PIXEL_SMILEY_CANVAS_SIZE}
      />
    </div>
  );
}

function PixelGrid() {
  return (
    <div className="grid h-full place-items-center opacity-20">
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: 64 }).map((_, index) => (
          <span
            className="h-1.5 w-1.5 bg-current"
            key={`placeholder-${index}`}
            style={{
              opacity:
                (index * 17 + 11) % 10 > PIXEL_GRID_BRIGHT_THRESHOLD ? 1 : 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  index,
  title,
  inverse = false,
}: {
  index: string;
  title: string;
  inverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "scroll-fade flex items-center gap-4 font-mono font-black text-xs uppercase tracking-[0.3em]",
        inverse ? "text-background/50" : "text-foreground/40"
      )}
    >
      <span>[{index}]</span>
      <span
        className={cn(
          "h-px w-12",
          inverse ? "bg-background/30" : "bg-foreground/20"
        )}
      />
      <span>{title}</span>
    </div>
  );
}
