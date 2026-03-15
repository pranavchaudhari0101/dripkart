import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.about-heading span', { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' });
      gsap.from('.about-text', { y: 40, opacity: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' });
      gsap.from('.about-img', { scale: 1.1, opacity: 0, duration: 1.5, ease: 'power3.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-brand-bgPrimary min-h-screen pt-[160px] pb-24">
      <div className="px-6 md:px-12 max-w-[1200px] mx-auto">
        <h1 className="about-heading font-display text-[clamp(60px,10vw,140px)] leading-[0.9] font-medium mb-12 overflow-hidden flex flex-col">
          <span>We are</span>
          <span className="italic self-end pr-8 md:pr-20 text-brand-accentColor drop-shadow-sm">DRIPkaRt.</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="about-img w-full pt-[120%] bg-brand-bgSecondary relative overflow-hidden">
            <img src="/hero-model.png" alt="Brand Story" className="absolute inset-0 w-full h-full object-cover object-top" />
          </div>
          
          <div className="about-text">
            <p className="font-body font-medium text-[11px] uppercase tracking-[0.2em] mb-6 text-brand-textMuted">The Story</p>
            <h3 className="font-display text-[32px] md:text-[40px] leading-[1.2] mb-8">
              Born from the streets.<br/>Crafted for the bold.
            </h3>
            <div className="space-y-6 font-body text-[15px] leading-[1.8] text-brand-textMuted text-justify">
              <p>
                DRIPkaRt started with a simple belief: streetwear shouldn't just be clothes; it should be an attitude. We blend high-end fashion sensibilities with raw urban energy to create pieces that speak for themselves.
              </p>
              <p>
                Every fabric is meticulously sourced. Every silhouette is obsessively refined. We don't chase trends—we define our own language.
              </p>
              <p className="text-brand-textPrimary font-medium italic mt-8 text-[18px]">
                "Premium streetwear for those who refuse to blend in."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
