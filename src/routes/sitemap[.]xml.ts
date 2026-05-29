import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/lib/site-data";

import { BLOG_POSTS } from "./blog/-constants";

interface SitemapRoute {
  path: string;
  changefreq: "yearly" | "monthly" | "weekly" | "daily";
  priority: string;
  lastmod?: string;
}

const STATIC_ROUTES: SitemapRoute[] = [
  { changefreq: "monthly", path: "", priority: "1.0" },
  { changefreq: "weekly", path: "/blog", priority: "0.8" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const fallback = new Date().toISOString();
        const blogRoutes: SitemapRoute[] = BLOG_POSTS.map((post) => ({
          changefreq: "yearly",
          lastmod: new Date(post.date).toISOString(),
          path: post.to,
          priority: "0.7",
        }));

        const urls = [...STATIC_ROUTES, ...blogRoutes]
          .map(
            (route) => `
  <url>
    <loc>${SITE.url}${route.path}</loc>
    <lastmod>${route.lastmod ?? fallback}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
          )
          .join("");

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

        return new Response(body, {
          headers: {
            "Cache-Control": "public, max-age=300",
            "Content-Type": "application/xml; charset=utf-8",
          },
        });
      },
    },
  },
});
