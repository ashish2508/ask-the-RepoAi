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
          ? "border-glow-dark bg-zinc-800"
          : "border-glow-light bg-yellow-100"
      }`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      role="switch"
      aria-checked={isDark}
    >
      {isDark ? (
        <Moon className="h-6 w-6 text-zinc-900" />
      ) : (
        <Sun className="h-6 w-6 text-zinc-900" />
      )}
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>

      <style jsx>{`
        .border-glow-light {
          box-shadow:
            0 0 12px rgba(255, 165, 0, 0.6),
            0 0 20px rgba(255, 215, 0, 0.4);
        }
        .border-glow-dark {
          box-shadow:
            0 0 12px rgba(255, 255, 255, 0.4),
            0 0 20px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </button>
  );
}
