import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '../context/CartContext';
import { useAuthStore } from '../store/authStore';

gsap.registerPlugin(ScrollTrigger);

export function Nav() {
  const { cartCount } = useCart();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    setIsScrolled(window.scrollY > 80);

    const st = ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        setIsScrolled(self.scroll() > 80);
      }
    });

    return () => st.kill();
  }, [isHome]);

  const navClasses = `fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-500 ${
    isHome && !isScrolled
      ? 'bg-transparent text-white'
      : 'bg-white text-brand-textPrimary shadow-md'
  }`;

  return (
    <nav 
      id="mainNav"
      className={navClasses}
    >
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="font-body text-xs font-bold uppercase tracking-[0.12em] hover:opacity-60 transition-opacity">Home</Link>
        <Link to="/shop" className="font-body text-xs font-bold uppercase tracking-[0.12em] hover:opacity-60 transition-opacity">Shop</Link>
        <Link to="/collections" className="font-body text-xs font-bold uppercase tracking-[0.12em] hover:opacity-60 transition-opacity">Collections</Link>
        <Link to="/about" className="font-body text-xs font-bold uppercase tracking-[0.12em] hover:opacity-60 transition-opacity">About</Link>
        {user?.role === 'ADMIN' && (
          <Link to="/admin" className="font-body text-xs font-bold uppercase tracking-[0.12em] text-brand-accentColor hover:opacity-60 transition-opacity">Manage</Link>
        )}
      </div>

      <button className="md:hidden flex flex-col gap-[5px] p-1 group">
        <span className="block w-[22px] h-[2px] bg-brand-textPrimary transition-colors"></span>
        <span className="block w-[22px] h-[2px] bg-brand-textPrimary transition-colors"></span>
        <span className="block w-[22px] h-[2px] bg-brand-textPrimary transition-colors"></span>
      </button>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Link to="/" className="font-display text-[26px] font-bold tracking-tighter">
          DRIP<span className="font-light italic">ka</span>Rt
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <button className="hover:scale-110 hover:text-brand-accentColor transition-all duration-300">
          <Search strokeWidth={2.5} size={20} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => {
              if (user) {
                setShowUserMenu(!showUserMenu);
              } else {
                window.location.assign('/login');
              }
            }}
            className="hover:scale-110 hover:text-brand-accentColor transition-all duration-300 flex items-center"
          >
            <User strokeWidth={2.5} size={20} />
          </button>
          
          {user && showUserMenu && (
            <div className="absolute top-10 right-0 w-56 bg-white border border-gray-200 shadow-2xl py-3 flex flex-col text-brand-textPrimary z-50 animate-in fade-in slide-in-from-top-2 duration-300 rounded-sm">
              <div className="px-5 py-3 border-b border-gray-200 mb-2">
                <p className="font-display font-black text-[18px] truncate">{user.name}</p>
                <p className="font-body text-[11px] text-brand-accentColor bg-brand-textPrimary px-2 w-fit uppercase tracking-widest font-black">{user.role}</p>
              </div>
              {user.role === 'ADMIN' && (
                <Link to="/admin" onClick={() => setShowUserMenu(false)} className="px-5 py-2.5 font-body text-[14px] font-black hover:bg-brand-accentColor hover:text-brand-textPrimary transition-colors">Admin Dashboard</Link>
              )}
              <Link to="/order-tracking" onClick={() => setShowUserMenu(false)} className="px-5 py-2.5 font-body text-[14px] font-black hover:bg-brand-accentColor hover:text-brand-textPrimary transition-colors">Track Orders</Link>
              <button 
                onClick={() => { logout(); setShowUserMenu(false); }}
                className="px-5 py-2.5 font-body text-[14px] font-black text-left text-red-600 hover:bg-red-600 hover:text-white transition-colors border-t border-gray-200 mt-2"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        <Link 
          to="/cart"
          className="relative hover:scale-110 hover:text-brand-accentColor transition-all duration-300 flex items-center"
        >
          <ShoppingBag strokeWidth={2.5} size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-accentColor text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
