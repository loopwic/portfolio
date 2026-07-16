"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef } from "react";

import { GSAP_EASE_POWER2, GSAP_EASE_POWER3 } from "@/lib/motion-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface HomeTransitionsProps {
  children: ReactNode;
}

export const HomeTransitions = ({ children }: HomeTransitionsProps) => {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-atmosphere-drift]", { willChange: "transform" });
        gsap.to('[data-atmosphere-drift="primary"]', {
          duration: 19,
          ease: "sine.inOut",
          repeat: -1,
          x: 10,
          y: 8,
          yoyo: true,
        });
        gsap.to('[data-atmosphere-drift="secondary"]', {
          duration: 23,
          ease: "sine.inOut",
          repeat: -1,
          x: -10,
          y: -8,
          yoyo: true,
        });

        const intro = gsap.timeline({ defaults: { ease: GSAP_EASE_POWER3 } });

        intro
          .from("[data-profile-avatar]", {
            clearProps: "opacity,transform",
            duration: 0.62,
            opacity: 0,
            scale: 0.92,
            x: -12,
          })
          .from(
            "[data-profile-copy]",
            {
              clearProps: "opacity,transform",
              duration: 0.68,
              opacity: 0,
              x: 12,
            },
            0.08
          );

        for (const section of gsap.utils.toArray<HTMLElement>(
          "[data-motion-section]"
        )) {
          const heading = section.querySelector("[data-motion-heading]");
          const items = section.querySelectorAll(
            "[data-motion-item], [data-timeline-item]"
          );
          const reveal = gsap.timeline({
            scrollTrigger: {
              once: true,
              start: "top 76%",
              trigger: section,
            },
          });

          if (heading) {
            reveal.from(heading, {
              clearProps: "opacity,transform",
              duration: 0.48,
              ease: GSAP_EASE_POWER3,
              opacity: 0,
              y: 10,
            });
          }

          if (items.length > 0) {
            reveal.from(
              items,
              {
                clearProps: "opacity,transform",
                duration: 0.64,
                ease: GSAP_EASE_POWER3,
                opacity: 0,
                stagger: 0.08,
                y: 18,
              },
              heading ? "-=0.2" : 0
            );
          }
        }

        const experience = scope.current?.querySelector("#experience");
        const timelineLine = scope.current?.querySelector(
          "[data-timeline-line]"
        );

        if (experience && timelineLine) {
          gsap.from(timelineLine, {
            clearProps: "transform",
            duration: 0.82,
            ease: GSAP_EASE_POWER2,
            scaleY: 0,
            scrollTrigger: {
              once: true,
              start: "top 76%",
              trigger: experience,
            },
            transformOrigin: "top",
          });
        }

        ScrollTrigger.refresh();
      });

      return () => media.revert();
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
};
