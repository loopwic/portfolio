import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteUtilities } from "@/components/site-utilities";
import { buildSeo, personJsonLd } from "@/lib/seo";

import appCss from "@/styles.css?url";

const PERSON_LD = JSON.stringify(personJsonLd());

const RootLayout = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    disableTransitionOnChange
    enableSystem
    storageKey="loopwic-theme"
  >
    <SiteUtilities />
    <main className="min-h-screen overflow-x-clip">
      <Outlet />
    </main>
  </ThemeProvider>
);

const RootDocument = ({ children }: { children: ReactNode }) => (
  <html lang="zh-CN" suppressHydrationWarning>
    <head>
      <HeadContent />
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is static and built from typed config
        dangerouslySetInnerHTML={{ __html: PERSON_LD }}
        type="application/ld+json"
      />
    </head>
    <body className="min-h-screen bg-background font-sans text-foreground antialiased">
      {children}
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  component: RootLayout,
  head: () => {
    const seo = buildSeo();
    return {
      links: [
        { href: appCss, rel: "stylesheet" },
        { href: "/favicon.ico", rel: "icon" },
        ...seo.links,
        { href: "https://fonts.googleapis.com", rel: "preconnect" },
        {
          crossOrigin: "anonymous",
          href: "https://fonts.gstatic.com",
          rel: "preconnect",
        },
        { href: "https://cdn.loopwic.com", rel: "preconnect" },
        {
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;600&family=Noto+Serif+SC:wght@300;400;500;600&display=swap",
          rel: "stylesheet",
        },
      ],
      meta: [
        { charSet: "utf-8" },
        { content: "width=device-width, initial-scale=1", name: "viewport" },
        {
          content: "#fafafa",
          media: "(prefers-color-scheme: light)",
          name: "theme-color",
        },
        {
          content: "#111111",
          media: "(prefers-color-scheme: dark)",
          name: "theme-color",
        },
        ...seo.meta,
      ],
    };
  },
  shellComponent: RootDocument,
});
