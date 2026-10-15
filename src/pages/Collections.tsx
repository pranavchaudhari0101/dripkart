import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOOKBOOK_ITEMS, type LookbookItem } from '../lib/lookbookData';
import { X, ChevronLeft, ChevronRight, ZoomIn, ShoppingBag, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FEATURED_DROPS = [
  { 
    title: "ESSENTIALS '26", 
    desc: "The foundational pieces every wardrobe needs. Clean cuts, heavyweight fabrics, timeless street style.", 
    img: "/products/product-01.jpeg",
    tag: "Denim & Classic"
  },
  { 
    title: "KIDS STREETWEAR '26", 
    desc: "Vibrant art prints, cozy fleece sets, and relaxed jogger silhouettes designed for next-gen comfort.", 
    img: "/products/product-14.jpeg",
    tag: "Next Gen"
  },
  { 
    title: "URBAN TAILORED", 
    desc: "Luxury jacquard polo collars, subtle embroidery, and premium drawstring pants for effortless street elegance.", 
    img: "/products/product-70.jpeg",
    tag: "Signature Polos"
  },
];

type CategoryFilter = 'all' | 'shirts' | 'kids' | 'bottoms' | 'tees';

export function Collections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all');
  const [selectedImage, setSelectedImage] = useState<LookbookItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.coll-header', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' });
      
      gsap.utils.toArray('.coll-section').forEach((section: any) => {
        gsap.from(section, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Filter items
  const filteredItems = LOOKBOOK_ITEMS.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredItems]);

  const currentIndex = selectedImage ? filteredItems.findIndex(i => i.id === selectedImage.id) : -1;

  const handlePrev = () => {
    if (currentIndex <= 0) {
      setSelectedImage(filteredItems[filteredItems.length - 1]);
    } else {
      setSelectedImage(filteredItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex >= filteredItems.length - 1) {
      setSelectedImage(filteredItems[0]);
    } else {
      setSelectedImage(filteredItems[currentIndex + 1]);
    }
  };

  const filterButtons: { key: CategoryFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All Photos', count: LOOKBOOK_ITEMS.length },
    { key: 'shirts', label: "Men's Denim Shirts", count: LOOKBOOK_ITEMS.filter(i => i.category === 'shirts').length },
    { key: 'kids', label: "Kids & Girls Sets", count: LOOKBOOK_ITEMS.filter(i => i.category === 'kids').length },
    { key: 'bottoms', label: "Pants & Bottoms", count: LOOKBOOK_ITEMS.filter(i => i.category === 'bottoms').length },
    { key: 'tees', label: "Polos & Tees", count: LOOKBOOK_ITEMS.filter(i => i.category === 'tees').length },
  ];

  return (
    <div ref={containerRef} className="pt-[120px] md:pt-[140px] pb-24 bg-brand-bgPrimary min-h-screen">
      
      {/* ═══ Header ═══ */}
      <div className="coll-header text-center mb-16 px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accentColor/10 border border-brand-accentColor/30 rounded-full mb-4">
          <Sparkles size={13} className="text-brand-accentColor" />
          <span className="font-body text-[10px] font-black uppercase tracking-[0.2em] text-brand-textPrimary">
            Complete Lookbook & Catalog
          </span>
        </div>
        <h1 className="font-display text-[44px] md:text-[76px] italic leading-none mb-4 text-brand-textPrimary">
          Collections & Lookbook
        </h1>
        <p className="font-body text-brand-textMuted max-w-[520px] mx-auto text-[14px] md:text-[15px] leading-relaxed">
          Explore curated seasonal drops and browse all 96 product photos from the Jwala Creation archives.
        </p>
        
        {/* Quick Jump Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <a 
            href="#lookbook" 
            className="px-6 py-3 bg-brand-textPrimary text-white font-body text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-brand-accentColor hover:text-black transition-colors"
          >
            Browse All 96 Photos ↓
          </a>
          <Link 
            to="/shop" 
            className="px-6 py-3 border border-brand-textPrimary font-body text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-brand-textPrimary hover:text-white transition-colors"
          >
            Go to Shop →
          </Link>
        </div>
      </div>

      {/* ═══ Featured Editorial Drops ═══ */}
      <div className="flex flex-col gap-20 md:gap-32 mb-28">
        {FEATURED_DROPS.map((coll, i) => (
          <div 
            key={i} 
            className={`coll-section flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20 px-6 md:px-12 max-w-[1400px] mx-auto`}
          >
            <div className="w-full md:w-1/2 aspect-[4/5] bg-brand-bgSecondary overflow-hidden group rounded-sm shadow-md relative">
              <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/80 backdrop-blur-md text-white font-body text-[10px] font-bold uppercase tracking-[0.2em]">
                {coll.tag}
              </span>
              <img 
                src={coll.img} 
                alt={coll.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" 
                onError={(e) => {
                  e.currentTarget.src = '/products/product-01.jpeg';
                }}
              />
            </div>

            <div className="w-full md:w-1/2 max-w-[480px]">
              <span className="font-display text-[64px] text-brand-accentColor leading-none block border-b border-brand-textPrimary/10 pb-3 mb-6 font-black italic">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="font-display text-[38px] md:text-[54px] leading-tight mb-4 uppercase tracking-tighter text-brand-textPrimary">
                {coll.title}
              </h2>
              <p className="font-body text-[14px] md:text-[15px] text-brand-textMuted leading-relaxed mb-8">
                {coll.desc}
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-textPrimary font-body font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-brand-textPrimary hover:text-white transition-colors"
              >
                <ShoppingBag size={14} />
                Explore Styles in Shop
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ The Complete 96-Photo Lookbook Archive ═══ */}
      <section id="lookbook" className="px-4 md:px-12 max-w-[1600px] mx-auto pt-16 border-t border-brand-textPrimary/10">
        <div className="text-center mb-10">
          <p className="font-body text-[11px] font-black uppercase tracking-[0.3em] text-brand-accentColor mb-2">
            Photoshoot Archives
          </p>
          <h2 className="font-display text-[32px] md:text-[52px] italic uppercase tracking-tight text-brand-textPrimary">
            Complete Lookbook Gallery
          </h2>
          <p className="font-body text-[13px] text-brand-textMuted max-w-[500px] mx-auto mt-2">
            Click on any photo to zoom in high resolution and view details.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveTab(btn.key)}
              className={`px-4 py-2 font-body text-[11px] font-bold uppercase tracking-[0.12em] rounded-full transition-all flex items-center gap-2 ${
                activeTab === btn.key
                  ? 'bg-brand-textPrimary text-white shadow-md'
                  : 'bg-white border border-gray-200 text-brand-textMuted hover:border-brand-textPrimary hover:text-brand-textPrimary'
              }`}
            >
              <span>{btn.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === btn.key ? 'bg-brand-accentColor text-black' : 'bg-gray-100 text-gray-600'
              }`}>
                {btn.count}
              </span>
            </button>
          ))}
        </div>

        {/* 96 Photos Masonry / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative aspect-[3/4] bg-brand-bgSecondary rounded-sm overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/50"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = '/products/product-01.jpeg';
                }}
              />

              {/* Tag / Number Badge */}
              <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/75 backdrop-blur-sm text-white font-body text-[9px] font-bold uppercase tracking-wider rounded-xs">
                #{String(item.id).padStart(2, '0')}
              </span>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                <span className="text-[9px] font-body uppercase tracking-[0.15em] text-[#c8ff00] font-bold">
                  {item.categoryLabel}
                </span>
                <p className="font-body text-[11px] font-semibold leading-tight line-clamp-2 mt-0.5">
                  {item.title}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/90">
                  <ZoomIn size={12} />
                  <span>View Full Photo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ High-Resolution Lightbox Modal ═══ */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 z-20 w-11 h-11 bg-white/10 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 md:left-8 z-20 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all"
            aria-label="Previous Photo"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 md:right-8 z-20 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all"
            aria-label="Next Photo"
          >
            <ChevronRight size={24} />
          </button>

          {/* Modal Content Box */}
          <div 
            className="relative max-w-[900px] w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] w-auto overflow-hidden rounded-md shadow-2xl bg-black">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
                onError={(e) => {
                  e.currentTarget.src = '/products/product-01.jpeg';
                }}
              />
            </div>

            {/* Bottom Details Bar */}
            <div className="mt-4 text-center text-white space-y-1">
              <div className="flex items-center justify-center gap-3">
                <span className="px-2.5 py-0.5 bg-brand-accentColor text-black font-body text-[10px] font-black uppercase tracking-widest rounded-xs">
                  Photo #{String(selectedImage.id).padStart(2, '0')}
                </span>
                <span className="text-white/60 font-body text-[12px] uppercase tracking-wider">
                  {currentIndex + 1} of {filteredItems.length}
                </span>
              </div>
              <h3 className="font-display text-[20px] md:text-[24px] uppercase tracking-tight font-bold">
                {selectedImage.title}
              </h3>
              <p className="font-body text-[12px] text-white/50 uppercase tracking-[0.2em]">
                {selectedImage.categoryLabel}
              </p>
              
              <div className="pt-2">
                <Link
                  to="/shop"
                  onClick={() => setSelectedImage(null)}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-brand-accentColor text-black font-body text-[11px] font-black uppercase tracking-[0.15em] rounded-sm hover:brightness-110 transition-all shadow-lg"
                >
                  <ShoppingBag size={14} />
                  Shop Similar Styles
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
