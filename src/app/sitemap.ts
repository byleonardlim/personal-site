import type { MetadataRoute } from 'next';
import { getCaseStudyContent } from '@/lib/case-studies';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://byleonardlim.com';

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  const caseStudies = await getCaseStudyContent();
  const workRoutes: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${baseUrl}/work/${cs.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...routes, ...workRoutes];
}
