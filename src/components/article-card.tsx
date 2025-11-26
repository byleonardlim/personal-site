'use client';

import Link from 'next/link';
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
  const metaItems = [
    featured ? 'Featured' : null,
    year,
    readingTime,
  ].filter(Boolean) as string[];
  const wrapperBase = 'group block overflow-hidden transition-all duration-300';
  const wrapperClasses = featured
    ? 'rounded-sm border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4'
    : 'rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800/50';
  const titleClasses = featured
    ? 'underline underline-offset-4 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white mb-8 group-hover:opacity-70 transition-opacity duration-200'
    : 'underline text-lg text-gray-900 dark:text-white mb-8 group-hover:opacity-70 transition-opacity duration-200';
  return (
    <Link
      href={`/?a=${slug}`}
      scroll={false}
      className={`${wrapperBase} ${wrapperClasses}`}
    >
      <h3 className={titleClasses}>
        {title}
      </h3>
      <ul className="mb-2 flex flex-wrap gap-x-4 text-xs text-gray-500 dark:text-gray-400 uppercase">
        {metaItems.map((text, idx) => (
          <li
            key={idx}
            className={
              text === 'Featured'
                ? 'text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full font-medium'
                : ''
            }
          >
            {text}
          </li>
        ))}
      </ul>
      <Tags tags={tags} />
    </Link>
  );
}

