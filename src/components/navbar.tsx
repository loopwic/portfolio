"use client";
import { motion, useTransform } from "motion/react";
import Link from "next/link";
import { useScrollContext } from "@/contexts/scroll-context";

const constants = [
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
  {
    label: "Works",
    href: "#works",
  },
];

// 静态常量
const FULL_ROTATION_DEGREES = 360;
const NAV_BAR_SCALE = 0.5;

export default function Navbar() {
  const { scrollYProgress } = useScrollContext();

  // 使用 useTransform 来创建响应式的旋转动画
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, FULL_ROTATION_DEGREES]
  );

  // 使用 useTransform 来创建响应式的缩放动画
  const scale = useTransform(scrollYProgress, [0, 1], [1, NAV_BAR_SCALE]);

  return (
    <nav className="fixed inset-x-0 top-0 z-99 flex items-center justify-between bg-background/40 px-4 py-2 backdrop-blur-2xl">
      <motion.div
        className="relative flex size-12 items-center justify-center"
        style={{
          scale,
        }}
      >
        <Link
          className="relative z-2 flex text-left font-bold font-mono text-xs"
          href="/"
        >
          Loop <br /> Wic
        </Link>
        <motion.div
          className="absolute inset-0 bg-muted"
          id="logo-bg"
          style={{
            rotate,
          }}
        />
      </motion.div>

      <div className="flex items-center gap-2.5">
        {constants.map((item) => (
          <Link
            className="font-mono text-muted-foreground text-sm hover:text-primary"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
