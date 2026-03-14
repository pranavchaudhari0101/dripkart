import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import gsap from 'gsap';

export function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-UNKNOWN';
  const [status, setStatus] = useState<'PENDING' | 'PAID' | 'FAILED'>('PENDING');

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.from('.success-anim', { 
      y: 20, 
      opacity: 0, 
      duration: 0.8, 
      stagger: 0.1, 
      ease: 'power3.out' 
    });

    if (orderId === 'ORD-UNKNOWN') return;

    let pollCount = 0;
    // Poll for payment status
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/payments/status/${orderId}`);
        if (res.data.status === 'PAID') {
          setStatus('PAID');
          clearInterval(interval);
        } else if (res.data.status === 'FAILED') {
          setStatus('FAILED');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Polling error', err);
      }
      
      pollCount++;
      if (pollCount > 20) { // Stop after ~1 minute
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="min-h-screen pt-[160px] pb-20 px-6 flex flex-col items-center justify-center text-center bg-brand-bgPrimary">
      {status === 'PAID' ? (
        <>
          <div className="success-anim w-24 h-24 bg-brand-accentColor rounded-full flex items-center justify-center mb-8 mx-auto animate-bounce">
            <Check size={48} className="text-brand-textPrimary" />
          </div>
          <h1 className="success-anim font-display text-[48px] md:text-[64px] leading-tight mb-4">
            Payment Successful
          </h1>
          <p className="success-anim font-body text-brand-textMuted text-[16px] max-w-[400px] mx-auto mb-8">
            Your drip is secured and being prepared for dispatch.
          </p>
        </>
      ) : status === 'FAILED' ? (
        <>
          <div className="success-anim w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8 mx-auto">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          <h1 className="success-anim font-display text-[48px] md:text-[64px] leading-tight mb-4">
            Payment Failed
          </h1>
          <p className="success-anim font-body text-brand-textMuted text-[16px] max-w-[400px] mx-auto mb-8">
            Something went wrong with your transaction. Please try again or contact support.
          </p>
        </>
      ) : (
        <>
          <div className="success-anim w-24 h-24 bg-brand-bgSecondary rounded-full flex items-center justify-center mb-8 mx-auto">
            <Loader2 size={48} className="text-brand-textPrimary animate-spin" />
          </div>
          <h1 className="success-anim font-display text-[48px] md:text-[64px] leading-tight mb-4">
            Verifying Payment
          </h1>
          <p className="success-anim font-body text-brand-textMuted text-[16px] max-w-[400px] mx-auto mb-8">
            Please wait while we confirm your transaction with PhonePe.
          </p>
        </>
      )}

      <div className="success-anim bg-white px-10 py-8 mb-12 border border-gray-200 shadow-lg text-center rounded-sm">
        <p className="font-body text-[12px] uppercase tracking-[0.4em] text-brand-textPrimary mb-2 font-black">Manifest Reference</p>
        <p className="font-display text-[28px] font-black tracking-tighter text-brand-accentColor bg-black px-4 py-2 w-fit mx-auto">{orderId}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 success-anim">
        <Link 
          to="/order-tracking" 
          state={{ orderId }}
          className="px-10 py-5 bg-black text-white font-body font-black text-[12px] uppercase tracking-[0.35em] hover:bg-brand-accentColor hover:text-black transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center"
        >
          Audit Journey
        </Link>
        <Link 
          to="/shop" 
          className="px-10 py-5 border-2 border-black text-black font-body font-black text-[12px] uppercase tracking-[0.35em] hover:bg-black hover:text-white transition-all active:scale-[0.98] shadow-xl flex items-center justify-center"
        >
          Return to Archives
        </Link>
      </div>
    </div>
  );
}
