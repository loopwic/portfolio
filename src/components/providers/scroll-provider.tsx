"use client";

import { useLocation } from "@tanstack/react-router";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { ScrollProvider as ScrollProviderContext } from "@/contexts/scroll-context";
import { HOME_SECTIONS } from "@/lib/site-data";

export default function ScrollProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    if (!isHomePage) {
      setCurrentSectionIndex(0);
      return;
    }

    const updateCurrentSection = () => {
      const sections = HOME_SECTIONS.map((id) => document.getElementById(id));
      const viewportMiddle = window.scrollY + window.innerHeight / 2;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        if (!el) {
          continue;
        }
        const sectionMiddle = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(viewportMiddle - sectionMiddle);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }

      setCurrentSectionIndex(closestIndex);
    };

    updateCurrentSection();
    window.addEventListener("scroll", updateCurrentSection, { passive: true });
    window.addEventListener("resize", updateCurrentSection);

    return () => {
      window.removeEventListener("scroll", updateCurrentSection);
      window.removeEventListener("resize", updateCurrentSection);
    };
  }, [isHomePage]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <ScrollProviderContext value={{ currentSectionIndex, scrollToSection }}>
      {children}
    </ScrollProviderContext>
  );
}
