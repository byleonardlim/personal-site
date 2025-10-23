import path from 'path';
import matter from 'gray-matter';
import { promises as fsPromises } from 'fs';
import { Article } from '@/types/articles';
import { cache } from 'react';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export const getArticleContent = cache(async (): Promise<Article[]> => {
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
          content: markdownContent,
          readingTime: `${readingTime} min read`,
          ...data,
        } as Article;
      })
  );

  return articles;
});

export async function getArticleBySlug(slug: string) {
  const articles = await getArticleContent();
  return articles.find(article => article.slug === slug);
}
