import { useEffect } from "react";
import type { RefObject } from "react";

export const useCubeTitleMask = (
  titleRef: RefObject<HTMLElement | null>,
  cubeRef: RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    const title = titleRef.current;
    const cube = cubeRef.current;

    if (!(title && cube)) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const syncMask = () => {
      const cubeRect = cube.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const centerX = cubeRect.left + cubeRect.width / 2 - titleRect.left;
      const centerY = cubeRect.top + cubeRect.height / 2 - titleRect.top;
      const radiusX = cubeRect.width * 0.36;
      const radiusY = cubeRect.height * 0.43;

      title.style.setProperty("--hero-mask-x", `${centerX}px`);
      title.style.setProperty("--hero-mask-y", `${centerY}px`);
      title.style.setProperty("--hero-mask-rx", `${radiusX}px`);
      title.style.setProperty("--hero-mask-ry", `${radiusY}px`);
    };

    syncMask();

    if (reduceMotion) {
      return;
    }

    let frame = 0;

    const tick = () => {
      syncMask();
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame === 0) {
        return;
      }
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0 }
    );
    observer.observe(title);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [cubeRef, titleRef]);
};
