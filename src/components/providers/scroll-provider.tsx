"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import { ScrollProvider as ScrollProviderContext } from "@/contexts/scroll-context";
import { usePageScroll } from "@/hooks/use-page-scroll";

export default function ScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // 定义各个section的ID
  const sections = ["home", "about", "projects"];

  const {
    currentSectionIndex,
    scrollProgress,
    isAnimating,
    direction,
    scrollYProgress,
    scrollToSection,
  } = usePageScroll(sections, isHomePage);

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
      <main className="container mx-auto">{children}</main>
    </ScrollProviderContext>
  );
}
