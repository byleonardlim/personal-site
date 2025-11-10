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
    ? 'rounded-sm border border-green-200 dark:border-green-900 bg-green-50/60 dark:bg-green-950/40 p-4'
    : 'rounded-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-900/20';
  const titleClasses = featured
    ? 'underline underline-offset-4 text-2xl font-semibold text-gray-900 dark:text-white mb-8 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200'
    : 'underline text-lg text-gray-900 dark:text-white mb-8 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200';
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
                ? 'text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full font-medium'
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

