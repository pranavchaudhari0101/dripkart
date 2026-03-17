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
  variants?: any[];
}

export function useProducts(featured?: boolean) {
  return useQuery<Product[]>({
    queryKey: ['products', { featured }],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: { featured }
      });
      return res.data.map((p: any) => {
        const price = Number(p.price);
        return {
          ...p,
          price: Number.isFinite(price) ? price : 0
        };
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
