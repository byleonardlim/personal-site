'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Tags } from './tag';

interface ArticleCardProps {
  slug: string;
  title: string;
  year: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
}

export default function ArticleCard({
  slug,
  title,
  year,
  readingTime,
  tags,
  featured,
}: ArticleCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!featured || !cardRef.current || !gradientRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(gradientRef.current, {
        // Make the gradient movement more obvious and tightly linked to scroll
        backgroundPosition: '200% 50%',
        ease: 'none',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 0.15,
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [featured]);

  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!featured || !cardRef.current || !gradientRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    const rotateX = -y * 8;
    const rotateY = x * 8;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      transformOrigin: 'center center',
      duration: 0.25,
      ease: 'power2.out',
    });

    gsap.to(gradientRef.current, {
      backgroundPosition: `${200 + x * 60}% ${50 + y * 30}%`,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handlePointerLeave = () => {
    if (!featured || !cardRef.current || !gradientRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.35,
      ease: 'power3.out',
    });

    gsap.to(gradientRef.current, {
      backgroundPosition: '200% 50%',
      duration: 0.35,
      ease: 'power3.out',
    });
  };

  const metaItems = [
    year,
    readingTime,
  ];
  
  const wrapperBase = 'group block overflow-hidden transition-all duration-300 relative';
  const wrapperClasses = featured
    ? 'rounded-sm border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4'
    : 'rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800/50';
  const titleClasses = featured
    ? 'underline underline-offset-4 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white mb-8 group-hover:opacity-70 transition-opacity duration-200'
    : 'underline text-lg text-gray-900 dark:text-white mb-8 group-hover:opacity-70 transition-opacity duration-200';
  return (
    <Link
      ref={cardRef}
      href={`/?a=${slug}`}
      scroll={false}
      className={`${wrapperBase} ${wrapperClasses}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {featured && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-sm">
          <div
            ref={gradientRef}
            className="absolute inset-0 opacity-25 dark:opacity-30"
            style={{
              backgroundImage: 'linear-gradient(120deg, #7aa2f7 0%, #9ece6a 50%, #7aa2f7 100%)',
              backgroundSize: '400% 400%',
              backgroundPosition: '0% 50%',
            }}
          />
          <div 
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }} 
          />
        </div>
      )}
      <div className="relative z-10">
        {featured && (
          <div className="mb-3 inline-flex text-[10px] tracking-[0.18em] uppercase text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-sm font-medium bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
            Featured
          </div>
        )}
        <h3 className={titleClasses}>
          {title}
        </h3>
        <ul className="mb-2 flex flex-wrap gap-x-4 text-xs text-gray-500 dark:text-gray-400 uppercase">
          {metaItems.map((text, idx) => (
            <li
              key={idx}
            >
              {text}
            </li>
          ))}
        </ul>
        <Tags tags={tags} />
      </div>
    </Link>
  );
}

