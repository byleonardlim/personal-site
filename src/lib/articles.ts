import path from 'path';
import matter from 'gray-matter';
import { promises as fsPromises } from 'fs';
import { Article, ArticleMeta } from '@/types/articles';
import { cache } from 'react';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export const getArticleList = cache(async (): Promise<ArticleMeta[]> => {
  const files = await fsPromises.readdir(ARTICLES_DIR);
  const articles = await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async (file) => {
        const filePath = path.join(ARTICLES_DIR, file);
        const content = await fsPromises.readFile(filePath, 'utf-8');
        const { data, content: markdownContent } = matter(content);

        const words = markdownContent.split(' ').length;
        const readingTime = Math.ceil(words / 200);

        return {
          slug: file.replace(/\.md$/, ''),
          readingTime: `${readingTime} min read`,
          ...data,
        } as ArticleMeta;
      })
  );

  return articles;
});

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  try {
    const content = await fsPromises.readFile(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);

    const words = markdownContent.split(' ').length;
    const readingTime = Math.ceil(words / 200);

    return {
      slug,
      content: markdownContent,
      readingTime: `${readingTime} min read`,
      ...data,
    } as Article;
  } catch {
    return undefined;
  }
}
