import { Fragment } from 'react';

export function Ticker() {
  const items = [
    "New Arrivals", "Premium Streetwear", "Free Shipping Over ₹1999", "Drip Season is Here", "Limited Drops",
    "New Arrivals", "Premium Streetwear", "Free Shipping Over ₹1999", "Drip Season is Here", "Limited Drops",
    "New Arrivals", "Premium Streetwear", "Free Shipping Over ₹1999", "Drip Season is Here", "Limited Drops",
  ];

  return (
    <section className="bg-brand-accentColor h-[45px] overflow-hidden flex items-center relative z-[5]" aria-hidden="true">
      <div className="flex whitespace-nowrap animate-ticker-scroll">
        {items.map((text, i) => (
          <Fragment key={i}>
            <span className="font-display font-semibold italic text-[14px] text-brand-textPrimary px-4 shrink-0">
              {text}
            </span>
            <span className="font-display font-semibold italic text-[14px] text-brand-textPrimary px-4 shrink-0">
              ✦
            </span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
