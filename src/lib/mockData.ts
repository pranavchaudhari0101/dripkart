import type { Product } from '../hooks/useProducts';

export const MOCK_PRODUCTS: Product[] = [
  // ═══════════════════════════════════════════════════════════
  //  MEN'S DENIM SHIRTS (photos 01–11)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'denim-shirt-washed',
    name: 'Mens Premium Washed Denim Shirt — Ice Blue',
    price: 1299,
    slug: 'denim-shirt-washed',
    category: 'shirts',
    description: 'Classic acid-washed denim shirt with dual flap pockets. Roll-up sleeves with a relaxed fit for effortless street style.',
    image: '/products/product-01.jpeg',
    badge: 'New Arrival',
    badgeType: 'accent',
    isFeatured: true
  },
  {
    id: 'denim-shirt-light',
    name: 'Mens Slim Fit Denim Shirt — Sky Wash',
    price: 1199,
    slug: 'denim-shirt-light',
    category: 'shirts',
    description: 'Lightweight denim shirt in a light sky wash. Single pocket design with button-down collar.',
    image: '/products/product-04.jpeg',
    isFeatured: true
  },
  {
    id: 'denim-shirt-dual-pocket',
    name: 'Mens Denim Shirt — Double Pocket Blue',
    price: 1399,
    slug: 'denim-shirt-dual-pocket',
    category: 'shirts',
    description: 'Heavy-duty denim shirt featuring twin buttoned chest pockets. Acid wash finish with a rugged silhouette.',
    image: '/products/product-07.jpeg',
    badge: 'Best Seller',
    badgeType: 'accent',
    isFeatured: true
  },

  // ═══════════════════════════════════════════════════════════
  //  GIRLS' GRAPHIC TEE + CARGO JOGGER SETS (photos 12–14)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'girls-floral-tee-set-lavender',
    name: 'Girls Graphic Tee & Cargo Jogger Set — Lavender',
    price: 899,
    slug: 'girls-floral-tee-set-lavender',
    category: 'kids',
    description: 'Adorable graphic print tee paired with lavender cargo joggers. Soft cotton blend with elastic waistband.',
    image: '/products/product-14.jpeg',
    badge: 'New',
    badgeType: 'accent',
    isFeatured: true
  },
  {
    id: 'girls-floral-tee-set-white',
    name: 'Girls Floral Art Tee & Cargo Set — White/Lilac',
    price: 899,
    slug: 'girls-floral-tee-set-white',
    category: 'kids',
    description: 'White tee with stunning floral hair art print, paired with lavender cargo joggers. Perfect for trendy kids.',
    image: '/products/product-12.jpeg',
    isFeatured: false
  },

  // ═══════════════════════════════════════════════════════════
  //  BOYS' GRAPHIC T-SHIRT + JOGGER SETS (photos 15–23)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'boys-bear-tee-set',
    name: 'Boys Perpetual Bear Tee & Jogger Set — Black/Khaki',
    price: 999,
    slug: 'boys-bear-tee-set',
    category: 'kids',
    description: 'Trendy bear graphic tee with "Perpetual" print, paired with khaki drawstring joggers. Premium streetwear for kids.',
    image: '/products/product-20.jpeg',
    badge: 'Trending',
    badgeType: 'accent',
    isFeatured: true
  },
  {
    id: 'boys-embossed-letter-set',
    name: 'Boys Embossed Letter Sweatshirt & Jogger Set — Black',
    price: 1199,
    slug: 'boys-embossed-letter-set',
    category: 'kids',
    description: 'Premium embossed letter texture sweatshirt with matching joggers. Green "C" chenille patch detail.',
    image: '/products/product-23.jpeg',
    isFeatured: false
  },

  // ═══════════════════════════════════════════════════════════
  //  KIDS' BUNNY SWEATSHIRT SETS (photos 24–32)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'kids-bunny-set-red',
    name: 'Kids Bunny Sweatshirt & Happy Jogger Set — Maroon',
    price: 849,
    slug: 'kids-bunny-set-red',
    category: 'kids',
    description: 'Cute bunny graphic sweatshirt in maroon with matching "HAPPY" print black joggers. Fleece lined for warmth.',
    image: '/products/product-26.jpeg',
    isFeatured: false
  },
  {
    id: 'kids-bunny-set-green',
    name: 'Kids Bunny Sweatshirt & Happy Jogger Set — Mint Green',
    price: 849,
    slug: 'kids-bunny-set-green',
    category: 'kids',
    description: 'Adorable bunny graphic sweatshirt in mint green with matching "HAPPY" print black joggers. Soft fleece interior.',
    image: '/products/product-29.jpeg',
    isFeatured: false
  },

  // ═══════════════════════════════════════════════════════════
  //  KIDS' SMILE SWEATSHIRT SET (photos 33–35)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'kids-smile-sweatshirt-set',
    name: 'Kids Smile Sunflower Sweatshirt & Jogger Set — Pink',
    price: 899,
    slug: 'kids-smile-sweatshirt-set',
    category: 'kids',
    description: 'Pink sweatshirt with cute sunflower girl "Smile" graphic. Paired with matching black printed joggers.',
    image: '/products/product-35.jpeg',
    badge: 'Cute',
    badgeType: 'white',
    isFeatured: true
  },

  // ═══════════════════════════════════════════════════════════
  //  KIDS' PARROT TROPICAL SET (photos 36–41)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'kids-parrot-set-pink',
    name: 'Kids Tropical Parrot Sweatshirt Set — Pink',
    price: 949,
    slug: 'kids-parrot-set-pink',
    category: 'kids',
    description: 'Vibrant tropical parrot graphic sweatshirt in pink with matching black joggers. Bold floral artwork.',
    image: '/products/product-38.jpeg',
    isFeatured: false
  },
  {
    id: 'kids-parrot-set-white',
    name: 'Kids Tropical Parrot Sweatshirt Set — White',
    price: 949,
    slug: 'kids-parrot-set-white',
    category: 'kids',
    description: 'Colorful tropical parrot graphic on white sweatshirt with matching black joggers. Eye-catching design.',
    image: '/products/product-41.jpeg',
    isFeatured: false
  },

  // ═══════════════════════════════════════════════════════════
  //  MEN'S DRAWSTRING PANTS — FEIN (photo 63–65)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'fein-drawstring-pants',
    name: 'Mens FEIN Drawstring Pants — Olive Khaki',
    price: 1599,
    slug: 'fein-drawstring-pants',
    category: 'bottoms',
    description: 'Premium technical fabric drawstring pants with elastic waistband and button closure. Available in khaki, grey, and black.',
    image: '/products/product-63.jpeg',
    badge: 'New Arrival',
    badgeType: 'accent',
    isFeatured: true
  },

  // ═══════════════════════════════════════════════════════════
  //  MEN'S POLO T-SHIRTS (photos 66–80)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'polo-flower-embro',
    name: 'Mens Flower Embroidery Polo — Khaki',
    price: 1099,
    slug: 'polo-flower-embro',
    category: 'tees',
    description: 'Premium polo T-shirt with flower embroidery detail and contrast striped collar. Available in khaki, brown, and black.',
    image: '/products/product-65.jpeg',
    badge: 'New',
    badgeType: 'accent',
    isFeatured: true
  },
  {
    id: 'polo-lv-gold-collar',
    name: 'Mens LV Gold Collar Polo — Multi Color',
    price: 1299,
    slug: 'polo-lv-gold-collar',
    category: 'tees',
    description: 'Elegant polo with gold accent collar trim and "Mature" branding. Available in sage, mint, lavender, orange, and dusty rose.',
    image: '/products/product-70.jpeg',
    badge: 'Best Seller',
    badgeType: 'accent',
    isFeatured: true
  },
  {
    id: 'polo-atlas',
    name: 'Mens Atlas Jacquard Polo — Maroon',
    price: 1199,
    slug: 'polo-atlas',
    category: 'tees',
    description: 'Textured jacquard polo with embroidered collar detail. Available in maroon, cream, charcoal, and camel.',
    image: '/products/product-73.jpeg',
    isFeatured: false
  },
  {
    id: 'polo-kaashmiri',
    name: 'Mens Kaashmiri Print Polo — White/Grey',
    price: 1399,
    slug: 'polo-kaashmiri',
    category: 'tees',
    description: 'Artistic Kashmiri-inspired printed polo with geometric collar pattern. Premium lightweight cotton blend.',
    image: '/products/product-78.jpeg',
    badge: 'Limited',
    badgeType: 'white',
    isFeatured: true
  },
  {
    id: 'polo-snowfall',
    name: 'Mens Snowfall Polo — Olive',
    price: 1199,
    slug: 'polo-snowfall',
    category: 'tees',
    description: 'Sleek polo with contrast trim collar in the "Snowfall" collection. Available in olive, black, mustard, and cream.',
    image: '/products/product-79.jpeg',
    isFeatured: false
  },

  // ═══════════════════════════════════════════════════════════
  //  MEN'S CASUAL DRAWSTRING PANTS (photo 81)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'casual-drawstring-pants',
    name: 'Mens Premium Drawstring Casual Pants — Multi',
    price: 1499,
    slug: 'casual-drawstring-pants',
    category: 'bottoms',
    description: 'Relaxed fit casual pants with contrast drawstring. Available in navy, beige, grey, khaki, and brown.',
    image: '/products/product-81.jpeg',
    isFeatured: false
  },

  // ═══════════════════════════════════════════════════════════
  //  MEN'S GRAPHIC TEES (photos 82–96)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'vengeance-acid-tee',
    name: 'Mens Vengeance Wolf Acid Wash Tee — Black',
    price: 899,
    slug: 'vengeance-acid-tee',
    category: 'tees',
    description: 'Bold "Vengeance" wolf graphic on acid wash black oversized tee. Gothic typography with raw streetwear energy.',
    image: '/products/product-85.jpeg',
    badge: 'Hot',
    badgeType: 'accent',
    isFeatured: true
  },
  {
    id: 'collar-tee-embroidered',
    name: 'Mens Embroidered Collar T-Shirt — Multi',
    price: 999,
    slug: 'collar-tee-embroidered',
    category: 'tees',
    description: 'Premium collar T-shirt with delicate embroidery details. Soft cotton pique fabric with contrast trim.',
    image: '/products/product-87.jpeg',
    isFeatured: false
  },
  {
    id: 'textured-polo-classic',
    name: 'Mens Classic Textured Polo — Multi',
    price: 1049,
    slug: 'textured-polo-classic',
    category: 'tees',
    description: 'Classic textured polo with button-down collar and subtle branding. Premium breathable fabric.',
    image: '/products/product-90.jpeg',
    isFeatured: false
  },
  {
    id: 'premium-polo-stripe-collar',
    name: 'Mens Stripe Collar Polo — Multi',
    price: 1099,
    slug: 'premium-polo-stripe-collar',
    category: 'tees',
    description: 'Premium polo with striped collar detail and logo embroidery. Clean, minimal design for everyday wear.',
    image: '/products/product-93.jpeg',
    isFeatured: false
  },
  {
    id: 'polo-minimal-badge',
    name: 'Mens Minimal Badge Polo — Multi',
    price: 999,
    slug: 'polo-minimal-badge',
    category: 'tees',
    description: 'Clean minimal polo with small badge embroidery. Relaxed fit with ribbed collar and cuffs.',
    image: '/products/product-96.jpeg',
    isFeatured: false
  },

  // ═══════════════════════════════════════════════════════════
  //  ORIGINAL PRODUCTS (keeping a few favorites)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'hoodie',
    name: 'Mens Premium Oversized Hoodie',
    price: 1299,
    slug: 'hoodie',
    category: 'hoodies',
    description: 'Heavyweight loopback cotton. Dropped shoulders, relaxed fit.',
    image: '/hoodie.png',
    isFeatured: false
  },
  {
    id: 'cargo',
    name: 'Mens Cargo Shirt — Cream',
    price: 1099,
    slug: 'cargo',
    category: 'shirts',
    description: 'Utility meets luxury. Multiple 3D pockets with a boxy silhouette.',
    image: '/cargo-shirt.png',
    isFeatured: false
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
    id: 'cargo-shadow',
    name: 'Cargo Pants — Shadow Black',
    price: 2499,
    slug: 'cargo-shadow',
    category: 'bottoms',
    description: 'Premium heavyweight cargo pants with utility pockets and a relaxed silhouette.',
    image: '/cargo-shadow.png',
    isFeatured: false
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
];
