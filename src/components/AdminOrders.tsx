import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Package, Truck, ChevronDown, ChevronUp, Printer, RefreshCw, AlertCircle } from 'lucide-react';

interface OrderItem {
  id: string; productId: string; size: string; quantity: number;
  price: number; productName: string; productSku: string; image: string | null;
}
interface Order {
  id: string; userId: string; totalAmount: number; finalAmount: number;
  paymentStatus: string; paymentGateway: string; deliveryStatus: string;
  shipRocketId: string | null; awbCode: string | null; courierName: string | null;
  shippingAddress: any; createdAt: string; customerName: string; customerEmail: string; itemCount: number;
}
interface OrderDetail extends Order {
  customer: { name: string; email: string; phone: string };
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  PAID: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
  PROCESSING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PICKUP_SCHEDULED: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  SHIPPED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  IN_TRANSIT: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  OUT_FOR_DELIVERY: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  DELIVERED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  RETURN_INITIATED: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  RETURNED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const DELIVERY_STATUSES = [
  'PROCESSING','PICKUP_SCHEDULED','OUT_FOR_PICKUP','SHIPPED','IN_TRANSIT','OUT_FOR_DELIVERY','DELIVERED','RETURN_INITIATED','RETURNED'
];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter === 'PAID' || filter === 'PENDING') params.status = filter;
      else if (filter !== 'all') params.delivery = filter;
      const res = await api.get('/admin/orders', { params });
      setOrders(res.data);
    } catch (err) { console.error('Failed to fetch orders', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const toggleExpand = async (orderId: string) => {
    if (expandedId === orderId) { setExpandedId(null); setDetail(null); return; }
    setExpandedId(orderId);
    setDetailLoading(true);
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      setDetail(res.data);
    } catch (err) { console.error(err); }
    finally { setDetailLoading(false); }
  };

  const confirmShipping = async (orderId: string) => {
    if (!confirm('Confirm shipping for this order? This will create a Shiprocket shipment.')) return;
    setActionLoading(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/confirm-shipping`);
      alert('Shipping confirmed! Courier assigned.');
      fetchOrders();
      if (expandedId === orderId) toggleExpand(orderId);
    } catch (err: any) { alert(err.response?.data?.error || 'Failed'); }
    finally { setActionLoading(null); }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setActionLoading(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { deliveryStatus: newStatus });
      fetchOrders();
    } catch (err: any) { alert(err.response?.data?.error || 'Failed'); }
    finally { setActionLoading(null); }
  };

  const printLabel = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const res = await api.get(`/admin/orders/${orderId}/label`);
      if (res.data.labelUrl) window.open(res.data.labelUrl, '_blank');
      else alert('Label not available yet');
    } catch (err: any) { alert(err.response?.data?.error || 'Failed'); }
    finally { setActionLoading(null); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <button onClick={() => fetchOrders()} className="p-2 glass-dark border border-white/10 hover:border-[#c8ff00]/40 transition-colors" title="Refresh">
          <RefreshCw size={16} className={`text-[#c8ff00] ${loading ? 'animate-spin' : ''}`} />
        </button>
        {['all','PENDING','PAID','PROCESSING','SHIPPED','DELIVERED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 font-body text-[10px] uppercase tracking-[0.2em] font-bold border transition-all ${filter === f ? 'bg-[#c8ff00] text-black border-[#c8ff00]' : 'glass-dark border-white/10 text-white/60 hover:border-white/30'}`}
          >{f === 'all' ? 'All Orders' : f}</button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: orders.length, color: 'white' },
          { label: 'Awaiting Ship', value: orders.filter(o => o.deliveryStatus === 'PROCESSING' && (o.paymentStatus === 'PAID' || o.paymentGateway === 'cod')).length, color: '#c8ff00' },
          { label: 'In Transit', value: orders.filter(o => ['SHIPPED','IN_TRANSIT','OUT_FOR_DELIVERY'].includes(o.deliveryStatus)).length, color: '#818cf8' },
          { label: 'Delivered', value: orders.filter(o => o.deliveryStatus === 'DELIVERED').length, color: '#34d399' },
        ].map(s => (
          <div key={s.label} className="glass-dark border border-white/5 p-5">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">{s.label}</p>
            <p className="font-display text-[28px]" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-20"><RefreshCw size={24} className="animate-spin text-[#c8ff00] mx-auto" /><p className="font-body text-white/40 text-[12px] mt-4 uppercase tracking-widest">Loading orders...</p></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 glass-dark border border-white/5 p-12">
          <Package size={48} className="text-white/20 mx-auto mb-4" />
          <p className="font-body text-white/40 text-[13px]">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className={`glass-dark border transition-all ${expandedId === order.id ? 'border-[#c8ff00]/30' : 'border-white/5 hover:border-white/15'}`}>
              {/* Row */}
              <button onClick={() => toggleExpand(order.id)} className="w-full flex flex-wrap items-center gap-4 p-5 text-left">
                <div className="flex-1 min-w-[140px]">
                  <p className="font-body text-[10px] text-white/30 uppercase tracking-widest mb-1">Order</p>
                  <p className="font-body text-[13px] font-bold text-[#c8ff00] truncate">{order.id.slice(0, 16)}...</p>
                </div>
                <div className="w-[140px]">
                  <p className="font-body text-[10px] text-white/30 uppercase tracking-widest mb-1">Customer</p>
                  <p className="font-body text-[13px] font-bold truncate">{order.customerName}</p>
                </div>
                <div className="w-[100px]">
                  <p className="font-body text-[10px] text-white/30 uppercase tracking-widest mb-1">Amount</p>
                  <p className="font-display text-[16px] font-bold">₹{order.finalAmount.toLocaleString()}</p>
                </div>
                <div className="w-[100px]">
                  <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-wider border ${STATUS_COLORS[order.paymentStatus] || 'bg-white/10 text-white/60'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="w-[120px]">
                  <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-wider border ${STATUS_COLORS[order.deliveryStatus] || 'bg-white/10 text-white/60'}`}>
                    {order.deliveryStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="w-[130px] hidden md:block">
                  <p className="font-body text-[11px] text-white/40">{formatDate(order.createdAt)}</p>
                </div>
                <div className="w-6">{expandedId === order.id ? <ChevronUp size={16} className="text-[#c8ff00]" /> : <ChevronDown size={16} className="text-white/30" />}</div>
              </button>

              {/* Expanded Detail */}
              {expandedId === order.id && (
                <div className="border-t border-white/10 p-6 space-y-6">
                  {detailLoading ? (
                    <p className="text-center text-white/40 text-[12px] py-8">Loading details...</p>
                  ) : detail ? (
                    <>
                      {/* Customer & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#c8ff00] font-bold mb-3">Customer</p>
                          <p className="font-body text-[14px] font-bold">{detail.customer.name}</p>
                          <p className="font-body text-[12px] text-white/60">{detail.customer.email}</p>
                          <p className="font-body text-[12px] text-white/60">{detail.customer.phone || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#c8ff00] font-bold mb-3">Shipping Address</p>
                          {detail.shippingAddress && (
                            <>
                              <p className="font-body text-[14px] font-bold">{(detail.shippingAddress as any).fullName}</p>
                              <p className="font-body text-[12px] text-white/60">{(detail.shippingAddress as any).line1}</p>
                              <p className="font-body text-[12px] text-white/60">{(detail.shippingAddress as any).city}, {(detail.shippingAddress as any).state} - {(detail.shippingAddress as any).pincode}</p>
                              <p className="font-body text-[12px] text-white/60">Ph: {(detail.shippingAddress as any).phone}</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#c8ff00] font-bold mb-4">Items ({detail.items.length})</p>
                        <div className="space-y-3">
                          {detail.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 glass border border-white/5 p-3">
                              {item.image ? (
                                <img src={item.image} alt="" className="w-12 h-16 object-cover" />
                              ) : (
                                <div className="w-12 h-16 bg-white/5 flex items-center justify-center"><Package size={16} className="text-white/20" /></div>
                              )}
                              <div className="flex-1">
                                <p className="font-body text-[13px] font-bold">{item.productName}</p>
                                <p className="font-body text-[10px] text-white/40 uppercase">SKU: {item.productSku} · Size: {item.size} · Qty: {item.quantity}</p>
                              </div>
                              <p className="font-display text-[14px] font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Info */}
                      {detail.awbCode && (
                        <div className="glass border border-white/10 p-4 flex flex-wrap gap-6">
                          <div><p className="font-body text-[9px] text-white/30 uppercase tracking-widest mb-1">AWB Code</p><p className="font-body text-[14px] font-bold text-[#c8ff00]">{detail.awbCode}</p></div>
                          <div><p className="font-body text-[9px] text-white/30 uppercase tracking-widest mb-1">Courier</p><p className="font-body text-[14px] font-bold">{detail.courierName || 'Pending'}</p></div>
                          <div><p className="font-body text-[9px] text-white/30 uppercase tracking-widest mb-1">Shiprocket ID</p><p className="font-body text-[14px] font-bold">{detail.shipRocketId}</p></div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                        {/* Confirm & Ship button - only show if PROCESSING and payment ok */}
                        {detail.deliveryStatus === 'PROCESSING' && (detail.paymentStatus === 'PAID' || detail.paymentGateway === 'cod') && (
                          <button onClick={() => confirmShipping(detail.id)} disabled={actionLoading === detail.id}
                            className="flex items-center gap-2 px-6 py-3 bg-[#c8ff00] text-black font-body font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all disabled:opacity-50">
                            <Truck size={16} />{actionLoading === detail.id ? 'Processing...' : 'Confirm & Ship'}
                          </button>
                        )}

                        {/* Print Label - only if shipped */}
                        {detail.shipRocketId && (
                          <button onClick={() => printLabel(detail.id)} disabled={actionLoading === detail.id}
                            className="flex items-center gap-2 px-6 py-3 glass-dark border border-white/20 text-white font-body font-bold text-[11px] uppercase tracking-[0.2em] hover:border-[#c8ff00]/40 transition-all disabled:opacity-50">
                            <Printer size={16} />Print Label
                          </button>
                        )}

                        {/* Status Override */}
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="font-body text-[9px] text-white/30 uppercase tracking-widest">Status:</span>
                          <select value={detail.deliveryStatus}
                            onChange={(e) => updateStatus(detail.id, e.target.value)}
                            className="bg-transparent border border-white/20 text-white font-body text-[11px] px-3 py-2 outline-none focus:border-[#c8ff00] appearance-none cursor-pointer uppercase tracking-wider">
                            {DELIVERY_STATUSES.map(s => <option key={s} value={s} className="bg-[#121212]">{s.replace(/_/g, ' ')}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Payment pending warning */}
                      {detail.paymentStatus === 'PENDING' && detail.paymentGateway !== 'cod' && (
                        <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20">
                          <AlertCircle size={16} className="text-yellow-400 shrink-0" />
                          <p className="font-body text-[12px] text-yellow-300">Payment is still pending. Do not ship until payment is confirmed.</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-red-400 text-[12px] py-4">Failed to load order details</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
