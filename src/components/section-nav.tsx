'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Section {
  id: string;
  title: string;
}

interface SectionNavProps {
  sections: Section[];
  className?: string;
  onSectionClick?: (id: string) => void;
}

export default function SectionNav({
  sections,
  className = '',
  onSectionClick,
}: SectionNavProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Use ScrollTrigger to track ACTIVE section at viewport middle; visibility handled separately
  useEffect(() => {
    setIsMounted(true);
    
    gsap.registerPlugin(ScrollTrigger);
    const sectionTriggers: ScrollTrigger[] = [];
    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;
      const stSec = ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setActiveSection(section.id);
          if (window.history.replaceState) {
            const newUrl = `${window.location.pathname}${window.location.search}#${section.id}`;
            window.history.replaceState({ path: newUrl }, '', newUrl);
          }
        },
        onEnterBack: () => {
          setActiveSection(section.id);
          if (window.history.replaceState) {
            const newUrl = `${window.location.pathname}${window.location.search}#${section.id}`;
            window.history.replaceState({ path: newUrl }, '', newUrl);
          }
        },
      });
      sectionTriggers.push(stSec);
    });

    // Visibility control via ScrollTrigger: hide when header visible, or near end
    const updateVisibility = (self?: ScrollTrigger) => {
      const headerEl = document.querySelector('[data-site-header], header, [role="banner"]') as HTMLElement | null;
      let hideForHeader = false;
      if (headerEl) {
        const style = window.getComputedStyle(headerEl);
        const isFixedOrSticky = style.position === 'fixed' || style.position === 'sticky';
        if (isFixedOrSticky) {
          // For fixed/sticky headers, hide while near the top area covered by the header
          const headerHeight = headerEl.offsetHeight || 64;
          hideForHeader = window.scrollY <= headerHeight;
        } else {
          // For normal flow headers, hide while header is intersecting viewport
          const hRect = headerEl.getBoundingClientRect();
          hideForHeader = hRect.bottom > 0;
        }
      } else {
        // Fallback: before first section threshold, treat like header in view
        const first = sections[0];
        const firstEl = first ? document.getElementById(first.id) : null;
        const rect = firstEl?.getBoundingClientRect();
        hideForHeader = rect ? rect.top > window.innerHeight * 0.8 : true;
      }

      let nearEnd = false;
      if (self) {
        nearEnd = self.progress >= 0.99; // slightly earlier to reduce premature hides on short pages
      } else {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollHeight = Math.max(docEl.scrollHeight, body.scrollHeight);
        const scrolledBottom = Math.ceil(window.scrollY + window.innerHeight);
        nearEnd = scrolledBottom >= scrollHeight - 50;
      }

      const shouldShow = !hideForHeader && !nearEnd;
      // Always set; React will no-op if unchanged. Avoids stale closure issues.
      setIsVisible(shouldShow);
    };

    // Use GSAP ScrollTrigger to drive visibility updates
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => updateVisibility(self),
      onRefresh: (self) => updateVisibility(self),
      invalidateOnRefresh: true,
    });
    // Initial run after DOM settles + ensure ScrollTrigger has correct measurements
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
      updateVisibility();
    }, 0);

    return () => {
      sectionTriggers.forEach((t) => t.kill());
      st.kill();
      clearTimeout(timeoutId);
    };
  }, [sections]);

  // Animate and position the sliding highlight behind the active button
  useEffect(() => {
    const updateHighlight = (instant = false) => {
      const btn = buttonRefs.current[activeSection];
      const container = containerRef.current;
      const highlight = highlightRef.current;
      if (!btn || !container || !highlight) return;

      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const left = btnRect.left - containerRect.left;
      const width = btnRect.width;
      const height = btnRect.height;

      // Ensure the active button is centered in view within the scroll container (mobile overflow)
      const needsScroll = container.scrollWidth > container.clientWidth;
      if (needsScroll) {
        const targetScrollLeft = left - (container.clientWidth - width) / 2 + container.scrollLeft;
        const clamped = Math.max(0, Math.min(targetScrollLeft, container.scrollWidth - container.clientWidth));
        if (Math.abs(clamped - container.scrollLeft) > 4) {
          container.scrollTo({ left: clamped, behavior: 'smooth' });
        }
      }

      gsap.killTweensOf(highlight);
      // Clear any previous translateX applied by older runs
      gsap.set(highlight, { x: 0 });
      if (!isVisible || instant) {
        gsap.set(highlight, { left, width, height, opacity: isVisible ? 1 : 0 });
      } else {
        gsap.to(highlight, {
          left,
          width,
          height,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    // Pre-position while hidden (opacity 0); animate when visible
    updateHighlight();

    // Keep highlight aligned on resize
    const onResize = () => updateHighlight(true);
    window.addEventListener('resize', onResize);

    // Observe container for layout changes (fonts/images causing reflow)
    const ro = containerRef.current
      ? new ResizeObserver(() => {
          updateHighlight(true);
        })
      : null;
    if (ro && containerRef.current) {
      ro.observe(containerRef.current);
    }

    // Update on window load to account for late-loading assets
    const onLoad = () => {
      ScrollTrigger.refresh();
      updateHighlight(true);
    };
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onLoad);
      if (ro) ro.disconnect();
    };
  }, [activeSection, isVisible]);

  // Handle nav show/hide animation
  useEffect(() => {
    if (!navRef.current) return;
    
    const nav = navRef.current;
    
    if (isVisible) {
      gsap.killTweensOf(nav);
      gsap.to(nav, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        display: 'block',
        onStart: () => {
          nav.style.display = 'block';
        }
      });
    } else {
      gsap.killTweensOf(nav);
      gsap.to(nav, {
        y: 20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          nav.style.display = 'none';
        }
      });
      // Ensure highlight tweens are cancelled and reset on hide
      if (highlightRef.current) {
        gsap.killTweensOf(highlightRef.current);
        gsap.set(highlightRef.current, { opacity: 0 });
      }
    }
  }, [isVisible]);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerEl = document.querySelector('[data-site-header], header, [role="banner"]') as HTMLElement | null;
      const style = headerEl ? window.getComputedStyle(headerEl) : null;
      const isFixedOrSticky = style ? (style.position === 'fixed' || style.position === 'sticky') : false;
      const headerOffset = isFixedOrSticky && headerEl ? headerEl.offsetHeight : 0;
      const targetY = element.getBoundingClientRect().top + window.scrollY - headerOffset - 12;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
      onSectionClick?.(sectionId);
    }
  };

  if (!sections?.length || !isMounted) {
    return null;
  }

  const navNode = (
    <div
      className="fixed inset-x-0 z-50 flex justify-center pointer-events-none"
      style={{ bottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <nav
        ref={navRef}
        className={`block translate-y-5 transform bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm p-1.5 sm:p-2 shadow-lg border border-gray-200 dark:border-neutral-700 rounded-xs pointer-events-auto ${className}`}
        style={{
          opacity: 0,
          display: 'none',
          whiteSpace: 'nowrap'
        } as React.CSSProperties}
        aria-label="Navigation"
        role="navigation"
      >
        <div
          ref={containerRef}
          className="relative flex flex-nowrap space-x-2 sm:space-x-4 overflow-x-auto max-w-full"
        >
          <div
            ref={highlightRef}
            className="absolute top-0 left-0 rounded-xs bg-green-500 pointer-events-none"
            style={{ opacity: 0, width: 0, height: 0, zIndex: 0 }}
            aria-hidden={true}
          />
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              ref={(el) => {
                buttonRefs.current[section.id] = el;
              }}
              className={`relative z-[1] px-3 py-2 text-xs sm:text-sm font-medium uppercase transition-colors duration-200 min-h-[48px] ${
                activeSection === section.id
                  ? 'text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400'
              }`}
              aria-current={activeSection === section.id ? 'page' : undefined}
              aria-label={`Jump to section: ${section.title}`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );

  return createPortal(navNode, document.body);
}
