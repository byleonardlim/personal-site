'use client';

import { useRouter } from 'next/navigation';
import { Tags } from './tag';

interface CaseStudyCardProps {
  slug: string;
  title: string;
  year: string;
  industry: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
}

export default function CaseStudyCard({
  slug,
  title,
  year,
  industry,
  readingTime,
  tags,
  featured,
}: CaseStudyCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/work/${slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden transition-all duration-300"
    >
      <h3 className="underline text-md text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
        {title}
      </h3>
      <div className="mb-2 flex flex-wrap space-x-4 lg:flex-row text-xs text-gray-500 uppercase">
        {featured && (
          <span className='text-green-600 block lg:inline'>Featured</span>
        )}
        <span className='block lg:inline'>{industry}</span>
        <span className='block lg:inline'>{year}</span>
        <span className='block lg:inline'>{readingTime}</span>
      </div>
      <Tags tags={tags} />
    </div>
  );
}
