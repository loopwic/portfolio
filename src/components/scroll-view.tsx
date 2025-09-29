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
import {
  SCROLL_VIEW_ANIMATIONS,
  SCROLL_VIEW_CONTAINER_TRANSITION,
  SCROLL_VIEW_CONTAINER_VARIANTS,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

type ScrollViewProps = {
  handleHoverStart?: () => void;
  handleHoverEnd?: () => void;
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

export const ScrollView = ({
  handleHoverStart,
  handleHoverEnd,
  buttonScope,
}: ScrollViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hideIndicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const indicatorOpacity = useMotionValue(0);
  const indicatorOffsetY = useMotionValue(10);
  const activeIndicatorAnimationRef = useRef<ReturnType<typeof animate> | null>(
    null
  );

  const updateScrollProgress = useCallback(
    (scrollTop: number, containerHeight: number) => {
      if (containerHeight <= 0) {
        return;
      }

      const imageHeight = containerHeight;
      const maxScroll = imageHeight * (IMAGES.length - 1);
      const progressValue =
        maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

      progress.set(progressValue);
      scrollProgress.set(progressValue);

      const nextIndex = Math.min(
        IMAGES.length - 1,
        Math.max(0, Math.round(scrollTop / imageHeight))
      );

      if (currentIndexRef.current !== nextIndex) {
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
      }
    },
    [progress, scrollProgress]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    handleHoverStart?.();
  }, [handleHoverStart]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    handleHoverEnd?.();
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
        duration: SCROLL_VIEW_ANIMATIONS.indicatorFadeDuration,
        ease: "easeOut",
      });

      animate(indicatorOffsetY, 0, {
        duration: SCROLL_VIEW_ANIMATIONS.indicatorFadeDuration,
        ease: "easeOut",
      });
    };

    const scheduleIndicatorHide = () => {
      hideIndicatorTimeoutRef.current &&
        clearTimeout(hideIndicatorTimeoutRef.current);

      hideIndicatorTimeoutRef.current = setTimeout(() => {
        activeIndicatorAnimationRef.current?.stop();
        activeIndicatorAnimationRef.current = animate(indicatorOpacity, 0, {
          duration: SCROLL_VIEW_ANIMATIONS.indicatorFadeDuration,
          ease: "anticipate",
        });

        animate(indicatorOffsetY, 10, {
          duration: SCROLL_VIEW_ANIMATIONS.indicatorFadeDuration,
          ease: "anticipate",
        });
      }, SCROLL_VIEW_ANIMATIONS.scrollIdleTimeout);
    };

    const processScrollFrame = () => {
      rafIdRef.current = null;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      updateScrollProgress(scrollTop, containerHeight);
    };

    const handleScroll = () => {
      showIndicator();
      scheduleIndicatorHide();

      if (rafIdRef.current !== null) {
        return;
      }

      rafIdRef.current = requestAnimationFrame(processScrollFrame);
    };

    // 初始化
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
  }, [updateScrollProgress, indicatorOffsetY, indicatorOpacity]);

  const containerClassName = cn(
    "relative",
    "max-h-[80vh]",
    "overflow-hidden",
    "rounded-lg",
    "md:cursor-none"
  );

  return (
    <motion.div
      animate={isHovered ? "hover" : "rest"}
      className={containerClassName}
      initial="rest"
      layout
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={buttonScope}
      style={{ maxWidth: "100%" }}
      transition={SCROLL_VIEW_CONTAINER_TRANSITION}
      variants={SCROLL_VIEW_CONTAINER_VARIANTS}
    >
      <div className="relative h-full w-full">
        {/* 滚动容器 */}
        <div
          className="scrollbar-none relative z-0 h-full w-full snap-y snap-mandatory overflow-y-auto"
          ref={containerRef}
          style={{
            willChange: "scroll-position",
            touchAction: "pan-y",
            overscrollBehavior: "contain",
          }}
        >
          {IMAGES.map((imageSrc) => (
            <div
              aria-hidden
              className="h-full w-full snap-start"
              key={imageSrc}
            />
          ))}
        </div>

        {/* 图片层 */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {IMAGES.map((imageSrc, index) => (
            <motion.div
              animate={{ opacity: index === currentIndex ? 1 : 0 }}
              className="absolute inset-0"
              initial={{ opacity: index === 0 ? 1 : 0 }}
              key={imageSrc}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Image
                alt={`Slide ${index + 1}`}
                className="object-cover"
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                src={imageSrc}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex select-none flex-col items-center justify-center bg-black/30"
        id="cover"
        initial={{ opacity: 0 }}
        style={{ willChange: "opacity" }}
      >
        <motion.p
          animate={{ y: 0, opacity: 1 }}
          className="hover-text font-semibold text-2xl text-white"
          initial={{ y: 20, opacity: 0 }}
          key={`title-${currentIndex}`}
          transition={SCROLL_VIEW_ANIMATIONS.textTransition}
        >
          {IMAGE_TEXTS[currentIndex]?.title}
        </motion.p>
        <motion.p
          animate={{ y: 0, opacity: 1 }}
          className="hover-text text-white"
          initial={{ y: 20, opacity: 0 }}
          key={`subtitle-${currentIndex}`}
          transition={SCROLL_VIEW_ANIMATIONS.textTransitionDelayed}
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
            willChange: "transform",
          }}
        />
      </motion.div>
    </motion.div>
  );
};
