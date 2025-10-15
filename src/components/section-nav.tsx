'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Initialize Intersection Observer to track section visibility
  useEffect(() => {
    setIsMounted(true);
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      let anySectionInView = false;
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetId = entry.target.id;
          setActiveSection(targetId);
          anySectionInView = true;
          
          // Update URL hash without scrolling
          if (window.history.pushState) {
            const newUrl = `${window.location.pathname}${window.location.search}#${targetId}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
          }
        }
      });
      
      // Show/hide nav based on section visibility
      if (anySectionInView !== isVisible) {
        setIsVisible(anySectionInView);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    // Initial check
    const checkInitialVisibility = () => {
      const anyInView = sections.some(section => {
        const el = document.getElementById(section.id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
          rect.top <= window.innerHeight * 0.8 &&
          rect.bottom >= window.innerHeight * 0.2
        );
      });
      setIsVisible(anyInView);
    };
    
    // Run after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(checkInitialVisibility, 100);

    return () => {
      if (observerRef.current) {
        sections.forEach(section => {
          const element = document.getElementById(section.id);
          if (element) {
            observerRef.current?.unobserve(element);
          }
        });
        observerRef.current.disconnect();
      }
      clearTimeout(timeoutId);
    };
  }, [sections, isVisible]);

  // Animate and position the sliding highlight behind the active button
  useEffect(() => {
    const updateHighlight = () => {
      const btn = buttonRefs.current[activeSection];
      const container = containerRef.current;
      const highlight = highlightRef.current;
      if (!btn || !container || !highlight) return;

      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const left = btnRect.left - containerRect.left;
      const width = btnRect.width;
      const height = btnRect.height;

      gsap.killTweensOf(highlight);
      gsap.to(highlight, {
        x: left,
        width,
        height,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    updateHighlight();

    // Keep highlight aligned on resize
    window.addEventListener('resize', updateHighlight);
    return () => {
      window.removeEventListener('resize', updateHighlight);
    };
  }, [activeSection, isVisible]);

  // Handle nav show/hide animation
  useEffect(() => {
    if (!navRef.current) return;
    
    const nav = navRef.current;
    
    if (isVisible) {
      gsap.killTweensOf(nav);
      gsap.to(nav, {
        x: '-50%',
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
    }
  }, [isVisible]);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Temporarily pause the observer to prevent race conditions
      const wasVisible = isVisible;
      setIsVisible(true);
      
      window.scrollTo({
        top: element.offsetTop - 20, // Add some offset from the top
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
      onSectionClick?.(sectionId);
      
      // Restore visibility state after scroll
      if (!wasVisible) {
        const timer = setTimeout(() => {
          setIsVisible(wasVisible);
        }, 2000); // Hide after 2 seconds if no other section is in view
        
        return () => clearTimeout(timer);
      }
    }
  };

  if (!sections?.length || !isMounted) {
    return null;
  }

  return (
    <nav
      ref={navRef}
      className={`hidden lg:block fixed left-1/2 bottom-10 z-50 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm p-2 shadow-lg border border-gray-200 dark:border-neutral-700 rounded-xs ${className}`}
      style={{
        opacity: 0,
        transform: 'translateX(-50%) translateY(20px)',
        display: 'none',
        whiteSpace: 'nowrap'
      } as React.CSSProperties}
      aria-label="Navigation"
      role="navigation"
    >
      <div ref={containerRef} className="relative flex space-x-4">
        <div
          ref={highlightRef}
          className="absolute top-0 left-0 rounded-xs bg-green-500 pointer-events-none"
          style={{ opacity: 0, width: 0, height: 0, zIndex: 0 }}
          aria-hidden
        />
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            ref={(el) => {
              buttonRefs.current[section.id] = el;
            }}
            className={`relative z-[1] px-3 py-1 text-sm font-medium uppercase transition-colors duration-200 ${
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
  );
}
