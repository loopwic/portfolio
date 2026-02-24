"use client";

import { useLocation } from "@tanstack/react-router";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | null;

type InputSnapshot = {
  value: number;
  magnitude: number;
  ratio: number;
  direction: Direction;
};

type TouchState = {
  isActive: boolean;
  identifier: number | null;
  lastY: number | null;
  heroContainer: HTMLElement | null;
};

const SETTINGS = {
  wheelThreshold: 220,
  touchThreshold: 120,
  idleResetDelay: 700,
  deltaBufferWindowMs: 260,
  directionResetDelta: 42,
  noiseDelta: 2,
  heroHandoffFactor: 0.4,
  wheelCooldownMs: 850,
  momentumGuardMs: 420,
  heroSelector: '[data-page-scroll-container="hero"]',
  spring: {
    type: "spring" as const,
    stiffness: 180,
    damping: 26,
    duration: 0.65,
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getDirection = (value: number): Direction => {
  if (value > 0) {
    return "down";
  }

  if (value < 0) {
    return "up";
  }

  return null;
};

const findHeroContainer = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<HTMLElement>(SETTINGS.heroSelector);
};

const canHeroScroll = (container: HTMLElement, delta: number) => {
  const maxScrollTop = container.scrollHeight - container.clientHeight;

  if (delta > 0) {
    return container.scrollTop < maxScrollTop - 1;
  }

  if (delta < 0) {
    return container.scrollTop > 1;
  }

  return false;
};

const createTouchState = (): TouchState => ({
  isActive: false,
  identifier: null,
  lastY: null,
  heroContainer: null,
});

const getTrackedTouch = (event: TouchEvent, identifier: number | null) => {
  if (identifier === null) {
    return event.changedTouches[0] ?? null;
  }

  const currentTouches = Array.from(event.touches);
  const changedTouches = Array.from(event.changedTouches);

  return (
    currentTouches.find((touch) => touch.identifier === identifier) ??
    changedTouches.find((touch) => touch.identifier === identifier) ??
    null
  );
};

export const usePageScroll = (sections: string[], enabled = true) => {
  const location = useLocation();
  const sectionCount = Math.max(sections.length, 1);

  const virtualIndex = useMotionValue(0);
  const scrollYProgress = useMotionValue(0);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [direction, setDirection] = useState<Direction>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const animationControlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const animationPathRef = useRef({ start: 0, target: 0 });

  const accumulatedDeltaRef = useRef(0);
  const lastDeltaTimestampRef = useRef(0);
  const cooldownUntilRef = useRef(0);
  const wheelThresholdRef = useRef(SETTINGS.wheelThreshold);

  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStateRef = useRef<TouchState>(createTouchState());

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

      scrollYProgress.set(clamp(value, 0, sectionCount - 1) / total);
    },
    [scrollYProgress, sectionCount]
  );

  const clearPreview = useCallback(() => {
    setScrollProgress(0);
    setDirection(null);
    updateGlobalProgress(currentIndexRef.current);
  }, [updateGlobalProgress]);

  const resetAccumulator = useCallback(() => {
    accumulatedDeltaRef.current = 0;
    lastDeltaTimestampRef.current = 0;
  }, []);

  const resetTouchState = useCallback(() => {
    touchStateRef.current = createTouchState();
    wheelThresholdRef.current = SETTINGS.wheelThreshold;
  }, []);

  const isBlockedDirection = useCallback(
    (nextDirection: Direction) => {
      if (nextDirection === null) {
        return true;
      }

      const atFirst = currentIndexRef.current === 0;
      const atLast = currentIndexRef.current === sectionCount - 1;

      return (
        (atFirst && nextDirection === "up") ||
        (atLast && nextDirection === "down")
      );
    },
    [sectionCount]
  );

  const applyPreview = useCallback(
    (nextDirection: Direction, ratio: number) => {
      if (!nextDirection || isBlockedDirection(nextDirection)) {
        clearPreview();
        return false;
      }

      setDirection(nextDirection);
      setScrollProgress(ratio);

      const simulatedValue =
        nextDirection === "down"
          ? currentIndexRef.current + ratio
          : currentIndexRef.current - ratio;

      updateGlobalProgress(simulatedValue);
      return true;
    },
    [clearPreview, isBlockedDirection, updateGlobalProgress]
  );

  const scrollToSection = useCallback(
    (targetIndex: number) => {
      const clampedTarget = clamp(targetIndex, 0, sectionCount - 1);

      if (clampedTarget === currentIndexRef.current) {
        clearPreview();
        return;
      }

      animationControlsRef.current?.stop();

      animationPathRef.current = {
        start: currentIndexRef.current,
        target: clampedTarget,
      };

      isAnimatingRef.current = true;
      setIsAnimating(true);
      setDirection(clampedTarget > currentIndexRef.current ? "down" : "up");
      setScrollProgress(0);

      cooldownUntilRef.current = Date.now() + SETTINGS.wheelCooldownMs;
      resetAccumulator();
      clearIdleTimeout();

      animationControlsRef.current = animate(virtualIndex, clampedTarget, {
        ...SETTINGS.spring,
        onComplete: () => {
          currentIndexRef.current = clampedTarget;
          virtualIndex.set(clampedTarget);

          isAnimatingRef.current = false;
          setIsAnimating(false);
          clearPreview();

          cooldownUntilRef.current = Math.max(
            cooldownUntilRef.current,
            Date.now() + SETTINGS.momentumGuardMs
          );

          if (typeof window !== "undefined") {
            window.history.replaceState(
              null,
              "",
              `/#${sections[clampedTarget]}`
            );
          }
        },
      });
    },
    [
      clearIdleTimeout,
      clearPreview,
      resetAccumulator,
      sectionCount,
      sections,
      virtualIndex,
    ]
  );

  const scheduleIdleReset = useCallback(() => {
    clearIdleTimeout();

    idleTimeoutRef.current = setTimeout(() => {
      if (isAnimatingRef.current) {
        return;
      }

      resetAccumulator();
      clearPreview();
    }, SETTINGS.idleResetDelay);
  }, [clearIdleTimeout, clearPreview, resetAccumulator]);

  const makeSnapshot = useCallback((delta: number): InputSnapshot => {
    const now = Date.now();

    if (Math.abs(delta) <= SETTINGS.noiseDelta) {
      const value = accumulatedDeltaRef.current;
      const magnitude = Math.abs(value);
      const threshold = wheelThresholdRef.current;

      return {
        value,
        magnitude,
        ratio: clamp(magnitude / threshold, 0, 1),
        direction: getDirection(value),
      };
    }

    if (now - lastDeltaTimestampRef.current > SETTINGS.deltaBufferWindowMs) {
      accumulatedDeltaRef.current = 0;
    }

    if (
      Math.sign(delta) !== Math.sign(accumulatedDeltaRef.current) &&
      accumulatedDeltaRef.current !== 0 &&
      Math.abs(delta) >= SETTINGS.directionResetDelta
    ) {
      accumulatedDeltaRef.current = 0;
    }

    accumulatedDeltaRef.current += delta;
    lastDeltaTimestampRef.current = now;

    const value = accumulatedDeltaRef.current;
    const magnitude = Math.abs(value);
    const threshold = wheelThresholdRef.current;

    return {
      value,
      magnitude,
      ratio: clamp(magnitude / threshold, 0, 1),
      direction: getDirection(value),
    };
  }, []);

  const processDelta = useCallback(
    (delta: number, options?: { hidePreview?: boolean }) => {
      const snapshot = makeSnapshot(delta);

      if (options?.hidePreview) {
        clearPreview();
      } else {
        const canPreview = applyPreview(snapshot.direction, snapshot.ratio);

        if (!canPreview) {
          scheduleIdleReset();
          return;
        }
      }

      if (
        snapshot.direction &&
        !isBlockedDirection(snapshot.direction) &&
        snapshot.magnitude >= wheelThresholdRef.current
      ) {
        resetAccumulator();
        const offset = snapshot.direction === "down" ? 1 : -1;
        scrollToSection(currentIndexRef.current + offset);
        return;
      }

      scheduleIdleReset();
    },
    [
      applyPreview,
      clearPreview,
      isBlockedDirection,
      makeSnapshot,
      resetAccumulator,
      scheduleIdleReset,
      scrollToSection,
    ]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!enabled || event.deltaY === 0) {
        return;
      }

      const now = Date.now();

      if (isAnimatingRef.current) {
        cooldownUntilRef.current = now + SETTINGS.momentumGuardMs;
        return;
      }

      if (now < cooldownUntilRef.current) {
        cooldownUntilRef.current = now + SETTINGS.momentumGuardMs;
        return;
      }

      const heroContainer = findHeroContainer(event.target);
      if (heroContainer && canHeroScroll(heroContainer, event.deltaY)) {
        processDelta(event.deltaY * SETTINGS.heroHandoffFactor, {
          hidePreview: true,
        });
        return;
      }

      event.preventDefault();
      processDelta(event.deltaY);
    },
    [enabled, processDelta]
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!enabled || isAnimatingRef.current) {
        return;
      }

      if (event.touches.length > 1) {
        resetTouchState();
        return;
      }

      const touch = event.changedTouches[0];
      if (!touch) {
        return;
      }

      touchStateRef.current = {
        isActive: true,
        identifier: touch.identifier,
        lastY: touch.clientY,
        heroContainer: findHeroContainer(event.target),
      };

      resetAccumulator();
      wheelThresholdRef.current = SETTINGS.touchThreshold;
      clearIdleTimeout();
    },
    [clearIdleTimeout, enabled, resetAccumulator, resetTouchState]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!(enabled && touchStateRef.current.isActive)) {
        return;
      }

      if (event.touches.length > 1) {
        resetTouchState();
        return;
      }

      const trackedTouch = getTrackedTouch(
        event,
        touchStateRef.current.identifier
      );
      if (!trackedTouch) {
        return;
      }

      const previousY = touchStateRef.current.lastY ?? trackedTouch.clientY;
      const delta = previousY - trackedTouch.clientY;
      touchStateRef.current.lastY = trackedTouch.clientY;

      if (delta === 0) {
        return;
      }

      const heroContainer = touchStateRef.current.heroContainer;
      if (heroContainer && canHeroScroll(heroContainer, delta)) {
        processDelta(delta * SETTINGS.heroHandoffFactor, { hidePreview: true });
        return;
      }

      event.preventDefault();
      processDelta(delta);
    },
    [enabled, processDelta, resetTouchState]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!touchStateRef.current.isActive) {
        return;
      }

      const identifier = touchStateRef.current.identifier;
      if (identifier === null) {
        resetTouchState();
        return;
      }

      const ended = Array.from(event.changedTouches).some(
        (touch) => touch.identifier === identifier
      );

      if (!ended) {
        return;
      }

      resetTouchState();
      scheduleIdleReset();
    },
    [resetTouchState, scheduleIdleReset]
  );

  const handleTouchCancel = useCallback(() => {
    if (!touchStateRef.current.isActive) {
      return;
    }

    resetTouchState();
  }, [resetTouchState]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || isAnimatingRef.current) {
        return;
      }

      let targetIndex: number | null = null;

      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
          targetIndex = clamp(currentIndexRef.current + 1, 0, sectionCount - 1);
          break;
        case "ArrowUp":
        case "PageUp":
          targetIndex = clamp(currentIndexRef.current - 1, 0, sectionCount - 1);
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

      if (targetIndex === null || targetIndex === currentIndexRef.current) {
        return;
      }

      event.preventDefault();
      scrollToSection(targetIndex);
    },
    [enabled, scrollToSection, sectionCount]
  );

  useMotionValueEvent(virtualIndex, "change", (latest) => {
    const clamped = clamp(latest, 0, sectionCount - 1);

    setCurrentSectionIndex(Math.round(clamped));
    updateGlobalProgress(clamped);

    if (!isAnimatingRef.current) {
      return;
    }

    const { start, target } = animationPathRef.current;
    const distance = Math.abs(target - start);
    const travelled = Math.abs(clamped - start);
    const ratio = distance === 0 ? 0 : Math.min(1, travelled / distance);
    setScrollProgress(ratio);
  });

  useEffect(() => {
    currentIndexRef.current = 0;
    virtualIndex.set(0);
    updateGlobalProgress(0);
  }, [updateGlobalProgress, virtualIndex]);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchCancel);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
      window.removeEventListener("keydown", handleKeyDown);
      resetTouchState();
    };
  }, [
    handleKeyDown,
    handleTouchCancel,
    handleTouchEnd,
    handleTouchMove,
    handleTouchStart,
    handleWheel,
    resetTouchState,
  ]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    if (enabled) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [enabled]);

  useEffect(() => {
    if (location.pathname === "/") {
      return;
    }

    animationControlsRef.current?.stop();
    clearIdleTimeout();
    resetAccumulator();
    resetTouchState();

    currentIndexRef.current = 0;
    isAnimatingRef.current = false;
    cooldownUntilRef.current = 0;

    setCurrentSectionIndex(0);
    setIsAnimating(false);
    clearPreview();

    virtualIndex.set(0);
    updateGlobalProgress(0);
  }, [
    clearIdleTimeout,
    clearPreview,
    location.pathname,
    resetAccumulator,
    resetTouchState,
    updateGlobalProgress,
    virtualIndex,
  ]);

  useEffect(() => () => clearIdleTimeout(), [clearIdleTimeout]);

  return {
    currentSectionIndex,
    scrollProgress,
    isAnimating,
    direction,
    scrollYProgress,
    scrollToSection,
  };
};
