import React, { useEffect, useState } from 'react';
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

// Convert API sizes object {S: 10, M: 5} to array [{size: 'S', stock: 10}, ...]
function parseSizes(sizes: any): { size: string; stock: number }[] {
  if (!sizes) return [];
  if (Array.isArray(sizes)) return sizes;
  if (typeof sizes === 'object') {
    return Object.entries(sizes).map(([size, stock]) => ({
      size,
      stock: typeof stock === 'number' ? stock : parseInt(String(stock)) || 0
    }));
  }
  return [];
}

// Get all images from product (API or fallback)
function getImages(product: any, fallbackImage: string): string[] {
  const images: string[] = [];
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img: any) => {
      if (typeof img === 'string') images.push(img);
      else if (img?.url) images.push(img.url);
    });
  }
  if (images.length === 0 && product.image) images.push(product.image);
  if (images.length === 0) images.push(fallbackImage);
  return images;
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: product = PRODUCTS['hoodie'] } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      const fallback = id && PRODUCTS[id] ? PRODUCTS[id] : PRODUCTS['hoodie'];
      return {
        ...res.data,
        image: res.data.images?.[0]?.url || fallback?.image || '/hoodie.png',
        desc: res.data.description || fallback?.desc,
        details: fallback?.details || ['Premium quality materials', 'Designed for comfort']
      };
    },
    initialData: id && PRODUCTS[id] ? PRODUCTS[id] : PRODUCTS['hoodie'],
  });

  const { addToCart, toggleCart } = useCart();
  
  const sizes = React.useMemo(() => parseSizes(product.sizes), [product.sizes]);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = getImages(product, '/hoodie.png');

  // Reset image idx when product changes
  useEffect(() => {
    setActiveImageIdx(0);
  }, [product.id, images.length]);

  // Set default size to first available
  useEffect(() => {
    if (sizes.length > 0) {
      const available = sizes.find(s => s.stock > 0);
      if (available && (!size || !sizes.find(s => s.size === size && s.stock > 0))) {
        setSize(available.size);
      } else if (!size) {
        setSize(sizes[0].size);
      }
    } else {
      setSize('');
    }
  }, [sizes, size]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    gsap.set(['.pd-image', '.pd-info > *'], { opacity: 0 });
    tl.to('.pd-image', { opacity: 1, x: 0, duration: 0.8, startAt: { x: -20 } })
      .to('.pd-info > *', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, startAt: { y: 10 } }, '-=0.4');
  }, [id]);

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <div className="pt-[120px] md:pt-[140px] pb-20 px-4 md:px-12 max-w-[1600px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-white/60 mb-8 md:mb-12">
          <Link to="/" className="hover:text-[#c8ff00] transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-[#c8ff00] transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-white/80 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 items-start">
          
          {/* Product Image Gallery */}
          <div className="lg:col-span-7 space-y-3 md:space-y-6 pd-image">
            <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-black flex items-center justify-center">
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 glass-dark rounded-full flex items-center justify-center cursor-pointer z-10 hover:bg-[#c8ff00] hover:text-black transition-all group/heart shadow-2xl"
              >
                <Heart size={18} strokeWidth={1.5} className={`${isWishlisted ? 'fill-current text-[#c8ff00]' : 'group-hover/heart:fill-current'}`} />
              </button>
              <img 
                src={images[activeImageIdx] || images[0]} 
                alt={product.name}
                decoding="async"
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                <span className="px-3 py-1.5 md:px-4 md:py-2 glass-dark border border-white/10 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">
                  {product.badge || 'Dripkart Exclusive'}
                </span>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                {images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-square overflow-hidden border-2 transition-all ${activeImageIdx === idx ? 'border-[#c8ff00]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Fallback: if only 1 image, show duplicates with effects */}
            {images.length === 1 && (
              <div className="grid grid-cols-2 gap-3 md:gap-6 opacity-80">
                <div className="aspect-square bg-white/5 overflow-hidden">
                  <img src={images[0]} alt="" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500 cursor-zoom-in" />
                </div>
                <div className="aspect-square bg-white/5 overflow-hidden">
                  <img src={images[0]} alt="" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500 cursor-zoom-in" />
                </div>
              </div>
            )}
          </div>

          {/* Sticky Product Info */}
          <div className="lg:col-span-5 lg:sticky lg:top-[140px] pd-info">
            <div className="space-y-6 md:space-y-8">
              <div>
                <span className="inline-block text-[#c8ff00] font-body text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] mb-3 md:mb-4">Dripkart Exclusive</span>
                <h1 className="font-display font-medium text-[28px] md:text-[56px] leading-[0.95] tracking-tight uppercase mb-3 md:mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3 md:gap-4 mt-4 md:mt-6">
                  <span className="font-display font-bold text-[24px] md:text-[32px]">₹{product.price?.toLocaleString()}</span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="font-body text-white/30 line-through text-[14px] md:text-[18px]">₹{product.mrp?.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="h-[1px] w-full bg-white/10"></div>
              
              <p className="font-body text-[13px] md:text-[15px] leading-[1.8] text-white/80">
                {product.desc}
              </p>

              {/* Size Selector */}
              {sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <span className="font-body font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white">Select Size</span>
                    <button 
                      onClick={() => setShowSizeGuide(true)}
                      className="font-body text-[10px] md:text-[11px] text-[#c8ff00] border-b border-[#c8ff00]/30 pb-0.5 font-bold hover:border-[#c8ff00] transition-colors"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {sizes.map((s) => (
                      <button 
                        key={s.size}
                        disabled={s.stock === 0}
                        onClick={() => setSize(s.size)}
                        className={`min-w-[56px] md:min-w-[70px] h-[46px] md:h-[54px] border font-body text-[12px] md:text-[13px] font-bold transition-all relative ${
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
              )}

              {/* Quantity */}
              <div>
                <span className="block font-body font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white mb-3 md:mb-4">Quantity</span>
                <div className="flex items-center glass-dark w-fit h-12 md:h-14 border border-white/10 text-white">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 md:w-14 h-full flex items-center justify-center hover:text-[#d1ff00] transition-colors font-bold text-lg">-</button>
                  <div className="w-12 md:w-14 h-full flex items-center justify-center font-body text-[13px] md:text-[14px] font-bold border-x border-white/10 uppercase text-white">{qty}</div>
                  <button onClick={() => setQty(qty + 1)} className="w-12 md:w-14 h-full flex items-center justify-center hover:text-[#d1ff00] transition-colors font-bold text-lg">+</button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-2 md:pt-4">
                <button 
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: images[0],
                      size: size || (sizes.length > 0 ? sizes[0].size : 'M')
                    }, qty);
                    toggleCart();
                  }}
                  className="w-full h-14 md:h-16 bg-[#c8ff00] text-black font-body font-black text-[13px] md:text-[15px] uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all hover:brightness-110 active:scale-[0.98] shadow-[0_0_30px_rgba(200,255,0,0.2)]"
                >
                  Add to Cart — ₹{(product.price * qty).toLocaleString()}
                </button>
              </div>

              {/* Specs */}
              <div className="glass-dark p-6 md:p-8 border border-white/5 mt-8 md:mt-12">
                <h4 className="font-body font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#c8ff00] mb-4 md:mb-6">Product Details</h4>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {(product.details || []).map((d: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 md:gap-4 py-2 border-b border-white/5 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c8ff00]/50" />
                      <span className="font-body text-[12px] md:text-[13px] text-white/80 font-medium">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 md:mt-24">
          <div className="flex items-center gap-6 mb-8 md:mb-16">
            <h2 className="font-display text-[28px] md:text-[40px] uppercase tracking-tighter text-white">Community Feedback</h2>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>
          <div className="glass-dark p-4 md:p-12">
            <Reviews />
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)}></div>
          <div className="relative w-full max-w-[500px] bg-[#1a1a1a] border border-white/10 p-6 md:p-12 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white/40 hover:text-white transition-colors"
            >
              <ChevronRight className="rotate-45" size={24} />
            </button>
            <h2 className="font-display text-[24px] md:text-[32px] uppercase tracking-tighter mb-6 md:mb-8 italic">Size <span className="text-[#c8ff00]">Guide</span></h2>
            <div className="space-y-6">
              <table className="w-full font-body text-[11px] md:text-[12px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[#c8ff00] uppercase tracking-widest">
                    <th className="py-3 font-black">Size</th>
                    <th className="py-3 font-black">Chest (in)</th>
                    <th className="py-3 font-black">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr className="border-b border-white/5"><td className="py-3 md:py-4 font-bold text-white uppercase">Small</td><td className="py-3 md:py-4">38 - 40</td><td className="py-3 md:py-4">27.0</td></tr>
                  <tr className="border-b border-white/5"><td className="py-3 md:py-4 font-bold text-white uppercase">Medium</td><td className="py-3 md:py-4">40 - 42</td><td className="py-3 md:py-4">28.5</td></tr>
                  <tr className="border-b border-white/5"><td className="py-3 md:py-4 font-bold text-white uppercase">Large</td><td className="py-3 md:py-4">42 - 44</td><td className="py-3 md:py-4">30.0</td></tr>
                  <tr className="border-b border-white/5"><td className="py-3 md:py-4 font-bold text-white uppercase">XL</td><td className="py-3 md:py-4">44 - 46</td><td className="py-3 md:py-4">31.5</td></tr>
                </tbody>
              </table>
              <p className="font-body text-[10px] md:text-[11px] text-white/30 italic">
                * Our silhouettes are designed with a relaxed, oversized fit. For a truer fit, we recommend sizing down.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
