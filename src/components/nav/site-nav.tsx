"use client";

import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useScrollContext } from "@/contexts/scroll-context";
import { NAV_ITEMS, HOME_SECTIONS, SITE } from "@/lib/site-data";
import { NAV, EASE_BRUTAL, DURATION_FAST } from "@/lib/animations";
import { cn } from "@/lib/utils";

const SCROLL_HIDE_THRESHOLD = 80;

export function SiteNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { currentSectionIndex, scrollToSection } = useScrollContext();
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < SCROLL_HIDE_THRESHOLD) {
      setIsVisible(true);
      lastScrollY.current = latest;
      return;
    }
    setIsVisible(latest < lastScrollY.current);
    lastScrollY.current = latest;
  });

  const handleSectionClick = (sectionId: string) => {
    if (pathname !== "/") {
      navigate({ to: "/", hash: sectionId });
      return;
    }
    scrollToSection(sectionId);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const homeSectionLinks = HOME_SECTIONS.filter(
    (s) => s === "hero" || s === "about" || s === "projects"
  );
  const sectionLabels: Record<string, string> = {
    hero: "HOME",
    about: "ABOUT",
    projects: "PROJECTS",
  };

  return (
    <>
      {/* Desktop nav — top bar */}
      <motion.header
        animate={isVisible ? NAV.show : NAV.hide}
        className="fixed inset-x-0 top-0 z-99 hidden border-border-hard border-b-2 bg-background/90 backdrop-blur-md md:block"
        initial={NAV.show}
        transition={NAV.transition}
      >
        <nav className="container mx-auto flex h-14 items-center justify-between px-4">
          <button
            className="font-display font-bold text-lg tracking-tight"
            onClick={() => handleSectionClick("hero")}
            type="button"
          >
            {SITE.title}
          </button>

          <div className="flex items-center gap-6">
            {homeSectionLinks.map((sectionId, index) => (
              <button
                className={cn(
                  "brutal-mono relative py-1 transition-colors hover:text-foreground",
                  pathname === "/" && index === currentSectionIndex
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                key={sectionId}
                onClick={() => handleSectionClick(sectionId)}
                type="button"
              >
                {sectionLabels[sectionId]}
                {pathname === "/" && index === currentSectionIndex && (
                  <motion.span
                    className="absolute inset-x-0 -bottom-0.5 h-[3px] bg-signal-a"
                    layoutId="nav-underline"
                    transition={{
                      duration: DURATION_FAST,
                      ease: EASE_BRUTAL,
                    }}
                  />
                )}
              </button>
            ))}
            <Link
              className={cn(
                "brutal-mono relative py-1 transition-colors hover:text-foreground",
                pathname.startsWith("/blog")
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
              to="/blog"
            >
              BLOG
              {pathname.startsWith("/blog") && (
                <span className="absolute inset-x-0 -bottom-0.5 h-[3px] bg-signal-a" />
              )}
            </Link>

            <button
              aria-label="Toggle theme"
              className="brutal-mono ml-2 border-2 border-border-hard px-2 py-1 transition-colors hover:bg-foreground hover:text-background"
              onClick={toggleTheme}
              type="button"
            >
              {isMounted ? (resolvedTheme === "dark" ? "LIGHT" : "DARK") : "—"}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile nav — bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-99 flex h-12 items-center justify-around border-border-hard border-t-2 bg-background/90 backdrop-blur-md md:hidden">
        {homeSectionLinks.map((sectionId, index) => (
          <button
            className={cn(
              "brutal-mono transition-colors",
              pathname === "/" && index === currentSectionIndex
                ? "text-signal-a"
                : "text-muted-foreground"
            )}
            key={sectionId}
            onClick={() => handleSectionClick(sectionId)}
            type="button"
          >
            {sectionLabels[sectionId]}
          </button>
        ))}
        <Link
          className={cn(
            "brutal-mono transition-colors",
            pathname.startsWith("/blog")
              ? "text-signal-a"
              : "text-muted-foreground"
          )}
          to="/blog"
        >
          BLOG
        </Link>
        <button
          aria-label="Toggle theme"
          className={cn(
            "brutal-mono transition-colors",
            "text-muted-foreground"
          )}
          onClick={toggleTheme}
          type="button"
        >
          {isMounted ? (resolvedTheme === "dark" ? "LT" : "DK") : "—"}
        </button>
      </nav>
    </>
  );
}
