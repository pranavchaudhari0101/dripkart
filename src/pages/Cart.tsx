import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.cart-anim',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (!cartItems.length) {
    return (
      <div className="min-h-screen pt-[160px] pb-20 px-6 flex flex-col items-center justify-center text-center bg-gray-50">
        <h1 className="font-display text-[48px] md:text-[64px] mb-4 text-gray-900">Your Cart</h1>
        <p className="font-body text-gray-500 text-[16px] mb-10">Your cart is currently empty. Start shopping to add items.</p>
        <Link 
          to="/shop" 
          className="px-10 py-5 bg-gray-900 text-white font-body font-bold text-[12px] uppercase tracking-[0.3em] rounded-sm hover:bg-[#c8ff00] hover:text-gray-900 transition-all shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="pt-[140px] pb-20 px-6 md:px-12 max-w-[1100px] mx-auto min-h-screen bg-gray-50">
      <h1 className="cart-anim font-display text-[40px] md:text-[48px] mb-12 text-gray-900 border-b border-gray-200 pb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
        {/* Cart Items */}
        <div className="space-y-0">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size}`} className="cart-anim flex gap-6 md:gap-8 py-8 border-b border-gray-200 last:border-0">
              {/* Image */}
              <div className="w-[100px] md:w-[140px] aspect-[3/4] bg-gray-100 overflow-hidden shrink-0 rounded-sm">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display font-bold text-[18px] md:text-[22px] leading-tight uppercase tracking-tighter text-gray-900">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                  <p className="font-body text-[12px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Size: {item.size}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 w-fit h-10 bg-white rounded-sm">
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-10 h-full flex items-center justify-center hover:bg-[#c8ff00] font-black transition-colors text-gray-900"
                    >
                      -
                    </button>
                    <span className="font-body text-[13px] font-black w-10 text-center border-x border-gray-300 text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-10 h-full flex items-center justify-center hover:bg-[#c8ff00] font-black transition-colors text-gray-900"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <p className="font-display font-black text-[20px] text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-anim bg-white border border-gray-200 p-8 md:p-10 h-fit shadow-lg rounded-sm sticky top-[100px]">
          <h3 className="font-display text-[24px] mb-8 uppercase tracking-tighter text-gray-900">Order Summary</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between font-body text-[14px] text-gray-700 font-bold">
              <span className="uppercase tracking-widest">Subtotal</span>
              <span className="font-black text-gray-900">₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-body text-[14px] text-gray-700 font-bold">
              <span className="uppercase tracking-widest">Shipping</span>
              <span className="text-green-600 font-black tracking-tighter">FREE</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex justify-between items-end">
              <span className="font-body text-[11px] uppercase tracking-[0.2em] text-gray-500 font-bold">Total</span>
              <span className="text-[32px] font-bold leading-none text-gray-900">₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>

          <Link 
            to="/checkout"
            className="block w-full py-5 bg-gray-900 text-white text-center font-body font-black text-[13px] uppercase tracking-[0.3em] rounded-sm hover:bg-[#c8ff00] hover:text-gray-900 transition-all shadow-lg"
          >
            Proceed to Checkout
          </Link>

          <Link 
            to="/shop"
            className="block w-full py-4 mt-4 text-center font-body font-bold text-[12px] uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
