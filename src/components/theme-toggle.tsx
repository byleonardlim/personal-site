"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Laptop } from "lucide-react";

// Theme values we support
type ThemeChoice = "light" | "dark" | "system";

// Read current theme (light/dark/system) from localStorage and system
function getCurrentChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const ls = localStorage.getItem("theme");
  if (ls === "light" || ls === "dark") return ls;
  return "system";
}

function applyTheme(choice: ThemeChoice, withTransition = false) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const wantDark = choice === "dark" || (choice === "system" && systemDark);

  if (withTransition) {
    // Add a temporary class to animate color-related properties
    root.classList.add("theme-transition");
    // Next frame, toggle theme so transitions kick in
    requestAnimationFrame(() => {
      root.classList.toggle("dark", wantDark);
      // Remove transition class after duration
      setTimeout(() => root.classList.remove("theme-transition"), 320);
    });
  } else {
    root.classList.toggle("dark", wantDark);
  }
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  // Initialize to 'system' on both server and client to keep SSR/CSR markup identical
  const [choice, setChoice] = useState<ThemeChoice>("system");

  // Apply immediately on mount to avoid mismatch
  useEffect(() => {
    // Sync choice from storage/system after mount, then apply with no transition
    const current = getCurrentChoice();
    setChoice(current);
    applyTheme(current, false);
  }, []);

  // Respond to system changes when in system mode
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (choice === "system") applyTheme("system", true);
    };
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, [choice]);

  const onToggle = () => {
    let next: ThemeChoice;
    if (choice === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      next = systemDark ? "light" : "dark";
    } else {
      next = choice === "dark" ? "light" : "dark";
    }
    setChoice(next);
    localStorage.setItem("theme", next);
    applyTheme(next, true);
  };

  const buttonBase =
    "inline-flex items-center gap-1 px-2 py-1 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${buttonBase} ${className}`}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {choice === "system" ? (
        <Laptop className="w-4 h-4" />
      ) : choice === "dark" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
