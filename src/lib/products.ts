import { Product } from '@/types/products';

export const productsData: Product[] = [
  {
    slug: 'insight-dashboard',
    title: 'Insight Dashboard',
    year: '2025',
    category: 'Analytics',
    status: 'Building',
    url: 'https://example.com/insight-dashboard',
    description: 'A modular analytics dashboard exploring decision support patterns and clean data visualizations.'
  },
  {
    slug: 'ai-research-notes',
    title: 'AI Research Notes',
    year: '2024',
    category: 'Knowledge',
    status: 'Shipped',
    url: 'https://example.com/ai-research-notes',
    description: 'Lightweight note system for testing LLM prompts, RAG setups, and UX flows.'
  },
  {
    slug: 'prototyper',
    title: 'Prototyper',
    year: '2023',
    category: 'Tooling',
    status: 'Shipped',
    url: 'https://example.com/prototyper',
    description: 'A starter toolkit to spin up design experiments quickly with sensible defaults.'
  }
];
