import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Shipping() {
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
      <h1 className="policy-anim font-display text-[32px] md:text-[56px] uppercase tracking-tighter mb-4">Shipping Protocol</h1>
      <p className="policy-anim text-[12px] uppercase tracking-[0.2em] text-brand-accentColor font-bold mb-16">Last Updated: October 2026</p>

      <div className="space-y-12 text-brand-textSecondary text-[14px] md:text-[16px] leading-relaxed">
        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">1. Dispatch Timeline</h2>
          <p className="mb-4">
            All standard orders are processed and dispatched from our primary fulfillment node within 24-48 hours of payment verification. Exclusive drops and limited edition garments may require an extended processing protocol of up to 5 business days due to intense volume.
          </p>
        </section>

        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">2. Transit Zones & Vectors</h2>
          <p className="mb-4">
            We currently deploy shipments globally. Domestic vectors (India) typically resolve within 3-5 business days. International vectors depend heavily on local customs clearance protocols and usually resolve within 7-14 business days.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 text-[13px] text-brand-textMuted">
            <li>Express Protocol: 1-2 Business Days (Domestic Only)</li>
            <li>Standard Protocol: 3-5 Business Days</li>
            <li>Void Protocol (International): 7-14 Business Days</li>
          </ul>
        </section>

        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">3. Trace Manifest</h2>
          <p className="mb-4">
            Upon dispatch, a Trace Manifest (tracking link) is automatically transmitted to the email address provided during checkout. You can also monitor your order's transit status in real-time via the "Trace Manifest" portal in our footer.
          </p>
        </section>

        <section className="policy-anim">
          <h2 className="font-display text-[20px] text-brand-textPrimary uppercase tracking-tight mb-4">4. Customs & Import Tariffs</h2>
          <p className="mb-4">
            For international vectors, the recipient is strictly responsible for any local customs duties, taxes, or import tariffs. Dripkart does not artificially deflate invoice values to circumvent local taxation protocols. Refusal to pay customs will result in the package being abandoned in the void, with no refund issued.
          </p>
        </section>
      </div>
    </div>
  );
}
