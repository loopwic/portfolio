"use client";

import { useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import { ScrollProvider as ScrollProviderContext } from "@/contexts/scroll-context";
import { usePageScroll } from "@/hooks/use-page-scroll";

const HOME_SECTIONS = ["home", "about", "projects"];

export default function ScrollProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const {
    currentSectionIndex,
    scrollProgress,
    isAnimating,
    direction,
    scrollYProgress,
    scrollToSection,
  } = usePageScroll(HOME_SECTIONS, isHomePage);

  const scrollContextValue = {
    currentSectionIndex,
    scrollProgress,
    isAnimating,
    direction,
    scrollYProgress,
    scrollToSection,
  };

  return (
    <ScrollProviderContext value={scrollContextValue}>
      <Navbar />
      <main className="min-h-screen overflow-x-clip">{children}</main>
    </ScrollProviderContext>
  );
}
