import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export default function Section({ children, className = '' }: SectionProps) {
  return (
    <section
      className={`mb-20 lg:mb-32 ${className}`}
    >
      {children}
    </section>
  );
}
