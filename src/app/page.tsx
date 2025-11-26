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
    <div className="max-w-screen-xl mx-auto px-6 lg:px-12 text-base selection:bg-gray-200 dark:selection:bg-gray-800 pb-32">
      {/* About Section */}
      <Section
        title="Leonard Lim"
        subtitle={
          <>
            <span>Fractional Product Design</span>
            <span className="block lg:inline mt-1 lg:mt-0">{aboutContent.location}</span>
          </>
        }
        className="min-h-[80vh] mt-[2rem] lg:mt-0"
        contentClassName="justify-center lg:pl-16 max-w-4xl"
      >
        <h1 className="text-3xl lg:text-5xl font-medium leading-tight text-gray-900 dark:text-gray-100 mb-8">
          Disrupting the user experience domain with clarity and intent.
        </h1>
        <div className="max-w-2xl text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed space-y-6">
          <p>
            I work with early-stage companies and lean organizations to shape how people experience and building their products. Through fractional design leadership, I help teams find focus, align around users, and design with purpose.
          </p>
          <p>
            By staying ahead of the market with artificial intelligence, I guide quiet shifts that create lasting impact, turning complex systems into experiences that simply work.
          </p>
        </div>
      </Section>

      <div className="w-full lg:grid lg:grid-cols-12 lg:gap-16">
        {/* Articles Section */}
        <div className="lg:col-span-7">
          <Section title="Selected Works" subtitle="Articles">
            <div className="space-y-8">
              {articles.map((study: Article) => (
                <ArticleCard
                  key={study.slug}
                  {...study}
                />
              ))}
            </div>
          </Section>
        </div>

        {/* Products Section */}
        <div className="lg:col-span-5">
          <Section title="Products" subtitle="Building">
            <div className="space-y-8">
              {productsData.map((product) => (
                <ProductCard key={product.slug} {...product} />
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* Experience Section */}
      <Section title="Experience" subtitle="Career">
        <div className="max-w-3xl space-y-8">
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
      <Section title="Connect" subtitle="Socials">
        <div className="space-y-3 text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-3 opacity-70" />
            <a href={`mailto:${aboutContent.email}`} className="hover:text-black dark:hover:text-white transition-colors duration-200">
              { aboutContent.email }
            </a>
          </div>
          <div className="flex items-center">
            <ExternalLink className="w-4 h-4 mr-3 opacity-70" />
            <a href={aboutContent.linkedin} className="hover:text-black dark:hover:text-white transition-colors duration-200">
              LinkedIn
            </a>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-3 opacity-70" />
            <span>
              { aboutContent.location }
            </span>
          </div>
        </div>
      </Section>
      <FloatingBar />
    </div>
  );
}