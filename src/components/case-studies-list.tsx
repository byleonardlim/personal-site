'use client';

import Link from 'next/link';
import { CaseStudy } from '@/types/case-studies';

interface CaseStudiesListProps {
  caseStudies: CaseStudy[];
  currentSlug: string;
}

export function CaseStudiesList({ caseStudies, currentSlug }: CaseStudiesListProps) {
  return (
    <div className="mt-16 lg:mb-32 border-t border-neutral-200 dark:border-neutral-700 px-2 py-4 max-w-5xl md:max-w-3xl mx-auto">
      <h2 className="text-md font-medium mb-4 uppercase">More Selected Work</h2>
      <div className="flex flex-col space-y-4">
        {caseStudies.map((study) => (
          <div key={study.slug} className={`py-4 ${study.slug === currentSlug ? 'text-green-600' : 'hover:text-green-600'}`}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <Link
                href={`/work/${study.slug}`}
                className="block text-sm font-medium text-neutral-900 dark:text-neutral-300 hover:text-green-600 underline order-last lg:order-first transition-colors duration-200"
              >
                {study.title}
              </Link>
              {study.slug === currentSlug && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 order-first lg:order-last">Currently Reading</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
