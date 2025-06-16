"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`focus:ring-primary focus:ring-offset-background flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
        isDark
          ? " bg-transparent"
          : "border-glow-light bg-yellow-100"
      }`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      role="switch"
      aria-checked={isDark}
    >
      {isDark ? (
        <Moon className="h-6 w-6 text-emerald-900" />
      ) : (
        <Sun className="h-6 w-6 text-emerald-900" />
      )}
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  );
}
