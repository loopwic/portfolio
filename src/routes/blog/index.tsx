import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { BLOG_ANIMATIONS } from "@/lib/animations";
import { BLOG_POSTS } from "./-constants";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      {
        title: "Loopwic 的博客",
      },
      {
        name: "description",
        content: "Loopwic 的技术文章与实践记录。",
      },
    ],
  }),
  component: BlogPage,
});

const toDisplayDate = (value: string) => {
  const [year, month, day] = value.split("-").map((item) => Number(item));
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

function BlogPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-border/75 bg-card/85 p-5 lg:p-7"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div
            aria-hidden
            className="-top-16 -right-8 pointer-events-none absolute h-44 w-44 rounded-full bg-primary/10 blur-3xl"
          />

          <p className="mb-2 font-mono text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
            Notes / Engineering / Build Logs
          </p>
          <h1 className="font-semibold text-3xl tracking-tight lg:text-4xl">
            Loopwic 的博客
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground text-sm leading-relaxed">
            记录我做项目时的架构决策、踩坑过程与交付细节。重点是能复用、可落地，而不是“看起来很厉害”。
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 font-mono text-[0.66rem] text-muted-foreground uppercase tracking-[0.1em]">
              全部文章
            </span>
            <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 font-mono text-[0.66rem] text-muted-foreground">
              {BLOG_POSTS.length} 篇
            </span>
          </div>
        </motion.section>

        <motion.ul
          animate="visible"
          className="mt-4 space-y-3"
          initial="hidden"
          variants={BLOG_ANIMATIONS.container}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {BLOG_POSTS.map((post, index) => (
            <motion.li key={post.slug} variants={BLOG_ANIMATIONS.item}>
              <article className="group rounded-2xl border border-border/75 bg-card/80 px-5 py-5 transition-colors duration-250 hover:border-border lg:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[0.64rem] text-muted-foreground uppercase tracking-[0.12em]">
                    #{String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.16em]">
                    {toDisplayDate(post.date)}
                  </p>
                </div>

                <Link
                  className="mt-3 inline-flex items-center gap-1.5 font-semibold text-xl leading-tight tracking-tight transition-colors duration-200 group-hover:text-primary"
                  to={post.to}
                >
                  {post.title}
                  <ArrowUpRight className="group-hover:-translate-y-0.5 size-4 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>

                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  {post.summary}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li
                      className="rounded-full border border-border/70 bg-background/55 px-2.5 py-1 font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.08em]"
                      key={`${post.slug}-${tag}`}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
