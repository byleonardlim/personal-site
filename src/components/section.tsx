import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  sidebarClassName?: string;
}

export default function Section({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  contentClassName = '',
  sidebarClassName = ''
}: SectionProps) {
  return (
    <section className={`mb-20 lg:mb-32 w-full flex lg:flex-row flex-col lg:items-stretch py-12 lg:py-0 ${className}`}>
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-start w-full text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-12">
        <span>{title}</span>
        <div className="text-right">
          {subtitle}
        </div>
      </div>

      {/* Desktop Left Handle */}
      <div className={`hidden lg:flex flex-col justify-between py-4 pr-8 border-r border-gray-200 dark:border-gray-800 select-none ${sidebarClassName}`}>
        <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
          {title}
        </span>
        {subtitle && (
           <div className="[writing-mode:vertical-rl] rotate-180 flex gap-6 text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
             {subtitle}
           </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col lg:pl-12 ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
}
