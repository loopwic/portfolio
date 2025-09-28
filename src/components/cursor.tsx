import { CaretUpDownIcon } from "@phosphor-icons/react";
import { motion, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type CursorProps = {
  isExpanded?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
};

const CURSOR_SIZE = 40; // size-10 = 40px
const CURSOR_OFFSET = CURSOR_SIZE / 2; // 图标尺寸的一半
const ANIMATION_DURATION = 0.2;
const Z_INDEX = 9999;
const SCALE_HIDDEN = 0.5;

export default function Cursor({ buttonRef }: CursorProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!(buttonRef?.current && isMounted)) {
      return;
    }

    const button = buttonRef.current;

    const move = (e: MouseEvent) => {
      // 使用视口坐标，减去图标尺寸的一半使其居中
      const cursorX = e.clientX - CURSOR_OFFSET;
      const cursorY = e.clientY - CURSOR_OFFSET;

      x.set(cursorX);
      y.set(cursorY);
    };

    const enter = () => setIsVisible(true);
    const leave = () => setIsVisible(false);

    button.addEventListener("mousemove", move);
    button.addEventListener("mouseenter", enter);
    button.addEventListener("mouseleave", leave);

    return () => {
      button.removeEventListener("mousemove", move);
      button.removeEventListener("mouseenter", enter);
      button.removeEventListener("mouseleave", leave);
    };
  }, [x, y, buttonRef, isMounted]);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <motion.div
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : SCALE_HIDDEN,
      }}
      className="fixed flex size-10 items-center justify-center rounded-full bg-white text-black"
      initial={{
        opacity: 0,
        scale: SCALE_HIDDEN,
      }}
      style={{
        left: x,
        top: y,
        pointerEvents: "none", // 不挡交互
        zIndex: Z_INDEX,
      }}
      transition={{
        duration: ANIMATION_DURATION,
        ease: "easeOut",
      }}
    >
      <CaretUpDownIcon />
    </motion.div>,
    document.body
  );
}
