import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://loopwic.com";

const routes = [
  {
    path: "",
    changefreq: "monthly",
    priority: "1.0",
  },
  {
    path: "/blog",
    changefreq: "weekly",
    priority: "0.8",
  },
  {
    path: "/blog/configure-alacritty-from-scratch",
    changefreq: "yearly",
    priority: "0.5",
  },
  {
    path: "/blog/build-personal-blog-with-nextjs-and-mdx",
    changefreq: "yearly",
    priority: "0.5",
  },
  {
    path: "/blog/lattice-backend-ddd-refactor",
    changefreq: "yearly",
    priority: "0.7",
  },
] as const;

export const Route = createFileRoute("/sitemap/xml")({
  server: {
    handlers: {
      GET: () => {
        const lastModified = new Date().toISOString();
        const urls = routes
          .map(
            (route) => `
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastModified}</lastmod>
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
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
