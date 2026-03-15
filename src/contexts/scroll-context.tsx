"use client";

import type { MotionValue } from "motion/react";
import { createContext, type ReactNode, useContext } from "react";

type ScrollContextType = {
  scrollYProgress: MotionValue<number>;
  currentSectionIndex: number;
  scrollToSection: (id: string) => void;
};

const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within ScrollProvider");
  }
  return context;
};

export const ScrollProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: NonNullable<ScrollContextType>;
}) => {
  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};
