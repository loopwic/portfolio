"use client";

import { useEffect, useRef, useState } from "react";

const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
const CIPHER_ITERATIONS = 6;
const CIPHER_INTERVAL_MS = 50;
const RANDOM_CENTER_OFFSET = 0.5;
const SCATTER_X_RANGE = 600;
const SCATTER_Y_RANGE = 400;
const SCATTER_ROTATION_RANGE = 90;
const SCATTER_DELAY_TOTAL_MS = 400;
const TYPEWRITER_STEP_DELAY_MS = 20;
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
  const [cipherText, setCipherText] = useState(mode === "cipher" ? text : "");

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
    if (!(mode === "cipher" && isVisible)) {
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
            return CIPHER_CHARS[
              Math.floor(Math.random() * CIPHER_CHARS.length)
            ];
          })
          .join("")
      );

      iteration += text.length / CIPHER_ITERATIONS;

      if (iteration >= text.length) {
        setCipherText(text);
        clearInterval(interval);
      }
    }, CIPHER_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [mode, text, isVisible]);

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
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translate(0, 0) rotate(0deg)"
                : `translate(${getSeededRange(seed, i, 1, SCATTER_X_RANGE)}px, ${getSeededRange(seed, i, 2, SCATTER_Y_RANGE)}px) rotate(${getSeededRange(seed, i, 3, SCATTER_ROTATION_RANGE)}deg)`,
              transitionDelay: `${roundValue(i * (SCATTER_DELAY_TOTAL_MS / letters.length))}ms`,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
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
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(8px)",
            transition: `opacity 0.18s cubic-bezier(0.16,1,0.3,1) ${i * TYPEWRITER_STEP_DELAY_MS}ms, transform 0.18s cubic-bezier(0.16,1,0.3,1) ${i * TYPEWRITER_STEP_DELAY_MS}ms`,
          }}
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
