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
  return (
    <Link
      href={`/article/${slug}`}
      className="group block overflow-hidden transition-all duration-300"
    >
      <h3 className="underline text-md text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
        {title}
      </h3>
      <div className="mb-2 flex flex-wrap space-x-4 lg:flex-row text-xs text-gray-500 dark:text-gray-400 uppercase">
        {featured && (
          <span className='text-green-600 dark:text-green-400 block lg:inline'>Featured</span>
        )}
        <span className='block lg:inline'>{industry}</span>
        <span className='block lg:inline'>{year}</span>
        <span className='block lg:inline'>{readingTime}</span>
      </div>
      <Tags tags={tags} />
    </Link>
  );
}
