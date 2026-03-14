import { useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export function CartDrawer() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: 'power3.out' });
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' });
      gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
    }
  }, [isCartOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) toggleCart();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCartOpen, toggleCart]);

  return (
    <>
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        onClick={toggleCart}
        className="fixed inset-0 bg-black z-[60] opacity-0 invisible cursor-pointer"
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] translate-x-full shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-8 md:p-10 border-b border-gray-200">
          <h2 className="font-display text-[28px] font-black uppercase tracking-tighter">Your Cart</h2>
          <button 
            onClick={toggleCart}
            className="w-12 h-12 flex items-center justify-center bg-black text-white hover:bg-brand-accentColor hover:text-black transition-colors shadow-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <p className="font-display font-black italic text-[24px] mb-4 opacity-10">Your cart is empty</p>
              <button 
                onClick={toggleCart} 
                className="px-8 py-4 bg-black text-white font-body font-black text-[12px] uppercase tracking-[0.3em] hover:bg-brand-accentColor hover:text-black transition-all shadow-xl"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-6 group border-b border-gray-200 pb-8 last:border-0">
                  <div className="w-[120px] aspect-[3/4] bg-brand-bgSecondary overflow-hidden shrink-0 relative rounded-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 py-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display font-black text-[18px] leading-tight uppercase tracking-tighter">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-brand-textPrimary hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                      <p className="font-body text-[12px] font-black uppercase tracking-[0.2em] text-brand-textPrimary mb-4">Size: {item.size}</p>
                      
                      <div className="flex items-center border border-gray-300 w-fit h-10 bg-white rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-10 h-full flex items-center justify-center hover:bg-brand-accentColor font-black transition-colors"
                        >
                          -
                        </button>
                        <span className="font-body text-[13px] font-black w-10 text-center border-x border-gray-300">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-10 h-full flex items-center justify-center hover:bg-brand-accentColor font-black transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="font-display font-black text-[18px] mt-4">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-8 md:p-10 bg-white border-t border-gray-200 space-y-6">
            <div className="flex justify-between items-end">
              <span className="font-body font-bold text-[12px] uppercase tracking-[0.2em]">Total Amount</span>
              <span className="font-display font-black text-[32px] tracking-tighter leading-none">₹{cartTotal.toLocaleString()}</span>
            </div>
            <Link 
              to="/checkout" 
              onClick={toggleCart}
              className="block w-full py-6 bg-black text-white text-center font-body font-black text-[14px] uppercase tracking-[0.5em] hover:bg-brand-accentColor hover:text-black transition-all shadow-2xl"
            >
              Checkout Now
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
