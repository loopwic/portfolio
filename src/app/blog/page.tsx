"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { BLOG_ANIMATIONS } from "@/lib/animations";
import { BLOG_POSTS } from "./constants";

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-xl">Loopwic的博客</h1>

      <motion.ul
        animate="visible"
        className="divide-y"
        initial="hidden"
        variants={BLOG_ANIMATIONS.container}
        viewport={{ once: true }}
        whileInView="visible"
      >
        {BLOG_POSTS.map((post) => (
          <motion.li
            className="space-y-2 py-2"
            key={post.slug}
            variants={BLOG_ANIMATIONS.item}
          >
            <Link
              className="font-bold hover:text-blue hover:underline"
              href={`/blog/${post.slug}`}
            >
              {post.title}
            </Link>

            <p className="text-gray-500 text-sm">{post.summary}</p>
            <p className="text-gray-500 text-sm">{post.date}</p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
