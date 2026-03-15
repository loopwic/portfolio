"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
const CIPHER_ITERATIONS = 6;
const CIPHER_INTERVAL_MS = 50;

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
  const [cipherDone, setCipherDone] = useState(false);

  useEffect(() => {
    if (!triggerOnView || !ref.current) return;

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
    if (mode !== "cipher" || !isVisible) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setCipherText(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration) return text[i];
            return CIPHER_CHARS[
              Math.floor(Math.random() * CIPHER_CHARS.length)
            ];
          })
          .join("")
      );

      iteration += text.length / CIPHER_ITERATIONS;

      if (iteration >= text.length) {
        setCipherText(text);
        setCipherDone(true);
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
                : `translate(${(Math.random() - 0.5) * 600}px, ${(Math.random() - 0.5) * 400}px) rotate(${(Math.random() - 0.5) * 90}deg)`,
              transitionDelay: `${i * (400 / letters.length)}ms`,
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
            transition: `opacity 0.18s cubic-bezier(0.16,1,0.3,1) ${i * 20}ms, transform 0.18s cubic-bezier(0.16,1,0.3,1) ${i * 20}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
