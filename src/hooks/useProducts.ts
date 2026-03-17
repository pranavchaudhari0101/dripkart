import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

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
}

export function useProducts(featured?: boolean) {
  return useQuery<Product[]>({
    queryKey: ['products', { featured }],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: { featured }
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
