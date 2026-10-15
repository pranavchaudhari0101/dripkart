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
      // Base catalog created from the product photos
      const baseCatalog = featured ? MOCK_PRODUCTS.filter(p => p.isFeatured) : MOCK_PRODUCTS;

      try {
        const res = await api.get('/products', {
          params: { featured },
          timeout: 4000,
        });
        
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Format backend products, ensuring valid fallback image
          const backendProducts = res.data
            .map((p: any) => {
              const price = Number(p.price);
              const imgUrl = (p.images && p.images[0]?.url) || p.image || p.imageUrl;
              return {
                ...p,
                price: Number.isFinite(price) ? price : 0,
                image: imgUrl || '/products/product-01.jpeg'
              };
            })
            .filter((p: any) => p.name);

          // Combine: our local photo products first, plus any new unique backend products
          const existingIds = new Set(baseCatalog.map(p => p.id));
          const existingNames = new Set(baseCatalog.map(p => p.name.toLowerCase()));
          
          const uniqueBackend = backendProducts.filter((p: any) => 
            !existingIds.has(p.id) && !existingNames.has(p.name.toLowerCase())
          );

          return [...baseCatalog, ...uniqueBackend];
        }

        return baseCatalog;
      } catch (error) {
        console.warn('Backend products fetch skipped, using photo catalog:', error);
        return baseCatalog;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15,   // 15 minutes
    refetchOnWindowFocus: false,
  });
}
