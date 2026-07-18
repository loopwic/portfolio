"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const normalizePathname = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/$/u, "") : pathname;

const getPageLink = (pathname: string) => {
  if (pathname.startsWith("/blog/")) {
    return { label: "Blog", to: "/blog" as const };
  }

  if (pathname === "/blog") {
    return { label: "Home", to: "/" as const };
  }

  return { label: "Blog", to: "/blog" as const };
};

export const SiteUtilities = () => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = normalizePathname(location.pathname);
  const isDark = mounted && resolvedTheme === "dark";
  const ThemeIcon = isDark ? Sun : Moon;

  useEffect(() => setMounted(true), []);

  const pageLink = getPageLink(pathname);

  return (
    <nav
      aria-label="页面工具"
      className="fixed top-4 right-4 z-50 flex items-center rounded-full border border-foreground/10 bg-background/72 p-1 shadow-[0_8px_28px_rgba(0,0,0,0.035)] backdrop-blur-xl md:top-6 md:right-6 dark:shadow-[0_8px_28px_rgba(0,0,0,0.2)]"
    >
      <Link
        className="grid min-h-11 min-w-14 place-items-center rounded-full px-3 font-mono text-2xs uppercase tracking-[0.14em] text-foreground/62 transition-colors duration-300 hover:bg-foreground/[0.055] hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-1"
        to={pageLink.to}
      >
        {pageLink.label}
      </Link>
      <button
        aria-label={isDark ? "切换到日间模式" : "切换到夜间模式"}
        aria-pressed={isDark}
        className="group grid size-11 place-items-center rounded-full text-foreground/58 transition-[background-color,color,transform] duration-300 hover:bg-foreground/[0.055] hover:text-foreground active:scale-[0.94] focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-1 motion-reduce:transition-none"
        disabled={!mounted}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={isDark ? "日间模式" : "夜间模式"}
        type="button"
      >
        {mounted ? (
          <ThemeIcon
            aria-hidden="true"
            className="size-3.5 transition-transform duration-500 ease-[var(--ease-brutal)] group-hover:rotate-[18deg] group-active:scale-90 motion-reduce:transition-none"
            strokeWidth={1.5}
          />
        ) : (
          <span aria-hidden="true" className="size-3.5" />
        )}
      </button>
    </nav>
  );
};
