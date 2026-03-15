"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

const NAVBAR_HEIGHT = 72;
const PARENT_PADDING_TOP = 18;
const TOTAL_OFFSET = NAVBAR_HEIGHT + PARENT_PADDING_TOP;
const SCROLL_SPACING = 20;
const THROTTLE_DELAY = 50;
const READING_OFFSET = 100;

const calculateIndent = (level: number, minLevel: number): string => {
  const relativeLevel = level - minLevel;
  const indentMap = {
    0: "ml-0",
    1: "ml-4",
    2: "ml-8",
    3: "ml-12",
    4: "ml-16",
  } as const;

  return indentMap[relativeLevel as keyof typeof indentMap] || "ml-16";
};

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headingElements = document.querySelectorAll("h2, h3, h4, h5, h6");
    const headingList: Heading[] = Array.from(headingElements)
      .filter((heading) => heading.id && heading.textContent?.trim())
      .map((heading) => ({
        id: heading.id,
        text: heading.textContent?.trim() || "",
        level: Number.parseInt(heading.tagName.charAt(1), 10),
      }));

    setHeadings(headingList);

    const getHeadingInfo = (
      heading: Heading,
      readingPosition: number,
      viewportTop: number
    ) => {
      const element = document.getElementById(heading.id);
      if (!element) return null;

      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const elementBottom = elementTop + elementHeight;

      return {
        ...heading,
        element,
        elementTop,
        elementBottom,
        isPassed: elementTop < readingPosition,
        isInReadingZone:
          elementTop <= readingPosition && elementBottom >= viewportTop,
        distanceFromReading: Math.abs(elementTop - readingPosition),
      };
    };

    const findTargetHeading = (
      headingInfos: NonNullable<ReturnType<typeof getHeadingInfo>>[]
    ) => {
      const inReadingZone = headingInfos.filter((h) => h.isInReadingZone);

      if (inReadingZone.length > 0) {
        return inReadingZone.reduce((closest, current) =>
          current.distanceFromReading < closest.distanceFromReading
            ? current
            : closest
        );
      }

      const passedHeadings = headingInfos.filter((h) => h.isPassed);
      const lastPassed = passedHeadings.at(-1);
      return lastPassed || headingInfos[0];
    };

    const updateActiveHeading = () => {
      if (headingList.length === 0) return;

      const scrollTop = window.scrollY;
      const viewportTop = scrollTop + TOTAL_OFFSET;
      const readingPosition = viewportTop + READING_OFFSET;

      const headingInfos = headingList
        .map((heading) => getHeadingInfo(heading, readingPosition, viewportTop))
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => a.elementTop - b.elementTop);

      if (headingInfos.length === 0) return;

      const targetHeading = findTargetHeading(headingInfos);
      setActiveId(targetHeading.id);
    };

    if (headingList.length > 0) {
      setActiveId(headingList[0].id);
    }

    let lastUpdateTime = 0;

    const throttledUpdateActiveHeading = () => {
      const now = Date.now();
      if (now - lastUpdateTime < THROTTLE_DELAY) return;
      lastUpdateTime = now;
      requestAnimationFrame(updateActiveHeading);
    };

    window.addEventListener("scroll", throttledUpdateActiveHeading);
    updateActiveHeading();

    return () => {
      window.removeEventListener("scroll", throttledUpdateActiveHeading);
    };
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - TOTAL_OFFSET - SCROLL_SPACING;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-1">
      <ul className="space-y-0.5 text-sm">
        {headings.map((heading) => (
          <li
            className={calculateIndent(heading.level, minLevel)}
            key={heading.id}
          >
            <button
              className={`block w-full border-l-2 px-2.5 py-1.5 text-left transition-colors ${
                activeId === heading.id
                  ? "border-signal-a font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border-hard hover:text-foreground"
              }`}
              onClick={() => scrollToHeading(heading.id)}
              type="button"
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
