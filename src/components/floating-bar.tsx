"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";

export default function FloatingBar() {
  const router = useRouter();
  const pathname = usePathname();
  const showBack = pathname !== "/";

  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.15;
      setElevated(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-end px-4">
        <div
          className={`flex items-center gap-2 rounded-sm border border-neutral-300/80 dark:border-neutral-700/70 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-2 py-1 transition-all duration-300 ease-out ${elevated ? "shadow-lg" : "shadow-none"}`}
        >
          {showBack && (
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-transparent text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 transition-colors"
              aria-label="Back to home"
              title="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="sr-only">Back to home</span>
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
