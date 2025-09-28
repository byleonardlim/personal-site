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

function applyTheme(choice: ThemeChoice) {
  if (typeof document === "undefined") return;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const wantDark = choice === "dark" || (choice === "system" && systemDark);
  document.documentElement.classList.toggle("dark", wantDark);
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [choice, setChoice] = useState<ThemeChoice>(() => getCurrentChoice());

  // Apply immediately on mount to avoid mismatch
  useEffect(() => {
    applyTheme(choice);
  }, []);

  // Respond to system changes when in system mode
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (choice === "system") applyTheme("system");
    };
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, [choice]);

  const onSelect = (next: ThemeChoice) => {
    setChoice(next);
    if (next === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", next);
    }
    applyTheme(next);
  };

  const buttonBase =
    "inline-flex items-center gap-1 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        aria-pressed={choice === "light"}
        onClick={() => onSelect("light")}
        className={buttonBase}
        title="Light"
      >
        <Sun className="w-4 h-4" />
        <span className="sr-only">Light</span>
      </button>
      <button
        type="button"
        aria-pressed={choice === "dark"}
        onClick={() => onSelect("dark")}
        className={buttonBase}
        title="Dark"
      >
        <Moon className="w-4 h-4" />
        <span className="sr-only">Dark</span>
      </button>
      <button
        type="button"
        aria-pressed={choice === "system"}
        onClick={() => onSelect("system")}
        className={buttonBase}
        title="System"
      >
        <Laptop className="w-4 h-4" />
        <span className="sr-only">System</span>
      </button>
    </div>
  );
}
