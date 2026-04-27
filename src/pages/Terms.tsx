import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Terms() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.policy-anim',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-[160px] pb-24 px-6 md:px-12 max-w-[800px] mx-auto bg-brand-bgPrimary text-brand-textPrimary font-body">
      <h1 className="policy-anim font-display text-[32px] md:text-[56px] uppercase tracking-tighter mb-4">Terms of Service</h1>
      <p className="policy-anim text-[12px] uppercase tracking-[0.2em] text-brand-accentColor font-bold mb-16">Last Updated: October 2026</p>

      <div className="space-y-12 text-brand-textSecondary text-[14px] md:text-[16px] leading-relaxed">
        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            By accessing the Dripkart platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must immediately disconnect from the platform. We reserve the right to modify these terms at any time without explicit notification.
          </p>
        </section>

        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">2. Intellectual Property</h2>
          <p className="mb-4">
            All visual aesthetics, typography, garments, digital assets, and code on this platform are the exclusive property of Dripkart and the Collective. Unauthorized reproduction, modification, or distribution of our aesthetics is strictly prohibited and will be met with immediate legal action.
          </p>
        </section>

        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">3. Purchases & Availability</h2>
          <p className="mb-4">
            All garment drops are limited and subject to availability. We reserve the right to refuse service to anyone, limit quantities purchased per person, or cancel orders at our sole discretion. In the event of a cancellation, voided transactions will be fully refunded to the original payment node.
          </p>
        </section>

        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">4. Resale & Distribution</h2>
          <p className="mb-4">
            Garments purchased from Dripkart are intended for personal use. We actively monitor and ban known resellers and bots. Accounts suspected of mass purchasing for secondary market exploitation will be permanently banned from the platform.
          </p>
        </section>

        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">5. Governing Law</h2>
          <p className="mb-4">
            These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts located in Mumbai, Maharashtra.
          </p>
        </section>
      </div>
    </div>
  );
}
