import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-reveal > *', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
        }
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-black text-white py-20 px-6 md:px-12 border-t border-white/10">
      <div className="footer-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 md:gap-10 mb-12">
        
        {/* Brand Col */}
        <div>
          <div className="font-display font-semibold text-[32px] mb-3">
            DRIP<span className="font-light italic text-brand-accentColor">ka</span>Rt
          </div>
          <p className="font-display font-medium italic text-[14px] text-white/60 leading-[1.6]">
            Defining the aesthetic boundary.
          </p>
        </div>
        
        <div className="space-y-6">
          <h4 className="font-display text-[16px] font-bold uppercase tracking-[0.2em] mb-8">Navigation</h4>
          <div className="flex flex-col gap-4">
            <Link to="/shop" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Archives</Link>
            <Link to="/collections" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Latest Drop</Link>
            <Link to="/editorial" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Editorial</Link>
            <Link to="/collective" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Collective</Link>
          </div>
        </div>

        <div className="space-y-6">
          <p className="font-body font-black text-[12px] uppercase tracking-[0.3em] text-brand-accentColor mb-5">Support</p>
          <div className="flex flex-col gap-4">
            <Link to="/order-tracking" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Trace Manifest</Link>
            <Link to="/shipping" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Shipping Protocol</Link>
            <Link to="/privacy" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Terms of Service</Link>
          </div>
        </div>

        <div className="space-y-6">
          <p className="font-body font-black text-[12px] uppercase tracking-[0.3em] text-brand-accentColor mb-5">Connect</p>
          <div className="flex flex-col gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Instagram</a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Discord</a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">X/Twitter</a>
            <a href="https://spotify.com" target="_blank" rel="noreferrer" className="font-body font-bold text-[13px] text-white hover:text-brand-accentColor transition-colors">Spotify</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <p className="font-body text-[12px] text-white font-black uppercase tracking-widest">© 2026 DRIPkaRt. Established in the Void.</p>
        <p className="font-body text-[12px] text-white font-black uppercase tracking-widest">Authored with ✦ and Heavy CSS.</p>
      </div>
    </footer>
  );
}
