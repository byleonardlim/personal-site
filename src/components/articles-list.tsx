'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/types/articles';

interface ArticlesListProps {
  articles: Article[];
  currentSlug: string;
}

export function ArticlesList({ articles, currentSlug }: ArticlesListProps) {
  useEffect(() => {
    // Scroll the drawer panel to top whenever the current article changes
    setTimeout(() => {
      const drawerPanel = document.querySelector('[role="dialog"] > div:last-child');
      if (drawerPanel) {
        drawerPanel.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }, [currentSlug]);

  return (
    <div className="mt-16 lg:mb-32 border-t border-neutral-200 dark:border-neutral-800 pt-16 w-full max-w-3xl mx-auto">
      <h2 className="text-sm font-semibold mb-8 uppercase tracking-wider text-gray-500 dark:text-gray-400">Articles</h2>
      <div className="flex flex-col space-y-4">
        {articles.map((study) => (
          <div key={study.slug} className={`py-2`}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <Link
                href={`/?a=${study.slug}`}
                scroll={false}
                className={`block text-sm font-medium transition-colors duration-200 ${
                  study.slug === currentSlug
                    ? 'text-black dark:text-white font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {study.title}
              </Link>
              {study.slug === currentSlug && (
                <span className="text-xs text-gray-400 uppercase tracking-wider order-first lg:order-last">Currently Reading</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
