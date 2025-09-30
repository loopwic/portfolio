"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

// 滚动偏移量常量
const NAVBAR_HEIGHT = 72; // 导航栏高度
const PARENT_PADDING_TOP = 18;
const TOTAL_OFFSET = NAVBAR_HEIGHT + PARENT_PADDING_TOP;
const SCROLL_SPACING = 20; // 滚动时的额外间距
const THROTTLE_DELAY = 50; // 节流延迟（毫秒）
const READING_OFFSET = 100; // 阅读位置偏移量

// 计算相对于最小层级的缩进
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
    // 提取页面中的所有标题，排除 H1（文档标题）
    const headingElements = document.querySelectorAll("h2, h3, h4, h5, h6");
    const headingList: Heading[] = Array.from(headingElements)
      .filter((heading) => heading.id && heading.textContent?.trim())
      .map((heading) => ({
        id: heading.id,
        text: heading.textContent?.trim() || "",
        level: Number.parseInt(heading.tagName.charAt(1), 10),
      }));

    setHeadings(headingList);

    // 计算标题信息的辅助函数
    const getHeadingInfo = (
      heading: Heading,
      readingPosition: number,
      viewportTop: number
    ) => {
      const element = document.getElementById(heading.id);
      if (!element) {
        return null;
      }

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

    // 选择目标标题的辅助函数
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

    // 精细化的滚动高亮逻辑
    const updateActiveHeading = () => {
      if (headingList.length === 0) {
        return;
      }

      const scrollTop = window.scrollY;
      const viewportTop = scrollTop + TOTAL_OFFSET;
      const readingPosition = viewportTop + READING_OFFSET;

      const headingInfos = headingList
        .map((heading) => getHeadingInfo(heading, readingPosition, viewportTop))
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => a.elementTop - b.elementTop);

      if (headingInfos.length === 0) {
        return;
      }

      const targetHeading = findTargetHeading(headingInfos);
      setActiveId(targetHeading.id);
    };

    // 初始化时设置第一个标题为活跃
    if (headingList.length > 0) {
      setActiveId(headingList[0].id);
    }

    // 使用简单的节流优化
    let lastUpdateTime = 0;

    const throttledUpdateActiveHeading = () => {
      const now = Date.now();
      if (now - lastUpdateTime < THROTTLE_DELAY) {
        return;
      }

      lastUpdateTime = now;
      requestAnimationFrame(updateActiveHeading);
    };

    // 添加滚动监听
    window.addEventListener("scroll", throttledUpdateActiveHeading);

    // 初始调用一次
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

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // 立即更新活跃状态，提供即时反馈
      setActiveId(id);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  // 找到最小层级作为基准（通常是 H2 = level 2）
  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav className="sticky top-18 overflow-y-auto">
      <div className="mb-4 font-medium text-foreground text-sm">目录</div>
      <ul className="space-y-1 text-sm">
        {headings.map((heading) => (
          <li
            className={calculateIndent(heading.level, minLevel)}
            key={heading.id}
          >
            <button
              className={`block w-full rounded-md px-2 py-1 text-left transition-colors hover:bg-muted ${
                activeId === heading.id
                  ? "bg-muted font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground"
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
