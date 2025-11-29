'use client';

import { FC } from 'react';

interface TagProps {
  tag: string;
}

export const Tag: FC<TagProps> = ({ tag }) => {
  const baseClasses = 'px-2 py-1 text-xs rounded-md backdrop-blur-sm';
  const colorClasses = 'border border-gray-200/70 dark:border-gray-700/70 bg-white/40 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-300';

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      {tag}
    </span>
  );
};

interface TagsProps {
  tags: string[];
}

export const Tags: FC<TagsProps> = ({ tags }) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags
        .sort((a, b) => a.localeCompare(b))
        .map((tag, index) => (
          <Tag key={index} tag={tag} />
        ))}
    </div>
  );
};
