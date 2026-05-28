"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useEffect } from "react";

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

      gsap.set(".intro-line", { yPercent: 110, opacity: 0, skewY: 10 });
      gsap.set(".fade-in", { y: 24, opacity: 0 });

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .to(".intro-line", {
          yPercent: 0,
          opacity: 1,
          skewY: 0,
          duration: reduceMotion ? 0.2 : 1.4,
          stagger: 0.15,
        })
        .to(
          ".fade-in",
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.2 : 1.0,
            stagger: 0.1,
          },
          "-=1.0"
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
          ease: "none",
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
            stagger: { each: 0.12, from: "center" },
            duration: 0.95,
            ease: "back.out(1.6)",
          },
          0.15
        )
        .to(
          ".sticker-field",
          {
            rotate: 1.5,
            scale: 1.02,
            duration: 1.4,
            ease: "none",
          },
          0.25
        );

      for (const section of gsap.utils.toArray<HTMLElement>(
        ".scroll-section"
      )) {
        gsap.fromTo(
          section.querySelectorAll(".scroll-fade"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      for (const item of gsap.utils.toArray<HTMLElement>(".project-item")) {
        const projectImage = item.querySelector(".project-img");
        const pixelDecs = item.querySelectorAll(".pixel-dec");
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });

        if (projectImage) {
          tl.to(projectImage, { scale: 1.05, duration: 0.8 });
        }

        if (pixelDecs.length > 0) {
          tl.to(
            pixelDecs,
            { opacity: 1, y: -4, stagger: 0.05, duration: 0.4 },
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
            ease: "power2.out",
          });
        };
        const onLeave = () => {
          gsap.to(target, {
            x: 0,
            y: 0,
            duration: 0.32,
            ease: "power3.out",
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
