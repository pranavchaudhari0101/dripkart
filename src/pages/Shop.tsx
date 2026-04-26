import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useProducts } from '../hooks/useProducts';
import { Link, useSearchParams } from 'react-router-dom';


export function Shop() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const { data: products = [] } = useProducts();

  useEffect(() => {
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

  // Filter products
  const filteredProducts = products.filter((p: any) => {
    const matchesCategory = activeCategory === 'All' || 
      p.category?.toLowerCase() === activeCategory.toLowerCase() || 
      (activeCategory === 'T-Shirts' && p.category?.toLowerCase() === 'tees');
    
    const matchesSearch = !searchQuery || 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Helper to get best image
  const getImage = (p: any) => {
    if (p.images && p.images.length > 0 && p.images[0].url) return p.images[0].url;
    if (p.image) return p.image;
    if (p.imageUrl) return p.imageUrl;
    return '/hoodie.png';
  };

  const categories = ['All', 'Tees', 'Hoodies', 'Outerwear', 'Bottoms'];

  return (
    <div ref={gridRef} className="pt-[120px] md:pt-[140px] pb-20 px-4 md:px-12 min-h-screen bg-brand-bgPrimary">
      
      {/* Header */}
      <div className="shop-header mb-6 md:mb-10">
        <h1 className="font-display text-[32px] md:text-[48px] italic border-b border-brand-textPrimary/20 pb-4 uppercase tracking-tighter text-brand-textPrimary">
          {searchQuery ? `Results for "${searchQuery}"` : 'Shop'}
        </h1>
      </div>

      {/* Mobile: Horizontal pill categories */}
      <div className="md:hidden mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 font-body text-[11px] font-bold uppercase tracking-[0.1em] whitespace-nowrap rounded-full border transition-all ${
                activeCategory === cat 
                  ? 'bg-brand-textPrimary text-white border-brand-textPrimary' 
                  : 'bg-transparent text-brand-textMuted border-gray-300 hover:border-brand-textPrimary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[200px] shrink-0 shop-header">
          <h3 className="font-body font-medium text-[11px] uppercase tracking-[0.15em] mb-4">Categories</h3>
          <ul className="space-y-3">
            {categories.map((cat) => (
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
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-[24px] text-brand-textMuted mb-4">No products found</p>
              {searchQuery && (
                <Link to="/shop" className="font-body text-[12px] uppercase tracking-wider text-brand-accentColor hover:underline">
                  Clear search & browse all
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[2px]">
              {filteredProducts.map((p: any) => (
                <div key={p.id} className="shop-product relative overflow-hidden group hover:z-10 bg-brand-bgSecondary cursor-pointer">
                  <Link to={`/shop/${p.slug || p.id}`} className="block">
                    <div className="relative w-full pt-[133.33%] overflow-hidden bg-brand-bgSecondary">
                      {p.badge && (
                        <span className={`absolute top-3 right-3 font-body font-medium text-[9px] uppercase tracking-[0.12em] px-2.5 py-1.5 z-[2] ${
                          p.badgeType === 'white' ? 'bg-white text-brand-textPrimary' : 'bg-brand-accentColor text-brand-textPrimary'
                        }`}>
                          {p.badge}
                        </span>
                      )}

                      <img 
                        src={getImage(p)} 
                        alt={p.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" 
                      />

                      {/* Add to Cart — navigates to product */}
                      <div className="absolute bottom-0 left-0 w-full bg-brand-textPrimary text-white font-body font-medium text-[10px] uppercase tracking-[0.12em] p-3 text-center translate-y-full transition-all duration-350 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-[2] group-hover:translate-y-0 hover:!bg-brand-accentColor hover:!text-brand-textPrimary pointer-events-auto">
                        View Product →
                      </div>
                    </div>
                    
                    <div className="pt-3 px-2 pb-4">
                      <p className="font-body font-normal text-[11px] md:text-[12px] text-brand-textPrimary mb-1 truncate">{p.name}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="font-display font-semibold text-[14px] md:text-[15px] text-brand-textPrimary">₹{p.price?.toLocaleString()}</p>
                        {p.mrp && p.mrp > p.price && (
                          <p className="font-body text-[11px] text-brand-textMuted line-through">₹{p.mrp?.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
