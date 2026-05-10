import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { MOCK_PRODUCTS } from '../lib/mockData';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
  badgeType?: 'white' | 'accent';
  isFeatured: boolean;
  variants?: any[];
}

export function useProducts(featured?: boolean) {
  return useQuery<Product[]>({
    queryKey: ['products', { featured }],
    queryFn: async () => {
      try {
        const res = await api.get('/products', {
          params: { featured },
          timeout: 5000, // 5s timeout — fall back to mock data fast
        });
        
        if (!res.data || res.data.length === 0) {
          throw new Error('No products found');
        }

        return res.data.map((p: any) => {
          const price = Number(p.price);
          return {
            ...p,
            price: Number.isFinite(price) ? price : 0
          };
        });
      } catch (error) {
        console.warn('Failed to fetch products:', error);

        // Only fall back to mock data in development
        if (import.meta.env.DEV) {
          if (featured) {
            return MOCK_PRODUCTS.filter(p => p.isFeatured);
          }
          return MOCK_PRODUCTS;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15,   // 15 minutes
    refetchOnWindowFocus: false,
  });
}
