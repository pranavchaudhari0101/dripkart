import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Editorial() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.editorial-anim',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-[160px] pb-24 px-6 md:px-12 max-w-[1200px] mx-auto bg-brand-bgPrimary text-brand-textPrimary">
      <header className="mb-16 md:mb-24">
        <h1 className="editorial-anim font-display text-[40px] md:text-[80px] leading-[0.9] tracking-tighter mb-6 uppercase">
          Editorial
        </h1>
        <p className="editorial-anim font-body text-[14px] md:text-[18px] text-brand-textMuted max-w-[600px] font-medium leading-relaxed">
          Exploring the intersection of brutalist architecture, digital void, and avant-garde streetwear. This is the visual journal of Dripkart.
        </p>
      </header>

      <div className="space-y-24 md:space-y-32">
        <article className="editorial-anim group cursor-pointer">
          <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-brand-bgSecondary overflow-hidden mb-8 relative">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" 
              alt="Cyberpunk street" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
            <div className="max-w-[700px]">
              <p className="font-body text-[10px] md:text-[12px] text-brand-accentColor font-bold tracking-[0.3em] uppercase mb-4">Volume I // The Void</p>
              <h2 className="font-display text-[28px] md:text-[48px] uppercase tracking-tighter leading-none mb-6">Embracing the Digital Shadows</h2>
              <p className="font-body text-[14px] md:text-[16px] text-brand-textSecondary leading-relaxed">
                Modern streetwear is no longer just about fabric—it is about the statement made in the silence of the digital ether. Our latest collection draws heavy inspiration from brutalist web design and the stark contrast of neon against pitch black.
              </p>
            </div>
            <button className="px-8 py-4 bg-transparent border border-brand-textPrimary text-brand-textPrimary hover:bg-brand-textPrimary hover:text-brand-bgPrimary transition-colors uppercase tracking-[0.2em] font-bold text-[12px] whitespace-nowrap">
              Read Manifesto
            </button>
          </div>
        </article>

        <article className="editorial-anim group cursor-pointer">
          <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-brand-bgSecondary overflow-hidden mb-8 relative">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=2070&auto=format&fit=crop" 
              alt="Concrete brutalism" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
            <div className="max-w-[700px]">
              <p className="font-body text-[10px] md:text-[12px] text-brand-accentColor font-bold tracking-[0.3em] uppercase mb-4">Volume II // Structure</p>
              <h2 className="font-display text-[28px] md:text-[48px] uppercase tracking-tighter leading-none mb-6">Concrete Foundations</h2>
              <p className="font-body text-[14px] md:text-[16px] text-brand-textSecondary leading-relaxed">
                Stripping away the excess to reveal the raw, unpolished truth. We examine how architectural brutalism informs silhouette and structure in high-end outerwear.
              </p>
            </div>
            <button className="px-8 py-4 bg-transparent border border-brand-textPrimary text-brand-textPrimary hover:bg-brand-textPrimary hover:text-brand-bgPrimary transition-colors uppercase tracking-[0.2em] font-bold text-[12px] whitespace-nowrap">
              Read Manifesto
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
