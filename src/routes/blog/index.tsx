"use client";

import { useGSAP } from "@gsap/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { BLOG_POSTS } from "./-constants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Loopwic Archive - Pixel Fusion" },
      { name: "description", content: "Loopwic 的技术文章与前端实践记录。" },
    ],
  }),
  component: BlogPage,
});

const toDisplayDate = (value: string) => {
  const [year, month, day] = value.split("-").map((item) => Number(item));
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

function BlogPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".header-element", {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
      });

      for (const item of gsap.utils.toArray<HTMLElement>(".blog-post-item")) {
        const _revealContent = item.querySelector(".reveal-content");

        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          onEnter: () => {
            gsap.to(item, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          },
        });

        // Hover Effect
        const tl = gsap.timeline({ paused: true });
        tl.to(item.querySelector(".pixel-indicator"), {
          scale: 1.5,
          rotation: 90,
          duration: 0.4,
          ease: "back.out(1.7)",
        }).to(
          item.querySelector(".post-title"),
          { x: 12, duration: 0.3, ease: "power2.out" },
          0
        );

        item.addEventListener("mouseenter", () => tl.play());
        item.addEventListener("mouseleave", () => tl.reverse());
      }
    },
    { scope: container }
  );

  return (
    <div
      className="min-h-screen bg-background pt-32 pb-24 text-foreground relative overflow-hidden"
      ref={container}
    >
      {/* Background Pixel Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-[1240px] px-5 lg:px-8">
        <header className="mb-14 grid gap-10 border-foreground/10 border-y py-10 lg:grid-cols-[0.38fr_1fr] lg:items-end lg:py-12">
          <div className="header-element">
            <div className="mb-7 flex items-center gap-4">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 bg-foreground" />
                <span className="h-1.5 w-1.5 bg-foreground opacity-50" />
              </div>
              <span className="font-mono text-2xs font-black text-muted-foreground uppercase tracking-[0.25em]">
                Archive / {BLOG_POSTS.length} Logs
              </span>
            </div>
            <p className="max-w-md text-base font-semibold leading-relaxed text-foreground/62 md:text-lg">
              这里记录我如何整理工具、拆解前端结构、把交互细节落成稳定的工程经验。像素级的记录。
            </p>
          </div>

          <h1 className="header-element text-left font-display text-hero-blog font-black uppercase leading-[0.78] tracking-tight lg:text-right">
            Signal <span className="text-muted-foreground">Trace</span>
          </h1>
        </header>

        <div className="grid gap-0 border-t border-foreground/10">
          {BLOG_POSTS.map((post, index) => (
            <Link
              className="blog-post-item group relative block py-10 opacity-0 translate-y-8 border-b border-foreground/10 hover:border-foreground/30 transition-colors"
              key={post.slug}
              to={post.to}
            >
              <div className="grid md:grid-cols-[0.15fr_1fr] gap-6 md:gap-12 items-baseline">
                <div className="font-mono font-black text-sm text-muted-foreground/60 uppercase tracking-widest flex items-center gap-4">
                  <span className="pixel-indicator w-2 h-2 bg-foreground/20 block" />
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="reveal-content">
                  <p className="font-mono font-black text-2xs text-foreground/50 uppercase tracking-[0.2em] mb-4">
                    {toDisplayDate(post.date)}{" "}
                    <span className="mx-2 opacity-30">/</span> {post.tags[0]}
                  </p>
                  <h2 className="post-title font-display text-title-blog font-black leading-[1.1] uppercase tracking-tight">
                    {post.title}
                  </h2>
                  <p className="mt-5 max-w-3xl text-foreground/60 leading-relaxed text-lg">
                    {post.summary}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        className="text-3xs font-mono font-bold uppercase tracking-[0.15em] text-foreground/50 bg-foreground/5 px-2 py-1"
                        key={`${post.slug}-${tag}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decor */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Plus className="w-6 h-6 text-foreground/30" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
