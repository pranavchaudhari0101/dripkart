import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ALL_PRODUCTS = [
  { id: 'hoodie', name: 'Mens Premium Oversized Hoodie', price: 1299, image: '/hoodie.png', badge: 'Low Stock', badgeType: 'white' },
  { id: 'cargo', name: 'Mens Cargo Shirt — Cream', price: 1099, image: '/cargo-shirt.png', badge: 'Popular', badgeType: 'accent' },
  { id: 'drop', name: 'Premium Urban Drop Tee', price: 799, image: '/drop-tee.png', badge: 'Best Seller', badgeType: 'white' },
  { id: 'zipup', name: 'Mens Zip-Up Hoodie — Slate', price: 1499, image: '/zipup-hoodie.png', badge: 'Best Seller', badgeType: 'white' },
  // Adding duplicates just to fill out the shop page grid
  { id: 'hoodie-2', name: 'Womens Crop Hoodie — Olive', price: 1199, image: '/hoodie.png', badge: 'New', badgeType: 'accent' },
  { id: 'cargo-2', name: 'Mens Utility Shorts — Khaki', price: 899, image: '/cargo-shirt.png' },
  { id: 'drop-2', name: 'Signature Basic Tee — Black', price: 699, image: '/drop-tee.png' },
  { id: 'zipup-2', name: 'Heavyweight Zip-Up — Ash', price: 1599, image: '/zipup-hoodie.png' }
];

export function Shop() {
  const { addToCart } = useCart();
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // Fetch real data from Hono Backend API
  const { data: products = ALL_PRODUCTS } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    },
    initialData: ALL_PRODUCTS, // Fallback to mockup data conceptually while DB is empty
  });

  useEffect(() => {
    // Scroll to top when page mounts
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.shop-header', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.shop-product', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className="pt-[140px] pb-20 px-6 md:px-12 min-h-screen bg-brand-bgPrimary">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="shop-header w-full md:w-[220px] shrink-0">
          <h1 className="font-display text-[40px] italic mb-8 border-b border-brand-textPrimary/20 pb-4 uppercase tracking-tighter text-brand-textPrimary">Shop</h1>
          
          <div className="mb-8">
            <h3 className="font-body font-medium text-[11px] uppercase tracking-[0.15em] mb-4">Categories</h3>
            <ul className="space-y-3">
              {['All', 'Tees', 'Hoodies', 'Outerwear', 'Bottoms'].map((cat) => (
                <li key={cat}>
                  <button 
                    onClick={() => setActiveCategory(cat)}
                    className={`font-body text-[13px] transition-colors ${activeCategory === cat ? 'text-brand-accentColor font-medium' : 'text-brand-textMuted hover:text-brand-textPrimary'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[2px]">
            {products
              .filter((p: any) => activeCategory === 'All' || p.category?.toLowerCase() === activeCategory.toLowerCase() || (activeCategory === 'T-Shirts' && p.category?.toLowerCase() === 'tees'))
              .map((p: any) => (
              <div key={p.id} className="shop-product relative overflow-hidden group hover:z-10 bg-brand-bgSecondary cursor-pointer">
                <Link to={`/shop/${p.slug || p.id}`} className="block">
                  <div className="relative w-full pt-[133.33%] overflow-hidden bg-brand-bgSecondary">
                    
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                      className="absolute top-3 left-3 w-10 h-10 bg-brand-accentColor border border-brand-textPrimary/20 rounded-full flex items-center justify-center cursor-pointer z-[2] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Heart size={14} strokeWidth={1.5} className="text-brand-textPrimary" />
                    </button>

                    {p.badge && (
                      <span className={`absolute top-3 right-3 font-body font-medium text-[9px] uppercase tracking-[0.12em] px-2.5 py-1.5 z-[2] ${
                        p.badgeType === 'white' ? 'bg-white text-brand-textPrimary' : 'bg-brand-accentColor text-brand-textPrimary'
                      }`}>
                        {p.badge}
                      </span>
                    )}

                    <img 
                      src={p.image || p.imageUrl || '/hoodie.png'} 
                      alt={p.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" 
                    />

                    {/* Microinteraction: Quick Add */}
                    <button 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        addToCart({ ...p, size: 'M' }, 1); 
                      }} 
                      className="absolute bottom-0 left-0 w-full bg-brand-textPrimary text-white font-body font-medium text-[10px] uppercase tracking-[0.12em] p-3.5 text-center translate-y-full transition-all duration-350 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-[2] group-hover:translate-y-0 hover:!bg-brand-accentColor hover:!text-brand-textPrimary active:scale-y-95 pointer-events-auto"
                    >
                      + Quick Add
                    </button>
                  </div>
                  
                  <div className="pt-3.5 px-1 pb-4">
                    <p className="font-body font-normal text-[12px] text-brand-textPrimary mb-1">{p.name}</p>
                    <p className="font-display font-semibold text-[15px] text-brand-textPrimary">₹{p.price.toLocaleString()}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
