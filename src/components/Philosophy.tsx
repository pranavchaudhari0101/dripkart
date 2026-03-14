import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      });

      tl.from('.ph-label', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
        .from('.ph-heading', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.ph-desc', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .from('.ph-cta', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-brand-bgSecondary py-[60px] px-6 md:px-12 pb-20 text-center flex flex-col items-center">
      <p className="ph-label font-body font-black text-[12px] uppercase tracking-[0.3em] text-brand-textPrimary mb-7">Our Manifesto</p>
      
      <h2 className="ph-heading font-display text-[clamp(40px,6vw,72px)] leading-[1.15] mb-7">
        <span className="font-light italic">Comfort</span> <span className="font-semibold">and</span> <span className="font-light italic">Confidence</span>
      </h2>
      
      <p className="ph-desc font-body font-light text-[14px] text-brand-textMuted max-w-[420px] leading-[1.8] mb-8">
        Every piece in our collection is designed to make you feel unstoppable. Premium fabrics, clean cuts, and the kind of drip that speaks before you do.
      </p>
      
      <a href="#shop" className="ph-cta font-body font-medium text-[11px] uppercase tracking-[0.15em] text-brand-textPrimary pb-1 border-b border-brand-textPrimary/20 transition-opacity duration-300 hover:opacity-60">
        Shop All Collections →
      </a>
    </section>
  );
}
