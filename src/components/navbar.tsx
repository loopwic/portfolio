"use client";

import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, useTransform } from "motion/react";
import React, { useEffect } from "react";
import { useScrollContext } from "@/contexts/scroll-context";
import {
  LOGO_HOVER_ANIMATIONS,
  THEME_TOGGLE_ANIMATIONS,
} from "@/lib/animations";
import { cn } from "@/lib/utils";
import ThemeToggle from "./theme-toggle";

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
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { scrollYProgress, scrollToSection, currentSectionIndex } =
    useScrollContext();
  const [isLogoHovered, setIsLogoHovered] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, FULL_ROTATION_DEGREES]
  );

  const borderRadius = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleNavClick = (href: string) => {
    if (pathname !== "/") {
      navigate({
        to: "/",
        hash: href.slice(1),
      });
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
            {isMounted ? <ThemeToggle /> : null}
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
            to="/blog"
          >
            Blog
          </Link>
        </div>
      </nav>
    </header>
  );
}
