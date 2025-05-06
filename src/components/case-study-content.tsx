'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import Image from 'next/image';


import { SectionNav } from './section-nav';
import { Tags } from './tag';
import type { Components } from 'react-markdown';

interface CaseStudyContentProps {
  content: string;
  title: string;
  readingTime: string;
  industry: string;
  tags: string[];
}

interface Section {
  title: string;
  content: string;
  id: string;
  subSections?: Section[];
}



const generateSectionId = (title: string): string =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const parseMarkdownSections = (markdown: string): Section[] => {
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  const lines = markdown.split('\n');

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { 
        title: line.replace('## ', ''), 
        content: '',
        id: generateSectionId(line.replace('## ', ''))
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};

const normalizeImagePath = (src: string | undefined): string | undefined => {
  if (!src) return undefined;
  
  // Remove any leading public/ or /public/ prefix
  const normalized = src
    .replace(/^\/public\//, '/')
    .replace(/^public\//, '/')
    .replace(/^\//, '');
  
  // Return the normalized path with leading slash
  return `/${normalized}`;
};

const MarkdownComponents: Components = {
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <div {...props} className="prose-p">
      {children}
    </div>
  ),
  img: ({ src, srcSet }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const imageSrc = typeof src === 'string' ? src : srcSet;
    const normalizedSrc = normalizeImagePath(imageSrc);

    if (!normalizedSrc) {
      return null;
    }

    return (
      <figure className="relative w-full h-full overflow-hidden mb-8 p-2 lg:p-4 bg-gradient-to-t from-transparent to-gray-100 pointer-events-none">
        <Image
          src={normalizedSrc}
          alt="Case study content"
          className="w-full rounded-xs shadow-md"
          width={1200}
          height={630}
          priority={true}
        />
      </figure>
    );
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="text-md mb-3">{children}</h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 {...props} className="text-lg font-bold mb-2">{children}</h4>
  ),
  h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 {...props} className="text-base mb-2">{children}</h5>
  ),
  h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 {...props} className="text-sm mb-2">{children}</h6>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="list-none p-0 mb-8">
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 text-green-600 font-medium">
        {children}
      </div>
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="list-decimal p-0 ml-8 mb-8">
      <div className="flex flex-col space-y-4 text-green-600 font-medium">
        {children}
      </div>
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className='w-full'>
      {children}
    </li>
  ),
  a: ({ href, children }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="p-4 font-medium text-gray-600 text-lg bg-gradient-to-t from-transparent to-gray-100">
      {children}
    </blockquote>
  ),
  code: ({ inline, children, ...props }: { inline?: boolean } & React.HTMLAttributes<HTMLElement>) => {
    if (inline) {
      return (
        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
        <code {...props}>
          {children}
        </code>
      </pre>
    );
  },
} as const;

export function CaseStudyContent({ content, title, readingTime, tags }: CaseStudyContentProps) {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const parsedSections = parseMarkdownSections(content);
    setSections(parsedSections);
  }, [content]);

  return (
    <div className="relative">
      <SectionNav sections={sections} />
      <article className="p-2 lg:p-0 prose text-sm leading-tight">
        <section className="h-dvh pb-16 flex flex-col justify-center max-w-5xl md:max-w-3xl mx-auto">
          <span className="block mb-4 text-xs text-gray-600 uppercase">{readingTime}</span>
          <h1 className="text-2xl lg:text-3xl mb-4">{title}</h1>
          <div className="space-y-2">
            {tags.length > 0 && (
              <Tags tags={tags} />
            )}
          </div>
        </section>
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-16 max-w-5xl md:max-w-3xl mx-auto">
            <h2 className="text-md font-medium mb-4 uppercase text-green-700">{section.title}</h2>
            <div className="space-y-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {section.content}
              </ReactMarkdown>
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}
