import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Trash2, Save, Package, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface Variant {
  id: string;
  size: string;
  stock: number;
  isActive: boolean;
  _delete?: boolean;
}

interface Product {
  id: string;
  name: string;
  category: string;
  image: string | null;
  totalStock: number;
  variants: Variant[];
  isActive: boolean;
}

export function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editedVariants, setEditedVariants] = useState<Record<string, Variant[]>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<{ id: string; ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/products');
      setProducts(res.data);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (productId: string) => {
    if (expandedId === productId) {
      setExpandedId(null);
    } else {
      setExpandedId(productId);
      if (!editedVariants[productId]) {
        const p = products.find(p => p.id === productId);
        if (p) setEditedVariants(prev => ({ ...prev, [productId]: [...p.variants] }));
      }
    }
  };

  const updateVariant = (productId: string, idx: number, field: keyof Variant, value: any) => {
    setEditedVariants(prev => {
      const vars = [...(prev[productId] || [])];
      vars[idx] = { ...vars[idx], [field]: value };
      return { ...prev, [productId]: vars };
    });
  };

  const addVariant = (productId: string) => {
    setEditedVariants(prev => {
      const vars = [...(prev[productId] || [])];
      vars.push({ id: '', size: '', stock: 0, isActive: true });
      return { ...prev, [productId]: vars };
    });
  };

  const markDelete = (productId: string, idx: number) => {
    setEditedVariants(prev => {
      const vars = [...(prev[productId] || [])];
      if (!vars[idx].id) {
        vars.splice(idx, 1);
      } else {
        vars[idx] = { ...vars[idx], _delete: true };
      }
      return { ...prev, [productId]: vars };
    });
  };

  const saveVariants = async (productId: string) => {
    const vars = editedVariants[productId];
    if (!vars) return;

    setSaving(productId);
    setSaveMsg(null);
    try {
      const res = await api.patch(`/admin/products/${productId}/variants`, { variants: vars });
      setSaveMsg({ id: productId, ok: true, text: 'Inventory updated!' });
      // Refresh
      setEditedVariants(prev => ({ ...prev, [productId]: res.data.variants }));
      setProducts(prev => prev.map(p => p.id === productId
        ? { ...p, variants: res.data.variants, totalStock: res.data.variants.reduce((s: number, v: any) => s + (v.stock ?? 0), 0) }
        : p
      ));
    } catch (err: any) {
      setSaveMsg({ id: productId, ok: false, text: err.response?.data?.error || 'Save failed' });
    } finally {
      setSaving(null);
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#c8ff00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-[24px] md:text-[32px] uppercase tracking-tighter font-medium">
          Inventory <span className="text-white/40 italic">Control</span>
        </h2>
        <span className="font-body text-[11px] text-white/40 uppercase tracking-[0.2em]">
          {products.length} products
        </span>
      </div>

      {products.map(product => {
        const isExpanded = expandedId === product.id;
        const variants = editedVariants[product.id] || product.variants;
        const activeVariants = variants.filter(v => !v._delete);
        const isLowStock = product.totalStock > 0 && product.totalStock <= 10;
        const isOutOfStock = product.totalStock === 0;

        return (
          <div key={product.id} className="glass-dark border border-white/5 overflow-hidden">
            {/* Product Row */}
            <button
              onClick={() => toggleExpand(product.id)}
              className="w-full flex items-center gap-4 md:gap-6 p-4 md:p-6 text-left hover:bg-white/5 transition-colors"
            >
              {/* Image */}
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 overflow-hidden flex-shrink-0">
                {product.image ? (
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={20} className="text-white/20" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-body text-[13px] md:text-[14px] font-bold text-white truncate">{product.name}</p>
                <p className="font-body text-[10px] text-white/40 uppercase tracking-wider mt-1">
                  {product.category} · {product.variants.length} sizes
                </p>
              </div>

              {/* Stock Badge */}
              <div className="flex items-center gap-3">
                {isOutOfStock && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 font-body text-[10px] font-bold uppercase tracking-wider">
                    <AlertTriangle size={12} /> Out of Stock
                  </span>
                )}
                {isLowStock && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-body text-[10px] font-bold uppercase tracking-wider">
                    Low Stock
                  </span>
                )}
                <span className="font-body text-[14px] font-bold text-white/60 min-w-[40px] text-right">
                  {product.totalStock}
                </span>
                {isExpanded ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
              </div>
            </button>

            {/* Expanded Variant Editor */}
            {isExpanded && (
              <div className="border-t border-white/5 p-4 md:p-6 bg-white/[0.02]">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_100px_60px] md:grid-cols-[1fr_120px_80px] gap-4 px-2 mb-2">
                    <span className="font-body text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">Size</span>
                    <span className="font-body text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">Stock</span>
                    <span></span>
                  </div>

                  {activeVariants.map((v, idx) => {
                    const realIdx = variants.indexOf(v);
                    return (
                      <div key={v.id || `new-${idx}`} className="grid grid-cols-[1fr_100px_60px] md:grid-cols-[1fr_120px_80px] gap-4 items-center">
                        <input
                          value={v.size}
                          onChange={e => updateVariant(product.id, realIdx, 'size', e.target.value)}
                          disabled={!!v.id}
                          placeholder="e.g. XL"
                          className={`w-full pb-2 bg-transparent border-b font-body text-[14px] font-bold uppercase text-white outline-none transition-all ${
                            v.id ? 'border-white/10 opacity-60' : 'border-[#c8ff00]/50 focus:border-[#c8ff00]'
                          }`}
                        />
                        <input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={e => updateVariant(product.id, realIdx, 'stock', parseInt(e.target.value) || 0)}
                          className={`w-full pb-2 bg-transparent border-b font-body text-[14px] outline-none focus:border-[#c8ff00] transition-all ${
                            v.stock === 0 ? 'text-red-400 border-red-500/30' : v.stock <= 5 ? 'text-amber-400 border-amber-500/30' : 'text-emerald-400 border-white/10'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => markDelete(product.id, realIdx)}
                          className="p-2 text-white/20 hover:text-red-500 transition-colors justify-self-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => addVariant(product.id)}
                    className="flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.15em] font-bold text-[#c8ff00] hover:brightness-125 transition-all"
                  >
                    <Plus size={14} /> Add Size
                  </button>

                  <div className="flex-1" />

                  {saveMsg?.id === product.id && (
                    <span className={`font-body text-[11px] uppercase tracking-wider font-bold ${saveMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                      {saveMsg.text}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => saveVariants(product.id)}
                    disabled={saving === product.id}
                    className="flex items-center gap-2 px-6 py-3 bg-[#c8ff00] text-black font-body text-[11px] uppercase tracking-[0.15em] font-black hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    <Save size={14} />
                    {saving === product.id ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {products.length === 0 && (
        <div className="text-center py-20 glass-dark border border-white/5">
          <Package size={48} className="text-white/10 mx-auto mb-4" />
          <p className="font-body text-[13px] text-white/40 uppercase tracking-wider">No products found</p>
        </div>
      )}
    </div>
  );
}
