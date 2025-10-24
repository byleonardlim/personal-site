'use client';

import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutContent } from '@/lib/about';

gsap.registerPlugin(ScrollTrigger);



const AnimatedHeadline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const paragraphContainerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);
  const cursorTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const typewriterTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const doMeasure = () => {
      if (!measureRef.current) return;
      const rect = measureRef.current.getBoundingClientRect();
      setMeasuredHeight(rect.height);
    };
    doMeasure();
    window.addEventListener('resize', doMeasure);
    return () => window.removeEventListener('resize', doMeasure);
  }, []);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const targetText = aboutContent.bio;
    const chars = Array.from(targetText);
    const obj = { i: 0 } as { i: number };

    // Initialize empty and setup scrubbed typewriter (char-by-char)
    textRef.current.textContent = '';
    typewriterTweenRef.current = gsap.to(obj, {
      i: chars.length,
      ease: 'none',
      onUpdate: () => {
        if (textRef.current) {
          const n = Math.round(obj.i);
          // Update partial text
          textRef.current.textContent = chars.slice(0, n).join('');
          // If we're effectively at the end, ensure full text
          if (n >= chars.length - 1) {
            textRef.current.textContent = aboutContent.bio;
          }
        }
      },
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: () => `+=${Math.max(1600, Math.min(4000, chars.length * 5.5))}`,
        scrub: 0.25,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onLeave: () => {
          if (textRef.current) textRef.current.textContent = targetText;
        },
        onEnterBack: () => {
          if (textRef.current) {
            const n = Math.round(obj.i);
            textRef.current.textContent = chars.slice(0, n).join('');
          }
        },
      }
    });

    // Continuous cursor blinking
    cursorTimelineRef.current = gsap.timeline({
      repeat: -1,
      defaults: {
        duration: 0.5,
        ease: 'none',
        delay: 0.2
      }
    });

    cursorTimelineRef.current
      .to(cursorRef.current, { opacity: 0 })
      .to(cursorRef.current, { opacity: 1 });

    const cleanup = () => {
      // Store current refs in variables to avoid stale closures
      const currentTextRef = textRef.current;
      const currentCursorRef = cursorRef.current;

      // Cleanup tween and scroll trigger
      if (typewriterTweenRef.current) {
        typewriterTweenRef.current.kill();
        typewriterTweenRef.current = null;
      }
      if (cursorTimelineRef.current) {
        cursorTimelineRef.current.kill();
        cursorTimelineRef.current = null;
      }
      
      // Cleanup GSAP animations
      if (currentTextRef) {
        gsap.killTweensOf(currentTextRef);
      }
      if (currentCursorRef) {
        gsap.killTweensOf(currentCursorRef);
      }
    };

    return cleanup;
  }, []);

  return (
    <div ref={containerRef} className="flex items-start flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="w-fit" ref={headlineRef} />
      </div>
      <div ref={paragraphContainerRef} className="relative" style={{ minHeight: measuredHeight || undefined }}>
        <p className="text-muted-foreground max-w-2xl">
          <span ref={textRef} /><span ref={cursorRef} className="inline-block align-baseline select-none" aria-hidden>_</span>
        </p>
        <p ref={measureRef} aria-hidden className="text-muted-foreground max-w-2xl invisible absolute inset-0 pointer-events-none">
          {aboutContent.bio}
        </p>
      </div>
    </div>
  );
};

export default AnimatedHeadline;

