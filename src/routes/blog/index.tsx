import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BLOG, EASE_BRUTAL, DURATION_SECTION } from "@/lib/animations";
import { BLOG_POSTS } from "./-constants";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Loopwic 的博客" },
      { name: "description", content: "Loopwic 的技术文章与实践记录。" },
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
    <div className="min-h-screen pt-20 pb-16 md:pb-12">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="flex items-baseline justify-between">
          <h1 className="font-display font-bold text-[length:var(--type-display)] tracking-tight">
            BLOG
          </h1>
          <span className="brutal-mono">{BLOG_POSTS.length} POSTS</span>
        </div>

        <div className="brutal-divider mt-4" data-size="lg" />

        {/* Post list */}
        <motion.div
          animate="visible"
          className="mt-2"
          initial="hidden"
          variants={BLOG.container}
        >
          {BLOG_POSTS.map((post, index) => (
            <motion.div key={post.slug} variants={BLOG.item}>
              <Link
                className="group flex items-baseline gap-4 py-6 transition-transform duration-200 hover:translate-x-3 md:gap-6"
                to={post.to}
              >
                {/* Index number */}
                <span className="font-display font-bold text-[length:var(--type-h1)] text-muted-foreground/20 transition-colors duration-200 group-hover:text-signal-a">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-[length:var(--type-h2)] tracking-tight transition-all duration-200 group-hover:tracking-wide">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                    {post.summary}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li className="brutal-tag" key={`${post.slug}-${tag}`}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Date */}
                <span className="brutal-mono hidden shrink-0 md:block">
                  {toDisplayDate(post.date)}
                </span>
              </Link>

              {index < BLOG_POSTS.length - 1 && (
                <div className="brutal-divider" data-size="sm" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
