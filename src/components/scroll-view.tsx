"use client";

import { animate, motion, useMotionValue } from "motion/react";
import Image from "next/image";
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ScrollViewProps = {
  handleHoverStart: () => void;
  handleHoverEnd: () => void;
  buttonScope: RefObject<HTMLDivElement>;
};

const IMAGES = [
  "/images/home-0.jpg",
  "/images/home-1.jpg",
  "/images/home-2.jpg",
  "/images/home-3.jpg",
];

const IMAGE_TEXTS = [
  { title: "Welcome", subtitle: "Scroll to explore" },
  { title: "Explore", subtitle: "Journey begins here" },
  { title: "Create", subtitle: "Build something amazing" },
  { title: "Connect", subtitle: "Join our community" },
];

const SCROLL_IDLE_TIMEOUT = 1800;
const INDICATOR_FADE_DURATION = 0.22;

export const ScrollView = ({
  handleHoverStart,
  handleHoverEnd,
  buttonScope,
}: ScrollViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hideIndicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const pendingScrollRef = useRef({ scrollTop: 0, containerHeight: 0 });
  const currentIndexRef = useRef(0);
  const indicatorOpacity = useMotionValue(0);
  const indicatorOffsetY = useMotionValue(10);
  const activeIndicatorAnimationRef = useRef<ReturnType<typeof animate> | null>(
    null
  );

  const handleMouseEnter = useCallback(() => {
    handleHoverStart();
  }, [handleHoverStart]);

  const handleMouseLeave = useCallback(() => {
    handleHoverEnd();
  }, [handleHoverEnd]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const showIndicator = () => {
      hideIndicatorTimeoutRef.current &&
        clearTimeout(hideIndicatorTimeoutRef.current);

      activeIndicatorAnimationRef.current?.stop();
      activeIndicatorAnimationRef.current = animate(indicatorOpacity, 1, {
        duration: INDICATOR_FADE_DURATION,
        ease: "easeOut",
      });

      animate(indicatorOffsetY, 0, {
        duration: INDICATOR_FADE_DURATION,
        ease: "easeOut",
      });
    };

    const scheduleIndicatorHide = () => {
      hideIndicatorTimeoutRef.current &&
        clearTimeout(hideIndicatorTimeoutRef.current);

      hideIndicatorTimeoutRef.current = setTimeout(() => {
        activeIndicatorAnimationRef.current?.stop();
        activeIndicatorAnimationRef.current = animate(indicatorOpacity, 0, {
          duration: INDICATOR_FADE_DURATION,
          ease: "anticipate",
        });

        animate(indicatorOffsetY, 10, {
          duration: INDICATOR_FADE_DURATION,
          ease: "anticipate",
        });
      }, SCROLL_IDLE_TIMEOUT);
    };

    const processScrollFrame = () => {
      rafIdRef.current = null;
      const { scrollTop, containerHeight } = pendingScrollRef.current;

      if (containerHeight <= 0) {
        return;
      }

      const imageHeight = containerHeight;
      const maxScroll = imageHeight * (IMAGES.length - 1);
      const progressValue =
        maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

      progress.set(progressValue);

      const nextIndex = Math.min(
        IMAGES.length - 1,
        Math.max(0, Math.round(scrollTop / imageHeight))
      );

      if (currentIndexRef.current !== nextIndex) {
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
      }
    };

    const handleScroll = () => {
      pendingScrollRef.current = {
        scrollTop: container.scrollTop,
        containerHeight: container.clientHeight,
      };

      showIndicator();
      scheduleIndicatorHide();

      if (rafIdRef.current !== null) {
        return;
      }

      rafIdRef.current = requestAnimationFrame(processScrollFrame);
    };

    pendingScrollRef.current = {
      scrollTop: container.scrollTop,
      containerHeight: container.clientHeight,
    };
    processScrollFrame();

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);

      if (hideIndicatorTimeoutRef.current) {
        clearTimeout(hideIndicatorTimeoutRef.current);
      }

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      activeIndicatorAnimationRef.current?.stop();
    };
  }, [indicatorOffsetY, indicatorOpacity, progress]);

  return (
    <motion.div
      animate={{
        scale: 1,
        opacity: 1,
      }}
      className="relative cursor-none overflow-hidden"
      initial={{
        width: "20rem",
        height: "20rem",
        borderRadius: "var(--radius)",
        scale: 0.8,
        opacity: 0,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={buttonScope}
      transition={{ duration: 0.4 }}
    >
      <div
        className="scrollbar-none relative z-0 h-full w-full snap-y snap-mandatory overflow-y-auto"
        ref={containerRef}
      >
        {IMAGES.map((imageSrc, index) => (
          <div
            className="flex h-full w-full snap-start items-center justify-center"
            key={imageSrc}
          >
            <div className="relative h-full w-full">
              <Image
                alt={`Image ${index + 1}`}
                className="pointer-events-none select-none object-cover"
                fill
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
                quality={80}
                sizes="(max-width: 768px) 100vw, 80vw"
                src={imageSrc}
              />
            </div>
          </div>
        ))}
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex select-none flex-col items-center justify-center bg-black/30"
        id="cover"
        initial={{ opacity: 0 }}
      >
        <motion.p
          animate={{ y: 0, opacity: 1 }}
          className="hover-text font-semibold text-2xl text-white"
          initial={{ y: 20, opacity: 0 }}
          key={`title-${currentIndex}`}
          transition={{ duration: 0.3 }}
        >
          {IMAGE_TEXTS[currentIndex]?.title}
        </motion.p>
        <motion.p
          animate={{ y: 0, opacity: 1 }}
          className="hover-text text-white"
          initial={{ y: 20, opacity: 0 }}
          key={`subtitle-${currentIndex}`}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {IMAGE_TEXTS[currentIndex]?.subtitle}
        </motion.p>
      </motion.div>

      <motion.div
        className="-translate-x-1/2 absolute bottom-4 left-1/2 z-30 h-1 w-24 rounded-full bg-white/30"
        style={{ opacity: indicatorOpacity, y: indicatorOffsetY }}
      >
        <motion.div
          className="h-full rounded-full bg-white"
          style={{
            scaleX: progress,
            transformOrigin: "left center",
          }}
        />
      </motion.div>
    </motion.div>
  );
};
