"use client";

import React, { useEffect, useRef, useCallback, useLayoutEffect } from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function LoopingScroll({ className, children }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentHeightRef = useRef<number>(0);
  const tickingRef = useRef<boolean>(false);
  const initializedRef = useRef<boolean>(false);

  const measure = useCallback(() => {
    if (!contentRef.current) return;
    contentHeightRef.current = contentRef.current.offsetHeight;
  }, []);

  useEffect(() => {
    measure();
    const onResize = () => {
      const prevChunk = contentHeightRef.current;
      measure();
      const el = containerRef.current;
      const chunk = contentHeightRef.current;
      if (!el || !chunk) return;
      // Keep the scroll position centered around the middle copy after resize
      const top = el.scrollTop;
      if (prevChunk && prevChunk !== chunk) {
        const offsetInChunk = top % prevChunk;
        el.scrollTop = chunk + Math.max(1, Math.min(chunk - 1, offsetInChunk));
      } else if (!initializedRef.current) {
        // If not initialized yet, set to middle
        el.scrollTop = chunk + 1;
        initializedRef.current = true;
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  useLayoutEffect(() => {
    // Initialize at the middle copy to avoid immediate wrap when scrolling up
    const el = containerRef.current;
    const chunk = contentHeightRef.current;
    if (!el || !chunk) return;
    if (!initializedRef.current) {
      el.scrollTop = chunk + 1;
      initializedRef.current = true;
    }
  }, []);

  const onScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    requestAnimationFrame(() => {
      const el = containerRef.current;
      const chunk = contentHeightRef.current;
      if (!el || !chunk) {
        tickingRef.current = false;
        return;
      }

      const top = el.scrollTop;
      // With 3 copies (height = 3 * chunk), keep user within the middle band [1, 2*chunk-1]
      if (top >= 2 * chunk - 1) {
        el.scrollTop = top - chunk;
      } else if (top <= 1) {
        el.scrollTop = top + chunk;
      }
      tickingRef.current = false;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className={
        "h-dvh overflow-y-auto overscroll-y-none touch-pan-y " + (className || "")
      }
    >
      <div ref={contentRef}>{children}</div>
      <div aria-hidden>{children}</div>
      <div aria-hidden>{children}</div>
    </div>
  );
}
