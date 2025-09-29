"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import { ScrollProvider } from "@/contexts/scroll-context";
import { usePageScroll } from "@/hooks/use-page-scroll";

export default function ClientLayout({ children }: { children: ReactNode }) {
  // 定义各个section的ID
  const sections = ["home", "about", "projects", "works"];

  const {
    currentSectionIndex,
    scrollProgress,
    isAnimating,
    direction,
    scrollYProgress,
    translateY,
  } = usePageScroll(sections);

  const scrollContextValue = {
    currentSectionIndex,
    scrollProgress,
    isAnimating,
    direction,
    scrollYProgress,
    translateY,
  };

  return (
    <ScrollProvider value={scrollContextValue}>
      <Navbar />
      <main className="container mx-auto">{children}</main>
    </ScrollProvider>
  );
}
