'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);



const AnimatedHeadline = () => {
  const headlineRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const cursorTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!headlineRef.current) return;

    const headlines = [
      'No fluff. Just realistic impact.',
      'Partnering with you to create impactful experiences.',
      'Zero-to-one product design.',
      'Product experience transformation with AI.'
    ];

    let currentIndex = 0;

    const animateHeadline = () => {
      const nextIndex = (currentIndex + 1) % headlines.length;
      
      // Create a timeline for the headline animation
      timelineRef.current = gsap.timeline({
        onComplete: () => {
          currentIndex = nextIndex;
          // Add a small delay before starting the next animation
          setTimeout(animateHeadline, 5000);
        },
        defaults: {
          ease: 'power2.inOut'
        }
      });

      // Add the headline animation
      timelineRef.current
        .to(headlineRef.current, {
          duration: 1,
          scrambleText: {
            text: headlines[nextIndex],
            chars: '!@#$%&?=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            tweenLength: true
          }
        });

      // Create a separate timeline for continuous cursor blinking
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
    };

    // Initialize with first headline
    headlineRef.current.textContent = headlines[currentIndex];
    animateHeadline();

    const cleanup = () => {
      // Store current refs in variables to avoid stale closures
      const currentHeadlineRef = headlineRef.current;
      const currentCursorRef = cursorRef.current;
      
      // Cleanup timelines
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (cursorTimelineRef.current) {
        cursorTimelineRef.current.kill();
        cursorTimelineRef.current = null;
      }
      
      // Cleanup GSAP animations
      if (currentHeadlineRef) {
        gsap.killTweensOf(currentHeadlineRef);
      }
      if (currentCursorRef) {
        gsap.killTweensOf(currentCursorRef);
      }
    };

    return cleanup;
  }, []);

  return (
    <div className="flex items-start flex-col lg:flex-row lg:items-center gap-2">
      <span className="w-fit" ref={headlineRef} />
      <span ref={cursorRef} className="inline-block w-fit">_</span>
    </div>
  );
};

export default AnimatedHeadline;
