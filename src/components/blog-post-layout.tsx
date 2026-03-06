import { MDXProvider } from "@mdx-js/react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useMDXComponents } from "@/mdx-components";
import { TableOfContents } from "./table-of-contents";

type BlogPostLayoutProps = {
  children: ReactNode;
};

export function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-4 xl:grid-cols-12 xl:gap-6">
          <main className="min-w-0 xl:col-span-9">
            <div className="mb-3">
              <Link
                className="inline-flex items-center gap-1 rounded-full border border-border/75 bg-card/75 px-3 py-1.5 font-mono text-[0.66rem] text-muted-foreground uppercase tracking-[0.08em] transition-colors hover:text-foreground"
                to="/blog"
              >
                <ArrowLeft className="size-3.5" />
                返回博客
              </Link>
            </div>

            <article className="blog-prose max-w-none rounded-2xl border border-border/75 bg-card/90 p-5 lg:p-8">
              <MDXProvider components={useMDXComponents()}>
                {children}
              </MDXProvider>
            </article>
          </main>

          <aside className="hidden min-h-0 xl:col-span-3 xl:block">
            <div className="sticky top-24 rounded-2xl border border-border/75 bg-card/85 p-4">
              <p className="mb-3 font-mono text-[0.64rem] text-muted-foreground uppercase tracking-[0.14em]">
                目录导航
              </p>
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
