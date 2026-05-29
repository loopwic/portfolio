"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useEffect } from "react";
import {
  DURATION_REDUCED,
  GSAP_BACK_HEADER,
  GSAP_BACK_NUMBER,
  GSAP_BACK_SOFT,
  GSAP_EASE,
  GSAP_EASE_NONE,
  GSAP_EASE_POWER2,
  GSAP_EASE_POWER3,
  STAGGER_BASE,
  STAGGER_INTRO,
  STAGGER_STICKER,
  STAGGER_TIGHT,
} from "@/lib/motion-tokens";

export function HomeAnimations({
  scope,
}: {
  scope: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
  }, []);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.set(".intro-line", { yPercent: 110, opacity: 0, skewY: 8 });
      gsap.set(".fade-in", { y: 16, opacity: 0 });

      const intro = gsap.timeline({
        defaults: { ease: GSAP_EASE },
      });
      intro
        .to(".intro-line", {
          yPercent: 0,
          opacity: 1,
          skewY: 0,
          duration: reduceMotion ? DURATION_REDUCED : 0.85,
          stagger: STAGGER_INTRO,
        })
        .to(
          ".fade-in",
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? DURATION_REDUCED : 0.45,
            stagger: STAGGER_BASE,
          },
          "-=0.55"
        );

      if (reduceMotion) {
        gsap.set(".scroll-fade", { clearProps: "all" });
        gsap.set(".tech-sticker", { clearProps: "all" });
        return;
      }

      gsap.set(".tech-sticker", {
        filter: "blur(10px) saturate(1.35)",
        opacity: 0,
        rotateX: -82,
        rotateY: 54,
        rotateZ: -24,
        scale: 0.16,
        transformOrigin: "50% 50%",
        transformPerspective: 900,
        y: 140,
        z: -160,
      });
      gsap.set(".tech-sticker img", {
        transformOrigin: "50% 50%",
        transformPerspective: 900,
      });

      const protocolTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".protocol-pin",
          start: "top top",
          end: "+=1700",
          pin: true,
          scrub: 0.8,
        },
      });

      protocolTimeline
        .to(".protocol-copy", {
          opacity: 0.24,
          scale: 0.96,
          duration: 0.8,
          ease: GSAP_EASE_NONE,
        })
        .to(
          ".tech-sticker",
          {
            filter: "blur(0px) saturate(1)",
            opacity: 1,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            y: 0,
            z: 0,
            stagger: { each: STAGGER_STICKER, from: "center" },
            duration: 0.95,
            ease: GSAP_BACK_SOFT,
          },
          0.15
        )
        .to(
          ".sticker-field",
          {
            rotate: 1.5,
            scale: 1.02,
            duration: 1.4,
            ease: GSAP_EASE_NONE,
          },
          0.25
        );

      for (const section of gsap.utils.toArray<HTMLElement>(
        ".scroll-section"
      )) {
        const header = section.querySelector<HTMLElement>(
          ".scroll-fade.section-header"
        );
        const fades = Array.from(
          section.querySelectorAll<HTMLElement>(".scroll-fade")
        ).filter((el) => el !== header);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { x: -24, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.42, ease: GSAP_BACK_HEADER }
          );
          const numberEl = header.querySelector(".section-header-number");
          const ruleEl = header.querySelector(".section-header-rule");
          const titleEl = header.querySelector(".section-header-title");
          if (numberEl && ruleEl && titleEl) {
            tl.fromTo(
              numberEl,
              { scale: 0.6 },
              { scale: 1, duration: 0.32, ease: GSAP_BACK_NUMBER },
              "<"
            );
            tl.fromTo(
              ruleEl,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.32,
                ease: GSAP_EASE,
                transformOrigin: "left center",
              },
              "<+=0.1"
            );
            tl.fromTo(
              titleEl,
              { opacity: 0 },
              { opacity: 1, duration: 0.24, ease: GSAP_EASE_POWER2 },
              "<+=0.05"
            );
          }
        }

        if (fades.length > 0) {
          tl.fromTo(
            fades,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              stagger: STAGGER_TIGHT,
              ease: GSAP_EASE,
            },
            header ? "-=0.2" : 0
          );
        }
      }

      for (const item of gsap.utils.toArray<HTMLElement>(".project-item")) {
        const projectImage = item.querySelector(".project-img");
        const pixelDecs = item.querySelectorAll(".pixel-dec");
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: GSAP_EASE_POWER3 },
        });

        if (projectImage) {
          tl.to(projectImage, { scale: 1.05, duration: 0.8 });
        }

        if (pixelDecs.length > 0) {
          tl.to(
            pixelDecs,
            { opacity: 1, y: -4, stagger: STAGGER_TIGHT, duration: 0.4 },
            0
          );
        }

        item.addEventListener("mouseenter", () => tl.play());
        item.addEventListener("mouseleave", () => tl.reverse());
      }

      const magneticCleanups: Array<() => void> = [];
      for (const target of gsap.utils.toArray<HTMLElement>("[data-magnetic]")) {
        const onMove = (event: MouseEvent) => {
          const rect = target.getBoundingClientRect();
          gsap.to(target, {
            x: (event.clientX - rect.left - rect.width / 2) * 0.1,
            y: (event.clientY - rect.top - rect.height / 2) * 0.1,
            duration: 0.4,
            ease: GSAP_EASE_POWER2,
          });
        };
        const onLeave = () => {
          gsap.to(target, {
            x: 0,
            y: 0,
            duration: 0.32,
            ease: GSAP_EASE_POWER3,
          });
        };
        target.addEventListener("mousemove", onMove);
        target.addEventListener("mouseleave", onLeave);
        magneticCleanups.push(() => {
          target.removeEventListener("mousemove", onMove);
          target.removeEventListener("mouseleave", onLeave);
        });
      }

      return () => {
        for (const cleanup of magneticCleanups) {
          cleanup();
        }
      };
    },
    { scope }
  );

  return null;
}
