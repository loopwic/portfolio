"use client";
import { motion, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useScrollContext } from "@/contexts/scroll-context";
import {
  LOGO_HOVER_ANIMATIONS,
  THEME_TOGGLE_ANIMATIONS,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

const ThemeToggle = dynamic(() => import("./theme-toggle"), {
  ssr: false,
});

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
  const pathname = usePathname();
  const router = useRouter();
  const { scrollYProgress, scrollToSection, currentSectionIndex } =
    useScrollContext();
  const [isLogoHovered, setIsLogoHovered] = React.useState(false);

  // 使用 useTransform 来创建响应式的旋转动画
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, FULL_ROTATION_DEGREES]
  );

  const borderRadius = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleNavClick = (href: string) => {
    // 如果当前不在主页，先跳转到主页再滚动到对应锚点
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }

    const sectionIndex = CONSTANTS.findIndex((item) => item.href === href);

    if (sectionIndex !== -1) {
      scrollToSection(sectionIndex);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-99 flex items-center justify-between bg-background/40 py-4 backdrop-blur-2xl">
      <nav className="container mx-auto flex items-center justify-between px-4">
        <motion.div
          className="relative flex size-10 items-center justify-center"
          onHoverEnd={() => setIsLogoHovered(false)}
          onHoverStart={() => setIsLogoHovered(true)}
        >
          <motion.div
            animate={isLogoHovered ? "animate" : "initial"}
            className="relative z-2 flex text-left font-bold font-mono"
            initial="initial"
            variants={LOGO_HOVER_ANIMATIONS}
          >
            Lp
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-muted"
            id="logo-bg"
            style={{ rotate, borderRadius }}
          />
          <motion.div
            animate={isLogoHovered ? "animate" : "initial"}
            className="absolute top-0 right-0 text-background"
            initial="initial"
            variants={THEME_TOGGLE_ANIMATIONS}
          >
            <ThemeToggle />
            <motion.div
              className="absolute inset-0 z-1 bg-foreground"
              style={{ rotate, borderRadius }}
            />
          </motion.div>
        </motion.div>

        <div className="flex items-center gap-2.5">
          {CONSTANTS.map((item, index) => (
            <button
              className={cn(
                "text-sm transition-colors hover:text-primary",
                pathname === "/" && index === currentSectionIndex
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              type="button"
            >
              {item.label}
            </button>
          ))}
          <Link
            className={cn(
              "font-mono text-sm transition-colors hover:text-primary",
              pathname === "/blog" ? "text-primary" : "text-muted-foreground"
            )}
            href="/blog"
          >
            Blog
          </Link>
        </div>
      </nav>
    </header>
  );
}
