'use client';

import React from 'react';

interface ProductCardProps {
  slug: string;
  title: string;
  year: string;
  category: string;
  status: 'Shipped' | 'Building' | 'Paused';
  url?: string;
  description?: string;
}

export default function ProductCard({ slug, title, year, category, status, url, description }: ProductCardProps) {
  const metaItems = [category, status, year].filter(Boolean) as string[];
  const isBuilding = status === 'Building';

  return (
    <div className="group block overflow-hidden transition-all duration-300" data-slug={slug}>
      <h3 className="text-lg text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
        {title}
      </h3>
      <ul className="mb-2 flex flex-wrap gap-x-4 text-xs text-gray-500 dark:text-gray-400 uppercase">
        {metaItems.map((text, idx) => (
          <li key={idx}>{text}</li>
        ))}
      </ul>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}
      <div>
        {isBuilding ? (
          <span
            aria-disabled="true"
            className="text-gray-400 dark:text-gray-500 cursor-not-allowed"
          >
            Product Link
          </span>
        ) : (
          <a
            href={url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
          >
            Product Link
          </a>
        )}
      </div>
    </div>
  );
}
