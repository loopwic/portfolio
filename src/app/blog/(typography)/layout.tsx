import type { ReactNode } from "react";
import { TableOfContents } from "@/components/table-of-contents";

type BlogLayoutProps = {
  children: ReactNode;
};

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* 主要内容 */}
        <main className="min-w-0 flex-1">
          <article className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </article>
        </main>

        {/* 侧边栏目录 - 只在大屏幕显示 */}
        <aside className="hidden w-64 shrink-0 xl:block">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
