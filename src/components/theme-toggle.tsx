"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { gsap } from "gsap";

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
  const iconRef = useRef<HTMLDivElement>(null);

  // Apply immediately on mount to avoid mismatch
  useEffect(() => {
    // Sync choice from storage/system after mount, then apply with no transition
    const current = getCurrentChoice();
    setChoice(current);
    applyTheme(current, false);
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotation: 0 },
        { rotation: 0, duration: 0.2, ease: "back.out(1.7)" }
      );
    }
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

    // Animate rotation
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: "+=180",
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }

    setChoice(next);
    localStorage.setItem("theme", next);
    applyTheme(next, true);
  };

  const buttonBase =
    "inline-flex items-center gap-1 px-2 py-1 text-neutral-700 dark:text-neutral-200 hover:cursor-pointer transition-all hover:drop-shadow-[0_0_12px_rgba(0,0,0,0.7)] dark:hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] active:drop-shadow-[0_0_12px_rgba(0,0,0,0.7)] dark:active:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]";

  const iconBase =
    "w-4 h-4 transition-[filter,transform] duration-300";
  const iconForChoice =
    choice === "dark"
      ? `${iconBase} text-[#c8d3ff] drop-shadow-[0_0_18px_rgba(200,211,255,0.95)]`
      : choice === "light"
      ? `${iconBase} text-[#e0af68] drop-shadow-[0_0_20px_rgba(255,223,155,0.95)]`
      : `${iconBase} text-neutral-600 dark:text-neutral-300`;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${buttonBase} ${className}`}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <div ref={iconRef} className="flex items-center justify-center origin-center">
        {choice === "system" ? (
          <Laptop className={iconForChoice} />
        ) : choice === "dark" ? (
          <Moon className={iconForChoice} />
        ) : (
          <Sun className={iconForChoice} />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
