import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export function Admin() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    category: 'Essential',
    badge: '',
    isFeatured: false,
    tags: '',
  });

  const [sizes, setSizes] = useState<{size: string, stock: number}[]>([
    { size: 'S', stock: 10 },
    { size: 'M', stock: 10 },
    { size: 'L', stock: 10 }
  ]);

  const [images, setImages] = useState<(File | null)[]>([null, null, null, null, null]);

  useEffect(() => {
    // Set initial state to prevent visibility flicker
    gsap.set('.admin-anim', { opacity: 0, y: 10 });
    gsap.to('.admin-anim', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSizeChange = (index: number, field: 'size' | 'stock', value: string | number) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('mrp', formData.mrp);
      data.append('category', formData.category);
      data.append('badge', formData.badge);
      data.append('isFeatured', String(formData.isFeatured));
      
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      data.append('tags', JSON.stringify(tagsArray));

      const sizeMap: Record<string, number> = {};
      sizes.forEach(s => { if(s.size) sizeMap[s.size] = s.stock; });
      data.append('sizes', JSON.stringify(sizeMap));

      images.forEach((img, i) => {
        if (img) data.append(`image${i + 1}`, img);
      });

      await api.post('/admin/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(true);
      setFormData({
        name: '', description: '', price: '', mrp: '', 
        category: 'Essential', badge: '', isFeatured: false, tags: ''
      });
      setImages([null, null, null, null, null]);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#121212] pt-[160px] px-6 text-center text-white">
        <h1 className="font-display text-[32px] tracking-tighter uppercase">Access Denied</h1>
        <p className="font-body text-white/40 mt-4 max-w-md mx-auto">This terminal is restricted to authorized personnel. Please return to the main hub.</p>
        <Link to="/" className="inline-block mt-8 px-8 py-3 bg-[#c8ff00] text-black font-body font-bold text-[11px] uppercase tracking-[0.2em]">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pt-[140px] pb-20 px-6 max-w-[1600px] mx-auto overflow-hidden">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 admin-anim">
        <div>
          <span className="text-[#c8ff00] font-body text-[11px] font-bold uppercase tracking-[0.4em] mb-4 block">System Authorization: Layer 01</span>
          <h1 className="font-display text-[56px] md:text-[80px] leading-[0.85] tracking-tighter uppercase font-medium text-white">
            Drip Command <span className="text-white/40 italic">Center</span>
          </h1>
          <div className="flex items-center gap-4 mt-8">
            <div className="h-[2px] w-20 bg-[#d1ff00]"></div>
            <p className="font-body text-white/60 text-[11px] uppercase tracking-[0.3em]">Authorized Session: {user?.name}</p>
          </div>
        </div>
        {success && (
          <div className="glass-dark border border-[#c8ff00]/30 px-6 py-4 mt-8 md:mt-0 flex items-center gap-4 animate-in fade-in slide-in-from-right-10">
            <div className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
            <span className="font-body text-[12px] uppercase font-bold text-[#c8ff00] tracking-[0.1em]">Product Payload Uploaded Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-7 space-y-12 admin-anim">
          <section className="glass-dark p-10 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 font-body text-[8px] opacity-20 uppercase">Module: Core_Config</div>
            <h2 className="font-display text-[20px] mb-10 border-b border-white/10 pb-6 font-bold uppercase tracking-tight">Technical Specifications</h2>
            
            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-8">
                <div className="group">
                  <label className="block font-body text-[10px] uppercase tracking-[0.2em] font-black mb-3 text-white/70 group-focus-within:text-[#d1ff00] transition-colors">Designation / Name</label>
                  <input 
                    required 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter product title..." 
                    className="w-full pb-3 bg-transparent border-b border-white/20 font-display text-[24px] uppercase text-white outline-none focus:border-[#d1ff00] transition-all placeholder:text-white/10" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-white/50 group-focus-within:text-[#c8ff00] transition-colors">Classification</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange} 
                      className="w-full pb-3 bg-transparent border-b border-white/20 font-body text-[14px] text-white outline-none focus:border-[#c8ff00] transition-all appearance-none cursor-pointer"
                    >
                      <option value="hoodies" className="bg-[#121212]">Hoodies</option>
                      <option value="tees" className="bg-[#121212]">Tees</option>
                      <option value="pants" className="bg-[#121212]">Pants</option>
                      <option value="accessories" className="bg-[#121212]">Accessories</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="block font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-white/50 group-focus-within:text-[#c8ff00] transition-colors">Limited Edition Badge</label>
                    <input name="badge" value={formData.badge} onChange={handleInputChange} placeholder="e.g. DROP_01" className="w-full pb-3 bg-transparent border-b border-white/20 font-body text-[14px] text-white outline-none focus:border-[#c8ff00] transition-all placeholder:text-white/10 uppercase" />
                  </div>
                </div>

                <div className="group">
                  <label className="block font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-white/50 group-focus-within:text-[#c8ff00] transition-colors">Aesthetic Description</label>
                  <textarea 
                    required 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows={4} 
                    className="w-full p-4 glass-dark border border-white/10 font-body text-[14px] text-white/80 outline-none focus:border-[#c8ff00] resize-none transition-all placeholder:text-white/20" 
                    placeholder="Describe the fabric, fit, and soul of this piece..." 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="group">
                  <label className="block font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-white/50 group-focus-within:text-[#c8ff00] transition-colors">Unit Price (₹)</label>
                  <input required name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full pb-3 bg-transparent border-b border-white/20 font-display text-[20px] text-white outline-none focus:border-[#c8ff00] transition-all" />
                </div>
                <div className="group">
                  <label className="block font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-white/50 group-focus-within:text-[#c8ff00] transition-colors">Base MRP (₹)</label>
                  <input required name="mrp" type="number" value={formData.mrp} onChange={handleInputChange} className="w-full pb-3 bg-transparent border-b border-white/20 font-display text-[20px] text-white/40 outline-none focus:border-[#c8ff00] transition-all" />
                </div>
              </div>

              <div className="group">
                <label className="block font-body text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-white/50 group-focus-within:text-[#c8ff00] transition-colors">Metadata Tags</label>
                <input name="tags" value={formData.tags} onChange={handleInputChange} className="w-full pb-3 bg-transparent border-b border-white/20 font-body text-[14px] text-white outline-none focus:border-[#c8ff00] transition-all placeholder:text-white/10" placeholder="separate with commas (e.g. rare, cotton, oversized)" />
              </div>

              <div className="flex items-center gap-4 py-4 px-6 glass-dark border border-white/5 w-fit rounded-sm group cursor-pointer">
                <input name="isFeatured" type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-4 h-4 accent-[#c8ff00] cursor-pointer" />
                <label htmlFor="isFeatured" className="font-body text-[11px] uppercase tracking-[0.1em] font-bold cursor-pointer text-white/60 group-hover:text-white">Feature in Main Carousel</label>
              </div>
            </div>
          </section>

          <section className="glass-dark p-10 border border-white/5">
            <h2 className="font-display text-[20px] mb-10 border-b border-white/10 pb-6 font-bold uppercase tracking-tight">Inventory Distribution</h2>
            <div className="space-y-6">
              {sizes.map((s, idx) => (
                <div key={idx} className="flex gap-8 items-center group">
                  <div className="flex-1">
                    <input 
                      value={s.size} 
                      onChange={(e) => handleSizeChange(idx, 'size', e.target.value)} 
                      className="w-full pb-2 bg-transparent border-b border-white/10 font-body text-[14px] font-bold uppercase text-white outline-none focus:border-[#c8ff00] transition-all" 
                      placeholder="SIZE_CODE" 
                    />
                  </div>
                  <div className="w-32">
                    <input 
                      type="number" 
                      value={s.stock} 
                      onChange={(e) => handleSizeChange(idx, 'stock', parseInt(e.target.value))} 
                      className="w-full pb-2 bg-transparent border-b border-white/10 font-body text-[14px] text-white/60 outline-none focus:border-[#c8ff00] transition-all" 
                      placeholder="STOCK_UNIT" 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSizes(sizes.filter((_, i) => i !== idx))} 
                    className="p-3 text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setSizes([...sizes, { size: '', stock: 0 }])} 
                className="flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.2em] font-black text-[#c8ff00] hover:brightness-125 transition-all mt-8"
              >
                <Plus size={14} /> Add Inventory Instance
              </button>
            </div>
          </section>
        </div>

        {/* Right: Media Manifest & Authorization */}
        <div className="lg:col-span-5 space-y-12 admin-anim">
          <section className="glass-dark p-10 border border-white/5">
            <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
              <h2 className="font-display text-[20px] font-bold uppercase tracking-tight">Media Assets</h2>
              <span className="font-body text-[10px] text-white/30 uppercase tracking-[0.2em]">Slots Available: 5</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className={`relative aspect-[3/4] glass border ${img ? 'border-[#c8ff00]/30 glow shadow-[0_0_20px_rgba(200,255,0,0.05)]' : 'border-dashed border-white/10'} overflow-hidden group transition-all`}>
                  {img ? (
                    <div className="absolute inset-0">
                      <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
                      <div className="absolute inset-0 bg-[#c8ff00]/10 mix-blend-overlay pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <button type="button" onClick={() => handleImageChange(idx, { target: { files: null } } as any)} className="w-12 h-12 glass-dark rounded-full flex items-center justify-center text-[#c8ff00] hover:bg-[#c8ff00] hover:text-black transition-all">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                      <Upload size={20} className="text-[#c8ff00] mb-3 opacity-50" strokeWidth={1.5} />
                      <span className="font-body text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">Upload_0{idx + 1}</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(idx, e)} className="hidden" />
                    </label>
                  )}
                  {idx === 0 && <span className="absolute top-4 left-4 px-3 py-1 glass-dark text-[#c8ff00] text-[8px] uppercase tracking-[0.3em] font-bold font-body border border-[#c8ff00]/30">Primary</span>}
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-7 bg-[#c8ff00] text-black font-body font-black text-[14px] uppercase tracking-[0.5em] hover:brightness-110 transition-all shadow-[0_0_40px_rgba(200,255,0,0.1)] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? 'Authorizing Payload...' : 'Authorize Dispatch'}
            </button>
            <p className="text-center font-body text-[9px] text-white/40 uppercase tracking-[0.3em] leading-relaxed">
              Dispatching this product will broadcast it to the global shop registry.<br />Ensure all technical specifications are validated.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
