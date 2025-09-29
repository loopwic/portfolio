"use client";

import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const WHEEL_THRESHOLD = 200;
const TOUCH_THRESHOLD = 100;
const IDLE_RESET_DELAY = 800;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const isWithinScrollableContainer = (element: Element | null) =>
  Boolean(element?.closest(".scrollbar-none"));

type Direction = "up" | "down" | null;

export const usePageScroll = (sections: string[]) => {
  const sectionCount = Math.max(sections.length, 1);

  const position = useMotionValue(0);
  const translateY = useMotionValue(0);
  const scrollYProgress = useMotionValue(0);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [direction, setDirection] = useState<Direction>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const indexRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const animationPathRef = useRef({ start: 0, target: 0 });
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewportHeightRef = useRef(
    typeof window !== "undefined" ? window.innerHeight : 0
  );
  const wheelThresholdRef = useRef(WHEEL_THRESHOLD);
  const touchIdentifierRef = useRef<number | null>(null);
  const touchLastYRef = useRef<number | null>(null);
  const isTouchActiveRef = useRef(false);

  const clearIdleTimeout = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  }, []);

  const updateGlobalProgress = useCallback(
    (value: number) => {
      const total = sectionCount - 1;

      if (total <= 0) {
        scrollYProgress.set(0);
        return;
      }

      const clampedValue = clamp(value, 0, sectionCount - 1);
      scrollYProgress.set(clampedValue / total);
    },
    [sectionCount, scrollYProgress]
  );

  const applyPosition = useCallback(
    (value: number) => {
      const clampedValue = clamp(value, 0, sectionCount - 1);
      translateY.set(-clampedValue * viewportHeightRef.current);

      updateGlobalProgress(clampedValue);

      const nearestIndex = Math.round(clampedValue);
      setCurrentSectionIndex(nearestIndex);
    },
    [sectionCount, translateY, updateGlobalProgress]
  );

  useMotionValueEvent(position, "change", (latest) => {
    applyPosition(latest);

    if (!isAnimatingRef.current) {
      return;
    }

    const { start, target } = animationPathRef.current;
    const distance = Math.abs(target - start);
    const travelled = Math.abs(latest - start);
    const ratio = distance === 0 ? 0 : Math.min(1, travelled / distance);
    setScrollProgress(ratio);
  });

  const scrollToSection = useCallback(
    (targetIndex: number) => {
      const clampedTarget = clamp(targetIndex, 0, sectionCount - 1);

      if (clampedTarget === indexRef.current) {
        setScrollProgress(0);
        setDirection(null);
        return;
      }

      controlsRef.current?.stop();

      animationPathRef.current = {
        start: indexRef.current,
        target: clampedTarget,
      };

      isAnimatingRef.current = true;
      setIsAnimating(true);
      setScrollProgress(0);
      setDirection(clampedTarget > indexRef.current ? "down" : "up");

      accumulatedDeltaRef.current = 0;
      clearIdleTimeout();

      controlsRef.current = animate(position, clampedTarget, {
        type: "spring",
        stiffness: 180,
        damping: 26,
        duration: 0.65,
        onComplete: () => {
          indexRef.current = clampedTarget;
          position.set(clampedTarget);
          setScrollProgress(0);
          setDirection(null);
          isAnimatingRef.current = false;
          setIsAnimating(false);
          updateGlobalProgress(clampedTarget);
        },
      });
    },
    [clearIdleTimeout, position, sectionCount, updateGlobalProgress]
  );

  const determineDirection = useCallback((value: number): Direction => {
    if (value > 0) {
      return "down";
    }

    if (value < 0) {
      return "up";
    }

    return null;
  }, []);

  const resetProgressState = useCallback(() => {
    accumulatedDeltaRef.current = 0;
    setScrollProgress(0);
    setDirection(null);
    updateGlobalProgress(indexRef.current);
  }, [updateGlobalProgress]);

  const attemptSectionChange = useCallback(
    (nextDirection: Direction) => {
      if (!nextDirection) {
        resetProgressState();
        return;
      }

      const offset = nextDirection === "down" ? 1 : -1;
      const targetIndex = clamp(indexRef.current + offset, 0, sectionCount - 1);

      if (targetIndex === indexRef.current) {
        resetProgressState();
        return;
      }

      scrollToSection(targetIndex);
    },
    [resetProgressState, scrollToSection, sectionCount]
  );

  const computeWheelSnapshot = useCallback(
    (delta: number) => {
      if (
        Math.sign(delta) !== Math.sign(accumulatedDeltaRef.current) &&
        accumulatedDeltaRef.current !== 0
      ) {
        accumulatedDeltaRef.current = 0;
      }

      accumulatedDeltaRef.current += delta;

      const magnitude = Math.abs(accumulatedDeltaRef.current);
      const threshold = wheelThresholdRef.current;
      const ratio = clamp(magnitude / threshold, 0, 1);
      const nextDirection = determineDirection(accumulatedDeltaRef.current);

      return { magnitude, threshold, ratio, nextDirection };
    },
    [determineDirection]
  );

  const applyWheelProgress = useCallback(
    (nextDirection: Direction, ratio: number) => {
      // 检查边界条件
      const isAtFirstPage = indexRef.current === 0;
      const isAtLastPage = indexRef.current === sectionCount - 1;

      // 在第一页且尝试向上滚动时，完全忽略
      if (isAtFirstPage && nextDirection === "up") {
        return;
      }

      // 在最后一页且尝试向下滚动时，完全忽略
      if (isAtLastPage && nextDirection === "down") {
        return;
      }

      setScrollProgress(nextDirection ? ratio : 0);
      setDirection(nextDirection);

      if (!nextDirection) {
        updateGlobalProgress(indexRef.current);
        return;
      }

      const simulatedValue =
        nextDirection === "down"
          ? indexRef.current + ratio
          : indexRef.current - ratio;

      updateGlobalProgress(simulatedValue);
    },
    [updateGlobalProgress, sectionCount]
  );

  const handleThresholdCross = useCallback(
    (nextDirection: Direction) => {
      accumulatedDeltaRef.current = 0;
      attemptSectionChange(nextDirection);
    },
    [attemptSectionChange]
  );

  useEffect(() => {
    const handleResize = () => {
      viewportHeightRef.current = window.innerHeight;
      wheelThresholdRef.current = WHEEL_THRESHOLD;

      translateY.set(-indexRef.current * viewportHeightRef.current);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [translateY]);

  useEffect(() => {
    updateGlobalProgress(indexRef.current);
    applyPosition(indexRef.current);
  }, [applyPosition, updateGlobalProgress]);

  const scheduleIdleReset = useCallback(() => {
    clearIdleTimeout();

    idleTimeoutRef.current = setTimeout(() => {
      if (isAnimatingRef.current) {
        return;
      }

      resetProgressState();
    }, IDLE_RESET_DELAY);
  }, [clearIdleTimeout, resetProgressState]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const target = event.target as Element | null;

      if (isWithinScrollableContainer(target)) {
        return;
      }

      event.preventDefault();

      if (isAnimatingRef.current) {
        return;
      }

      const delta = event.deltaY;

      if (delta === 0) {
        return;
      }

      const { magnitude, threshold, ratio, nextDirection } =
        computeWheelSnapshot(delta);

      applyWheelProgress(nextDirection, ratio);

      if (nextDirection && magnitude >= threshold) {
        handleThresholdCross(nextDirection);
        return;
      }

      scheduleIdleReset();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    const resetTouchState = () => {
      touchIdentifierRef.current = null;
      touchLastYRef.current = null;
      isTouchActiveRef.current = false;
      accumulatedDeltaRef.current = 0;
      wheelThresholdRef.current = WHEEL_THRESHOLD;
    };

    const getTrackedTouch = (event: TouchEvent) => {
      const identifier = touchIdentifierRef.current;

      if (identifier === null) {
        return event.changedTouches[0] ?? null;
      }

      const currentTouches = Array.from(event.touches);
      const updatedTouches = Array.from(event.changedTouches);

      return (
        currentTouches.find((touch) => touch.identifier === identifier) ??
        updatedTouches.find((touch) => touch.identifier === identifier) ??
        null
      );
    };

    const shouldResetTouch = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        return true;
      }

      const target = event.target as Element | null;
      return isWithinScrollableContainer(target);
    };

    const processTouchDelta = (event: TouchEvent, delta: number) => {
      if (delta === 0) {
        return;
      }

      event.preventDefault();

      const { magnitude, threshold, ratio, nextDirection } =
        computeWheelSnapshot(delta);

      applyWheelProgress(nextDirection, ratio);

      if (nextDirection && magnitude >= threshold) {
        handleThresholdCross(nextDirection);
        resetTouchState();
        return;
      }

      scheduleIdleReset();
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (isAnimatingRef.current) {
        return;
      }

      if (event.touches.length > 1) {
        resetTouchState();
        return;
      }

      const target = event.target as Element | null;
      if (isWithinScrollableContainer(target)) {
        return;
      }

      const touch = event.changedTouches[0];
      if (!touch) {
        return;
      }

      touchIdentifierRef.current = touch.identifier;
      touchLastYRef.current = touch.clientY;
      isTouchActiveRef.current = true;
      accumulatedDeltaRef.current = 0;
      wheelThresholdRef.current = TOUCH_THRESHOLD;
      clearIdleTimeout();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isTouchActiveRef.current) {
        return;
      }

      if (shouldResetTouch(event)) {
        resetTouchState();
        return;
      }

      const touch = getTrackedTouch(event);

      if (!touch) {
        return;
      }

      const lastY = touchLastYRef.current ?? touch.clientY;
      const delta = lastY - touch.clientY;

      touchLastYRef.current = touch.clientY;

      processTouchDelta(event, delta);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!isTouchActiveRef.current) {
        return;
      }

      const identifier = touchIdentifierRef.current;
      if (identifier === null) {
        resetTouchState();
        return;
      }

      const endedTouch = Array.from(event.changedTouches).some(
        (touch) => touch.identifier === identifier
      );

      if (!endedTouch) {
        return;
      }

      resetTouchState();
      scheduleIdleReset();
    };

    const handleTouchCancel = () => {
      if (!isTouchActiveRef.current) {
        return;
      }

      resetTouchState();
    };

    window.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
      resetTouchState();
    };
  }, [
    applyWheelProgress,
    computeWheelSnapshot,
    handleThresholdCross,
    clearIdleTimeout,
    scheduleIdleReset,
  ]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (isAnimatingRef.current) {
        return;
      }

      let targetIndex: number | null = null;

      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
          targetIndex = clamp(indexRef.current + 1, 0, sectionCount - 1);
          break;
        case "ArrowUp":
        case "PageUp":
          targetIndex = clamp(indexRef.current - 1, 0, sectionCount - 1);
          break;
        case "Home":
          targetIndex = 0;
          break;
        case "End":
          targetIndex = sectionCount - 1;
          break;
        default:
          return;
      }

      if (targetIndex === null || targetIndex === indexRef.current) {
        return;
      }

      event.preventDefault();
      scrollToSection(targetIndex);
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [scrollToSection, sectionCount]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => () => clearIdleTimeout(), [clearIdleTimeout]);

  return {
    currentSectionIndex,
    scrollProgress,
    isAnimating,
    direction,
    scrollYProgress,
    translateY,
    scrollToSection,
  };
};
