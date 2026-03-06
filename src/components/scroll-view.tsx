"use client";

import { animate, motion, useMotionValue } from "motion/react";
import {
  type MouseEvent as ReactMouseEvent,
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
  isActive?: boolean;
  isExpanded?: boolean;
};

const IMAGES = [
  "https://cdn.loopwic.com/images/home-0.jpg",
  "https://cdn.loopwic.com/images/home-1.jpg",
  "https://cdn.loopwic.com/images/home-2.jpg",
  "https://cdn.loopwic.com/images/home-3.jpg",
];

const IMAGE_TEXTS = [
  {
    title: "Loopwic 的交互作品集",
    subtitle: "往下滑，先看体验，再看实现。",
  },
  {
    title: "前端 / 动效 / 工程",
    subtitle: "同一套页面，滚轮、触控板和键盘都能顺滑翻页。",
  },
  {
    title: "不做一次性特效",
    subtitle: "状态清晰、结构稳定，后续迭代不会越改越乱。",
  },
  {
    title: "继续下滑",
    subtitle: "下一页是关于我和项目细节。",
  },
];

const TEXT_INITIAL_OFFSET = 20;
const POINTER_CENTER = 0.5;
const TILT_MAX_DEGREES = 4;

const computeScrollInfo = (scrollTop: number, containerHeight: number) => {
  if (containerHeight <= 0) {
    return {
      baseIndex: 0,
      nextIndex: 0,
      blend: 0,
      rawIndex: 0,
    };
  }

  const rawIndex = scrollTop / containerHeight;
  const baseIndex = Math.floor(rawIndex);
  const blend = rawIndex - baseIndex;

  return {
    baseIndex,
    nextIndex: baseIndex + 1,
    blend,
    rawIndex,
  };
};

