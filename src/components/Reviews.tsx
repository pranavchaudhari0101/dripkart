import { Star } from 'lucide-react';

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: '1',
    user: 'Aryan S.',
    rating: 5,
    date: '2 Oct 2025',
    comment: 'The quality of the cotton is insane. Definitely premium stuff. The fit is perfectly oversized just like I wanted.',
    verified: true
  },
  {
    id: '2',
    user: 'Priya K.',
    rating: 4,
    date: '15 Sep 2025',
    comment: 'Love the color and the silhouette. Only wish the delivery was a bit faster, but the product is worth the wait.',
    verified: true
  },
  {
    id: '3',
    user: 'Vikram M.',
    rating: 5,
    date: '28 Aug 2025',
    comment: 'Project Delta drops are getting better every time. This hoodie is a masterpiece.',
    verified: true
  }
];

export function Reviews() {
  return (
    <section className="mt-20 pt-20 border-t border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="font-display text-[32px] md:text-[40px] italic mb-2">Customer Feedback</h2>
          <div className="flex items-center gap-2">
            <div className="flex text-brand-accentColor">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="font-body text-[14px] font-bold">4.9 / 5.0 — Based on 128 reviews</span>
          </div>
        </div>
        <button className="h-14 px-8 border border-brand-textPrimary font-body text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all">
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {reviews.map((r) => (
          <div key={r.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-body text-[13px] font-bold">{r.user}</span>
              <span className="font-body text-[11px] text-brand-textMuted">{r.date}</span>
            </div>
            <div className="flex text-brand-accentColor">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < r.rating ? "currentColor" : "none"} 
                  stroke={i < r.rating ? "none" : "currentColor"} 
                  strokeWidth={2} 
                />
              ))}
            </div>
            <p className="font-body text-[14px] leading-relaxed text-brand-textMuted italic">
              "{r.comment}"
            </p>
            {r.verified && (
              <div className="flex items-center gap-1.5 text-green-600 font-body text-[10px] font-bold uppercase tracking-wider">
                <div className="w-1 h-1 bg-green-600 rounded-full" />
                Verified Purchase
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
