import { notFound } from 'next/navigation';
import { getCaseStudyContent } from '@/lib/case-studies';
import { CaseStudyContent } from '@/components/case-study-content';
import { CaseStudiesList } from '@/components/case-studies-list';
import Header from '@/components/header';

export async function generateStaticParams() {
  const caseStudies = await getCaseStudyContent();
  return caseStudies.map(study => ({
    slug: study.slug as string,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudies = await getCaseStudyContent();
  const caseStudy = caseStudies.find(study => study.slug === slug);

  if (!caseStudy) {
    notFound();
  }

  const readingTime = Math.ceil(caseStudy.content.split(' ').length / 200) + ' min read';

  return (
    <div className="max-w-5xl mx-auto min-h-screen px-2 text-sm">
      <Header />       
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