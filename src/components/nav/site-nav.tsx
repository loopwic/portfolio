"use client";

import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { useScrollContext } from "@/contexts/scroll-context";
import {
  CSS_EASE_BRUTAL,
  CSS_EASE_OUT_CUBIC,
  MS_NAV_INDICATOR,
  MS_THEME_WIPE,
} from "@/lib/motion-tokens";
import { HOME_SECTIONS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const BLOG_NAV_INDEX = HOME_SECTIONS.length;

const SCROLL_HIDE_THRESHOLD = 80;

const sectionLabels: Partial<Record<(typeof HOME_SECTIONS)[number], string>> = {
  about: "Protocol",
  cta: "Ping",
  hero: "Home",
  projects: "Output",
  writing: "Log",
};

const PixelLogo = () => (
  <div className="group inline-flex items-center gap-2">
    <span className="h-2 w-2 bg-current transition-transform group-hover:translate-x-0.5" />
    <span className="font-display text-brand font-black uppercase leading-none tracking-[0.12em]">
      Loopwic
    </span>
  </div>
);

export const SiteNav = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const { currentSectionIndex, scrollToSection } = useScrollContext();
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [indicator, setIndicator] = useState({
    left: 0,
    visible: false,
    width: 0,
  });

  let activeIndex = -1;
  if (pathname.startsWith("/blog")) {
    activeIndex = BLOG_NAV_INDEX;
  } else if (pathname === "/") {
    activeIndex = currentSectionIndex;
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useLayoutEffect(() => {
    const container = itemsContainerRef.current;
    const item = itemRefs.current[activeIndex];
    if (!(container && item) || activeIndex < 0) {
      setIndicator((prev) => ({ ...prev, visible: false }));
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setIndicator({
      left: itemRect.left - containerRect.left,
      visible: true,
      width: itemRect.width,
    });
  }, [activeIndex]);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const container = itemsContainerRef.current;
    if (!container) {
      return;
    }
    const observer = new ResizeObserver(() => {
      const item = itemRefs.current[activeIndex];
      if (!item) {
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      setIndicator({
        left: itemRect.left - containerRect.left,
        visible: true,
        width: itemRect.width,
      });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [activeIndex]);

  useEffect(() => {
    const updateVisibility = () => {
      const latest = window.scrollY;
      if (latest < SCROLL_HIDE_THRESHOLD) {
        setIsVisible(true);
        lastScrollY.current = latest;
        return;
      }
      setIsVisible(latest < lastScrollY.current);
      lastScrollY.current = latest;
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  const handleSectionClick = (sectionId: string) => {
    if (pathname !== "/") {
      navigate({ hash: sectionId, to: "/" });
      return;
    }
    scrollToSection(sectionId);
  };

  const toggleTheme = async (event: ReactMouseEvent<HTMLButtonElement>) => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>;
      };
    };
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduceMotion) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
      setTheme(nextTheme);
    });

    await transition.ready;
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0 at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: MS_THEME_WIPE,
        easing: CSS_EASE_OUT_CUBIC,
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 hidden border-foreground/10 border-b bg-background/95 px-5 py-3 text-foreground transition-transform duration-300 ease-out md:block",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-4">
          <nav className="flex items-center gap-6">
            <button
              className="mr-6 outline-none"
              onClick={() => handleSectionClick("hero")}
              type="button"
            >
              <PixelLogo />
            </button>

            <div
              className="relative flex items-center gap-6"
              ref={itemsContainerRef}
            >
              {HOME_SECTIONS.map((sectionId, index) => (
                <button
                  className={cn(
                    "relative py-1 font-black font-mono text-2xs uppercase tracking-[0.25em] outline-none transition-opacity duration-200",
                    pathname === "/" && index === currentSectionIndex
                      ? "opacity-100"
                      : "opacity-45 hover:opacity-100"
                  )}
                  key={sectionId}
                  onClick={() => handleSectionClick(sectionId)}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  type="button"
                >
                  {sectionLabels[sectionId]}
                </button>
              ))}

              <span className="mx-2 h-3 w-px bg-foreground/15" />

              <Link
                className={cn(
                  "relative py-1 font-black font-mono text-2xs uppercase tracking-[0.25em] outline-none transition-opacity duration-200",
                  pathname.startsWith("/blog")
                    ? "opacity-100"
                    : "opacity-45 hover:opacity-100"
                )}
                ref={(el) => {
                  itemRefs.current[BLOG_NAV_INDEX] = el;
                }}
                to="/blog"
              >
                Blog
              </Link>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-1 h-0.5 bg-foreground"
                style={{
                  left: `${indicator.left}px`,
                  opacity: indicator.visible ? 1 : 0,
                  transition: `left ${MS_NAV_INDICATOR}ms ${CSS_EASE_BRUTAL}, width ${MS_NAV_INDICATOR}ms ${CSS_EASE_BRUTAL}, opacity 180ms ease-out`,
                  width: `${indicator.width}px`,
                }}
              />
            </div>
          </nav>

          <button
            aria-label="Toggle theme"
            className="grid h-8 w-8 place-items-center opacity-60 hover:opacity-100 transition-opacity outline-none"
            onClick={toggleTheme}
            type="button"
          >
            {isMounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      <header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between bg-background/80 backdrop-blur-md px-5 md:hidden border-b border-foreground/10">
        <button
          className="outline-none"
          onClick={() => handleSectionClick("hero")}
          type="button"
        >
          <PixelLogo />
        </button>

        <div className="flex items-center gap-4">
          <Link
            className="font-black font-mono text-2xs uppercase tracking-[0.2em] opacity-60"
            to="/blog"
          >
            Blog
          </Link>
          <button
            aria-label="Toggle theme"
            className="grid h-8 w-8 place-items-center opacity-60"
            onClick={toggleTheme}
            type="button"
          >
            {isMounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>
    </>
  );
};
