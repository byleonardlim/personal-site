'use client';

import Link from 'next/link';
import { Article } from '@/types/articles';

interface ArticlesListProps {
  articles: Article[];
  currentSlug: string;
}

export function ArticlesList({ articles, currentSlug }: ArticlesListProps) {
  return (
    <div className="mt-16 lg:mb-32 border-t border-neutral-200 dark:border-neutral-700 px-2 py-4 w-full">
      <h2 className="text-md font-medium mb-4 uppercase text-neutral-700 dark:text-neutral-300">Articles</h2>
      <div className="flex flex-col space-y-4">
        {articles.map((study) => (
          <div key={study.slug} className={`py-4 ${study.slug === currentSlug ? 'text-green-600 dark:text-green-400' : 'hover:text-green-600 dark:hover:text-green-400'}`}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <Link
                href={`/article/${study.slug}`}
                className="block text-sm font-medium text-neutral-900 dark:text-neutral-300 hover:text-green-600 dark:hover:text-green-400 underline order-last lg:order-first transition-colors duration-200"
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
