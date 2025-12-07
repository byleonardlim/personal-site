export interface ArticleMeta {
  slug: string;
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

export interface Article extends ArticleMeta {
  content: string;
}