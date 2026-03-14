import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { Heart, ChevronRight } from 'lucide-react';

const PRODUCTS: Record<string, any> = {
  'hoodie': { id: 'hoodie', name: 'Mens Premium Oversized Hoodie', price: 1299, image: '/src/assets/hoodie.png', desc: 'Heavyweight loopback cotton. Dropped shoulders, relaxed fit.', details: ['100% Organic Cotton', '450gsm heavyweight fabric', 'Kangaroo pocket', 'Ribbed trims'] },
  'cargo': { id: 'cargo', name: 'Mens Cargo Shirt — Cream', price: 1099, image: '/src/assets/cargo-shirt.png', desc: 'Utility meets luxury. Multiple 3D pockets with a boxy silhouette.', details: ['100% Cotton Twill', '4 utility chest pockets', 'Boxy fit', 'Branded buttons'] },
  'drop': { id: 'drop', name: 'Premium Urban Drop Tee', price: 799, image: '/src/assets/drop-tee.png', desc: 'The perfect essential drop-shoulder tee. Ultra-soft.', details: ['Interlock jersey', 'Ribbed crewneck', 'Drop shoulders', 'Subtle branding'] },
  'zipup': { id: 'zipup', name: 'Mens Zip-Up Hoodie — Slate', price: 1499, image: '/src/assets/zipup-hoodie.png', desc: 'Everyday essential zip-up. Features a custom metal zipper.', details: ['Brushed fleece interior', 'YKK metal zipper', 'Regular fit', 'Tonal embroidery'] }
};

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: product = PRODUCTS['hoodie'] } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return {
        ...res.data,
        image: res.data.images?.[0]?.url || PRODUCTS[id || 'hoodie']?.image || '/src/assets/hoodie.png',
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
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.pd-image', { x: -40, opacity: 0, duration: 0.8 })
      .from('.pd-info > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.4');
  }, [id]);

  return (
    <div className="pt-[120px] pb-20 px-6 md:px-12 max-w-[1400px] mx-auto min-h-screen">
      <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.15em] text-brand-textMuted mb-8">
        <Link to="/" className="hover:text-brand-textPrimary transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-brand-textPrimary transition-colors">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-brand-textPrimary">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Product Image */}
        <div className="pd-image relative bg-brand-bgSecondary aspect-[3/4] overflow-hidden group">
          <button className="absolute top-5 right-5 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer z-10 hover:bg-brand-accentColor transition-colors shadow-xl">
            <Heart size={18} strokeWidth={1.5} className="text-brand-textPrimary" />
          </button>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110" />
        </div>

        {/* Product Info */}
        <div className="pd-info py-4">
          <h1 className="font-display font-medium text-[36px] md:text-[44px] leading-[1.1] mb-2">{product.name}</h1>
          <p className="font-display font-semibold text-[24px] mb-8">₹{product.price.toLocaleString()}</p>
          
          <p className="font-body text-[14px] leading-[1.8] text-brand-textMuted mb-10">
            {product.desc}
          </p>

          {/* Size Selector */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body font-bold text-[12px] uppercase tracking-[0.2em] text-brand-textPrimary">Select Size</span>
              <button className="font-body text-[11px] text-brand-textPrimary font-medium underline underline-offset-4 hover:text-brand-accentColor transition-colors">Size Guide</button>
            </div>
                  <div className="grid grid-cols-4 gap-3">
                    {product.sizes.map((s: { size: string; stock: number }) => (
                      <button 
                        key={s.size}
                        disabled={s.stock === 0}
                        onClick={() => setSize(s.size)}
                        className={`py-3 border font-body text-[12px] font-bold transition-all ${
                          size === s.size 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-black border-brand-textPrimary hover:border-black'
                        } ${s.stock === 0 ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>
          </div>

          {/* Quantity */}
          <div className="mb-12">
            <span className="block font-body font-bold text-[12px] uppercase tracking-[0.2em] text-brand-textPrimary mb-4">Quantity</span>
            <div className="flex items-center border border-gray-300 w-fit h-14 bg-white shadow-md rounded-sm">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-14 h-full flex items-center justify-center hover:bg-brand-accentColor font-black transition-colors">-</button>
              <div className="w-14 h-full flex items-center justify-center font-body text-[14px] font-bold border-x border-gray-300 bg-white">{qty}</div>
              <button onClick={() => setQty(qty + 1)} className="w-14 h-full flex items-center justify-center hover:bg-brand-accentColor font-black transition-colors">+</button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={() => {
              addToCart({ ...product, size, quantity: qty });
              toggleCart();
            }}
            className="w-full py-6 bg-black text-white font-body font-bold text-[14px] uppercase tracking-[0.4em] transition-all hover:bg-brand-accentColor hover:text-black active:scale-[0.98] shadow-xl relative overflow-hidden group mb-12"
          >
            <span className="relative z-10">Add to Cart — ₹{(product.price * qty).toLocaleString()}</span>
          </button>

          {/* Details */}
          <div className="mt-12 pt-10 border-t border-gray-200">
            <h4 className="font-body font-bold text-[12px] uppercase tracking-[0.2em] text-brand-textPrimary mb-6">Product Specifications</h4>
            <ul className="space-y-4 font-body text-[14px] text-brand-textPrimary font-bold">
              {product.details.map((d: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-brand-accentColor flex-shrink-0"></span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
