import type { Metadata } from 'next';
import { Mail, MapPin, ExternalLink } from 'lucide-react';
import { getArticleContent } from '@/lib/articles';
import ArticleCard from '@/components/article-card';
import type { Article } from '@/types/articles';
import { experienceData } from '@/lib/experience';
import { ExperienceCard } from '@/components/experience-card';
import Section from '@/components/section';
import { aboutContent } from '@/lib/about';
import FloatingBar from '@/components/floating-bar';
import { productsData } from '@/lib/products';
import ProductCard from '@/components/product-card';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ a?: string }> }): Promise<Metadata> {
  const { a } = await searchParams;
  if (!a) return {};
  const articles: Article[] = await getArticleContent();
  const article = articles.find(x => x.slug === a);
  if (!article) return {};
  const url = `https://byleonardlim.com/article/${article.slug}`;
  return {
    alternates: { canonical: url },
    robots: { index: false, follow: true },
  } as const;
}

export default async function Home() {
  const articles: Article[] = await getArticleContent();
  // Sort articles with featured ones first
  articles.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  

  return (
    <div className="w-screen px-2 text-sm">
      {/* About Section */}
      <Section className="w-full pb-16 min-h-[80vh] flex items-center justify-center">
        <div className="max-w-[73ch] mb-4 text-md lg:text-lg">
          <p className="text-muted-foreground max-w-full">{aboutContent.bio}</p>
        </div>
      </Section>
      <div className="w-full lg:grid lg:grid-cols-2 lg:gap-12">
      {/* Articles Section */}
      <Section className="w-full">
        <h2 className="w-fit text-md lg:text-lg font-medium mb-4 uppercase text-neutral-600 dark:text-neutral-300">
          Articles
        </h2>
        <div className="space-y-8">
          {articles.map((study: Article) => (
            <ArticleCard
              key={study.slug}
              {...study}
            />
          ))}
        </div>
      </Section>

      {/* Products Section */}
      <Section className="w-full">
        <h2 className="w-fit text-md lg:text-lg font-medium mb-4 uppercase text-neutral-600 dark:text-neutral-300">
          Products
        </h2>
        <div className="space-y-8">
          {productsData.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      </Section>
      </div>

      {/* Experience Section */}
      <Section className="w-full">
        <h2 className="w-fit text-md lg:text-lg font-medium mb-4 uppercase text-neutral-600 dark:text-neutral-300">
          Experiences
        </h2>
        <div className="space-y-8">
          {experienceData
            .sort((a, b) => {
              // Place 'Present' at the top
              if (a.endDate === 'Present' && b.endDate === 'Present') {
                const startA = new Date(a.startDate);
                const startB = new Date(b.startDate);
                return startB.getTime() - startA.getTime();
              }
              if (a.endDate === 'Present') return -1;
              if (b.endDate === 'Present') return 1;
              
              // Convert dates to YYYY-MM format for comparison
              const dateA = new Date(a.endDate);
              const dateB = new Date(b.endDate);
              return dateB.getTime() - dateA.getTime();
            })
            .map((experience, index) => (
              <div key={index} className="transition-opacity duration-300">
                <ExperienceCard experience={experience} />
              </div>
            ))}
        </div>
      </Section>

      {/* Connect Section */}
      <Section className="w-full">
        <h2 className="w-fit text-md lg:text-lg font-medium mb-4 uppercase text-neutral-600 dark:text-neutral-300"> 
          Connect
        </h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            <a href={`mailto:${aboutContent.email}`} className="underline text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
              { aboutContent.email }
            </a>
          </div>
          <div className="flex items-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            <a href={aboutContent.linkedin} className="underline text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
              LinkedIn
            </a>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-gray-800 dark:text-gray-200">
              { aboutContent.location }
            </span>
          </div>
        </div>
      </Section>
      <FloatingBar />
    </div>
  );
}