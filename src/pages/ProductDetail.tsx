import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { Heart, ChevronRight } from 'lucide-react';
import { Reviews } from '../components/Reviews';

const PRODUCTS: Record<string, any> = {
  'hoodie': { id: 'hoodie', name: 'Mens Premium Oversized Hoodie', price: 1299, image: '/hoodie.png', desc: 'Heavyweight loopback cotton. Dropped shoulders, relaxed fit.', details: ['100% Organic Cotton', '450gsm heavyweight fabric', 'Kangaroo pocket', 'Ribbed trims'] },
  'cargo': { id: 'cargo', name: 'Mens Cargo Shirt — Cream', price: 1099, image: '/cargo-shirt.png', desc: 'Utility meets luxury. Multiple 3D pockets with a boxy silhouette.', details: ['100% Cotton Twill', '4 utility chest pockets', 'Boxy fit', 'Branded buttons'] },
  'drop': { id: 'drop', name: 'Premium Urban Drop Tee', price: 799, image: '/drop-tee.png', desc: 'The perfect essential drop-shoulder tee. Ultra-soft.', details: ['Interlock jersey', 'Ribbed crewneck', 'Drop shoulders', 'Subtle branding'] },
  'zipup': { id: 'zipup', name: 'Mens Zip-Up Hoodie — Slate', price: 1499, image: '/zipup-hoodie.png', desc: 'Everyday essential zip-up. Features a custom metal zipper.', details: ['Brushed fleece interior', 'YKK metal zipper', 'Regular fit', 'Tonal embroidery'] }
};

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: product = PRODUCTS['hoodie'] } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return {
        ...res.data,
        image: res.data.images?.[0]?.url || PRODUCTS[id || 'hoodie']?.image || '/hoodie.png',
        desc: res.data.description || PRODUCTS[id || 'hoodie']?.desc,
        details: PRODUCTS[id || 'hoodie']?.details || ['100% Cotton']
      };
    },
    initialData: id && PRODUCTS[id] ? PRODUCTS[id] : PRODUCTS['hoodie'],
  });

  const { addToCart, toggleCart } = useCart();
  
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Use a slight pause to ensure DOM is ready and opacity is managed
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Set initial opacity to small non-zero value to prevent "pop" if JS fails
    gsap.set(['.pd-image', '.pd-info > *'], { opacity: 0 });
    
    tl.to('.pd-image', { opacity: 1, x: 0, duration: 0.8, startAt: { x: -20 } })
      .to('.pd-info > *', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, startAt: { y: 10 } }, '-=0.4');
  }, [id]);

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <div className="pt-[140px] pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-white/60 mb-12">
          <Link to="/" className="hover:text-[#c8ff00] transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-[#c8ff00] transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-white/80">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Product Image Gallery */}
          <div className="lg:col-span-7 space-y-6 pd-image">
            <div className="relative aspect-[4/5] overflow-hidden bg-black flex items-center justify-center">
              <button className="absolute top-8 right-8 w-12 h-12 glass-dark rounded-full flex items-center justify-center cursor-pointer z-10 hover:bg-[#c8ff00] hover:text-black transition-all group/heart shadow-2xl">
                <Heart size={20} strokeWidth={1.5} className="group-hover/heart:fill-current" />
              </button>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-8 left-8">
                <span className="px-4 py-2 glass-dark border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em]">Editorial Series 01</span>
              </div>
            </div>
            
            {/* Secondary Images (Simulated for UI) */}
            <div className="grid grid-cols-2 gap-6 opacity-80">
              <div className="aspect-square bg-white/5 overflow-hidden">
                <img src={product.image} alt="" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500 cursor-zoom-in" />
              </div>
              <div className="aspect-square bg-white/5 overflow-hidden">
                <img src={product.image} alt="" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500 cursor-zoom-in" />
              </div>
            </div>
          </div>

          {/* Sticky Product Info */}
          <div className="lg:col-span-5 lg:sticky lg:top-[160px] pd-info">
            <div className="space-y-8">
              <div>
                <span className="inline-block text-[#c8ff00] font-body text-[11px] font-bold uppercase tracking-[0.3em] mb-4">Dripkart Exclusive</span>
                <h1 className="font-display font-medium text-[44px] md:text-[56px] leading-[0.95] tracking-tight uppercase mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-4 mt-6">
                  <span className="font-display font-bold text-[32px]">₹{product.price.toLocaleString()}</span>
                  <span className="font-body text-white/30 line-through text-[18px]">₹{(product.price * 1.5).toLocaleString()}</span>
                </div>
              </div>

              <div className="h-[1px] w-full bg-white/10"></div>
              
              <p className="font-body text-[15px] leading-[1.8] text-white/80">
                {product.desc}
              </p>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-body font-bold text-[11px] uppercase tracking-[0.2em] text-white">Select Size</span>
                  <button className="font-body text-[11px] text-[#c8ff00] border-b border-[#c8ff00]/30 pb-0.5 font-bold hover:border-[#c8ff00] transition-colors">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {(product.sizes || []).map((s: { size: string; stock: number }) => (
                    <button 
                      key={s.size}
                      disabled={s.stock === 0}
                      onClick={() => setSize(s.size)}
                      className={`min-w-[70px] h-[54px] border font-body text-[13px] font-bold transition-all relative ${
                        size === s.size 
                          ? 'bg-[#c8ff00] text-black border-[#c8ff00] neon-glow' 
                          : 'bg-transparent text-white border-white/20 hover:border-white'
                      } ${s.stock === 0 ? 'opacity-20 cursor-not-allowed line-through' : ''}`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <span className="block font-body font-bold text-[11px] uppercase tracking-[0.2em] text-white mb-4">Quantity</span>
                <div className="flex items-center glass-dark w-fit h-14 border border-white/10 text-white">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-14 h-full flex items-center justify-center hover:text-[#d1ff00] transition-colors font-bold text-lg">-</button>
                  <div className="w-14 h-full flex items-center justify-center font-body text-[14px] font-bold border-x border-white/10 uppercase text-white">{qty}</div>
                  <button onClick={() => setQty(qty + 1)} className="w-14 h-full flex items-center justify-center hover:text-[#d1ff00] transition-colors font-bold text-lg">+</button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-4">
                <button 
                  onClick={() => {
                    addToCart({ ...product, size, quantity: qty });
                    toggleCart();
                  }}
                  className="w-full h-18 bg-[#c8ff00] text-black font-body font-black text-[15px] uppercase tracking-[0.4em] transition-all hover:brightness-110 active:scale-[0.98] shadow-[0_0_30px_rgba(200,255,0,0.2)]"
                >
                  Confirm Drop — ₹{(product.price * qty).toLocaleString()}
                </button>
              </div>

              {/* Specs Glass Panel */}
              <div className="glass-dark p-8 border border-white/5 mt-12">
                <h4 className="font-body font-bold text-[11px] uppercase tracking-[0.2em] text-[#c8ff00] mb-6">Technical Specifications</h4>
                <div className="grid grid-cols-1 gap-4">
                  {(product.details || []).map((d: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c8ff00]/50" />
                      <span className="font-body text-[13px] text-white/80 font-medium">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-16 px-6">
            <h2 className="font-display text-[40px] uppercase tracking-tighter text-white">Community Feedback</h2>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>
          <div className="glass-dark p-6 md:p-12">
            <Reviews />
          </div>
      </div>
    </div>
  );
}
