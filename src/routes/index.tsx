import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useState } from "react";
import { About } from "@/components/about";
import Cursor from "@/components/cursor";
import { Project } from "@/components/project";
import { ScrollThresholdIndicator } from "@/components/scroll-threshold-indicator";
import { ScrollView } from "@/components/scroll-view";
import { useScrollContext } from "@/contexts/scroll-context";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { HERO_ANIMATIONS } from "@/lib/animations";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const INDICATOR_MIN_PROGRESS = 0.12;

function HomePage() {
  const [buttonScope, animateButton] = useAnimate();
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { scrollProgress, isAnimating, direction, currentSectionIndex } =
    useScrollContext();
  const isHomeActive = currentSectionIndex === 0;
  const shouldExpand = isHomeActive && (isMobile || isHovered);
  const showThresholdIndicator =
    !!direction && !isAnimating && scrollProgress >= INDICATOR_MIN_PROGRESS;

  useEffect(() => {
    const scope = buttonScope.current;
    if (!scope) {
      return;
    }

    const state = shouldExpand ? "animate" : "initial";

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
  }, [shouldExpand, animateButton, buttonScope]);

  const scrollDirection = direction;
  const handleHoverStart = () => setIsHovered(true);
  const handleHoverEnd = () => setIsHovered(false);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {currentSectionIndex === 0 && (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="flex h-screen items-center justify-center"
            exit={{ opacity: 0, y: -20 }}
            id="home"
            initial={{ opacity: 0, y: 20 }}
            key="home-section"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ScrollView
              buttonScope={buttonScope}
              handleHoverEnd={handleHoverEnd}
              handleHoverStart={handleHoverStart}
              isActive={isHomeActive}
              isExpanded={shouldExpand}
              key={`scroll-view-${currentSectionIndex}`}
            />
          </motion.section>
        )}

        {currentSectionIndex === 1 && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            key="about-section"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <About />
          </motion.div>
        )}

        {currentSectionIndex === 2 && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            key="project-section"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Project />
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollThresholdIndicator
        direction={scrollDirection}
        isVisible={showThresholdIndicator}
        progress={scrollProgress}
      />

      {!isMobile && <Cursor buttonRef={buttonScope} />}
    </div>
  );
}
