import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Editorial() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.editorial-panel').forEach((panel: any, i) => {
        gsap.from(panel, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mx-6 md:mx-12 mb-12 md:mb-20">
      
      {/* Dark Panel */}
      <div className="editorial-panel py-[60px] px-10 md:px-14 min-h-[400px] md:min-h-[520px] relative flex flex-col justify-end overflow-hidden
        bg-gradient-to-br from-[#1a2c2a] to-[#0d1a18]">
        <span className="absolute top-5 right-7 font-display font-black text-[120px] leading-none pointer-events-none text-white/5 select-none">
          CORE
        </span>
        <h3 className="font-display text-[40px] md:text-[52px] leading-[1.1] mb-6 text-white uppercase tracking-tighter">Essential Elements</h3>
        <p className="font-body text-[15px] text-white leading-relaxed mb-10 max-w-[400px] font-bold uppercase tracking-wide">
          A collection of fundamental silhouettes designed to be the bedrock of your rotation. Heavyweight cotton and minimal branding.
        </p>
        <a href="#shop" className="inline-block font-body font-black text-[12px] uppercase tracking-[0.3em] pb-1 border-b-2 border-brand-accentColor text-white transition-all duration-300 self-start hover:text-brand-accentColor">
          Audit Collection
        </a>
      </div>

      <div className="relative group overflow-hidden bg-brand-bgSecondary p-8 md:p-14 flex flex-col justify-end min-h-[500px] border-l border-brand-textPrimary/10">
        <span className="absolute top-5 right-7 font-display font-black text-[120px] leading-none pointer-events-none text-brand-textPrimary select-none opacity-5">
          LVL
        </span>
        <p className="font-body font-black text-[12px] uppercase tracking-[0.3em] mb-5 text-brand-textPrimary">
          Next Horizon
        </p>
        <h3 className="font-display text-[44px] md:text-[56px] leading-[1.1] mb-6 uppercase tracking-tighter text-brand-textPrimary">Avant-Garde Theory</h3>
        <p className="font-body text-[15px] text-brand-textPrimary leading-relaxed mb-10 max-w-[400px] font-bold uppercase tracking-wide">
          Pushing the boundaries of streetwear through complex paneling and technical materials. A study in architectural wear.
        </p>
        <a href="#shop" className="inline-block font-body font-black text-[12px] uppercase tracking-[0.3em] pb-1 border-b-2 border-brand-textPrimary text-brand-textPrimary transition-all duration-300 self-start hover:text-brand-accentColor hover:border-brand-accentColor">
          Trace Manifest
        </a>
      </div>

    </section>
  );
}
