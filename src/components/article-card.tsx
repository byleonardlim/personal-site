'use client';

import Link from 'next/link';
import { Tags } from './tag';

interface ArticleCardProps {
  slug: string;
  title: string;
  year: string;
  industry: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
}

export default function ArticleCard({
  slug,
  title,
  year,
  industry,
  readingTime,
  tags,
  featured,
}: ArticleCardProps) {
  const metaItems = [
    featured ? 'Featured' : null,
    industry,
    year,
    readingTime,
  ].filter(Boolean) as string[];
  return (
    <Link
      href={`/?a=${slug}`}
      scroll={false}
      className="group block overflow-hidden transition-all duration-300"
    >
      <h3 className="underline text-lg text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
        {title}
      </h3>
      <ul className="mb-2 flex flex-wrap gap-x-4 text-xs text-gray-500 dark:text-gray-400 uppercase">
        {metaItems.map((text, idx) => (
          <li
            key={idx}
            className={text === 'Featured' ? 'text-green-600 dark:text-green-400' : ''}
          >
            {text}
          </li>
        ))}
      </ul>
      <Tags tags={tags} />
    </Link>
  );
}
