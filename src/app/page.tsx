"use client";

import { motion, useAnimate } from "motion/react";
import { useEffect, useState } from "react";
import { About } from "@/components/about";
import Cursor from "@/components/cursor";
import { ScrollThresholdIndicator } from "@/components/scroll-threshold-indicator";
import { ScrollView } from "@/components/scroll-view";
import { useScrollContext } from "@/contexts/scroll-context";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { HERO_ANIMATIONS } from "@/lib/animations";

export default function HomePage() {
  const [buttonScope, animateButton] = useAnimate();
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const scope = buttonScope.current;
    if (!scope) {
      return;
    }

    const state = isMobile || isHovered ? "animate" : "initial";

    animateButton(
      scope,
      HERO_ANIMATIONS.button[state],
      HERO_ANIMATIONS.button.transition
    );
    animateButton(
      "#cover",
      HERO_ANIMATIONS.cover[state],
      HERO_ANIMATIONS.cover.transition
    );
    animateButton(
      "p",
      HERO_ANIMATIONS.text[state],
      HERO_ANIMATIONS.text.transition
    );
  }, [isMobile, isHovered, animateButton, buttonScope]);

  // 从context获取滚动状态
  const { scrollProgress, isAnimating, direction, translateY } =
    useScrollContext();

  // 使用context中的方向
  const scrollDirection = direction;
  const handleHoverStart = () => setIsHovered(true);
  const handleHoverEnd = () => setIsHovered(false);

  return (
    <div className="relative">
      <motion.div style={{ y: translateY }}>
        <div className="flex h-screen items-center justify-center" id="home">
          <ScrollView
            buttonScope={buttonScope}
            handleHoverEnd={handleHoverEnd}
            handleHoverStart={handleHoverStart}
          />
        </div>

        <About />

        <div
          className="flex h-screen items-center justify-center bg-gradient-to-b from-muted/20 to-muted/40"
          id="projects"
        >
          <div className="text-center">
            <h2 className="mb-4 font-bold text-4xl">Projects</h2>
            <p className="max-w-2xl text-muted-foreground">
              More content to ensure we have enough scroll height for the navbar
              animation.
            </p>
          </div>
        </div>
      </motion.div>

      <div
        className="flex h-screen items-center justify-center bg-gradient-to-b from-muted/20 to-muted/40"
        id="works"
      />

      {/* 滚动阈值指示器 */}
      <ScrollThresholdIndicator
        direction={scrollDirection}
        isVisible={!!scrollDirection && !isAnimating}
        progress={scrollProgress}
      />

      {!isMobile && <Cursor buttonRef={buttonScope} />}
    </div>
  );
}
