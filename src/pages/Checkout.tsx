import { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';

export function Checkout() {
  const { cartItems, cartTotal } = useCart();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'COD'>('phonepe');
  const containerRef = useRef<HTMLDivElement>(null);

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
    address: '', city: '', pincode: '', phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            pincode: formData.pincode,
            phone: formData.phone,
            state: 'Unknown'
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
          window.location.assign(res.data.paymentUrl);
          return;
        }
      } catch (err: any) {
        alert(err.response?.data?.error || 'Order creation failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const inputClass = "w-full p-4 bg-white border border-gray-300 rounded-sm font-body text-[13px] text-gray-900 outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all placeholder:text-gray-400 shadow-sm";

  if (!cartItems.length) {
    return (
      <div className="min-h-screen pt-[160px] pb-20 px-6 flex flex-col items-center justify-center text-center bg-gray-50">
        <h1 className="font-display text-[40px] mb-8 text-gray-900">Your cart is empty</h1>
        <Link to="/shop" className="inline-block px-10 py-4 bg-gray-900 text-white font-body font-medium text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-[#c8ff00] hover:text-gray-900 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="pt-[140px] pb-20 px-6 md:px-12 max-w-[1200px] mx-auto min-h-screen bg-gray-50">
      <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-12">
        <Link to="/cart" className="hover:text-gray-900 transition-colors">Cart</Link>
        <ChevronRight size={12} />
        <span className={step >= 1 ? 'text-gray-900 font-medium' : ''}>Shipping</span>
        <ChevronRight size={12} />
        <span className={step >= 2 ? 'text-gray-900 font-medium' : ''}>Review & Payment</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 lg:gap-20">
        
        {/* Form Column */}
        <div>
          <form onSubmit={handleSubmit} className="checkout-anim space-y-12">
            {step === 1 && (
              <div>
                <h2 className="font-display text-[32px] md:text-[40px] mb-8 border-b border-gray-200 pb-4 uppercase tracking-tighter text-gray-900">Shipping Details</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">First Name</label>
                      <input required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Alexander" className={inputClass} />
                    </div>
                    <div>
                      <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Last Name</label>
                      <input required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="McQueen" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Email for Confirmation</label>
                    <input required name="email" value={formData.email} onChange={handleInputChange} placeholder="alex@mcqueen.com" type="email" className={inputClass} />
                  </div>

                  <div>
                    <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Street Address</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="Building, Street, Area" className={inputClass} />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">City</label>
                      <input required name="city" value={formData.city} onChange={handleInputChange} placeholder="Mumbai" className={inputClass} />
                    </div>
                    <div>
                      <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Pincode</label>
                      <input required name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="400001" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Phone Number</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-gray-900">
                <h2 className="font-display text-[32px] md:text-[40px] mb-8 border-b border-gray-200 pb-4 uppercase tracking-tighter">Review & Secure</h2>
                <div className="space-y-8">
                  <p className="font-body text-[14px] text-gray-700 leading-relaxed font-bold">
                    Please review your shipping details before proceeding with PhonePe Gateway for secure payment.
                  </p>
                  
                  <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
                     <p className="font-body text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-4 font-bold">Shipping To:</p>
                     <p className="font-display text-[28px] mb-1 font-bold text-gray-900">{formData.firstName} {formData.lastName}</p>
                     <p className="font-body text-[15px] text-gray-700 mb-4 font-bold">{formData.email}</p>
                     <div className="pt-6 border-t border-gray-200">
                        <p className="font-body text-[16px] leading-relaxed font-bold text-gray-900">{formData.address}, {formData.city}</p>
                        <p className="font-body text-[16px] font-black mt-2 text-gray-900">PIN: {formData.pincode}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <p className="font-body text-[11px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">Payment Method:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('phonepe')}
                        className={`p-6 border rounded-sm flex flex-col items-start gap-2 transition-all ${paymentMethod === 'phonepe' ? 'border-[#c8ff00] bg-[#c8ff00]/5 ring-1 ring-[#c8ff00]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <span className="font-body text-[13px] font-black uppercase tracking-wider">Pay Online</span>
                        <span className="font-body text-[10px] text-gray-500 uppercase">PhonePe Gateway</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-6 border rounded-sm flex flex-col items-start gap-2 transition-all ${paymentMethod === 'COD' ? 'border-[#c8ff00] bg-[#c8ff00]/5 ring-1 ring-[#c8ff00]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <span className="font-body text-[13px] font-black uppercase tracking-wider">Cash on Delivery</span>
                        <span className="font-body text-[10px] text-gray-500 uppercase text-left">Pay when you receive the order</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full mt-8 py-6 bg-gray-900 text-white font-body font-black text-[14px] uppercase tracking-[0.4em] rounded-sm transition-all hover:bg-[#c8ff00] hover:text-gray-900 active:scale-[0.98] disabled:opacity-50 shadow-lg flex items-center justify-center gap-3">
              {isLoading ? 'Processing...' : (step === 2 ? 'Pay Now' : 'Continue to Review')}
            </button>
          </form>
        </div>

        <div className="checkout-anim bg-white border border-gray-200 p-8 md:p-10 h-fit shadow-lg rounded-sm">
          <h3 className="font-display text-[24px] mb-8 uppercase tracking-tighter text-gray-900">Order Summary</h3>
          
          <div className="flex flex-col gap-6 mb-8 max-h-[500px] overflow-y-auto pr-4">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-6 group border-b border-gray-200 pb-4 last:border-0">
                <div className="w-[80px] aspect-[3/4] bg-gray-100 overflow-hidden shrink-0 relative rounded-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-all duration-500" />
                  <span className="absolute -top-3 -right-3 bg-gray-900 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md border border-white">{item.quantity}</span>
                </div>
                <div className="flex-1 py-1">
                  <h4 className="font-body text-[13px] font-black leading-tight mb-2 tracking-wide uppercase text-gray-900">{item.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-900 text-[#c8ff00] text-[10px] font-black tracking-widest uppercase rounded-sm">{item.size}</span>
                  </div>
                </div>
                <p className="font-display text-[16px] font-bold text-right self-center text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between font-body text-[14px] text-gray-700 font-bold">
              <span className="uppercase tracking-widest">Subtotal Sum</span>
              <span className="font-black text-gray-900">₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-body text-[14px] text-gray-700 font-bold">
              <span className="uppercase tracking-widest">Ground Logistics</span>
              <span className="text-gray-900 font-black tracking-tighter">FAST & FREE</span>
            </div>
            <div className="flex justify-between items-end pt-8 border-t border-gray-200">
              <div className="flex flex-col">
                <span className="font-body text-[11px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">Total Amount</span>
                <span className="text-[32px] font-bold leading-none text-gray-900">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
