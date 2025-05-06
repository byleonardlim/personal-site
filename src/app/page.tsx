import { Mail, MapPin, ExternalLink } from 'lucide-react';
import { getCaseStudyContent } from '@/lib/case-studies';
import CaseStudyCard from '@/components/case-study-card';
import { experienceData } from '@/lib/experience';
import { ExperienceCard } from '@/components/experience-card';
import AnimatedHeadline from '@/components/animated-headline';
import Section from '@/components/section';
import { aboutContent } from '@/lib/about';
import { defaultSEOConfig } from '@/lib/seo';

export async function generateMetadata() {
  return {
    title: defaultSEOConfig.defaultTitle,
    description: defaultSEOConfig.description,
    keywords: defaultSEOConfig.additionalMetaTags?.[0]?.content || 'full stack developer, typescript, react, node.js, software development',
    openGraph: defaultSEOConfig.openGraph ? {
      title: defaultSEOConfig.defaultTitle,
      description: defaultSEOConfig.description,
      url: defaultSEOConfig.openGraph.url,
      type: defaultSEOConfig.openGraph.type,
      siteName: defaultSEOConfig.openGraph.siteName,
      images: defaultSEOConfig.openGraph.images,
    } : undefined,
  };
}

export default async function Home() {
  const caseStudies = await getCaseStudyContent();
  // Sort case studies with featured ones first
  caseStudies.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <div className="max-w-5xl mx-auto min-h-screen px-2 text-sm">
      {/* Hero Section */}
      <Section className="pb-16 h-dvh border-0 flex items-center overflow-hidden text-2xl lg:text-3xl font-medium">
        <h1 className="mb-4">
          <span className="block">By, Leonard Lim.</span>
          <AnimatedHeadline />
        </h1>
      </Section>

      {/* Work Section */}
      <Section>
        <h2 className="w-fit text-md font-medium mb-4 uppercase bg-gray-900 py-2 px-4 text-gray-100">
          Selected Work
        </h2>
        <div className="space-y-8">
          {caseStudies.map((study) => (
            <CaseStudyCard
              key={study.slug}
              {...study}
            />
          ))}
        </div>
      </Section>

{/* About & Contact Section */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="w-fit text-md font-medium mb-4 uppercase bg-gray-900 py-2 px-4 text-gray-100">
              About
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {aboutContent.bio}
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="w-fit text-md font-medium mb-4 uppercase bg-gray-900 py-2 px-4 text-gray-100">
              Contact
            </h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  Singapore
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <a href={`mailto:${aboutContent.email}`} className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                  Email
                </a>
              </div>
              <div className="flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                <a href={aboutContent.linkedin} className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Experience Section */}
      <Section>
        <h2 className="w-fit text-md font-medium mb-4 uppercase bg-gray-900 py-2 px-4 text-gray-100">
          Recent Experience
        </h2>
        <div className="space-y-8">
          {experienceData.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
        </div>
      </Section>
    </div>
  );
}