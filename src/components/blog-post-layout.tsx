"use client";

import { useGSAP } from "@gsap/react";
import { MDXProvider } from "@mdx-js/react";
import { useLocation } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useRef } from "react";
import type { ReactNode } from "react";

import { PageAtmosphere } from "@/components/home/page-atmosphere";
import { Animation, Root } from "@/components/scrollytelling";
import { GSAP_EASE_POWER2 } from "@/lib/motion-tokens";
import { articleJsonLd } from "@/lib/seo";
import { useMDXComponents } from "@/mdx-components";
import { BLOG_POSTS } from "@/routes/blog/-constants";

import { TableOfContents } from "./table-of-contents";

const TRAILING_SLASH_PATTERN = /\/$/u;

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
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        return;
      }

      gsap.from("[data-post-element]", {
        clearProps: "all",
        duration: 0.85,
        ease: GSAP_EASE_POWER2,
        opacity: 0,
        stagger: 0.08,
        y: 14,
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
        className="relative isolate min-h-svh overflow-hidden bg-background px-5 py-24 text-foreground selection:bg-foreground selection:text-background md:px-8 md:py-28"
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
          <div className="fixed top-0 left-0 z-[60] h-px w-full origin-left scale-x-0 bg-foreground/70" />
        </Animation>

        <PageAtmosphere />

        <div className="relative z-10 mx-auto w-full max-w-[1040px]">
          <header
            className="flex flex-wrap items-center gap-x-3 gap-y-2 border-foreground/12 border-b pb-6 font-mono text-2xs uppercase tracking-[0.14em] text-foreground/52"
            data-post-element=""
          >
            <span>Blog</span>
            <span aria-hidden="true" className="h-px w-6 bg-foreground/18" />
            {post ? <time dateTime={post.date}>{post.date}</time> : null}
            {post ? (
              <span className="ml-auto text-foreground/40">{post.tags[0]}</span>
            ) : null}
          </header>

          <div className="mt-10 grid gap-16 xl:grid-cols-[minmax(0,760px)_12rem] xl:gap-20">
            <main
              className="mx-auto w-full min-w-0 max-w-[760px] xl:mx-0"
              data-post-element=""
            >
              <article className="blog-prose max-w-none">
                <MDXProvider components={useMDXComponents()}>
                  {children}
                </MDXProvider>
              </article>

              <footer className="mt-20 border-foreground/12 border-t pt-6 font-mono text-2xs uppercase tracking-[0.14em] text-foreground/35">
                End / {post?.date.slice(0, 4) ?? "Loopwic"}
              </footer>
            </main>

            <aside className="hidden xl:block" data-post-element="">
              <div className="sticky top-28 border-foreground/12 border-t pt-5">
                <p className="mb-4 font-mono text-2xs uppercase tracking-[0.14em] text-foreground/40">
                  Index
                </p>
                <div className="text-xs leading-relaxed text-foreground/48">
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
