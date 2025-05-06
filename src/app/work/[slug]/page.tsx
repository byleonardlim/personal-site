import { notFound } from 'next/navigation';
import { getCaseStudyContent } from '@/lib/case-studies';
import { defaultSEOConfig } from '@/lib/seo';
import { CaseStudyContent } from '@/components/case-study-content';
import { CaseStudiesList } from '@/components/case-studies-list';

export async function generateStaticParams() {
  const caseStudies = await getCaseStudyContent();
  return caseStudies.map(study => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const caseStudies = await getCaseStudyContent();
  const caseStudy = caseStudies.find(study => study.slug === slug);

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found | Leonard Lim',
      description: 'The requested case study could not be found',
    };
  }

  return {
    title: `${caseStudy.title} | ${defaultSEOConfig.defaultTitle}`,
    description: caseStudy.description || `Case study about ${caseStudy.industry} project`,
    keywords: [...caseStudy.tags, caseStudy.industry, 'case study', 'project'].join(', '),
    openGraph: {
      ...defaultSEOConfig.openGraph,
      title: caseStudy.title,
      description: caseStudy.description || `Case study about ${caseStudy.industry} project`,
      url: `https://byleonardlim.com/work/${caseStudy.slug}`,
      type: 'article',
      article: {
        readingTime: caseStudy.readingTime,
        section: 'Case Studies',
      },
    },
  };
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const caseStudies = await getCaseStudyContent();
  const caseStudy = caseStudies.find(study => study.slug === slug);

  if (!caseStudy) {
    notFound();
  }

  const readingTime = Math.ceil(caseStudy.content.split(' ').length / 200) + ' min read';

  return (
    <div className="space-y-8">
      <CaseStudyContent
        content={caseStudy.content}
        title={caseStudy.title}
        readingTime={readingTime}
        industry={caseStudy.industry}
        tags={caseStudy.tags}
      />
      <CaseStudiesList
        caseStudies={caseStudies}
        currentSlug={slug}
      />
    </div>
  );
}
