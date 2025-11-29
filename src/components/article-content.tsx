'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import { defaultSchema } from 'hast-util-sanitize';
import { Children, isValidElement } from 'react';
import type { ReactNode, ReactElement } from 'react';
import Image from 'next/image';

import { Tags } from './tag';
import type { Components } from 'react-markdown';
import type { Section } from '@/lib/markdown';

interface ArticleContentProps {
  title: string;
  readingTime: string;
  tags: string[];
  sections: Section[];
}

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

// Sanitize schema to allow safe HTML with broader, commonly used tags/attributes
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'figure',
    'figcaption',
    'picture',
    'source',
    'video',
    'audio',
    'track',
    'svg',
    'path',
    'circle',
    'rect',
    'line',
    'polyline',
    'polygon',
    'g',
    'defs',
    'symbol',
    'use',
    'details',
    'summary',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...((defaultSchema.attributes?.['*']) || []),
      'className',
      'id',
      ['data-*'],
      ['aria-*'],
      'role',
      'style',
    ],
    a: [
      ...((defaultSchema.attributes?.['a']) || []),
      'target',
      'rel',
      'aria-label',
    ],
    iframe: [
      ...((defaultSchema.attributes?.['iframe']) || []),
      'src',
      'allow',
      'allowfullscreen',
      'loading',
      'referrerpolicy',
      'sandbox',
      'width',
      'height',
    ],
    img: [
      ...((defaultSchema.attributes?.['img']) || []),
      'src',
      'srcSet',
      'sizes',
      'loading',
      'decoding',
      'alt',
      'width',
      'height',
      'referrerpolicy',
      'fetchpriority',
    ],
    picture: [
      ...((defaultSchema.attributes?.['picture']) || []),
    ],
    source: [
      ...((defaultSchema.attributes?.['source']) || []),
      'src',
      'srcSet',
      'sizes',
      'media',
      'type',
    ],
    video: [
      ...((defaultSchema.attributes?.['video']) || []),
      'src',
      'controls',
      'autoplay',
      'muted',
      'loop',
      'playsinline',
      'poster',
      'width',
      'height',
      'preload',
      'crossorigin',
    ],
    audio: [
      ...((defaultSchema.attributes?.['audio']) || []),
      'src',
      'controls',
      'autoplay',
      'muted',
      'loop',
      'preload',
      'crossorigin',
    ],
    track: [
      ...((defaultSchema.attributes?.['track']) || []),
      'kind',
      'src',
      'srclang',
      'label',
      'default',
    ],
    svg: [
      ...((defaultSchema.attributes?.['svg']) || []),
      'viewBox',
      'xmlns',
      'width',
      'height',
      'fill',
      'stroke',
      'strokeWidth',
      'strokeLinecap',
      'strokeLinejoin',
    ],
    path: [
      ...((defaultSchema.attributes?.['path']) || []),
      'd',
      'fill',
      'stroke',
      'strokeWidth',
      'strokeLinecap',
      'strokeLinejoin',
    ],
    circle: [
      ...((defaultSchema.attributes?.['circle']) || []),
      'cx',
      'cy',
      'r',
      'fill',
      'stroke',
      'strokeWidth',
    ],
    rect: [
      ...((defaultSchema.attributes?.['rect']) || []),
      'x',
      'y',
      'width',
      'height',
      'rx',
      'ry',
      'fill',
      'stroke',
      'strokeWidth',
    ],
    line: [
      ...((defaultSchema.attributes?.['line']) || []),
      'x1',
      'y1',
      'x2',
      'y2',
      'stroke',
      'strokeWidth',
    ],
    polyline: [
      ...((defaultSchema.attributes?.['polyline']) || []),
      'points',
      'fill',
      'stroke',
      'strokeWidth',
    ],
    polygon: [
      ...((defaultSchema.attributes?.['polygon']) || []),
      'points',
      'fill',
      'stroke',
      'strokeWidth',
    ],
    td: [
      ...((defaultSchema.attributes?.['td']) || []),
      'colSpan',
      'rowSpan',
      'align',
    ],
    th: [
      ...((defaultSchema.attributes?.['th']) || []),
      'colSpan',
      'rowSpan',
      'align',
    ],
    details: [
      ...((defaultSchema.attributes?.['details']) || []),
      'open',
    ],
    summary: [
      ...((defaultSchema.attributes?.['summary']) || []),
    ],
  },
} as const;

// Isolated renderers so we can detect them in paragraph unwrapping logic
const ImgRenderer = ({ src, srcSet }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const imageSrc = typeof src === 'string' ? src : srcSet;
    const normalizedSrc = normalizeImagePath(imageSrc);

    if (!normalizedSrc) {
      return null;
    }

    return (
      <figure className="my-12">
        <Image
          src={normalizedSrc}
          alt="Article content"
          className="w-full rounded-lg shadow-lg"
          width={1200}
          height={630}
          sizes="(min-width: 1024px) 80vw, 100vw"
        />
      </figure>
    );
};
const AnchorRenderer = ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    href={href}
    {...props}
    className="text-gray-900 dark:text-gray-100 underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4 hover:decoration-primary dark:hover:decoration-primary transition-colors decoration-2"
  >
    {children}
  </a>
);

const isWhitespaceText = (child: ReactNode) => typeof child === 'string' && child.trim() === '';

