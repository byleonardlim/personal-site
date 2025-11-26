'use client';

import { Experience } from '@/types/experience';
import { format } from 'date-fns';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const formatDate = (date: string) => {
    const [year, month] = date.split('-');
    return `${format(new Date(`${year}-${month}-01`), 'MMM yyyy')}`;
  };

  return (
    <div className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 items-baseline">
      <div className="md:col-span-3 text-sm text-gray-400 dark:text-gray-500 font-mono tabular-nums">
        {formatDate(experience.startDate)} — {experience.endDate === 'Present' ? 'Now' : formatDate(experience.endDate)}
      </div>
      
      <div className="md:col-span-9">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:underline decoration-gray-400 underline-offset-4 decoration-1 transition-all">
          {experience.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {experience.company}
        </p>
      </div>
     </div>
  );
}
