import { Mail, MapPin, ExternalLink } from 'lucide-react';
import { getCaseStudyContent } from '@/lib/case-studies';
import CaseStudyCard from '@/components/case-study-card';
import { experienceData } from '@/lib/experience';
import { ExperienceCard } from '@/components/experience-card';
import AnimatedHeadline from '@/components/animated-headline';
import Section from '@/components/section';
import { aboutContent } from '@/lib/about';
import Header from '@/components/header';
import LoopingScroll from '@/components/looping-scroll';
import FloatingBar from '@/components/floating-bar';

export default async function Home() {
  const caseStudies = await getCaseStudyContent();
  // Sort case studies with featured ones first
  caseStudies.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <LoopingScroll className="max-w-screen mx-auto px-2 text-sm">
      {/* Hero Section */}
      <Section className="max-w-6xl mx-auto pb-16 h-dvh border-0 flex items-center overflow-hidden text-2xl lg:text-3xl font-medium">
        <h1 className="mb-4">
          <span className="block text-green-600">Leonard Lim.</span>
          <AnimatedHeadline />
        </h1>
      </Section>

      {/* About Section */}
      <Section className="max-w-6xl mx-auto">
        <h2 className="w-fit text-md lg:text-lg font-medium mb-4 uppercase text-neutral-600 dark:text-neutral-300">
          About
        </h2>
        <p className="text-gray-800 dark:text-gray-200">
          {aboutContent.bio}
        </p>
      </Section>

      {/* Work Section */}
      <Section className="max-w-6xl mx-auto">
      <h2 className="w-fit text-md lg:text-lg font-medium mb-4 uppercase text-neutral-600 dark:text-neutral-300">
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

      {/* Experience Section */}
      <Section className="max-w-6xl mx-auto">
      <h2 className="w-fit text-md lg:text-lg font-medium mb-4 uppercase text-neutral-600 dark:text-neutral-300">
          Recent Experience
        </h2>
        <div className="space-y-8">
          {experienceData
            .sort((a, b) => {
              // Place 'Present' at the top
              if (a.endDate === 'Present') return -1;
              if (b.endDate === 'Present') return 1;
              
              // Convert dates to YYYY-MM format for comparison
              const dateA = new Date(a.endDate);
              const dateB = new Date(b.endDate);
              return dateB.getTime() - dateA.getTime();
            })
            .map((experience, index, array) => {
              // Calculate opacity based on position in array
              // First item (Present) is 100%, last item is 50%
              const totalItems = array.length;
              const opacity = 1 - (index / (totalItems - 1)) * 0.5;
              
              return (
                <div key={index} style={{ opacity }} className="transition-opacity duration-300">
                  <ExperienceCard experience={experience} />
                </div>
              );
            })}
        </div>
      </Section>

      {/* Connect Section */}
      <Section className="max-w-6xl mx-auto">
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
    </LoopingScroll>
  );
}