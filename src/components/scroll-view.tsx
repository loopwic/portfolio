"use client";

import { motion, useMotionValue } from "motion/react";
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

const SCROLL_IDLE_TIMEOUT = 2000;
const ANIMATION_DELAY_MS = 500;

export const ScrollView = ({
  handleHoverStart,
  handleHoverEnd,
  buttonScope,
}: ScrollViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 创建图片ref数组
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 处理图片切换
  const handleImageSwitch = useCallback((completedImages: number) => {
    isScrollingRef.current = true;

    const nextIndex = completedImages % IMAGES.length;
    setCurrentIndex(nextIndex);

    // 如果滚动到了最后，循环回到第一张
    if (completedImages >= IMAGES.length) {
      const targetElement = imageRefs.current[0];
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setTimeout(() => {
        setCurrentIndex(0);
        isScrollingRef.current = false;
      }, ANIMATION_DELAY_MS);
    } else {
      setTimeout(() => {
        isScrollingRef.current = false;
      }, ANIMATION_DELAY_MS);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // 设置滚动状态
      setIsScrolling(true);

      // 清除之前的定时器
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // 设置新的定时器，滚动停止后隐藏进度条
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, SCROLL_IDLE_TIMEOUT);

      // 计算图片高度和全局滚动进度
      const imageHeight = containerHeight;
      // 实际可滚动的最大高度 = (图片数量 - 1) * 图片高度
      const maxScrollHeight = imageHeight * (IMAGES.length - 1);
      const globalProgress =
        maxScrollHeight > 0 ? Math.min(scrollTop / maxScrollHeight, 1) : 0;

      // 更新全局进度条
      progress.set(globalProgress); // 检查是否完成了一个完整图片高度的滚动
      const completedImages = Math.floor(scrollTop / imageHeight);

      // 当滚动距离达到完整图片高度时切换图片
      if (completedImages !== currentIndex && !isScrollingRef.current) {
        handleImageSwitch(completedImages);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentIndex, progress, handleImageSwitch]);

  const handleMouseEnter = useCallback(() => {
    handleHoverStart();
  }, [handleHoverStart]);

  const handleMouseLeave = useCallback(() => {
    handleHoverEnd();
  }, [handleHoverEnd]);

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
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
          >
            <div className="relative h-full w-full">
              <Image
                alt={`Image ${index + 1}`}
                className="pointer-events-none select-none object-cover"
                fill
                priority={index === 0}
                quality={90}
                sizes="(max-width: 768px) 100vw, 80vw"
                src={imageSrc}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Hover覆盖层 */}
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
          {IMAGE_TEXTS[currentIndex].title}
        </motion.p>
        <motion.p
          animate={{ y: 0, opacity: 1 }}
          className="hover-text text-white"
          initial={{ y: 20, opacity: 0 }}
          key={`subtitle-${currentIndex}`}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {IMAGE_TEXTS[currentIndex].subtitle}
        </motion.p>
      </motion.div>

      {/* 滚动进度指示器 - 只在滚动时显示 */}
      <motion.div
        animate={{
          opacity: isScrolling ? 1 : 0,
          y: isScrolling ? 0 : 10,
        }}
        className="-translate-x-1/2 absolute bottom-4 left-1/2 z-30 h-1 w-24 rounded-full bg-white/30"
        transition={{ duration: 0.3 }}
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
