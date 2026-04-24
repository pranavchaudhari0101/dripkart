import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, RotateCcw, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

const STEPS = [
  { key: 'PROCESSING', label: 'Order Placed', icon: Package, desc: 'Your order has been received and is being prepared' },
  { key: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled', icon: Clock, desc: 'Courier pickup has been scheduled' },
  { key: 'SHIPPED', label: 'Shipped', icon: ArrowRight, desc: 'Package has been picked up by courier' },
  { key: 'IN_TRANSIT', label: 'In Transit', icon: Truck, desc: 'Your package is on its way' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin, desc: 'Package is out for delivery to your address' },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Package has been delivered successfully' },
];

function getStepIndex(status: string) {
  const idx = STEPS.findIndex(s => s.key === status);
  if (status === 'RETURN_INITIATED' || status === 'RETURNED') return -1; // special case
  return idx >= 0 ? idx : 0;
}

export function OrderTracking() {
  const location = useLocation();
  const [orderId, setOrderId] = useState(location.state?.orderId || '');
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    gsap.from('.track-anim', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 });
    if (orderId) handleTrack();
  }, []);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId) return;
    setIsLoading(true); setError(''); setOrderData(null);
    try {
      const res = await api.get(`/orders/${orderId}/track`);
      setOrderData(res.data);
    } catch (err: any) {
      // Fallback: try payment status endpoint
      try {
        const res = await api.get(`/payments/status/${orderId}`);
        setOrderData({ id: orderId, paymentStatus: res.data.status, deliveryStatus: 'PROCESSING' });
      } catch {
        setError('Order not found or invalid ID. Please check and try again.');
      }
    } finally { setIsLoading(false); }
  };

  const currentStep = orderData ? getStepIndex(orderData.deliveryStatus) : -1;
  const isReturned = orderData && ['RETURN_INITIATED', 'RETURNED'].includes(orderData.deliveryStatus);

  return (
    <div className="min-h-screen pt-[140px] pb-20 px-6 flex flex-col md:items-center bg-brand-bgPrimary">
      <div className="w-full max-w-[700px] mx-auto">

        <div className="text-center mb-12 track-anim">
          <h1 className="font-display text-[40px] md:text-[48px] mb-2">Track Your Order</h1>
          <p className="font-body text-brand-textMuted text-[14px]">Enter your order ID below to see the current status of your shipment.</p>
        </div>

        <form onSubmit={handleTrack} className="track-anim flex gap-2 mb-12">
          <input type="text" required value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g. ord_abc123..."
            className="flex-1 p-4 bg-transparent border border-gray-300 font-body text-[14px] outline-none focus:border-brand-accentColor uppercase transition-all" />
          <button type="submit" disabled={isLoading || !orderId}
            className="px-6 bg-brand-textPrimary text-white hover:bg-brand-accentColor hover:text-brand-textPrimary transition-colors disabled:opacity-50">
            <Search size={20} />
          </button>
        </form>

        {error && (
          <div className="track-anim bg-red-50 text-red-600 p-4 font-body text-[13px] text-center mb-8 border border-red-100">{error}</div>
        )}

        {orderData && (
          <div className="track-anim space-y-8">

            {/* Order Summary Card */}
            <div className="bg-white p-8 border border-gray-200 shadow-lg rounded-sm">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div>
                  <p className="font-body text-[10px] text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="font-body text-[16px] font-bold text-brand-textPrimary">{orderData.id}</p>
                </div>
                <div className="flex gap-3">
                  <span className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                    orderData.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                    orderData.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {orderData.paymentGateway === 'cod' ? 'COD' : orderData.paymentStatus}
                  </span>
                  <span className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                    orderData.deliveryStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    isReturned ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {orderData.deliveryStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* AWB & Courier Info */}
              {(orderData.awbCode || orderData.courierName) && (
                <div className="flex flex-wrap gap-6 p-4 bg-gray-50 border border-gray-100 mb-8">
                  {orderData.awbCode && (
                    <div>
                      <p className="font-body text-[9px] text-gray-400 uppercase tracking-widest mb-1">AWB / Tracking No.</p>
                      <p className="font-body text-[16px] font-black text-brand-accentColor bg-black px-3 py-1 inline-block">{orderData.awbCode}</p>
                    </div>
                  )}
                  {orderData.courierName && (
                    <div>
                      <p className="font-body text-[9px] text-gray-400 uppercase tracking-widest mb-1">Courier Partner</p>
                      <p className="font-body text-[14px] font-bold">{orderData.courierName}</p>
                    </div>
                  )}
                  {orderData.trackingUrl && (
                    <div className="ml-auto self-center">
                      <a href={orderData.trackingUrl} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 bg-brand-textPrimary text-white font-body text-[10px] uppercase tracking-widest font-bold hover:bg-brand-accentColor hover:text-brand-textPrimary transition-colors">
                        Track on Courier Site →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Return Status */}
              {isReturned && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 mb-8">
                  <RotateCcw size={20} className="text-red-500" />
                  <div>
                    <p className="font-body text-[13px] font-bold text-red-700">
                      {orderData.deliveryStatus === 'RETURN_INITIATED' ? 'Return Initiated' : 'Return Completed'}
                    </p>
                    <p className="font-body text-[11px] text-red-500">
                      {orderData.deliveryStatus === 'RETURN_INITIATED' ? 'Your order is being returned to the warehouse.' : 'The order has been returned successfully.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              {!isReturned && (
                <div className="relative pt-4">
                  {/* Vertical line (mobile) / Horizontal line (desktop) */}
                  <div className="hidden md:block">
                    <div className="absolute top-[28px] left-6 right-6 h-[3px] bg-gray-200 z-0"></div>
                    <div className="absolute top-[28px] left-6 h-[3px] bg-brand-accentColor z-0 transition-all duration-1000"
                      style={{ width: `${Math.max(0, currentStep) / (STEPS.length - 1) * (100 - 5)}%` }}></div>

                    <div className="flex justify-between relative z-10">
                      {STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                          <div key={step.key} className="flex flex-col items-center gap-3 w-[16%]">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                              isCurrent ? 'bg-brand-accentColor text-brand-textPrimary scale-110 shadow-lg ring-4 ring-brand-accentColor/20' :
                              isActive ? 'bg-brand-textPrimary text-brand-accentColor' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              <Icon size={20} />
                            </div>
                            <span className={`font-body text-[10px] uppercase tracking-wider text-center leading-tight ${
                              isActive ? 'text-brand-textPrimary font-bold' : 'text-brand-textMuted'
                            }`}>{step.label}</span>
                            {isCurrent && (
                              <p className="font-body text-[10px] text-brand-textMuted text-center leading-snug mt-1 max-w-[120px]">{step.desc}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile vertical timeline */}
                  <div className="md:hidden space-y-0">
                    {STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isActive = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div key={step.key} className="flex gap-4 items-start relative">
                          {idx < STEPS.length - 1 && (
                            <div className={`absolute left-[19px] top-[40px] w-[2px] h-[calc(100%)] ${isActive ? 'bg-brand-accentColor' : 'bg-gray-200'}`}></div>
                          )}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                            isCurrent ? 'bg-brand-accentColor text-brand-textPrimary ring-4 ring-brand-accentColor/20' :
                            isActive ? 'bg-brand-textPrimary text-brand-accentColor' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div className="pb-8">
                            <p className={`font-body text-[12px] uppercase tracking-wider ${isActive ? 'text-brand-textPrimary font-bold' : 'text-brand-textMuted'}`}>{step.label}</p>
                            {isCurrent && <p className="font-body text-[11px] text-brand-textMuted mt-1">{step.desc}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Payment failed */}
              {orderData.paymentStatus === 'FAILED' && (
                <p className="mt-8 text-center text-red-500 font-body text-[13px]">Payment for this order failed. Please contact support.</p>
              )}

              {/* Last updated */}
              {orderData.updatedAt && (
                <p className="text-center font-body text-[10px] text-gray-400 uppercase tracking-widest mt-8 pt-4 border-t border-gray-100">
                  Last Updated: {new Date(orderData.updatedAt).toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
