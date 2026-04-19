import { Product } from '../hooks/useProducts';

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'hoodie', 
    name: 'Mens Premium Oversized Hoodie', 
    price: 1299, 
    slug: 'hoodie', 
    category: 'hoodies', 
    description: 'Heavyweight loopback cotton. Dropped shoulders, relaxed fit.',
    image: '/hoodie.png',
    isFeatured: true
  },
  { 
    id: 'cargo', 
    name: 'Mens Cargo Shirt — Cream', 
    price: 1099, 
    slug: 'cargo', 
    category: 'shirts', 
    description: 'Utility meets luxury. Multiple 3D pockets with a boxy silhouette.',
    image: '/cargo-shirt.png',
    isFeatured: true
  },
  { 
    id: 'drop', 
    name: 'Premium Urban Drop Tee', 
    price: 799, 
    slug: 'drop', 
    category: 'tees', 
    description: 'The perfect essential drop-shoulder tee. Ultra-soft.',
    image: '/drop-tee.png',
    isFeatured: false
  },
  { 
    id: 'zipup', 
    name: 'Mens Zip-Up Hoodie — Slate', 
    price: 1499, 
    slug: 'zipup', 
    category: 'hoodies', 
    description: 'Everyday essential zip-up. Features a custom metal zipper.',
    image: '/zipup-hoodie.png',
    isFeatured: false
  },
  { 
    id: 'cargo-shadow', 
    name: 'Cargo Pants — Shadow Black', 
    price: 2499, 
    slug: 'cargo-shadow', 
    category: 'bottoms', 
    description: 'Premium heavyweight cargo pants with utility pockets and a relaxed silhouette.', 
    image: '/cargo-shadow.png', 
    badge: 'New Arrival', 
    badgeType: 'accent',
    isFeatured: true
  },
  { 
    id: 'cyber-tee', 
    name: 'Oversized Graphic Tee — Neon Cyber', 
    price: 1299, 
    slug: 'cyber-tee', 
    category: 'tees', 
    description: 'Futuristic graphic print on premium heavyweight cotton. Boxy fit.', 
    image: '/cyber-tee.png',
    isFeatured: true
  },
  { 
    id: 'utility-vest', 
    name: 'Utility Vest — Desert Sand', 
    price: 3299, 
    slug: 'utility-vest', 
    category: 'outerwear', 
    description: 'Technical utility vest with multiple tactical pockets and premium hardware.', 
    image: '/utility-vest.png', 
    badge: 'Limited', 
    badgeType: 'white',
    isFeatured: false
  },
  { 
    id: 'slate-joggers', 
    name: 'Relaxed Fit Joggers — Slate Grey', 
    price: 1899, 
    slug: 'slate-joggers', 
    category: 'bottoms', 
    description: 'Minimalist joggers crafted from premium heavyweight jersey cotton.', 
    image: '/slate-joggers.png',
    isFeatured: false
  },
  { 
    id: 'alpine-windbreaker', 
    name: 'Technical Windbreaker — Alpine White', 
    price: 4999, 
    slug: 'alpine-windbreaker', 
    category: 'outerwear', 
    description: 'Technical hooded windbreaker featuring waterproof material and a techwear aesthetic.', 
    image: '/alpine-windbreaker.png', 
    badge: 'Best Seller', 
    badgeType: 'accent',
    isFeatured: true
  },
  { 
    id: 'knit-sweater', 
    name: 'Minimalist Knit Sweater — Cream', 
    price: 2799, 
    slug: 'knit-sweater', 
    category: 'outerwear', 
    description: 'Oversized knit sweater made from luxury premium wool blend.', 
    image: '/knit-sweater.png',
    isFeatured: false
  },
  { 
    id: 'acid-hoodie', 
    name: 'Acid Wash Hoodie — Midnight Blue', 
    price: 2199, 
    slug: 'acid-hoodie', 
    category: 'hoodies', 
    description: 'Distressed acid wash aesthetic with a premium oversized drop-shoulder fit.', 
    image: '/acid-hoodie.png',
    isFeatured: false
  },
  { 
    id: 'arctic-tee', 
    name: 'Signature Drop Tee — Arctic White', 
    price: 899, 
    slug: 'arctic-tee', 
    category: 'tees', 
    description: 'The essential white tee redefined. Thick collar and perfect drop shoulders.', 
    image: '/arctic-tee.png',
    isFeatured: false
  }
];
