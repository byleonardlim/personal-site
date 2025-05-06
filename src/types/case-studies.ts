export interface CaseStudy {
  slug: string;
  content: string;
  readingTime: string;
  title: string;
  year: string;
  industry: string;
  duration: string;
  tags: string[];
  featured: boolean;
  description?: string;
  date?: string;
}