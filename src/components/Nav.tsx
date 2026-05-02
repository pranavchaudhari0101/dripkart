import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '../context/CartContext';
import { SignInButton, SignUpButton, UserButton, SignOutButton, useUser } from '@clerk/react';

gsap.registerPlugin(ScrollTrigger);

export function Nav() {
  const { cartCount } = useCart();
  const { user: clerkUser, isSignedIn } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowMobileMenu(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      st.kill();
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isHome]);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const isDarkPage = location.pathname.startsWith('/shop/') || location.pathname === '/admin' || location.pathname === '/collections';

  const navClasses = `fixed top-0 left-0 w-full z-40 px-4 md:px-12 py-4 flex items-center justify-between transition-all duration-500 ${
    isDarkPage 
      ? 'bg-black/80 backdrop-blur-lg text-white border-b border-white/10'
      : isHome && !isScrolled
        ? 'bg-transparent text-white'
        : 'bg-white text-brand-textPrimary shadow-md'
  }`;

  const barColor = isDarkPage || (isHome && !isScrolled) ? 'bg-white' : 'bg-brand-textPrimary';

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleTrendingClick = (tag: string) => {
    navigate(`/shop?q=${encodeURIComponent(tag)}`);
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <>
      <nav id="mainNav" className={navClasses}>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-body text-xs font-bold uppercase tracking-[0.12em] hover:opacity-60 transition-opacity">Home</Link>
          <Link to="/shop" className="font-body text-xs font-bold uppercase tracking-[0.12em] hover:opacity-60 transition-opacity">Shop</Link>
          <Link to="/collections" className="font-body text-xs font-bold uppercase tracking-[0.12em] hover:opacity-60 transition-opacity">Collections</Link>
          <Link to="/about" className="font-body text-xs font-bold uppercase tracking-[0.12em] hover:opacity-60 transition-opacity">About</Link>
          {clerkUser?.publicMetadata?.role === 'ADMIN' && (
            <Link to="/admin" className="font-body text-xs font-bold uppercase tracking-[0.12em] text-brand-accentColor hover:opacity-60 transition-opacity">Manage</Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden flex flex-col gap-[5px] p-2 group z-50"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          {showMobileMenu ? (
            <X size={22} className={barColor === 'bg-white' ? 'text-white' : 'text-brand-textPrimary'} />
          ) : (
            <>
              <span className={`block w-[22px] h-[2px] ${barColor} transition-all`}></span>
              <span className={`block w-[22px] h-[2px] ${barColor} transition-all`}></span>
              <span className={`block w-[16px] h-[2px] ${barColor} transition-all`}></span>
            </>
          )}
        </button>

        {/* Center Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="font-display text-[22px] md:text-[26px] font-bold tracking-tighter">
            DRIP<span className="font-light italic">ka</span>Rt
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setShowSearch(true)}
            className="hover:scale-110 hover:text-brand-accentColor transition-all duration-300"
          >
            <Search strokeWidth={2.5} size={20} />
          </button>
          
          <div className="flex items-center h-full z-[100]">
            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    rootBox: "z-[100]",
                    userButtonPopoverCard: { pointerEvents: "initial", zIndex: 99999 }
                  }
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button type="button" aria-label="Sign In" className="cursor-pointer hover:scale-110 hover:text-brand-accentColor transition-all duration-300 flex items-center">
                  <User strokeWidth={2.5} size={20} />
                </button>
              </SignInButton>
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

      {/* ═══ Mobile Menu Drawer ═══ */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-[90] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute top-0 left-0 w-[280px] h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-gray-100">
              <Link to="/" className="font-display text-[24px] font-bold tracking-tighter text-brand-textPrimary" onClick={() => setShowMobileMenu(false)}>
                DRIP<span className="font-light italic">ka</span>Rt
              </Link>
            </div>
            
            {isSignedIn && clerkUser && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <p className="font-body text-[14px] font-black text-brand-textPrimary">{clerkUser.fullName}</p>
                <p className="font-body text-[10px] text-gray-500 uppercase tracking-widest">{clerkUser.primaryEmailAddress?.emailAddress}</p>
              </div>
            )}

            <div className="flex-1 py-6 px-6 space-y-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Shop' },
                { to: '/collections', label: 'Collections' },
                { to: '/about', label: 'About' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block py-3 px-4 font-body text-[14px] font-bold uppercase tracking-[0.1em] transition-colors rounded-sm ${
                    location.pathname === link.to 
                      ? 'bg-brand-accentColor text-brand-textPrimary' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {clerkUser?.publicMetadata?.role === 'ADMIN' && (
                <Link to="/admin" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 font-body text-[14px] font-bold uppercase tracking-[0.1em] text-brand-accentColor bg-brand-textPrimary rounded-sm mt-4">
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 space-y-3">
              {isSignedIn ? (
                <>
                  <Link to="/order-tracking" onClick={() => setShowMobileMenu(false)} className="block w-full py-3 text-center font-body text-[12px] font-bold uppercase tracking-[0.15em] border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors">
                    Track Orders
                  </Link>
                  <SignOutButton>
                    <button onClick={() => setShowMobileMenu(false)} className="block w-full py-3 text-center font-body text-[12px] font-bold uppercase tracking-[0.15em] bg-red-50 text-red-600 rounded-sm hover:bg-red-100 transition-colors">
                      Sign Out
                    </button>
                  </SignOutButton>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <SignInButton mode="modal">
                    <button type="button" aria-label="Sign In" className="cursor-pointer block w-full py-3 text-center font-body text-[12px] font-bold uppercase tracking-[0.15em] bg-brand-textPrimary text-white rounded-sm">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button type="button" aria-label="Create Account" className="cursor-pointer block w-full py-3 text-center font-body text-[12px] font-bold uppercase tracking-[0.15em] border border-gray-200 rounded-sm hover:bg-gray-50">
                      Create Account
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Search Overlay ═══ */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-4 md:px-12 py-6 border-b border-gray-100">
            <Link to="/" onClick={() => setShowSearch(false)} className="font-display text-[22px] md:text-[26px] font-bold tracking-tighter text-brand-textPrimary">
              DRIP<span className="font-light italic">ka</span>Rt
            </Link>
            <button 
              onClick={() => setShowSearch(false)}
              className="w-10 h-10 md:w-12 md:h-12 bg-black text-white flex items-center justify-center hover:bg-brand-accentColor hover:text-black transition-all"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6">
            <form onSubmit={handleSearch} className="w-full max-w-[800px] space-y-8">
              <input 
                autoFocus
                type="text" 
                placeholder="SEARCH..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                className="w-full bg-transparent border-b-2 border-brand-textPrimary py-4 md:py-6 font-display text-[24px] md:text-[56px] font-black italic tracking-tighter outline-none placeholder:text-gray-200"
              />
              <div className="flex flex-wrap gap-3 md:gap-4">
                <span className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-brand-textMuted">Trending:</span>
                {['Hoodies', 'Cargo', 'Drop Tee', 'Essentials'].map(tag => (
                  <button 
                    key={tag} 
                    type="button"
                    onClick={() => handleTrendingClick(tag)}
                    className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-medium hover:text-brand-accentColor transition-colors underline decoration-brand-accentColor/0 hover:decoration-brand-accentColor underline-offset-4 decoration-2"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
