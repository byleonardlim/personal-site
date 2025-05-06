import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export default function Section({ children, className = '' }: SectionProps) {
  return (
    <section
      className={`h-9/10 mb-8 lg:mb-16 p-2 ${className}`}
    >
      <div className='w-full'>
        {children}
      </div>
    </section>
  );
}
