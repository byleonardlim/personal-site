"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { ArrowLeft, X } from "lucide-react";
import { gsap } from "gsap";

export default function FloatingBar() {
  const router = useRouter();
  const pathname = usePathname();
  const showBack = pathname !== "/";

  const [elevated, setElevated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevDimsRef = useRef<{ w: number; pl: number; pr: number } | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.15;
      setElevated(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Detect if the drawer is mounted by checking for the dialog element
  useEffect(() => {
    const detect = () => {
      const dlg = document.querySelector('[role="dialog"][aria-labelledby="drawer-title"]');
      setDrawerOpen(Boolean(dlg));
    };
    detect();
    const mo = new MutationObserver(detect);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [pathname]);

  // Animate container resize and padding on desktop when drawer state changes
  useLayoutEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;
    const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches; // lg breakpoint
    const cs = getComputedStyle(el);
    const next = {
      w: el.getBoundingClientRect().width,
      pl: parseFloat(cs.paddingLeft) || 0,
      pr: parseFloat(cs.paddingRight) || 0,
    };
    const prev = prevDimsRef.current;
    if (prev && isDesktop && (prev.w !== next.w || prev.pl !== next.pl || prev.pr !== next.pr)) {
      gsap.set(el, { width: prev.w, paddingLeft: prev.pl, paddingRight: prev.pr });
      gsap.to(el, {
        width: next.w,
        paddingLeft: next.pl,
        paddingRight: next.pr,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(el, { clearProps: "width,paddingLeft,paddingRight" });
        },
      });
    }
    prevDimsRef.current = next;
  }, [drawerOpen, mounted]);

  const closeDrawer = () => {
    const dlg = document.querySelector('[role="dialog"][aria-labelledby="drawer-title"]');
    if (dlg) {
      // Let DrawerShell handle GSAP close and navigation
      window.dispatchEvent(new Event("drawer:close"));
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/", { scroll: false });
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 left-0 right-0 z-[70]" data-drawer-exempt>
      <div
        ref={containerRef}
        className={`mx-auto flex items-center justify-between px-4 ${drawerOpen ? "lg:max-w-[90vw] lg:px-0" : "lg:max-w-6xl"}`}
      >
        <Link
          href="/"
          className="px-2 py-1 text-sm tracking-widest text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          aria-label="Home"
        >
          BYLEONARDLIM
        </Link>
        <div
          className={`flex items-center gap-2 rounded-sm border border-neutral-300/80 dark:border-neutral-700/70 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-2 py-1 transition-all duration-300 ease-out ${elevated || drawerOpen ? "shadow-lg" : "shadow-none"}`}
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
          {drawerOpen && (
            <button
              type="button"
              onClick={closeDrawer}
              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-transparent text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 transition-colors"
              aria-label="Close"
              title="Close"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>,
    document.body
  );
}
