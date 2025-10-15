import path from 'path';
import matter from 'gray-matter';
import { promises as fsPromises } from 'fs';
import { CaseStudy } from '@/types/case-studies';
import { cache } from 'react';

const CASE_STUDIES_DIR = path.join(process.cwd(), 'content', 'case-studies');

export const getCaseStudyContent = cache(async (): Promise<CaseStudy[]> => {
  const files = await fsPromises.readdir(CASE_STUDIES_DIR);
  const caseStudies = await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async (file) => {
        const filePath = path.join(CASE_STUDIES_DIR, file);
        const content = await fsPromises.readFile(filePath, 'utf-8');
        const { data, content: markdownContent } = matter(content);

        const words = markdownContent.split(' ').length;
        const readingTime = Math.ceil(words / 200);

        return {
          slug: file.replace(/\.md$/, ''),
          content: markdownContent,
          readingTime: `${readingTime} min read`,
          ...data,
        } as CaseStudy;
      })
  );

  return caseStudies;
});

export async function getCaseStudyBySlug(slug: string) {
  const caseStudies = await getCaseStudyContent();
  return caseStudies.find(study => study.slug === slug);
}
