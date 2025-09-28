"use client";

import { animate, motion, useMotionValue } from "motion/react";
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

const loadImage = (src: string, signal: AbortSignal) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";

    const handleAbort = () => {
      image.src = "";
      reject(new DOMException("Aborted", "AbortError"));
    };

    const cleanup = () => {
      signal.removeEventListener("abort", handleAbort);
      image.onload = null;
      image.onerror = null;
    };

    if (signal.aborted) {
      handleAbort();
      return;
    }

    signal.addEventListener("abort", handleAbort, { once: true });

    image.onload = () => {
      const finalize = () => {
        cleanup();
        resolve(image);
      };

      if (typeof image.decode === "function") {
        image.decode().then(finalize).catch(finalize);
        return;
      }

      finalize();
    };

    image.onerror = (event) => {
      cleanup();
      reject(event instanceof Error ? event : new Error("Image load failed"));
    };

    image.src = src;
  });

const preloadImages = async (
  signal: AbortSignal,
  onProgress?: (images: HTMLImageElement[]) => void
) => {
  const loadedImages: HTMLImageElement[] = [];

  for (const src of IMAGES) {
    if (signal.aborted) {
      break;
    }

    try {
      const image = await loadImage(src, signal);

      if (signal.aborted) {
        break;
      }

      loadedImages.push(image);
      onProgress?.([...loadedImages]);
    } catch {
      if (signal.aborted) {
        break;
      }
    }
  }

  return loadedImages;
};

export const ScrollView = ({
  handleHoverStart,
  handleHoverEnd,
  buttonScope,
}: ScrollViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const imageCacheRef = useRef<HTMLImageElement[]>([]);
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
  const resizeRafRef = useRef<number | null>(null);

  const drawFrame = useCallback(
    (scrollTop: number, containerHeight: number) => {
      const context = canvasCtxRef.current;
      if (!context) {
        return;
      }

      const { width, height } = canvasSizeRef.current;

      if (width === 0 || height === 0 || containerHeight === 0) {
        return;
      }

      context.clearRect(0, 0, width, height);

      const images = imageCacheRef.current;

      if (images.length === 0) {
        return;
      }

      const maxIndex = images.length - 1;
      const normalizedHeight = Math.max(containerHeight, 1);
      const baseIndex = Math.max(
        0,
        Math.min(maxIndex, Math.floor(scrollTop / normalizedHeight))
      );
      const offsetWithin = scrollTop - baseIndex * normalizedHeight;

      const currentImage = images[baseIndex];
      const nextIndex = Math.min(maxIndex, baseIndex + 1);
      const nextImage = images[nextIndex];

      const drawCoverImage = (image: HTMLImageElement, translateY: number) => {
        const intrinsicWidth = image.naturalWidth || image.width;
        const intrinsicHeight = image.naturalHeight || image.height;

        if (intrinsicWidth === 0 || intrinsicHeight === 0) {
          return;
        }

        const scale = Math.max(
          width / intrinsicWidth,
          height / intrinsicHeight
        );
        const renderWidth = intrinsicWidth * scale;
        const renderHeight = intrinsicHeight * scale;
        const offsetX = (width - renderWidth) / 2;
        const offsetY = (height - renderHeight) / 2;

        context.drawImage(
          image,
          offsetX,
          offsetY + translateY,
          renderWidth,
          renderHeight
        );
      };

      if (currentImage) {
        drawCoverImage(currentImage, -offsetWithin);
      }

      if (nextImage && nextIndex !== baseIndex) {
        drawCoverImage(nextImage, normalizedHeight - offsetWithin);
      }
    },
    []
  );

  const applyCanvasResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const context = canvasCtxRef.current;
    if (!context) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (typeof context.resetTransform === "function") {
      context.resetTransform();
    } else {
      context.setTransform(1, 0, 0, 1, 0, 0);
    }

    context.scale(dpr, dpr);
    canvasSizeRef.current = { width: rect.width, height: rect.height };

    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    pendingScrollRef.current = {
      scrollTop,
      containerHeight,
    };

    drawFrame(scrollTop, containerHeight);
  }, [drawFrame]);

  const scheduleCanvasResize = useCallback(() => {
    if (resizeRafRef.current !== null) {
      return;
    }

    resizeRafRef.current = requestAnimationFrame(() => {
      resizeRafRef.current = null;
      applyCanvasResize();
    });
  }, [applyCanvasResize]);

  const handleMouseEnter = useCallback(() => {
    handleHoverStart();
  }, [handleHoverStart]);

  const handleMouseLeave = useCallback(() => {
    handleHoverEnd();
  }, [handleHoverEnd]);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const hydrateImages = async () => {
      const loadedImages = await preloadImages(controller.signal, (images) => {
        if (!isActive || controller.signal.aborted || images.length === 0) {
          return;
        }

        imageCacheRef.current = images;
        const {
          scrollTop: currentScrollTop,
          containerHeight: currentContainerHeight,
        } = pendingScrollRef.current;
        drawFrame(currentScrollTop, currentContainerHeight);
      });

      if (!isActive || controller.signal.aborted || loadedImages.length === 0) {
        return;
      }

      imageCacheRef.current = loadedImages;
      const {
        scrollTop: finalScrollTop,
        containerHeight: finalContainerHeight,
      } = pendingScrollRef.current;
      drawFrame(finalScrollTop, finalContainerHeight);
    };

    hydrateImages().catch(() => {
      /* swallow preload failures */
    });

    return () => {
      isActive = false;
      controller.abort();
      imageCacheRef.current = [];
    };
  }, [drawFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    canvasCtxRef.current = context;

    scheduleCanvasResize();

    const resizeObserver = new ResizeObserver(() => {
      scheduleCanvasResize();
    });
    resizeObserver.observe(container);

    const handleWindowResize = () => scheduleCanvasResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      resizeObserver.disconnect();
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
      canvasCtxRef.current = null;
    };
  }, [scheduleCanvasResize]);

  useEffect(() => {
    const target = buttonScope.current;

    if (!target) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      const hasStyleMutation = mutations.some(
        (mutation) =>
          mutation.type === "attributes" && mutation.attributeName === "style"
      );

      if (!hasStyleMutation) {
        return;
      }

      scheduleCanvasResize();
    });

    observer.observe(target, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      observer.disconnect();
    };
  }, [buttonScope, scheduleCanvasResize]);

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
      drawFrame(scrollTop, containerHeight);

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
  }, [drawFrame, indicatorOffsetY, indicatorOpacity, progress]);

  return (
    <motion.div
      animate={{
        scale: 1,
        opacity: 1,
      }}
      className="relative size-80 cursor-none overflow-hidden rounded-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={buttonScope}
      transition={{ duration: 0.4 }}
    >
      <div className="relative h-full w-full">
        <div
          className="scrollbar-none relative z-0 h-full w-full snap-y snap-mandatory overflow-y-auto"
          ref={containerRef}
          style={{ willChange: "scroll-position" }}
        >
          {IMAGES.map((imageSrc) => (
            <div
              aria-hidden
              className="h-full w-full snap-start"
              key={imageSrc}
            />
          ))}
        </div>
        <canvas
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          ref={canvasRef}
        />
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
            willChange: "transform",
          }}
        />
      </motion.div>
    </motion.div>
  );
};
