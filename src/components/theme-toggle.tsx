"use client";

import { MoonIcon, SunDimIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      className="relative z-10 size-10 cursor-pointer hover:bg-transparent hover:text-background"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size={"icon"}
    >
      {theme === "dark" ? (
        <SunDimIcon size={32} weight="bold" />
      ) : (
        <MoonIcon size={32} weight="bold" />
      )}
    </Button>
  );
}
