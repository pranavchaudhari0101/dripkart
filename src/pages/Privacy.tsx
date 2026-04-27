import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Privacy() {
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
      <h1 className="policy-anim font-display text-[32px] md:text-[56px] uppercase tracking-tighter mb-4">Privacy Policy</h1>
      <p className="policy-anim text-[12px] uppercase tracking-[0.2em] text-brand-accentColor font-bold mb-16">Last Updated: October 2026</p>

      <div className="space-y-12 text-brand-textSecondary text-[14px] md:text-[16px] leading-relaxed">
        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">1. Data Assimilation</h2>
          <p className="mb-4">
            Dripkart processes minimal telemetry required to facilitate your aesthetic acquisition. We assimilate data you voluntarily provide during checkout, account creation, or newsletter subscription. This includes encrypted credentials, geographic coordinates for shipping, and contact nodes.
          </p>
        </section>

        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">2. The Cookie Matrix</h2>
          <p className="mb-4">
            Our platform deploys specialized cookies to maintain session continuity, track cart configurations, and analyze traffic patterns through the void. By interfacing with Dripkart, you consent to this temporary data storage. You may purge cookies via your browser's internal protocols, though this may destabilize your browsing experience.
          </p>
        </section>

        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">3. Third-Party Protocols</h2>
          <p className="mb-4">
            We interface with encrypted third-party gateways (such as PhonePe) to process financial transactions securely. Dripkart does not store raw credit card data on our own servers. Your financial data is securely tokenized and handled strictly by the payment gateway's secure nodes.
          </p>
        </section>

        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">4. Right to Erasure</h2>
          <p className="mb-4">
            You maintain full sovereignty over your digital footprint. To request the complete eradication of your data from our servers, transmit a formal request to support@dripkart.com. Note that transactional records are preserved for legal compliance.
          </p>
        </section>
      </div>
    </div>
  );
}
