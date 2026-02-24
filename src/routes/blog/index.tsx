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

function BlogPage() {
  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="border-border/80 border-b pb-8"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="mb-2 font-mono text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em]">
            Notes / Engineering / Build Logs
          </p>
          <h1 className="font-semibold text-3xl tracking-tight lg:text-4xl">
            Loopwic 的博客
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground text-sm leading-relaxed">
            记录我做项目时的架构决策、踩坑过程与交付细节。重点是能复用、可落地，而不是“看起来很厉害”。
          </p>
        </motion.section>

        <motion.ul
          animate="visible"
          className="mt-3 divide-y divide-border/80"
          initial="hidden"
          variants={BLOG_ANIMATIONS.container}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {BLOG_POSTS.map((post) => (
            <motion.li key={post.slug} variants={BLOG_ANIMATIONS.item}>
              <article className="group py-6">
                <div className="mb-2">
                  <p className="font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.16em]">
                    {post.date}
                  </p>
                </div>

                <Link
                  className="inline-flex items-center gap-1.5 font-semibold text-xl leading-tight tracking-tight transition-colors duration-200 group-hover:text-primary"
                  to={post.to}
                >
                  {post.title}
                  <ArrowUpRight className="size-4 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                </Link>

                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  {post.summary}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li
                      className="rounded-full border border-border/80 px-2.5 py-1 font-mono text-[0.68rem] text-muted-foreground uppercase tracking-[0.08em]"
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
