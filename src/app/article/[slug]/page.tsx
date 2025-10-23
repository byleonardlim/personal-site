import { notFound } from 'next/navigation';
import { getArticleContent } from '@/lib/articles';
import { ArticleContent } from '@/components/article-content';
import { ArticlesList } from '@/components/articles-list';
import { parseMarkdownSections } from '@/lib/markdown';

export async function generateStaticParams() {
  const articles = await getArticleContent();
  return articles.map(article => ({
    slug: article.slug as string,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getArticleContent();
  const article = articles.find(article => article.slug === slug);
  if (!article) return {};

  const title = article.title;
  const description = article.description || `Article: ${article.title}`;
  const url = `https://byleonardlim.com/article/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  } as const;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getArticleContent();
  const article = articles.find(article => article.slug === slug);

  if (!article) {
    notFound();
  }

  const sections = parseMarkdownSections(article.content);

  return (
    <div className="max-w-5xl mx-auto min-h-screen px-2">    
      <ArticleContent
        title={article.title}
        readingTime={article.readingTime}
        industry={article.industry}
        tags={article.tags}
        sections={sections}
      />
      <ArticlesList
        articles={articles}
        currentSlug={slug}
      />
    </div>
  );
}