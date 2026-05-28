"use client";

import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useRef } from "react";
import { AboutSection } from "@/components/home/about-section";
import { CTASection } from "@/components/home/cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { WritingSection } from "@/components/home/writing-section";

const HomeAnimations = lazy(() =>
  import("@/components/home/home-animations").then((module) => ({
    default: module.HomeAnimations,
  }))
);

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative text-foreground selection:bg-foreground selection:text-background"
      ref={rootRef}
    >
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <WritingSection />
      <CTASection />
      <Suspense fallback={null}>
        <HomeAnimations scope={rootRef} />
      </Suspense>
    </div>
  );
}
