export interface Article {
  slug: string;
  content: string;
  readingTime: string;
  title: string;
  year: string;
  duration: string;
  tags: string[];
  featured: boolean;
  description?: string;
  date?: string;
  coverImage?: string;
}