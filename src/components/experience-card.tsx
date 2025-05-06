'use client';

import { Experience } from '@/types/experience';
import { format } from 'date-fns';
import { Tags } from './tag';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const formatDate = (date: string) => {
    const [year, month] = date.split('-');
    return `${format(new Date(`${year}-${month}-01`), 'MMM yyyy')}`;
  };

  return (
    <div className="overflow-hidden">
      <div className="flex lg:flex-row flex-col justify-between items-start mb-1">
        <div>
          <h3 className="text-green-600 mb-1">
            {experience.title}
          </h3>
          <p className="text-gray-400">
            {experience.company}
          </p>
        </div>
        <div className="py-1 lg:py-0 text-right">
          <p className="text-gray-500">
            {formatDate(experience.startDate)} - {experience.endDate === 'Present' ? 'Present' : formatDate(experience.endDate)}
          </p>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
      </p>

      {experience.tags.length > 0 && (
        <Tags tags={experience.tags} />
      )}
     </div>
  );
}
