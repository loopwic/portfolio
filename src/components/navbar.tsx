"use client";
import { motion, useTransform } from "motion/react";
import Link from "next/link";
import { useScrollContext } from "@/contexts/scroll-context";

const CONSTANTS = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Projects",
    href: "#projects",
  },
];

const FULL_ROTATION_DEGREES = 360;

export default function Navbar() {
  const { scrollYProgress, scrollToSection, currentSectionIndex } =
    useScrollContext();

  // 使用 useTransform 来创建响应式的旋转动画
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, FULL_ROTATION_DEGREES]
  );

  const borderRadius = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleNavClick = (href: string) => {
    const sectionIndex = CONSTANTS.findIndex((item) => item.href === href);

    if (sectionIndex !== -1) {
      scrollToSection(sectionIndex);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-99 flex items-center justify-between bg-background/40 py-4 backdrop-blur-2xl">
      <nav className="container mx-auto flex items-center justify-between px-4">
        <motion.div className="relative flex size-10 items-center justify-center">
          <Link
            className="relative z-2 flex text-left font-bold font-mono"
            href="/"
          >
            Lp
          </Link>
          <motion.div
            className="absolute inset-0 bg-muted"
            id="logo-bg"
            style={{
              rotate,
              borderRadius,
            }}
          />
        </motion.div>

        <div className="flex items-center gap-2.5">
          {CONSTANTS.map((item, index) => (
            <button
              className={`font-mono text-sm transition-colors hover:text-primary ${
                index === currentSectionIndex
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
