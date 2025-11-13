"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { X } from "lucide-react";

export default function FloatingBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [elevated, setElevated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      <div className="w-screen flex items-center justify-between px-4 lg:px-10">
        <Link
          href="/"
          className="text-sm tracking-widest text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 hover:cursor-pointer transition-colors"
          aria-label="Home"
        >
          BYLEONARDLIM
        </Link>
        <div
          className={`flex items-center gap-2 rounded-sm border border-neutral-300/80 dark:border-neutral-700/70 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-2 py-1 transition-all duration-300 ease-out ${elevated || drawerOpen ? "shadow-lg" : "shadow-none"}`}
        >
          {drawerOpen && (
            <button
              type="button"
              onClick={closeDrawer}
              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-transparent text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 hover:cursor-pointer transition-colors"
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
