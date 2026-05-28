import { Link } from "@tanstack/react-router";
import { HOME_SECTIONS } from "@/lib/site-data";
import { BLOG_POSTS } from "@/routes/blog/-constants";
import { SectionHeader } from "./section-header";

export function WritingSection() {
  const latestPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section
      className="scroll-section px-5 py-24 md:px-8 md:py-32 border-t border-foreground/10 bg-background"
      id={HOME_SECTIONS[3]}
    >
      <div className="mx-auto max-w-[1240px]">
        <SectionHeader index="03" title="Log" />

        <div className="mt-20 grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="scroll-fade font-display text-section-tight font-black uppercase leading-[0.9]">
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
                  <h3 className="font-display text-subtitle font-black uppercase leading-[1.1] tracking-tight group-hover:translate-x-2 transition-transform duration-300">
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
