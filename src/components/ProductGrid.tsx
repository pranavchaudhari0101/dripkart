import { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const products = [
  { id: 'hoodie', name: 'Mens Premium Oversized Hoodie', price: '₹1,299', image: '/src/assets/hoodie.png', badge: 'Low Stock', badgeType: 'white' },
  { id: 'cargo', name: 'Mens Cargo Shirt — Cream', price: '₹1,099', image: '/src/assets/cargo-shirt.png', badge: 'Popular', badgeType: 'accent' },
  { id: 'drop', name: 'Premium Urban Drop Tee', price: '₹799', image: '/src/assets/drop-tee.png', badge: 'Best Seller', badgeType: 'white' },
  { id: 'zipup', name: 'Mens Zip-Up Hoodie — Slate', price: '₹1,499', image: '/src/assets/zipup-hoodie.png', badge: 'Best Seller', badgeType: 'white' }
];

export function ProductGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.section-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.section-title',
          start: 'top 85%',
        }
      });

      gsap.from('.product-card', {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.product-grid',
          start: 'top 80%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-[60px] px-6 md:px-12 pb-20 bg-brand-bgPrimary" id="newArrivals">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="section-title font-display font-normal italic text-[38px] text-brand-textPrimary">
          New Arrival
        </h2>
        <a href="#shop" className="font-body font-medium text-[11px] uppercase tracking-[0.12em] text-brand-textPrimary opacity-50 hover:opacity-100 transition-opacity">
          View all ›
        </a>
      </div>

      <div className="product-grid grid grid-cols-2 md:grid-cols-4 gap-[2px]">
        {products.map((p) => (
          <div key={p.id} className="product-card relative overflow-hidden cursor-pointer group">
            <div className="relative w-full pt-[133.33%] overflow-hidden bg-brand-bgSecondary">
              
              <button className="absolute top-3 left-3 w-10 h-10 bg-brand-accentColor border border-brand-textPrimary/20 rounded-full flex items-center justify-center cursor-pointer z-[2] opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart size={14} strokeWidth={1.5} className="text-brand-textPrimary" />
              </button>

              <span className={`absolute top-3 right-3 font-body font-medium text-[9px] uppercase tracking-[0.12em] px-2.5 py-1.5 z-[2] ${
                p.badgeType === 'white' ? 'bg-white text-brand-textPrimary' : 'bg-brand-accentColor text-brand-textPrimary'
              }`}>
                {p.badge}
              </span>

              <img 
                src={p.image} 
                alt={p.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" 
              />

              <div className="absolute bottom-0 left-0 w-full bg-brand-textPrimary text-white font-body font-medium text-[10px] uppercase tracking-[0.12em] p-3.5 text-center translate-y-full transition-all duration-350 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-[2] cursor-pointer group-hover:translate-y-0 hover:!bg-brand-accentColor hover:!text-brand-textPrimary">
                + Quick Add
              </div>
            </div>
            
            <div className="pt-3.5 px-1 pb-2">
              <p className="font-body font-normal text-[12px] text-brand-textPrimary mb-1">{p.name}</p>
              <p className="font-display font-semibold text-[15px] text-brand-textPrimary">{p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
