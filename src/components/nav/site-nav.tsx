"use client";

import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useScrollContext } from "@/contexts/scroll-context";
import { HOME_SECTIONS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const SCROLL_HIDE_THRESHOLD = 80;

const sectionLabels: Partial<Record<(typeof HOME_SECTIONS)[number], string>> = {
  hero: "Home",
  about: "Protocol",
  projects: "Output",
  writing: "Log",
  cta: "Ping",
};

function PixelLogo() {
  return (
    <div className="group inline-flex items-center gap-2">
      <span className="h-2 w-2 bg-current transition-transform group-hover:translate-x-0.5" />
      <span className="font-display text-[1.05rem] font-black uppercase leading-none tracking-[0.12em]">
        Loopwic
      </span>
    </div>
  );
}

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
      navigate({ to: "/", hash: sectionId });
      return;
    }
    scrollToSection(sectionId);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
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

            {HOME_SECTIONS.map((sectionId, index) => (
              <button
                className={cn(
                  "relative py-1 font-black font-mono text-[0.65rem] uppercase tracking-[0.25em] transition-all hover:opacity-100 outline-none",
                  pathname === "/" && index === currentSectionIndex
                    ? "opacity-100 before:absolute before:left-0 before:-bottom-1 before:h-0.5 before:w-full before:bg-foreground"
                    : "opacity-45 hover:before:absolute hover:before:left-0 hover:before:-bottom-1 hover:before:h-px hover:before:w-full hover:before:bg-foreground/40"
                )}
                key={sectionId}
                onClick={() => handleSectionClick(sectionId)}
                type="button"
              >
                {sectionLabels[sectionId]}
              </button>
            ))}

            <span className="mx-2 h-3 w-px bg-foreground/15" />

            <Link
              className={cn(
                "relative py-1 font-black font-mono text-[0.65rem] uppercase tracking-[0.25em] transition-all hover:opacity-100 outline-none",
                pathname.startsWith("/blog")
                  ? "opacity-100 before:absolute before:left-0 before:-bottom-1 before:h-0.5 before:w-full before:bg-foreground"
                  : "opacity-45 hover:before:absolute hover:before:left-0 hover:before:-bottom-1 hover:before:h-px hover:before:w-full hover:before:bg-foreground/40"
              )}
              to="/blog"
            >
              Blog
            </Link>
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
            className="font-black font-mono text-[0.68rem] uppercase tracking-[0.2em] opacity-60"
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
}
