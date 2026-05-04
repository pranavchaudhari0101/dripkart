import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-season', { y: 30, opacity: 0, duration: 0.8, delay: 0.3 })
        .from('.hero-desc', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-cta', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-top-right p', { y: 20, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=0.6')
        .from('.hero-wordmark', { y: 60, opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=0.8');

      gsap.to('.hero-model', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-end"
      style={{ background: 'radial-gradient(ellipse at top right, #2a4a40 0%, #1a2c2a 50%, #0f1e1b 100%)' }}
    >
      {/* Noise filter background */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none z-[1]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', backgroundSize: '128px 128px' }}
      />

      <img 
        src="/hero-model.png" 
        alt="Fashion model"
        fetchPriority="high"
        decoding="async"
        className="hero-model absolute right-[-5%] md:right-[5%] bottom-0 h-[70%] md:h-[85%] z-[2] object-contain object-bottom"
      />

      <div className="relative z-[3] px-6 md:px-12 pb-[120px] md:pb-[160px] max-w-[340px]">
        <p className="hero-season font-body font-medium text-[11px] uppercase tracking-[0.2em] text-brand-accentColor mb-5">
          NEW SEASON 2026
        </p>
        <p className="hero-desc font-display font-medium text-[16px] text-white leading-[1.8] mb-8 max-w-[280px] uppercase tracking-wide">
          Curating the next generation of street-ready silhouettes. A study in form, function, and aesthetic.
        </p>
        
        <a href="#shop" className="hero-cta inline-block px-8 py-4 border-2 border-white font-body font-black text-[12px] uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-brand-accentColor hover:border-brand-accentColor hover:text-brand-textPrimary shadow-2xl">
          Enter The Archives
        </a>
      </div>

      <div className="hero-top-right absolute bottom-12 right-6 md:right-12 hidden md:block">
        <p className="font-display font-black italic text-[14px] text-white leading-[1.6] uppercase tracking-widest">Exclusive &</p>
        <p className="font-display font-black italic text-[14px] text-white leading-[1.6] uppercase tracking-widest">Trending Collection</p>
      </div>

      <div className="hero-wordmark absolute bottom-[-10px] left-6 md:left-12 z-[4] font-display text-[clamp(40px,12vw,72px)] md:text-[clamp(72px,10vw,160px)] font-semibold text-white leading-none pointer-events-none whitespace-nowrap">
        DRIP<span className="font-light italic text-brand-accentColor">ka</span>Rt
      </div>
    </section>
  );
}
