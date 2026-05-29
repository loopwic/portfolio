import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { SiteNav } from "@/components/nav/site-nav";
import ScrollProvider from "@/components/providers/scroll-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { buildSeo, personJsonLd } from "@/lib/seo";

import appCss from "@/styles.css?url";

const CustomCursor = lazy(async () => {
  const mod = await import("@/components/ui/custom-cursor");
  return { default: mod.CustomCursor };
});

const useCustomCursorEnabled = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setEnabled(!(coarse.matches || reduce.matches));
    };

    update();
    coarse.addEventListener("change", update);
    reduce.addEventListener("change", update);

    return () => {
      coarse.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  return enabled;
};

const PERSON_LD = JSON.stringify(personJsonLd());

const RootLayout = () => {
  const cursorEnabled = useCustomCursorEnabled();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <ScrollProvider>
        {cursorEnabled ? (
          <Suspense fallback={null}>
            <CustomCursor />
          </Suspense>
        ) : null}
        <SiteNav />
        <main className="min-h-screen overflow-x-clip">
          <Outlet />
        </main>
      </ScrollProvider>
    </ThemeProvider>
  );
};

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
          href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
          rel: "stylesheet",
        },
      ],
      meta: [
        { charSet: "utf-8" },
        { content: "width=device-width, initial-scale=1", name: "viewport" },
        { content: "#0a0a0a", name: "theme-color" },
        ...seo.meta,
      ],
    };
  },
  shellComponent: RootDocument,
});
