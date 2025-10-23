import { notFound } from 'next/navigation';
import { getCaseStudyContent } from '@/lib/case-studies';
import { CaseStudyContent } from '@/components/case-study-content';
import { CaseStudiesList } from '@/components/case-studies-list';
import { parseMarkdownSections } from '@/lib/markdown';

export async function generateStaticParams() {
  const caseStudies = await getCaseStudyContent();
  return caseStudies.map(study => ({
    slug: study.slug as string,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudies = await getCaseStudyContent();
  const cs = caseStudies.find(study => study.slug === slug);
  if (!cs) return {};

  const title = cs.title;
  const description = cs.description || `Case study: ${cs.title}`;
  const url = `https://byleonardlim.com/work/${slug}`;

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

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudies = await getCaseStudyContent();
  const caseStudy = caseStudies.find(study => study.slug === slug);

  if (!caseStudy) {
    notFound();
  }

  const sections = parseMarkdownSections(caseStudy.content);

  return (
    <div className="max-w-5xl mx-auto min-h-screen px-2">    
      <CaseStudyContent
        title={caseStudy.title}
        readingTime={caseStudy.readingTime}
        industry={caseStudy.industry}
        tags={caseStudy.tags}
        sections={sections}
      />
      <CaseStudiesList
        caseStudies={caseStudies}
        currentSlug={slug}
      />
    </div>
  );
}