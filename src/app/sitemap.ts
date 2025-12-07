import type { MetadataRoute } from 'next';
import { getArticleList } from '@/lib/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://byleonardlim.com';

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  const articles = await getArticleList();
  const workRoutes: MetadataRoute.Sitemap = articles.map((cs) => ({
    url: `${baseUrl}/article/${cs.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...routes, ...workRoutes];
}
