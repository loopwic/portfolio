"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Only apply on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    // Force cursor none globally to prevent native cursors from showing
    const style = document.createElement("style");
    style.innerHTML = "* { cursor: none !important; }";
    document.head.appendChild(style);

    const interactables = document.querySelectorAll(
      "a, button, input, textarea, [data-interactive], [data-magnetic]"
    );
    const cleanups: Array<() => void> = [];
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let activeTarget: Element | null = null;

    // Base cursor setup
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
    gsap.set(cornersRef.current, {
      display: "none",
      height: 24,
      opacity: 0,
      width: 24,
      x: pointer.x - 12,
      y: pointer.y - 12,
    });

    const cornerPieces = () =>
      cornersRef.current?.querySelectorAll<HTMLElement>(
        "[data-cursor-corner]"
      ) ?? [];

    const syncCorners = (
      target: Element,
      duration = 0.18,
      ease = "power3.out"
    ) => {
      const rect = target.getBoundingClientRect();
      gsap.to(cornersRef.current, {
        duration,
        ease,
        height: rect.height,
        opacity: 1,
        width: rect.width,
        x: rect.left,
        y: rect.top,
      });
    };

    for (const el of interactables) {
      const onEnter = () => {
        activeTarget = el;
        // Kill previous animations to prevent ghosting
        gsap.killTweensOf(crosshairRef.current);
        gsap.killTweensOf(cornersRef.current);
        gsap.killTweensOf(cornerPieces());

        // Crosshair folds into the target frame before disappearing.
        gsap.to(crosshairRef.current, {
          duration: 0.14,
          ease: "power2.out",
          opacity: 0,
          scale: 0.58,
          onComplete: () => {
            gsap.set(crosshairRef.current, { display: "none" });
          },
        });

        // Corners split from the pointer into the hovered element bounds.
        gsap.set(cornersRef.current, {
          display: "block",
          height: 18,
          opacity: 0.18,
          width: 18,
          x: pointer.x - 9,
          y: pointer.y - 9,
        });
        gsap.set(cornerPieces(), {
          opacity: 0.35,
          scale: 0.38,
        });
        syncCorners(el, 0.36, "power4.out");
        gsap.to(cornerPieces(), {
          duration: 0.3,
          ease: "power3.out",
          opacity: 1,
          scale: 1,
          stagger: 0.025,
        });
      };

      const onLeave = () => {
        activeTarget = null;
        // Kill previous animations
        gsap.killTweensOf(crosshairRef.current);
        gsap.killTweensOf(cornersRef.current);
        gsap.killTweensOf(cornerPieces());

        // Corners collapse back toward the pointer, then disappear.
        gsap.to(cornersRef.current, {
          duration: 0.22,
          ease: "power3.inOut",
          height: 18,
          opacity: 0,
          width: 18,
          x: pointer.x - 9,
          y: pointer.y - 9,
          onComplete: () => {
            if (!activeTarget) {
              gsap.set(cornersRef.current, { display: "none" });
            }
          },
        });
        gsap.to(cornerPieces(), {
          duration: 0.16,
          ease: "power2.out",
          opacity: 0.25,
          scale: 0.42,
        });

        // Crosshair returns
        gsap.set(crosshairRef.current, { display: "block" });
        gsap.fromTo(
          crosshairRef.current,
          { opacity: 0, scale: 0.5 },
          {
            duration: 0.24,
            ease: "power4.out",
            opacity: 1,
            scale: 1,
          }
        );
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    }

    const onMouseMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      // Direct fast follow, no trailing, makes it feel like an FPS sniper
      gsap.to(cursorRef.current, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.1,
        ease: "none",
      });
      if (activeTarget) {
        syncCorners(activeTarget, 0.16, "power2.out");
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    const onViewportChange = () => {
      if (activeTarget) {
        syncCorners(activeTarget, 0.1);
      }
    };

    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, { passive: true });

    // Initial state
    const onMouseDown = () => {
      gsap.to(cursorRef.current, {
        scale: 0.8,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const onMouseUp = () => {
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.24,
        ease: "power4.out",
      });
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.head.removeChild(style);
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed top-0 left-0 z-[10000] hidden h-5 w-5 mix-blend-difference md:block"
        ref={cursorRef}
        style={{
          transformOrigin: "center center",
        }}
      >
        {/* Simple crosshair, kept quiet until it needs to mark a target. */}
        <div className="absolute inset-0" ref={crosshairRef}>
          <div className="-translate-x-1/2 absolute top-0 left-1/2 h-[38%] w-px bg-white" />
          <div className="-translate-x-1/2 absolute bottom-0 left-1/2 h-[38%] w-px bg-white" />
          <div className="-translate-y-1/2 absolute top-1/2 left-0 h-px w-[38%] bg-white" />
          <div className="-translate-y-1/2 absolute top-1/2 right-0 h-px w-[38%] bg-white" />
        </div>
      </div>

      {/* Four target corners, animated to the hovered element bounds. */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden mix-blend-difference md:block"
        ref={cornersRef}
      >
        {/* Top Left */}
        <div
          className="absolute top-0 left-0 h-3 w-3 origin-top-left border-white border-t border-l"
          data-cursor-corner
        />
        {/* Top Right */}
        <div
          className="absolute top-0 right-0 h-3 w-3 origin-top-right border-white border-t border-r"
          data-cursor-corner
        />
        {/* Bottom Left */}
        <div
          className="absolute bottom-0 left-0 h-3 w-3 origin-bottom-left border-white border-b border-l"
          data-cursor-corner
        />
        {/* Bottom Right */}
        <div
          className="absolute right-0 bottom-0 h-3 w-3 origin-bottom-right border-white border-r border-b"
          data-cursor-corner
        />
      </div>
    </>
  );
}
