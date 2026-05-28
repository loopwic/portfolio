"use client";

import { useEffect, useRef } from "react";
import {
  PIXEL_SMILEY_CANVAS_SIZE,
  PIXEL_SMILEY_GRID,
  SMILEY_DRAW_DELAY_MS,
  SMILEY_DRAW_DURATION_MS,
  SMILEY_EYE_CELLS,
  SMILEY_MOUTH_CELLS,
} from "./constants";

export function PixelSmiley() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const context = canvas?.getContext("2d");

    if (!(canvas && context && wrapper)) {
      return;
    }

    const cellSize = PIXEL_SMILEY_CANVAS_SIZE / PIXEL_SMILEY_GRID;
    let lineColor = getComputedStyle(wrapper).color || "#f4efe7";

    const resetCanvas = () => {
      canvas.width = PIXEL_SMILEY_CANVAS_SIZE;
      canvas.height = PIXEL_SMILEY_CANVAS_SIZE;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(
        0,
        0,
        PIXEL_SMILEY_CANVAS_SIZE,
        PIXEL_SMILEY_CANVAS_SIZE
      );
      context.imageSmoothingEnabled = false;
    };

    const paintCell = (x: number, y: number, color: string) => {
      context.fillStyle = color;
      context.fillRect(
        Math.round(x * cellSize),
        Math.round(y * cellSize),
        Math.ceil(cellSize),
        Math.ceil(cellSize)
      );
    };

    const allCells = [...SMILEY_EYE_CELLS, ...SMILEY_MOUTH_CELLS];
    let frame = 0;
    let startedAt = 0;
    let drawCount = 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const syncColor = () => {
      lineColor = getComputedStyle(wrapper).color || lineColor;
    };

    const paintCells = (cells: readonly (readonly [number, number])[]) => {
      syncColor();
      for (const [x, y] of cells) {
        paintCell(x, y, lineColor);
      }
    };

    const draw = (now: number) => {
      if (startedAt === 0) {
        startedAt = now;
      }

      const progress = Math.min(
        1,
        reduceMotion
          ? 1
          : Math.max(
              0,
              (now - startedAt - SMILEY_DRAW_DELAY_MS) / SMILEY_DRAW_DURATION_MS
            )
      );
      const visibleCount = Math.ceil(allCells.length * progress);

      context.clearRect(0, 0, canvas.width, canvas.height);
      paintCells(allCells.slice(0, visibleCount));

      if (progress < 1) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const startDrawing = () => {
      if (drawCount > 0) {
        return;
      }

      drawCount += 1;
      wrapper.classList.add("is-drawing");
      frame = window.requestAnimationFrame(draw);
    };

    resetCanvas();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startDrawing();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(wrapper);

    const themeObserver = new MutationObserver(() => {
      if (drawCount === 0) {
        return;
      }

      resetCanvas();
      paintCells(allCells);
    });
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => {
      observer.disconnect();
      themeObserver.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pixel-smiley pointer-events-none mt-4 h-[clamp(8rem,12vw,11rem)] w-[clamp(8rem,12vw,11rem)] text-current opacity-90 md:mt-2"
      ref={wrapperRef}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full fill-none stroke-current"
        viewBox="0 0 96 96"
      >
        <title>Pixel smiley</title>
        <path
          className="pixel-smiley-outline"
          d="M44 8 C55 7 67 12 75 20 C83 28 87 41 84 53 C82 66 74 78 62 84 C49 91 34 87 24 80 C17 74 15 67 10 60 C6 54 12 47 9 40 C6 31 12 23 21 17 C28 12 35 9 44 8 Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5.5"
        />
      </svg>
      <canvas
        className="absolute inset-0 block h-full w-full [image-rendering:pixelated]"
        height={PIXEL_SMILEY_CANVAS_SIZE}
        ref={canvasRef}
        width={PIXEL_SMILEY_CANVAS_SIZE}
      />
    </div>
  );
}
