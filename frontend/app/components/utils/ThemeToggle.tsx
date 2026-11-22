"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { SunIcon, MoonIcon } from "./Icons";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-background-alt border border-transparent hover:border-border transition-colors duration-200 cursor-pointer ${className}`}
    >
      {theme === "dark" ? (
        <SunIcon className="w-5 h-5 text-amber-400" />
      ) : (
        <MoonIcon className="w-5 h-5 text-foreground/80" />
      )}
    </button>
  );
}

export default ThemeToggle;