export const ScrollView = ({
  handleHoverStart,
  handleHoverEnd,
  buttonScope,
  isActive = true,
  isExpanded = false,
}: ScrollViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hideIndicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const indicatorOpacity = useMotionValue(0);
  const indicatorOffsetY = useMotionValue(10);
  const activeIndicatorAnimationRef = useRef<ReturnType<typeof animate> | null>(
    null
  );
  const wasActiveRef = useRef(isActive);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const drawImageCover = useCallback(
    (
      context: CanvasRenderingContext2D,
      image: HTMLImageElement | undefined,
      width: number,
      height: number
    ) => {
      if (!image) {
        return;
      }

      if (!image.complete) {
        return;
      }

      if (!image.naturalWidth) {
        return;
      }

      if (!image.naturalHeight) {
        return;
      }

      const imageAspect = image.naturalWidth / image.naturalHeight;
      const canvasAspect = width / height;

      let renderWidth = width;
      let renderHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imageAspect > canvasAspect) {
        renderHeight = height;
        renderWidth = height * imageAspect;
        offsetX = (width - renderWidth) / 2;
      } else {
        renderWidth = width;
        renderHeight = width / imageAspect;
        offsetY = (height - renderHeight) / 2;
      }

      context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);
    },
    []
  );

  const updateProgressValues = useCallback(
    (scrollTop: number, containerHeight: number) => {
      const maxScroll = containerHeight * (IMAGES.length - 1);
      const normalizedProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      const clampedProgress = Math.min(Math.max(normalizedProgress, 0), 1);

      progress.set(clampedProgress);
      scrollProgress.set(clampedProgress);

      return clampedProgress;
    },
    [progress, scrollProgress]
  );

  const updateActiveIndex = useCallback((rawIndex: number) => {
    const displayIndex = Math.min(
      IMAGES.length - 1,
      Math.max(0, Math.round(rawIndex))
    );

    if (currentIndexRef.current !== displayIndex) {
      currentIndexRef.current = displayIndex;
      setCurrentIndex(displayIndex);
    }

    return displayIndex;
  }, []);

  const paintImages = useCallback(
    (
      context: CanvasRenderingContext2D,
      dimensions: { width: number; height: number },
      indices: { baseIndex: number; nextIndex: number; blend: number }
    ) => {
      const { width, height } = dimensions;
      const { baseIndex, nextIndex, blend } = indices;
      const clampedBaseIndex = Math.min(
        IMAGES.length - 1,
        Math.max(0, baseIndex)
      );
      const clampedNextIndex = Math.min(
        IMAGES.length - 1,
        Math.max(0, nextIndex)
      );

      const baseImage = imagesRef.current[clampedBaseIndex];
      const nextImage =
        blend > 0 ? imagesRef.current[clampedNextIndex] : undefined;

      if (baseImage) {
        context.globalAlpha = 1;
        drawImageCover(context, baseImage, width, height);
      }

      if (nextImage && clampedNextIndex !== clampedBaseIndex) {
        context.globalAlpha = blend;
        drawImageCover(context, nextImage, width, height);
      }
    },
    [drawImageCover]
  );

  const renderCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container) {
      return;
    }

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    if (containerWidth === 0 || containerHeight === 0) {
      return;
    }

    const devicePixelRatio = window.devicePixelRatio ?? 1;
    const renderWidth = Math.floor(containerWidth * devicePixelRatio);
    const renderHeight = Math.floor(containerHeight * devicePixelRatio);

    if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
      canvas.width = renderWidth;
      canvas.height = renderHeight;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
    }

    context.save();
    context.scale(devicePixelRatio, devicePixelRatio);
    context.clearRect(0, 0, containerWidth, containerHeight);

    const scrollTop = container.scrollTop;
    const { baseIndex, nextIndex, blend, rawIndex } = computeScrollInfo(
      scrollTop,
      containerHeight
    );

    updateProgressValues(scrollTop, containerHeight);
    updateActiveIndex(rawIndex);
    paintImages(
      context,
      { width: containerWidth, height: containerHeight },
      { baseIndex, nextIndex, blend }
    );

    context.restore();
  }, [paintImages, updateActiveIndex, updateProgressValues]);

  const scheduleRender = useCallback(() => {
    if (rafIdRef.current !== null) {
      return;
    }

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      renderCanvas();
    });
  }, [renderCanvas]);

  const handleMouseEnter = useCallback(() => {
    handleHoverStart?.();
  }, [handleHoverStart]);

  const handleMouseLeave = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
    handleHoverEnd?.();
  }, [handleHoverEnd, tiltX, tiltY]);

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!isExpanded) {
        tiltX.set(0);
        tiltY.set(0);
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const normalizedX =
        (event.clientX - rect.left) / rect.width - POINTER_CENTER;
      const normalizedY =
        (event.clientY - rect.top) / rect.height - POINTER_CENTER;

      tiltX.set(-normalizedY * TILT_MAX_DEGREES);
      tiltY.set(normalizedX * TILT_MAX_DEGREES);
    },
    [isExpanded, tiltX, tiltY]
  );

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

    const handleScroll = () => {
      showIndicator();
      scheduleIndicatorHide();
      scheduleRender();
    };

    // 初始化
    renderCanvas();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);

      if (hideIndicatorTimeoutRef.current) {
        clearTimeout(hideIndicatorTimeoutRef.current);
      }

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      activeIndicatorAnimationRef.current?.stop();
    };
  }, [indicatorOffsetY, indicatorOpacity, renderCanvas, scheduleRender]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const imageElements = IMAGES.map((src) => {
      const image = new window.Image();
      image.src = src;
      return image;
    });

    imagesRef.current = imageElements;

    if (imageElements.every((image) => image.complete)) {
      scheduleRender();
      return;
    }

    let loaded = 0;
    let cancelled = false;

    const listeners = imageElements.map((image) => {
      const handleLoad = () => {
        loaded += 1;
        if (!cancelled && loaded >= imageElements.length) {
          scheduleRender();
        }
      };

      image.addEventListener("load", handleLoad, { once: true });
      image.addEventListener("error", handleLoad, { once: true });

      return handleLoad;
    });

    return () => {
      cancelled = true;
      imageElements.forEach((image, index) => {
        const listener = listeners[index];
        if (listener) {
          image.removeEventListener("load", listener);
          image.removeEventListener("error", listener);
        }
      });
    };
  }, [scheduleRender]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      scheduleRender();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [scheduleRender]);

  useEffect(() => {
    const container = containerRef.current;
    const becameActive = isActive && !wasActiveRef.current;
    const becameInactive = !isActive && wasActiveRef.current;
    wasActiveRef.current = isActive;

    if (!container) {
      return;
    }

    if (becameInactive) {
      if (hideIndicatorTimeoutRef.current) {
        clearTimeout(hideIndicatorTimeoutRef.current);
        hideIndicatorTimeoutRef.current = null;
      }

      activeIndicatorAnimationRef.current?.stop();
      indicatorOpacity.set(0);
      indicatorOffsetY.set(10);
      progress.set(0);
      scrollProgress.set(0);
      return;
    }

    if (becameActive) {
      currentIndexRef.current = 0;
      setCurrentIndex(0);
      container.scrollTo({ top: 0, behavior: "auto" });
      requestAnimationFrame(() => {
        renderCanvas();
      });
    }
  }, [
    indicatorOffsetY,
    indicatorOpacity,
    isActive,
    progress,
    renderCanvas,
    scrollProgress,
  ]);

  const containerClassName = cn(
    "relative",
    "max-h-[80vh]",
    "overflow-hidden",
    "rounded-[1.05rem]",
    "border border-white/18",
    "bg-black/12",
    "md:cursor-none"
  );

  return (
    <motion.div
      animate={isExpanded ? "hover" : "rest"}
      className={containerClassName}
      initial="rest"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={buttonScope}
      style={{
        maxWidth: "100%",
        transformPerspective: 1200,
        rotateX: tiltX,
        rotateY: tiltY,
      }}
      transition={SCROLL_VIEW_CONTAINER_TRANSITION}
      variants={SCROLL_VIEW_CONTAINER_VARIANTS}
    >
      <div className="pointer-events-none absolute inset-0 z-40 rounded-[inherit] border border-white/14" />
      <div className="relative h-full w-full">
        {/* 滚动容器 */}
        <div
          className="scrollbar-none relative z-0 h-full w-full snap-y snap-mandatory overflow-y-auto rounded-[inherit]"
          data-page-scroll-container="hero"
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

        {/* Canvas 渲染层 */}
        <canvas
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          ref={canvasRef}
        />
      </div>

      <motion.div
        animate={{ opacity: isExpanded ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 z-20 flex select-none flex-col justify-between bg-gradient-to-b from-black/34 via-black/6 to-black/56 p-4 lg:p-5"
        id="cover"
        initial={{ opacity: 0 }}
        style={{ willChange: "opacity" }}
        transition={SCROLL_VIEW_ANIMATIONS.textTransition}
      >
        <div className="flex items-start justify-between">
          <span className="rounded-full border border-white/30 bg-black/25 px-3 py-1 font-mono text-[0.66rem] text-white/92 uppercase tracking-[0.14em]">
            主页 · 作品集
          </span>
          <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 font-mono text-[0.66rem] text-white/85">
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(IMAGES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="max-w-xl lg:max-w-2xl">
          <motion.p
            animate={{
              y: isExpanded ? 0 : TEXT_INITIAL_OFFSET,
              opacity: isExpanded ? 1 : 0,
            }}
            className="font-semibold text-2xl text-white tracking-tight lg:text-3xl"
            initial={{ y: TEXT_INITIAL_OFFSET, opacity: 0 }}
            key={`title-${currentIndex}`}
            transition={SCROLL_VIEW_ANIMATIONS.textTransition}
          >
            {IMAGE_TEXTS[currentIndex]?.title}
          </motion.p>
          <motion.p
            animate={{
              y: isExpanded ? 0 : TEXT_INITIAL_OFFSET,
              opacity: isExpanded ? 1 : 0,
            }}
            className="mt-2 text-sm text-white/90 leading-relaxed lg:text-base"
            initial={{ y: TEXT_INITIAL_OFFSET, opacity: 0 }}
            key={`subtitle-${currentIndex}`}
            transition={SCROLL_VIEW_ANIMATIONS.textTransitionDelayed}
          >
            {IMAGE_TEXTS[currentIndex]?.subtitle}
          </motion.p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <span className="rounded-full border border-white/24 bg-black/25 px-3 py-1 font-mono text-[0.66rem] text-white/82">
            滚轮 / 触控板 / ↑↓
          </span>
          <span className="rounded-full border border-white/24 bg-black/25 px-3 py-1 font-mono text-[0.66rem] text-white/82">
            滚动可预览
          </span>
        </div>
      </motion.div>

      <motion.div
        className="-translate-x-1/2 absolute bottom-4 left-1/2 z-30 h-1.5 w-34 overflow-hidden rounded-full border border-white/24 bg-black/28"
        style={{ opacity: indicatorOpacity, y: indicatorOffsetY }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-white/88 via-white to-white/84"
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
