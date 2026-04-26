import { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import gsap from 'gsap';

export function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'COD'>('phonepe');
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  // Auth check — redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/checkout' } });
    }
  }, [user, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.checkout-anim',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [step]);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', 
    address: '', city: '', state: '', pincode: '', phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (step < 2) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        const payload = {
          address: {
            fullName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            line1: formData.address,
            city: formData.city,
            state: formData.state || 'Unknown',
            pincode: formData.pincode,
            phone: formData.phone,
          },
          items: cartItems.map(item => ({
            productId: item.id,
            size: item.size,
            quantity: item.quantity
          })),
          paymentMethod
        };

        const res = await api.post('/orders/create', payload);
        if (res.data.paymentUrl) {
          clearCart();
          window.location.assign(res.data.paymentUrl);
          return;
        }
        // COD success
        if (res.data.orderId) {
          clearCart();
          navigate('/order-success', { state: { orderId: res.data.orderId } });
        }
      } catch (err: any) {
        const msg = err.response?.data?.error || err.response?.data?.message || 'Order creation failed. Please try again.';
        if (err.response?.status === 401) {
          setError('Session expired. Please sign in again.');
          timeoutIdRef.current = window.setTimeout(() => navigate('/login', { state: { returnTo: '/checkout' } }), 2000);
        } else {
          setError(msg);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const inputClass = "w-full p-3.5 md:p-4 bg-white border border-gray-300 rounded-sm font-body text-[13px] text-gray-900 outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all placeholder:text-gray-400 shadow-sm";

  if (!user) return null; // Will redirect via useEffect

  if (!cartItems.length) {
    return (
      <div className="min-h-screen pt-[140px] pb-20 px-4 md:px-6 flex flex-col items-center justify-center text-center bg-gray-50">
        <h1 className="font-display text-[28px] md:text-[40px] mb-8 text-gray-900">Your cart is empty</h1>
        <Link to="/shop" className="inline-block px-8 md:px-10 py-4 bg-gray-900 text-white font-body font-medium text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-[#c8ff00] hover:text-gray-900 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="pt-[120px] md:pt-[140px] pb-20 px-4 md:px-12 max-w-[1200px] mx-auto min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-8 md:mb-12">
        <Link to="/cart" className="hover:text-gray-900 transition-colors">Cart</Link>
        <ChevronRight size={12} />
        <span className={step >= 1 ? 'text-gray-900 font-medium' : ''}>Shipping</span>
        <ChevronRight size={12} />
        <span className={step >= 2 ? 'text-gray-900 font-medium' : ''}>Review & Payment</span>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-center gap-3 rounded-sm">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <p className="font-body text-[13px] text-red-700 font-medium">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600"><X size={16} /></button>
        </div>
      )}

      {/* Mobile: Order summary first, then form */}
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-20">
        
        {/* Form Column */}
        <div>
          <form onSubmit={handleSubmit} className="checkout-anim space-y-8 md:space-y-12">
            {step === 1 && (
              <div>
                <h2 className="font-display text-[24px] md:text-[40px] mb-6 md:mb-8 border-b border-gray-200 pb-4 uppercase tracking-tighter text-gray-900">Shipping Details</h2>
                <div className="space-y-5 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">First Name</label>
                      <input required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" className={inputClass} />
                    </div>
                    <div>
                      <label className="block font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Last Name</label>
                      <input required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Email</label>
                    <input required name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" type="email" className={inputClass} />
                  </div>

                  <div>
                    <label className="block font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Street Address</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="Building, Street, Area" className={inputClass} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <div>
                      <label className="block font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">City</label>
                      <input required name="city" value={formData.city} onChange={handleInputChange} placeholder="Mumbai" className={inputClass} />
                    </div>
                    <div>
                      <label className="block font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">State</label>
                      <input required name="state" value={formData.state} onChange={handleInputChange} placeholder="Maharashtra" className={inputClass} />
                    </div>
                    <div>
                      <label className="block font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Pincode</label>
                      <input required name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="400001" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Phone Number</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-gray-900">
                <h2 className="font-display text-[24px] md:text-[40px] mb-6 md:mb-8 border-b border-gray-200 pb-4 uppercase tracking-tighter">Review & Pay</h2>
                <div className="space-y-6 md:space-y-8">
                  <div className="bg-white p-6 md:p-8 border border-gray-200 shadow-sm rounded-sm">
                     <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3 font-bold">Shipping To:</p>
                     <p className="font-display text-[22px] md:text-[28px] mb-1 font-bold text-gray-900">{formData.firstName} {formData.lastName}</p>
                     <p className="font-body text-[13px] md:text-[15px] text-gray-700 mb-4 font-bold">{formData.email}</p>
                     <div className="pt-4 md:pt-6 border-t border-gray-200">
                        <p className="font-body text-[14px] md:text-[16px] leading-relaxed font-bold text-gray-900">{formData.address}, {formData.city}</p>
                        <p className="font-body text-[14px] md:text-[16px] text-gray-600 mt-1">{formData.state} — {formData.pincode}</p>
                        <p className="font-body text-[13px] text-gray-500 mt-2">Ph: {formData.phone}</p>
                     </div>
                     <button type="button" onClick={() => setStep(1)} className="mt-4 font-body text-[11px] text-brand-accentColor font-bold uppercase tracking-wider hover:underline">Edit Address</button>
                  </div>

                  <div className="space-y-4">
                    <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">Payment Method:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('phonepe')}
                        className={`p-5 md:p-6 border rounded-sm flex flex-col items-start gap-2 transition-all ${paymentMethod === 'phonepe' ? 'border-[#c8ff00] bg-[#c8ff00]/5 ring-1 ring-[#c8ff00]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <span className="font-body text-[12px] md:text-[13px] font-black uppercase tracking-wider">Pay Online</span>
                        <span className="font-body text-[10px] text-gray-500 uppercase">PhonePe Gateway</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-5 md:p-6 border rounded-sm flex flex-col items-start gap-2 transition-all ${paymentMethod === 'COD' ? 'border-[#c8ff00] bg-[#c8ff00]/5 ring-1 ring-[#c8ff00]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <span className="font-body text-[12px] md:text-[13px] font-black uppercase tracking-wider">Cash on Delivery</span>
                        <span className="font-body text-[10px] text-gray-500 uppercase text-left">Pay when you receive</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full mt-6 md:mt-8 py-5 md:py-6 bg-gray-900 text-white font-body font-black text-[12px] md:text-[14px] uppercase tracking-[0.3em] md:tracking-[0.4em] rounded-sm transition-all hover:bg-[#c8ff00] hover:text-gray-900 active:scale-[0.98] disabled:opacity-50 shadow-lg flex items-center justify-center gap-3">
              {isLoading ? 'Processing...' : (step === 2 ? 'Place Order' : 'Continue to Review')}
            </button>
          </form>
        </div>

        {/* Order Summary — shows first on mobile */}
        <div className="checkout-anim bg-white border border-gray-200 p-6 md:p-10 h-fit shadow-lg rounded-sm lg:sticky lg:top-[100px]">
          <h3 className="font-display text-[20px] md:text-[24px] mb-6 md:mb-8 uppercase tracking-tighter text-gray-900">Order Summary</h3>
          
          <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8 max-h-[300px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 md:gap-6 group border-b border-gray-200 pb-4 last:border-0">
                <div className="w-[60px] md:w-[80px] aspect-[3/4] bg-gray-100 overflow-hidden shrink-0 relative rounded-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[9px] md:text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-white">{item.quantity}</span>
                </div>
                <div className="flex-1 py-1 min-w-0">
                  <h4 className="font-body text-[11px] md:text-[13px] font-black leading-tight mb-1.5 tracking-wide uppercase text-gray-900 truncate">{item.name}</h4>
                  <span className="px-2 py-0.5 bg-gray-900 text-[#c8ff00] text-[9px] md:text-[10px] font-black tracking-widest uppercase rounded-sm">{item.size}</span>
                </div>
                <p className="font-display text-[14px] md:text-[16px] font-bold text-right self-center text-gray-900 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 md:pt-6 space-y-3 md:space-y-4">
            <div className="flex justify-between font-body text-[12px] md:text-[14px] text-gray-700 font-bold">
              <span className="uppercase tracking-widest">Subtotal</span>
              <span className="font-black text-gray-900">₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-body text-[12px] md:text-[14px] text-gray-700 font-bold">
              <span className="uppercase tracking-widest">Shipping</span>
              <span className="text-green-600 font-black tracking-tighter">FREE</span>
            </div>
            <div className="flex justify-between items-end pt-4 md:pt-6 border-t border-gray-200">
              <span className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-500 font-bold">Total</span>
              <span className="text-[24px] md:text-[32px] font-bold leading-none text-gray-900">₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
