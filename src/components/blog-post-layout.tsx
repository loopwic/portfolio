"use client";

import { useGSAP } from "@gsap/react";
import { MDXProvider } from "@mdx-js/react";
import { Link, useLocation } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import type { ReactNode } from "react";

import { Animation, Root } from "@/components/scrollytelling";
import { GSAP_EASE_POWER2 } from "@/lib/motion-tokens";
import { articleJsonLd } from "@/lib/seo";
import { useMDXComponents } from "@/mdx-components";
import { BLOG_POSTS } from "@/routes/blog/-constants";

import { TableOfContents } from "./table-of-contents";

const TRAILING_SLASH_PATTERN = /\/$/u;
const END_DOTS = ["end-dot-a", "end-dot-b", "end-dot-c", "end-dot-d"];

interface BlogPostLayoutProps {
  children: ReactNode;
}

export const BlogPostLayout = ({ children }: BlogPostLayoutProps) => {
  const container = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const pathname = location.pathname.replace(TRAILING_SLASH_PATTERN, "");
  const post = BLOG_POSTS.find((item) => item.to === pathname);

  useGSAP(
    () => {
      gsap.from(".post-element", {
        clearProps: "all",
        duration: 1,
        ease: GSAP_EASE_POWER2,
        opacity: 0,
        stagger: 0.1,
        y: 20,
      });
    },
    { scope: container }
  );

  const articleLd = post
    ? JSON.stringify(
        articleJsonLd({
          description: post.summary,
          path: post.to,
          publishedTime: post.date,
          title: post.title,
        })
      )
    : null;

  return (
    <Root end="bottom bottom" scrub start="top top">
      <div
        className="min-h-screen bg-background pt-32 pb-24 text-foreground selection:bg-foreground/20 selection:text-foreground relative overflow-hidden"
        ref={container}
      >
        {articleLd ? (
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is derived from typed post metadata
            dangerouslySetInnerHTML={{ __html: articleLd }}
            type="application/ld+json"
          />
        ) : null}
        <Animation tween={{ end: 100, start: 0, to: { scaleX: 1 } }}>
          <div className="fixed top-0 left-0 z-50 h-[1.5px] w-full origin-left scale-x-0 bg-foreground mix-blend-difference" />
        </Animation>

        {/* Background Pixel Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="mx-auto max-w-[1360px] px-5 lg:px-8 relative z-10">
          <div className="grid gap-16 lg:grid-cols-[12rem_minmax(0,760px)] xl:grid-cols-[12rem_minmax(0,760px)_18rem] xl:gap-20">
            <aside className="post-element lg:sticky lg:top-32">
              <Link
                className="group inline-flex items-center gap-3 font-mono font-medium text-xs text-foreground/50 uppercase tracking-widest transition-colors hover:text-foreground"
                to="/blog"
              >
                <span className="grid h-7 w-7 place-items-center border border-foreground/10 transition-all group-hover:border-foreground/30 group-hover:bg-foreground/5 group-hover:-translate-x-1">
                  <ArrowLeft className="h-3.5 w-3.5" />
                </span>
                Back
              </Link>

              <div className="mt-16 hidden border-t border-foreground/10 pt-8 lg:block relative">
                <div className="absolute -top-px right-0 w-1 h-1 bg-foreground/20" />
                <p className="font-mono text-2xs text-foreground/40 uppercase tracking-[0.2em]">
                  Log Type
                </p>
                <p className="mt-3 font-mono text-xs text-foreground/70 uppercase tracking-[0.16em] border-l border-foreground/20 pl-3">
                  Field Note
                </p>
                {post ? (
                  <>
                    <p className="mt-12 font-mono text-2xs text-foreground/40 uppercase tracking-[0.2em]">
                      Logged At
                    </p>
                    <p className="mt-3 font-mono text-tiny text-foreground/80">
                      {post.date}
                    </p>
                    <div className="mt-10 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          className="border border-foreground/10 bg-foreground/[0.02] px-2.5 py-1 font-mono text-3xs text-foreground/60 uppercase tracking-[0.16em] cursor-default"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </aside>

            <main className="min-w-0">
              <div className="post-element border-t border-foreground/20 pt-8 relative">
                <div className="absolute -top-px -right-px w-1.5 h-1.5 bg-foreground/20" />
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1 h-1 bg-foreground/40 block" />
                  <p className="font-mono text-2xs text-foreground/50 uppercase tracking-[0.2em]">
                    {post ? `${post.date} / ${post.tags[0]}` : "Field Note"}
                  </p>
                </div>
                {post ? (
                  <p className="max-w-2xl text-foreground/70 text-lg leading-relaxed border-l border-foreground/10 pl-6 font-serif">
                    {post.summary}
                  </p>
                ) : null}
              </div>

              <article className="post-element blog-prose mt-16 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:font-medium prose-a:border-b prose-a:border-foreground/30 hover:prose-a:border-foreground prose-a:no-underline transition-colors">
                <MDXProvider components={useMDXComponents()}>
                  {children}
                </MDXProvider>
              </article>

              <div className="post-element mt-24 border-t border-foreground/10 pt-8 flex items-center justify-between">
                <p className="font-mono text-2xs text-foreground/30 uppercase tracking-[0.2em]">
                  [ End of Note ]
                </p>
                <div className="flex gap-1 opacity-20">
                  {END_DOTS.map((dot) => (
                    <span className="w-1 h-1 bg-foreground" key={dot} />
                  ))}
                </div>
              </div>
            </main>

            <aside className="hidden xl:block">
              <div className="post-element sticky top-32 border-t border-foreground/10 pt-8 relative">
                <div className="absolute -top-px left-0 w-1.5 h-1.5 bg-foreground/10" />
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex gap-0.5">
                    <span className="h-1 w-1 bg-foreground/40" />
                    <span className="h-1 w-1 bg-foreground/20" />
                  </div>
                  <span className="font-mono text-2xs text-foreground/40 uppercase tracking-[0.2em]">
                    Index
                  </span>
                </div>
                <div className="font-mono text-tiny text-foreground/50 leading-[2.2]">
                  <TableOfContents />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Root>
  );
};
