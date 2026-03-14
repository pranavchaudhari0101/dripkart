import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { Search, Package, Truck, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

export function OrderTracking() {
  const location = useLocation();
  const [orderId, setOrderId] = useState(location.state?.orderId || '');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    gsap.from('.track-anim', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 });
    if (orderId) {
      handleTrack();
    }
  }, []);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId) return;
    
    setIsLoading(true);
    setError('');
    setStatus(null);

    try {
      const res = await api.get(`/payments/status/${orderId}`);
      setStatus(res.data.status); // PENDING, PAID, FAILED
    } catch (err) {
      setError('Order not found or invalid ID. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStep = () => {
    if (status === 'PENDING' || status === 'FAILED') return 0;
    if (status === 'PAID') return 1;
    // For future expansion when shipping status is integrated
    if (status === 'SHIPPED') return 2;
    if (status === 'DELIVERED') return 3;
    return 0;
  };

  const currentStep = getStatusStep();

  return (
    <div className="min-h-screen pt-[140px] pb-20 px-6 flex flex-col md:items-center bg-brand-bgPrimary">
      <div className="w-full max-w-[600px] mx-auto">
        
        <div className="text-center mb-12 track-anim">
          <h1 className="font-display text-[40px] md:text-[48px] mb-2">Track Your Order</h1>
          <p className="font-body text-brand-textMuted text-[14px]">Enter your order ID below to see the current status of your shipment.</p>
        </div>

        <form onSubmit={handleTrack} className="track-anim flex gap-2 mb-12">
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. ORD-12345"
            className="flex-1 p-4 bg-transparent border border-gray-300 font-body text-[14px] outline-none focus:border-brand-accentColor uppercase transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !orderId}
            className="px-6 bg-brand-textPrimary text-white hover:bg-brand-accentColor hover:text-brand-textPrimary transition-colors disabled:opacity-50"
          >
            <Search size={20} />
          </button>
        </form>

        {error && (
          <div className="track-anim bg-red-50 text-red-600 p-4 font-body text-[13px] text-center mb-8 border border-red-100">
            {error}
          </div>
        )}

        {status && (
          <div className="track-anim bg-white p-8 border border-gray-200 shadow-lg rounded-sm">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-body font-medium text-[16px]">Order: {orderId}</h2>
              <span className={`px-3 py-1 text-[11px] font-medium tracking-wider uppercase ${
                status === 'PAID' ? 'bg-green-100 text-green-700' :
                status === 'FAILED' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {status}
              </span>
            </div>

            {/* Timeline */}
            <div className="relative pt-4">
              {/* Line behind icons */}
              <div className="absolute top-[28px] left-6 right-6 h-[4px] bg-black z-0"></div>
              <div 
                className="absolute top-[28px] left-6 h-[2px] bg-brand-accentColor z-0 transition-all duration-700"
                style={{ width: `${currentStep * 33.33}%` }}
              ></div>

              <div className="flex justify-between relative z-10">
                
                {/* Step 0: Order Placed */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${currentStep >= 0 ? 'bg-brand-textPrimary text-brand-accentColor' : 'bg-gray-100 text-gray-400'}`}>
                    <Package size={18} />
                  </div>
                  <span className={`font-body text-[11px] uppercase tracking-wider ${currentStep >= 0 ? 'text-brand-textPrimary font-medium' : 'text-brand-textMuted'}`}>Placed</span>
                </div>

                {/* Step 1: Payment Confirmed */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${currentStep >= 1 ? 'bg-brand-textPrimary text-brand-accentColor' : 'bg-gray-100 text-gray-400'}`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <span className={`font-body text-[11px] uppercase tracking-wider ${currentStep >= 1 ? 'text-brand-textPrimary font-medium' : 'text-brand-textMuted'}`}>Paid</span>
                </div>

                {/* Step 2: Shipped */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${currentStep >= 2 ? 'bg-brand-textPrimary text-brand-accentColor' : 'bg-gray-100 text-gray-400'}`}>
                    <Truck size={18} />
                  </div>
                  <span className={`font-body text-[11px] uppercase tracking-wider ${currentStep >= 2 ? 'text-brand-textPrimary font-medium' : 'text-brand-textMuted'}`}>Shipped</span>
                </div>

                {/* Step 3: Delivered */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${currentStep >= 3 ? 'bg-brand-textPrimary text-brand-accentColor' : 'bg-gray-100 text-gray-400'}`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <span className={`font-body text-[11px] uppercase tracking-wider ${currentStep >= 3 ? 'text-brand-textPrimary font-medium' : 'text-brand-textMuted'}`}>Delivered</span>
                </div>

              </div>
            </div>

            {status === 'FAILED' && (
              <p className="mt-8 text-center text-red-500 font-body text-[13px]">
                Payment for this order failed. Please contact support.
              </p>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
