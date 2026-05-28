"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

const INTERACTABLE_SELECTOR =
  "a, button, input, textarea, [data-interactive], [data-magnetic]";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    const crosshair = crosshairRef.current;
    const corners = cornersRef.current;
    if (!(cursor && crosshair && corners)) {
      return;
    }

    const styleTag = document.createElement("style");
    styleTag.innerHTML = "* { cursor: none !important; }";
    document.head.appendChild(styleTag);

    const cornerPieces = Array.from(
      corners.querySelectorAll<HTMLElement>("[data-cursor-corner]")
    );

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let activeTarget: Element | null = null;
    let scrollSyncQueued = false;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(corners, {
      display: "none",
      height: 24,
      opacity: 0,
      width: 24,
      x: pointer.x - 12,
      y: pointer.y - 12,
    });

    const moveCursorX = gsap.quickTo(cursor, "x", {
      duration: 0.1,
      ease: "none",
    });
    const moveCursorY = gsap.quickTo(cursor, "y", {
      duration: 0.1,
      ease: "none",
    });

    const syncCorners = (
      target: Element,
      duration = 0.18,
      ease = "power3.out"
    ) => {
      const rect = target.getBoundingClientRect();
      gsap.to(corners, {
        duration,
        ease,
        height: rect.height,
        opacity: 1,
        width: rect.width,
        x: rect.left,
        y: rect.top,
      });
    };

    const enterInteractable = (target: Element) => {
      activeTarget = target;
      gsap.killTweensOf(crosshair);
      gsap.killTweensOf(corners);
      gsap.killTweensOf(cornerPieces);

      gsap.to(crosshair, {
        duration: 0.14,
        ease: "power2.out",
        opacity: 0,
        scale: 0.58,
        onComplete: () => {
          gsap.set(crosshair, { display: "none" });
        },
      });

      gsap.set(corners, {
        display: "block",
        height: 18,
        opacity: 0.18,
        width: 18,
        x: pointer.x - 9,
        y: pointer.y - 9,
      });
      gsap.set(cornerPieces, { opacity: 0.35, scale: 0.38 });
      syncCorners(target, 0.36, "power4.out");
      gsap.to(cornerPieces, {
        duration: 0.3,
        ease: "power3.out",
        opacity: 1,
        scale: 1,
        stagger: 0.025,
      });
    };

    const leaveInteractable = () => {
      activeTarget = null;
      gsap.killTweensOf(crosshair);
      gsap.killTweensOf(corners);
      gsap.killTweensOf(cornerPieces);

      gsap.to(corners, {
        duration: 0.22,
        ease: "power3.inOut",
        height: 18,
        opacity: 0,
        width: 18,
        x: pointer.x - 9,
        y: pointer.y - 9,
        onComplete: () => {
          if (!activeTarget) {
            gsap.set(corners, { display: "none" });
          }
        },
      });
      gsap.to(cornerPieces, {
        duration: 0.16,
        ease: "power2.out",
        opacity: 0.25,
        scale: 0.42,
      });

      gsap.set(crosshair, { display: "block" });
      gsap.fromTo(
        crosshair,
        { opacity: 0, scale: 0.5 },
        { duration: 0.24, ease: "power4.out", opacity: 1, scale: 1 }
      );
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest(
        INTERACTABLE_SELECTOR
      );
      if (!target || target === activeTarget) {
        return;
      }
      if (activeTarget) {
        leaveInteractable();
      }
      enterInteractable(target);
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (!activeTarget) {
        return;
      }
      const related = (event.relatedTarget as Element | null)?.closest(
        INTERACTABLE_SELECTOR
      );
      if (related === activeTarget) {
        return;
      }
      leaveInteractable();
    };

    const handleMouseMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      moveCursorX(event.clientX);
      moveCursorY(event.clientY);
      if (activeTarget) {
        syncCorners(activeTarget, 0.16, "power2.out");
      }
    };

    const handleScroll = () => {
      if (!activeTarget || scrollSyncQueued) {
        return;
      }
      scrollSyncQueued = true;
      window.requestAnimationFrame(() => {
        scrollSyncQueued = false;
        if (activeTarget) {
          syncCorners(activeTarget, 0.1);
        }
      });
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.1, ease: "power2.out" });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.24, ease: "power4.out" });
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (styleTag.parentNode) {
        styleTag.parentNode.removeChild(styleTag);
      }
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed top-0 left-0 z-[10000] hidden h-5 w-5 mix-blend-difference md:block"
        ref={cursorRef}
        style={{ transformOrigin: "center center" }}
      >
        <div className="absolute inset-0" ref={crosshairRef}>
          <div className="-translate-x-1/2 absolute top-0 left-1/2 h-[38%] w-px bg-white" />
          <div className="-translate-x-1/2 absolute bottom-0 left-1/2 h-[38%] w-px bg-white" />
          <div className="-translate-y-1/2 absolute top-1/2 left-0 h-px w-[38%] bg-white" />
          <div className="-translate-y-1/2 absolute top-1/2 right-0 h-px w-[38%] bg-white" />
        </div>
      </div>

      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden mix-blend-difference md:block"
        ref={cornersRef}
      >
        <div
          className="absolute top-0 left-0 h-3 w-3 origin-top-left border-white border-t border-l"
          data-cursor-corner
        />
        <div
          className="absolute top-0 right-0 h-3 w-3 origin-top-right border-white border-t border-r"
          data-cursor-corner
        />
        <div
          className="absolute bottom-0 left-0 h-3 w-3 origin-bottom-left border-white border-b border-l"
          data-cursor-corner
        />
        <div
          className="absolute right-0 bottom-0 h-3 w-3 origin-bottom-right border-white border-r border-b"
          data-cursor-corner
        />
      </div>
    </>
  );
}
