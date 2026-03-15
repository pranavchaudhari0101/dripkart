import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';
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
    gsap.from('.admin-anim', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 });
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
      <div className="min-h-screen pt-[160px] px-6 text-center">
        <h1 className="font-display text-[32px]">Access Denied</h1>
        <p className="font-body text-brand-textMuted mt-4">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[160px] pb-20 px-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-end mb-12 admin-anim">
        <div>
          <h1 className="font-display text-[48px] md:text-[64px] leading-tight">Project Delta</h1>
          <p className="font-body text-brand-textMuted text-[14px] uppercase tracking-[0.2em] mt-2">Product Management Portal</p>
        </div>
        {success && (
          <div className="flex items-center gap-2 text-green-600 font-body text-[13px] animate-bounce">
            <CheckCircle2 size={18} />
            Product Created Successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: General Info */}
        <div className="lg:col-span-7 space-y-12 admin-anim">
          <section>
            <h2 className="font-display text-[24px] mb-6 border-b-2 border-brand-textPrimary pb-2 font-bold uppercase tracking-tighter">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block font-body text-[11px] uppercase tracking-[0.2em] font-bold mb-2">Product Name</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full p-4 bg-white border border-brand-textPrimary font-body text-[14px] text-brand-textPrimary outline-none focus:border-brand-accentColor transition-all" />
                </div>
                <div>
                  <label className="block font-body text-[11px] uppercase tracking-[0.2em] font-bold mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-4 bg-white border border-brand-textPrimary font-body text-[14px] text-brand-textPrimary outline-none focus:border-brand-accentColor transition-all">
                    <option value="hoodies">Hoodies</option>
                    <option value="tees">Tees</option>
                    <option value="pants">Pants</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-body text-[11px] uppercase tracking-[0.2em] font-bold mb-2">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full p-4 bg-white border border-brand-textPrimary font-body text-[14px] text-brand-textPrimary outline-none focus:border-brand-accentColor resize-none transition-all" placeholder="Elaborate on the aesthetic..." />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-10">
              <div>
                <label className="block font-body text-[11px] uppercase tracking-[0.2em] font-bold mb-2">Price (₹)</label>
                <input required name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full p-4 bg-white border border-brand-textPrimary font-body text-[14px] text-brand-textPrimary outline-none focus:border-brand-accentColor transition-all" placeholder="1999" />
              </div>
              <div>
                <label className="block font-body text-[11px] uppercase tracking-[0.2em] font-bold mb-2">MRP (₹)</label>
                <input required name="mrp" type="number" value={formData.mrp} onChange={handleInputChange} className="w-full p-4 bg-white border border-brand-textPrimary font-body text-[14px] text-brand-textPrimary outline-none focus:border-brand-accentColor transition-all" placeholder="2499" />
              </div>
              <div>
                <label className="block font-body text-[11px] uppercase tracking-[0.2em] font-bold mb-2">Badge</label>
                <input name="badge" value={formData.badge} onChange={handleInputChange} className="w-full p-4 bg-white border border-brand-textPrimary font-body text-[14px] text-brand-textPrimary outline-none focus:border-brand-accentColor transition-all" placeholder="NEW / SALE / LTD" />
              </div>
            </div>

            <div className="mt-10">
              <label className="block font-body text-[11px] uppercase tracking-[0.2em] font-bold mb-2">Tags</label>
              <input name="tags" value={formData.tags} onChange={handleInputChange} className="w-full p-4 bg-white border border-brand-textPrimary font-body text-[14px] text-brand-textPrimary outline-none focus:border-brand-accentColor transition-all" placeholder="heavyweight, cotton, boxy" />
            </div>

            <div className="flex items-center gap-3 mt-10">
              <input name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleInputChange} className="w-5 h-5 accent-brand-textPrimary" />
              <label className="font-body text-[13px]">Feature this product on the index page</label>
            </div>
          </section>

          <div className="track-anim bg-white p-8 md:p-12 border border-brand-textPrimary mb-12 shadow-xl">
            <h2 className="font-display text-[24px] mb-6 border-b-2 border-brand-textPrimary pb-2 font-bold uppercase tracking-tighter">Inventory</h2>
            <div className="space-y-4">
              {sizes.map((s, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <input value={s.size} onChange={(e) => handleSizeChange(idx, 'size', e.target.value)} className="w-24 p-4 bg-white border border-brand-textPrimary font-body text-[14px] text-brand-textPrimary outline-none focus:border-brand-accentColor transition-all" placeholder="Size" />
                  <input type="number" value={s.stock} onChange={(e) => handleSizeChange(idx, 'stock', parseInt(e.target.value))} className="w-32 p-4 bg-white border border-brand-textPrimary font-body text-[14px] text-brand-textPrimary outline-none focus:border-brand-accentColor transition-all" placeholder="Stock" />
                  <button type="button" onClick={() => setSizes(sizes.filter((_, i) => i !== idx))} className="p-4 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setSizes([...sizes, { size: '', stock: 0 }])} className="flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.2em] font-bold hover:text-brand-accentColor transition-colors mt-6 bg-black text-white px-6 py-3 w-fit shadow-lg">
                <Plus size={16} /> Add Size Variant
              </button>
            </div>
          </div>
        </div>

        {/* Right: Media & Submit */}
        <div className="lg:col-span-5 space-y-12 admin-anim">
          <section className="bg-white p-8 md:p-12 border border-brand-textPrimary shadow-xl">
            <h2 className="font-display text-[24px] mb-8 border-b-2 border-brand-textPrimary pb-2 font-bold uppercase tracking-tighter">Images</h2>
            <div className="grid grid-cols-2 gap-6">
              {images.map((img, idx) => (
                <div key={idx} className={`relative aspect-[3/4] border ${img ? 'border-brand-textPrimary' : 'border-dashed border-brand-textPrimary'} group transition-all`}>
                  {img ? (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${URL.createObjectURL(img)})` }}>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => handleImageChange(idx, { target: { files: null } } as any)} className="text-white hover:text-brand-accentColor transition-colors">
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-accentColor transition-colors">
                      <Upload size={24} className="text-brand-textPrimary mb-2" strokeWidth={2} />
                      <span className="font-body text-[11px] uppercase tracking-[0.2em] text-brand-textPrimary font-bold">Slot {idx + 1}</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(idx, e)} className="hidden" />
                    </label>
                  )}
                  {idx === 0 && <span className="absolute top-0 right-0 px-3 py-1 bg-black text-brand-accentColor text-[10px] uppercase tracking-[0.2em] font-bold font-body">Cover</span>}
                </div>
              ))}
            </div>
            <p className="font-body text-[12px] text-brand-textPrimary mt-6 italic font-bold">Standard Portrait: 1200x1600.</p>
          </section>

          <button type="submit" disabled={isLoading} className="w-full py-6 bg-black text-white font-body font-bold text-[14px] uppercase tracking-[0.3em] hover:bg-brand-accentColor hover:text-black transition-all shadow-xl">
            {isLoading ? 'Saving Product...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
