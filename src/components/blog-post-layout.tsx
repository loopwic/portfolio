import { MDXProvider } from "@mdx-js/react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMDXComponents } from "@/mdx-components";
import { TableOfContents } from "./table-of-contents";

type BlogPostLayoutProps = {
  children: ReactNode;
};

export function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return (
    <div className="min-h-screen pt-20 pb-16 md:pb-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-6 xl:grid-cols-12 xl:gap-8">
          <main className="min-w-0 xl:col-span-9">
            <div className="mb-4">
              <Link
                className="brutal-mono inline-flex items-center gap-1 border-2 border-border-hard px-3 py-1.5 transition-colors hover:bg-foreground hover:text-background"
                to="/blog"
              >
                ← 返回博客
              </Link>
            </div>

            <article className="blog-prose max-w-none border-2 border-border-hard p-5 lg:p-8">
              <MDXProvider components={useMDXComponents()}>
                {children}
              </MDXProvider>
            </article>
          </main>

          <aside className="hidden min-h-0 xl:col-span-3 xl:block">
            <div className="sticky top-20 border-2 border-border-hard p-4">
              <p className="brutal-mono mb-3">目录导航</p>
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
