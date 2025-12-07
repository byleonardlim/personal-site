import { getArticleBySlug, getArticleList } from '@/lib/articles';
import { parseMarkdownSections } from '@/lib/markdown';
import { ArticleContent } from '@/components/article-content';
import { ArticlesList } from '@/components/articles-list';
import DrawerShell from '@/components/drawer-shell';

export default async function DrawerSlot({ searchParams }: { searchParams: Promise<{ a?: string }> }) {
  const { a } = await searchParams;
  if (!a) return null;

  const article = await getArticleBySlug(a);
  if (!article) return null;

  const sections = parseMarkdownSections(article.content);
  const articles = await getArticleList();

  return (
    <DrawerShell titleId="drawer-title" titleText="Article" closeHref="/">
      <div className="w-full">
        <ArticleContent
          title={article.title}
          readingTime={article.readingTime}
          tags={article.tags}
          sections={sections}
        />
        <ArticlesList
          articles={articles}
          currentSlug={a}
        />
      </div>
    </DrawerShell>
  );
}
