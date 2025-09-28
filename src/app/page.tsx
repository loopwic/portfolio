"use client";

import { motion, useAnimate } from "motion/react";
import Cursor from "@/components/cursor";
import { ScrollThresholdIndicator } from "@/components/scroll-threshold-indicator";
import { ScrollView } from "@/components/scroll-view";
import { useScrollContext } from "@/contexts/scroll-context";

export default function HomePage() {
  const [buttonScope, animateButton] = useAnimate();

  // 从context获取滚动状态
  const { scrollProgress, isAnimating, direction, translateY } =
    useScrollContext();

  // 使用context中的方向
  const scrollDirection = direction;

  const handleHoverStart = () => {
    // 按钮变宽，从正方形变为宽矩形
    animateButton(
      buttonScope.current,
      {
        width: "30rem", // 480px
        height: "20rem", // 320px
        borderRadius: 0,
      },
      { duration: 0.3 }
    );

    // 覆盖层淡入
    animateButton(
      "#cover",
      {
        opacity: 1,
      },
      { duration: 0.2 }
    );

    // 文字向上滑入
    animateButton(
      ".hover-text",
      {
        y: 0,
      },
      { duration: 0.3 }
    );
  };

  const handleHoverEnd = () => {
    // 按钮恢复正方形
    animateButton(
      buttonScope.current,
      {
        width: "20rem",
        height: "20rem",
        borderRadius: "var(--radius)",
      },
      { duration: 0.3 }
    );

    // 覆盖层淡出
    animateButton(
      "#cover",
      {
        opacity: 0,
      },
      { duration: 0.2 }
    );

    // 文字向下滑出
    animateButton(
      ".hover-text",
      {
        y: 20,
      },
      { duration: 0.3 }
    );
  };

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

        {/* 添加更多内容来创建滚动 */}
        <div
          className="flex h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20"
          id="about"
        >
          <div className="text-center">
            <h2 className="mb-4 font-bold text-4xl">About</h2>
            <p className="max-w-2xl text-muted-foreground">
              This is some additional content to create scrollable area for
              navbar animation.
            </p>
          </div>
        </div>

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

      <p className="fixed bottom-4 left-4 text-4xl text-muted-foreground/30 uppercase">
        hey there
      </p>

      {/* 滚动阈值指示器 */}
      <ScrollThresholdIndicator
        direction={scrollDirection}
        isVisible={!!scrollDirection && !isAnimating}
        progress={scrollProgress}
      />

      <Cursor buttonRef={buttonScope} />
    </div>
  );
}
