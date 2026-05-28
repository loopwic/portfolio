import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { lazy, type ReactNode, Suspense, useEffect, useState } from "react";
import { SiteNav } from "@/components/nav/site-nav";
import ScrollProvider from "@/components/providers/scroll-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { buildSeo, personJsonLd } from "@/lib/seo";
import appCss from "@/styles.css?url";

const CustomCursor = lazy(() =>
  import("@/components/ui/custom-cursor").then((module) => ({
    default: module.CustomCursor,
  }))
);

function useCustomCursorEnabled() {
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
}

const PERSON_LD = JSON.stringify(personJsonLd());

export const Route = createRootRoute({
  head: () => {
    const seo = buildSeo();
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0a0a0a" },
        ...seo.meta,
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.ico" },
        ...seo.links,
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        { rel: "preconnect", href: "https://cdn.loopwic.com" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
        },
      ],
    };
  },
  shellComponent: RootDocument,
  component: RootLayout,
});

function RootLayout() {
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
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
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
}
