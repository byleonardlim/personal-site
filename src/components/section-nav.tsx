'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

interface SectionNavProps {
  sections: Array<{
    title: string;
    id: string;
  }>;
  className?: string;
}

export function SectionNav({ sections, className = '' }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  const handleScroll = useCallback(() => {
    const currentSection = sections.find((section) => {
      const element = document.getElementById(section.id);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      

      // Check if section is in viewport
      const isInViewport = rect.top >= 0 && rect.bottom <= viewportHeight;
      // Check if section is near the top of viewport
      const isNearTop = rect.top >= 0 && rect.top <= viewportHeight * 0.3;
      // Check if section is near the bottom of viewport
      const isNearBottom = rect.bottom <= viewportHeight && rect.bottom >= viewportHeight * 0.7;
      
      return isInViewport || isNearTop || isNearBottom;
    });

    if (currentSection?.id) {
      setActiveSection(currentSection.id);
    }
  }, [sections]);

  useEffect(() => {
    setIsMounted(true);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial scroll check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleSectionClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: {
          y: element,
          offsetY: 320, // Adjust this value based on your header height
        },
        ease: 'power2.inOut'
      });
    }
  }, []);

  // Slide animation for active section
  useEffect(() => {
    const activeButton = document.querySelector('.active-section');
    if (activeButton) {
      const slideIn = () => {
        gsap.from(activeButton, {
          duration: 0.3,
          opacity: 0,
          x: -20,
          ease: 'power2.out'
        });
      };

      // Remove previous active class
      const previousActive = document.querySelector('.active-section');
      if (previousActive) {
        previousActive.classList.remove('active-section');
      }

      // Add new active class and trigger animation
      activeButton.classList.add('active-section');
      slideIn();
    }
  }, [activeSection]);

  if (!sections || sections.length === 0) {
    return null;
  }

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <nav
      className={`hidden lg:block fixed w-fit left-1/2 transform -translate-x-1/2 bottom-10 z-50 bg-white/90 backdrop-blur-sm p-2 shadow-lg border border-gray-200 rounded-xs ${className}`}
      aria-label="Navigation"
      role="navigation"
    >
      <div className="flex space-x-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className={`px-3 py-1 text-sm font-medium uppercase transition-colors duration-200 text-neutral-600 ${
              activeSection === section.id
                ? 'bg-green-500 text-white'
                : 'hover:text-green-600'
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
