export interface Product {
  slug: string;
  title: string;
  year: string;
  category: string;
  status: 'Shipped' | 'Building' | 'Paused';
  url?: string;
  description?: string;
}
