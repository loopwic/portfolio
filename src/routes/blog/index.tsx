import { createFileRoute, Link } from "@tanstack/react-router";

import { PageAtmosphere } from "@/components/home/page-atmosphere";

import { BLOG_POSTS } from "./-constants";

const BlogPage = () => (
  <div className="relative isolate min-h-svh bg-background px-5 py-24 text-foreground selection:bg-foreground selection:text-background md:px-8 md:py-28">
    <PageAtmosphere />

    <main className="relative z-10 mx-auto w-full max-w-[896px]">
      <header className="flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.16em] text-foreground/68">
        <span>04</span>
        <span aria-hidden="true" className="h-px w-8 bg-foreground/18" />
        <h1 className="font-normal">博客</h1>
      </header>

      <ol className="mt-8 border-foreground/12 border-t">
        {BLOG_POSTS.map((post, index) => (
          <li className="border-foreground/12 border-b" key={post.slug}>
            <Link
              className="group grid gap-3 py-6 outline-none transition-colors duration-300 hover:bg-foreground/[0.018] focus-visible:bg-foreground/[0.035] md:grid-cols-[7rem_minmax(0,1fr)_6.5rem] md:gap-7 md:px-4 md:py-7"
              to={post.to}
            >
              <time
                className="font-mono text-2xs tracking-[0.08em] text-foreground/46 md:pt-1.5"
                dateTime={post.date}
              >
                {post.date.replaceAll("-", ".")}
              </time>

              <div className="min-w-0 transition-transform duration-500 ease-out group-hover:translate-x-1">
                <h2 className="font-display text-[clamp(1.3rem,2.3vw,1.65rem)] font-light leading-snug tracking-[-0.012em]">
                  {post.title}
                </h2>
                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-foreground/56 md:text-sm">
                  {post.summary}
                </p>
              </div>

              <div className="flex items-end justify-between gap-4 md:flex-col md:items-end md:justify-between">
                <span className="font-mono text-2xs uppercase tracking-[0.12em] text-foreground/42">
                  {post.tags[0]}
                </span>
                <span
                  aria-hidden="true"
                  className="font-mono text-2xs text-foreground/32 transition-colors duration-300 group-hover:text-foreground/72"
                >
                  {String(index + 1).padStart(2, "0")} ↗
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  </div>
);

export const Route = createFileRoute("/blog/")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "博客 — Loopwic" },
      { content: "Loopwic 的技术文章与前端实践记录。", name: "description" },
    ],
  }),
});
