import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Collective() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.collec-anim',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const members = [
    { name: "Pranav Chaudhari", role: "Creative Director", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop" },
    { name: "Aria Vance", role: "Lead Designer", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop" },
    { name: "Marcus Wei", role: "Technical Architect", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1287&auto=format&fit=crop" },
    { name: "Elena Rostova", role: "Visual Merchandiser", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1287&auto=format&fit=crop" }
  ];

  return (
    <div ref={containerRef} className="min-h-screen pt-[160px] pb-24 px-6 md:px-12 max-w-[1200px] mx-auto bg-brand-bgPrimary text-brand-textPrimary">
      <header className="mb-20">
        <h1 className="collec-anim font-display text-[40px] md:text-[80px] leading-[0.9] tracking-tighter mb-6 uppercase">
          The Collective
        </h1>
        <p className="collec-anim font-body text-[14px] md:text-[18px] text-brand-textMuted max-w-[600px] font-medium leading-relaxed">
          We are an anonymous syndicate of designers, engineers, and cultural theorists. We build garments and digital experiences that challenge the status quo.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map((member, i) => (
          <div key={i} className="collec-anim group cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden bg-brand-bgSecondary mb-4">
              <img 
                src={member.img} 
                alt={member.name} 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
              />
            </div>
            <h3 className="font-display font-bold text-[20px] uppercase tracking-tighter mb-1">{member.name}</h3>
            <p className="font-body text-[12px] uppercase tracking-[0.2em] text-brand-accentColor font-bold">{member.role}</p>
          </div>
        ))}
      </div>

      <div className="mt-32 collec-anim border-t border-brand-border pt-16">
        <h2 className="font-display text-[28px] md:text-[40px] uppercase tracking-tighter mb-6">Join the Void</h2>
        <p className="font-body text-[14px] md:text-[16px] text-brand-textSecondary max-w-[500px] mb-8">
          We are always looking for architects of the new aesthetic. If you bleed neon and dream in monochrome, send your portfolio to the abyss.
        </p>
        <button className="px-8 py-4 bg-brand-textPrimary text-brand-bgPrimary font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-brand-accentColor transition-colors">
          Submit Portfolio
        </button>
      </div>
    </div>
  );
}
