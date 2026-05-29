"use client";

import { useEffect, useRef, useState } from "react";
import { CSS_EASE_BRUTAL, DURATION_SNAP, KINETIC } from "@/lib/motion-tokens";

const RANDOM_CENTER_OFFSET = 0.5;
const HASH_MULTIPLIER = 31;
const HASH_MODULO = 100_000;
const RANDOM_SINE_SCALE = 12.9898;
const RANDOM_SINE_OFFSET = 78.233;
const RANDOM_SINE_MULTIPLIER = 43_758.5453;
const ROUNDING_PRECISION = 1000;

type KineticTextProps = {
  text: string;
  mode?: "scatter" | "typewriter" | "cipher";
  className?: string;
  as?: "h1" | "h2" | "span" | "p";
  triggerOnView?: boolean;
};

export function KineticText({
  text,
  mode = "scatter",
  className = "",
  as: Tag = "span",
  triggerOnView = true,
}: KineticTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(!triggerOnView);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [cipherText, setCipherText] = useState(mode === "cipher" ? text : "");

  // Read once on mount. SSR-safe default (false); corrected on the client
  // before any motion runs, so reduced-motion users get the static state.
  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (!(triggerOnView && ref.current)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggerOnView]);

  useEffect(() => {
    if (!(mode === "cipher" && isVisible) || reduceMotion) {
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setCipherText(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") {
              return " ";
            }
            if (i < iteration) {
              return text[i];
            }
            return KINETIC.cipherChars[
              Math.floor(Math.random() * KINETIC.cipherChars.length)
            ];
          })
          .join("")
      );

      iteration += text.length / KINETIC.cipherIterations;

      if (iteration >= text.length) {
        setCipherText(text);
        clearInterval(interval);
      }
    }, KINETIC.cipherIntervalMs);

    return () => clearInterval(interval);
  }, [mode, text, isVisible, reduceMotion]);

  if (mode === "cipher") {
    return (
      <Tag className={className} ref={ref as never}>
        {isVisible ? cipherText : text}
      </Tag>
    );
  }

  if (mode === "scatter") {
    const letters = text.split("");
    const seed = hashText(text);

    return (
      <Tag className={className} ref={ref as never}>
        {letters.map((char, i) => (
          <span
            className="inline-block transition-all duration-600"
            key={`${i}-${char}`}
            style={
              reduceMotion
                ? { opacity: 1, transform: "none", transition: "none" }
                : {
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translate(0, 0) rotate(0deg)"
                      : `translate(0px, ${getSeededRange(seed, i, 2, KINETIC.settleYpx)}px) rotate(${getSeededRange(seed, i, 3, KINETIC.settleRotateDeg)}deg)`,
                    transitionDelay: `${roundValue(i * (KINETIC.scatterDelayTotalMs / letters.length))}ms`,
                    transitionTimingFunction: CSS_EASE_BRUTAL,
                  }
            }
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </Tag>
    );
  }

  // typewriter
  const letters = text.split("");
  return (
    <Tag className={className} ref={ref as never}>
      {letters.map((char, i) => (
        <span
          className="inline-block"
          key={`${i}-${char}`}
          style={
            reduceMotion
              ? { opacity: 1, transform: "none", transition: "none" }
              : {
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity ${DURATION_SNAP}s ${CSS_EASE_BRUTAL} ${i * KINETIC.typewriterStepMs}ms, transform ${DURATION_SNAP}s ${CSS_EASE_BRUTAL} ${i * KINETIC.typewriterStepMs}ms`,
                }
          }
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}

function hashText(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * HASH_MULTIPLIER + char.charCodeAt(0)) % HASH_MODULO;
  }

  return hash;
}

function seededRandom(seed: number) {
  const raw =
    Math.sin(seed * RANDOM_SINE_SCALE + RANDOM_SINE_OFFSET) *
    RANDOM_SINE_MULTIPLIER;

  return raw - Math.floor(raw);
}

function getSeededRange(
  seed: number,
  index: number,
  salt: number,
  range: number
) {
  return roundValue(
    (seededRandom(seed + index * HASH_MULTIPLIER + salt) -
      RANDOM_CENTER_OFFSET) *
      range
  );
}

function roundValue(value: number) {
  return Math.round(value * ROUNDING_PRECISION) / ROUNDING_PRECISION;
}