const MarkdownComponents: Components = {
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    const kidArray = Children.toArray(children).filter((child: ReactNode) => !isWhitespaceText(child));

    const isImgEl = (el: unknown) => isValidElement(el) && (el.type === 'img' || el.type === ImgRenderer);
    const isAnchorEl = (el: unknown) => isValidElement(el) && (el.type === 'a' || el.type === AnchorRenderer);

    if (kidArray.length === 1) {
      const only = kidArray[0];
      const imageOnly = isImgEl(only);
      let anchorWithOnlyImage = false;
      if (isValidElement(only) && isAnchorEl(only)) {
        const el = only as ReactElement<{ children?: ReactNode | ReactNode[] }>;
        const anchorChildren = el.props?.children;
        anchorWithOnlyImage = Array.isArray(anchorChildren)
          && Children.toArray(anchorChildren).filter((c: ReactNode) => !isWhitespaceText(c)).length === 1
          && isImgEl(Children.toArray(anchorChildren).filter((c: ReactNode) => !isWhitespaceText(c))[0]);
      }
      if (imageOnly || anchorWithOnlyImage) {
        // Unwrap to avoid <p> containing a <figure>
        return <>{children}</>;
      }
    }

    return (
      <p {...props} className="prose-p text-pretty mb-8 text-lg leading-8 text-gray-700 dark:text-gray-300">
        {children}
      </p>
    );
  },
  img: ImgRenderer,
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="text-xl font-medium mt-12 mb-6 text-gray-900 dark:text-gray-100">{children}</h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 {...props} className="text-lg font-medium mt-10 mb-4 text-gray-900 dark:text-gray-100">{children}</h4>
  ),
  h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 {...props} className="text-base font-medium mt-8 mb-3 text-gray-900 dark:text-gray-100">{children}</h5>
  ),
  h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 {...props} className="text-sm font-medium mt-8 mb-3 text-gray-900 dark:text-gray-100">{children}</h6>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 mb-8">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="list-decimal pl-6 space-y-3 mb-8 marker:text-gray-400 dark:marker:text-gray-600">
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement> & { ordered?: boolean; node?: unknown; index?: number; checked?: boolean }) => {
    const kids = Children.toArray(children).filter(child => !isWhitespaceText(child));
    const first = kids[0];

    // Extract known non-DOM props to prevent spreading them to the <li> element
    // 'node' is the AST node passed by react-markdown
    // 'ordered' is a boolean passed for list items
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ordered, node: _node, index: _index, checked: _checked, ...liProps } = props;

    // Check if the first child is a strong/bold tag (indicates a stat/metric)
    // ReactMarkdown might pass 'strong' as a React element type 'strong'
    const isStat = isValidElement(first) && (first.type === 'strong' || first.type === 'b' || (typeof first.type === 'function' && first.type.name === 'strong'));

    if (isStat) {
      const statContent = (first as ReactElement<{ children: ReactNode }>).props.children;
      const description = kids.slice(1);
      
      if (ordered) {
        return (
          <li {...liProps} className="block p-6 mb-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col">
              <span className="text-4xl lg:text-5xl font-bold text-primary dark:text-primary mb-2 block">
                {statContent}
              </span>
              <div className="text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                {description}
              </div>
            </div>
          </li>
        );
      }

      return (
        <li {...liProps} className="block p-6 bg-gray-50 dark:bg-gray-900/30 h-full">
          <div className="flex flex-col h-full justify-between">
            <span className="text-2xl lg:text-4xl font-bold text-primary dark:text-primary mb-2 block uppercase">
              {statContent}
            </span>
            <div className="text-sm capitalize tracking-wider text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              {description}
            </div>
          </div>
        </li>
      );
    }

    if (ordered) {
      return (
        <li {...liProps} className="text-gray-700 dark:text-gray-300 leading-8 pl-2">
          {children}
        </li>
      );
    }

    return (
      <li {...liProps} className="group flex items-start p-6 bg-gray-50 dark:bg-gray-900/30 h-full">
        <span className="mr-4 mt-2.5 w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full shrink-0 group-hover:bg-primary dark:group-hover:bg-primary transition-colors" />
        <div className="flex-1 leading-8 text-gray-700 dark:text-gray-300">{children}</div>
      </li>
    );
  },
  a: AnchorRenderer,
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
    <blockquote className="pl-6 py-2 my-10 border-l-2 border-primary/50 italic text-xl text-gray-800 dark:text-gray-200 leading-relaxed">
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string } & React.HTMLAttributes<HTMLElement>) => {
    if (inline) {
      return (
        <code className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre {...props} className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-6 overflow-x-auto mb-8 text-sm leading-relaxed">
      {children}
    </pre>
  ),
} as const;

export function ArticleContent({ title, readingTime, tags, sections }: ArticleContentProps) {

  return (
    <div className="relative">
      
      <article className="p-2 lg:p-0 prose max-w-none leading-normal">
        <section className="h-[80vh] pb-16 flex flex-col justify-center max-w-3xl mx-auto">
          <span className="block mb-4 text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">{readingTime}</span>
          <h1 className="text-3xl lg:text-4xl mb-6 font-medium leading-tight">{title}</h1>
          <div className="space-y-2">
            {tags.length > 0 && (
              <Tags tags={tags} />
            )}
          </div>
        </section>
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-32 max-w-3xl mx-auto">
            <h2 className="text-sm font-semibold mb-8 uppercase tracking-wider text-gray-500 dark:text-gray-400">{section.title}</h2>
            <div className="space-y-8 text-lg text-gray-800 dark:text-gray-200">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw,
                  [rehypeSanitize, sanitizeSchema],
                  rehypeUnwrapImages,
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'append', properties: { className: ['anchor'] } }],
                  [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
                ]}
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

