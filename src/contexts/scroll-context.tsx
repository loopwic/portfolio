"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

interface ScrollContextType {
  currentSectionIndex: number;
  scrollToSection: (id: string) => void;
}

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
}) => <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
