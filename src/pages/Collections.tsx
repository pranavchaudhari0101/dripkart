import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const collections = [
  { title: "ESSENTIALS '26", desc: "The foundational pieces every wardrobe needs. Clean cuts, heavyweight fabrics, permanent drip.", img: "/src/assets/hero-model.png" },
  { title: "NIGHT RUN", desc: "Reflective detailing. Technical fabrics. Built for the city after dark.", img: "/src/assets/hoodie.png" },
  { title: "CORE CARGO", desc: "Utility re-imagined. 3D pockets, durable twill, and a silhouette that commands attention.", img: "/src/assets/cargo-shirt.png" },
];

export function Collections() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.coll-header', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' });
      
      gsap.utils.toArray('.coll-section').forEach((section: any) => {
        gsap.from(section, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-[140px] pb-24 bg-brand-bgPrimary min-h-screen">
      <div className="coll-header text-center mb-20 px-6">
        <h1 className="font-display text-[48px] md:text-[72px] italic leading-none mb-4">Collections</h1>
        <p className="font-body text-brand-textMuted max-w-[400px] mx-auto">Curated drops representing the pinnacle of DRIPkaRt's design philosophy.</p>
      </div>

      <div className="flex flex-col gap-24 md:gap-40">
        {collections.map((coll, i) => (
          <div key={i} className={`coll-section flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 px-6 md:px-12 max-w-[1400px] mx-auto`}>
            
            <div className="w-full md:w-1/2 aspect-[4/5] bg-white overflow-hidden group rounded-sm">
              <img src={coll.img} alt={coll.title} className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110" />
            </div>

            <div className="w-full md:w-1/2 max-w-[480px]">
              <span className="font-display text-[72px] text-brand-accentColor leading-none block border-b-2 border-brand-textPrimary/20 pb-4 mb-8 -ml-4 font-black italic">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="font-display text-[48px] md:text-[64px] leading-tight mb-6 uppercase tracking-tighter text-brand-textPrimary">
                {coll.title}
              </h2>
              <p className="font-body text-[16px] text-brand-textPrimary leading-relaxed mb-10 font-bold uppercase tracking-wide">
                {coll.desc}
              </p>
              <a href="/shop" className="inline-block px-8 py-4 border border-brand-textPrimary font-body font-medium text-[11px] uppercase tracking-[0.2em] hover:bg-brand-textPrimary hover:text-white transition-colors">
                Explore Collection
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
