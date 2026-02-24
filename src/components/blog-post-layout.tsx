import { MDXProvider } from "@mdx-js/react";
import type { ReactNode } from "react";
import { useMDXComponents } from "@/mdx-components";
import { TableOfContents } from "./table-of-contents";

type BlogPostLayoutProps = {
  children: ReactNode;
};

export function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          <main className="min-w-0 flex-1">
            <article className="prose prose-gray dark:prose-invert max-w-none rounded-xl border border-border/70 bg-card p-6 lg:p-8">
              <MDXProvider components={useMDXComponents()}>
                {children}
              </MDXProvider>
            </article>
          </main>

          <aside className="hidden w-64 shrink-0 xl:block">
            <div className="sticky top-24 rounded-xl border border-border/70 bg-card p-4">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
