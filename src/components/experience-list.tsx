"use client";

import React, { useEffect, useRef } from "react";
import { Experience } from "@/types/experience";
import { ExperienceCard } from "@/components/experience-card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceListProps {
  experiences: Experience[];
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Set all to dimmed initially
      gsap.set(itemRefs.current, { opacity: 0.3 });

      itemRefs.current.forEach((el) => {
        if (!el) return;
        // One timeline that maps the element's journey through the viewport
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          el,
          { opacity: 0.3 },
          { opacity: 1, duration: 0.5, immediateRender: false }
        ).to(el, { opacity: 0.3, duration: 0.5 });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {experiences.map((experience, index) => (
        <div
          key={`${experience.title}-${index}`}
          ref={(el) => {
            if (el) itemRefs.current[index] = el;
          }}
          className="transition-opacity duration-300 will-change-[opacity]"
        >
          <ExperienceCard experience={experience} />
        </div>
      ))}
    </div>
  );
}
