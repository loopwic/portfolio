import { Link } from "@tanstack/react-router";
import { HOME_SECTIONS } from "@/lib/site-data";
import { BLOG_POSTS } from "@/routes/blog/-constants";
import { SectionHeader } from "./section-header";

const latestPosts = [...BLOG_POSTS]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 5);

export function WritingSection() {
  return (
    <section
      className="writing-pin relative flex min-h-screen flex-col justify-center overflow-x-hidden border-foreground/10 border-t bg-background py-20 lg:h-screen lg:overflow-hidden lg:py-0"
      id={HOME_SECTIONS[3]}
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 md:px-8">
        <SectionHeader index="03" title="Log" />
        <div className="mt-8 flex items-end justify-between gap-8">
          <h2 className="font-display text-section-tight font-black uppercase leading-[0.9]">
            Field <br />
            <span className="text-foreground/30">Notes.</span>
          </h2>
          <div className="hidden shrink-0 flex-col items-end gap-3 lg:flex">
            <span className="font-mono text-2xs font-black uppercase tracking-[0.25em] text-foreground/45">
              Scroll →
            </span>
            <span className="block h-px w-32 overflow-hidden bg-foreground/15">
              <span className="writing-progress block h-full w-full origin-left scale-x-0 bg-foreground" />
            </span>
          </div>
        </div>
      </div>

      <div className="writing-rail mt-12 w-full snap-x snap-mandatory pb-2 lg:mt-16">
        <div className="writing-track flex w-max gap-5 px-5 md:gap-6 md:px-8 lg:pl-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:pr-[clamp(3rem,12vw,12rem)]">
          {latestPosts.map((post, index) => (
            <Link
              className="writing-card group flex h-[62vh] max-h-[30rem] w-[clamp(17rem,82vw,23rem)] shrink-0 snap-start flex-col justify-between border border-foreground/15 bg-background p-7 transition-colors duration-300 hover:border-foreground/40 lg:h-[56vh] lg:max-h-[30rem] lg:w-[clamp(22rem,27vw,27rem)] lg:p-9"
              key={post.slug}
              to={post.to}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-2xs font-black uppercase tracking-[0.24em] text-foreground/45">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="mt-8 line-clamp-3 break-words font-display text-subtitle font-black uppercase leading-[1.02] tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-1">
                  {post.title}
                </h3>
                <p className="mt-5 line-clamp-4 text-foreground/60 text-sm leading-relaxed md:text-base">
                  {post.summary}
                </p>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      className="border border-foreground/18 px-2.5 py-1 font-mono text-3xs font-black uppercase tracking-[0.16em] text-foreground/55 transition-colors group-hover:border-foreground/35 group-hover:text-foreground"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span
                  aria-hidden="true"
                  className="inline-flex shrink-0 items-center gap-2 self-end font-mono text-3xs font-black uppercase tracking-[0.22em] text-foreground/55 transition-colors group-hover:text-foreground"
                >
                  Read
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}

          <Link
            className="writing-card group flex h-[62vh] max-h-[30rem] w-[clamp(15rem,72vw,20rem)] shrink-0 snap-start flex-col justify-between border-2 border-foreground bg-background p-7 transition-colors duration-300 hover:bg-foreground hover:text-background lg:h-[56vh] lg:max-h-[30rem] lg:w-[clamp(18rem,22vw,22rem)] lg:p-9"
            to="/blog"
          >
            <span className="font-mono text-2xs font-black uppercase tracking-[0.24em] opacity-50">
              [ Archive ]
            </span>
            <div>
              <h3 className="break-words font-display text-[clamp(1.75rem,3vw,2.5rem)] font-black uppercase leading-[0.95] tracking-tight">
                Read <br />
                Everything.
              </h3>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.2em] transition-[gap] duration-200 group-hover:gap-4">
                All notes
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
