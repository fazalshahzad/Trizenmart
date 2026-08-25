import React, { useState } from 'react';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Package, 
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/helpers';
import { Order } from '../types';

export const OrderTrackingView: React.FC = () => {
  const { orders, settings, selectedOrder, setSelectedOrder, addToast } = useStore();

  const [searchId, setSearchId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(selectedOrder || orders[0] || null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    if (!query) return;

    const found = orders.find(
      o => o.orderNumber.toUpperCase() === query ||
           o.customer.phoneNumber.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, ''))
    );

    if (found) {
      setTrackedOrder(found);
      setSelectedOrder(found);
      setSearched(true);
      addToast(`Tracking details found for ${found.orderNumber}`, 'success');
    } else {
      setTrackedOrder(null);
      setSearched(true);
      addToast('No order found with that Order ID or Phone number', 'warning');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">Order Pending Verification</span>;
      case 'confirmed':
        return <span className="bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full">Verified & Queued for Packing</span>;
      case 'processing':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">Packed in Warehouse</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Transit via Courier</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Delivered Successfully</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="trizenmart-tracking-view">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-extrabold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5" />
          <span>Live Parcel Tracking</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your {settings.storeName} Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Enter your Order ID (e.g. <span className="font-mono font-bold text-slate-700">TZM-90412</span>) or registered phone number to check dispatch status in Pakistan.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID (TZM-XXXXX) or 0300 1234567..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:outline-hidden focus:border-emerald-500 uppercase tracking-wide"
              id="tracking-search-input"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-colors shadow-sm"
            id="tracking-search-btn"
          >
            Track Status
          </button>
        </form>
      </div>

      {/* Tracking Result Card */}
      {trackedOrder ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-slate-900 font-mono">
                  {trackedOrder.orderNumber}
                </h2>
                {getStatusBadge(trackedOrder.status)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Placed on {new Date(trackedOrder.date).toLocaleString()} • Recipient: <strong className="text-slate-800">{trackedOrder.customer.fullName}</strong>
              </p>
            </div>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20need%20a%20status%20update%20for%20order%20${trackedOrder.orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Courier Support</span>
            </a>
          </div>

          {/* Courier Logistics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 font-semibold">Courier Logistics</span>
              <p className="font-bold text-slate-900 mt-0.5">{trackedOrder.courierName || 'TCS Express Pakistan'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Consignment / Tracking #</span>
              <p className="font-mono font-bold text-emerald-700 mt-0.5">{trackedOrder.trackingNumber || 'Pending Dispatch'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Estimated Arrival</span>
              <p className="font-bold text-slate-900 mt-0.5">{trackedOrder.estimatedDelivery}</p>
            </div>
          </div>

          {/* Step-by-Step Progress Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracking Timeline</h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {trackedOrder.timeline.map((event, i) => (
                <div key={i} className="relative flex items-start gap-4">
                  
                  {/* Timeline Dot */}
                  <div className={`absolute -left-6 sm:-left-8 w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    event.completed 
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' 
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {event.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`text-xs sm:text-sm font-bold ${event.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                        {event.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">{event.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.description}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">Shipping Address:</h4>
              <p className="text-slate-600 leading-relaxed">
                {trackedOrder.customer.address}, {trackedOrder.customer.city}, {trackedOrder.customer.province}
              </p>
              <p className="text-slate-600">
                Phone: <strong>{trackedOrder.customer.phoneNumber}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">Order Items ({trackedOrder.items.length}):</h4>
              <div className="space-y-1 text-slate-700">
                {trackedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate max-w-[200px]">{it.product.name} (x{it.quantity})</span>
                    <span className="font-bold">{formatPrice(it.product.price * it.quantity, settings.currencySymbol)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-1 flex justify-between font-bold text-slate-900">
                  <span>Total (COD / Paid):</span>
                  <span className="text-emerald-700">{formatPrice(trackedOrder.total, settings.currencySymbol)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : searched ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching order found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please check the Order ID spelling or verify with your mobile number. You can also contact our support team on WhatsApp.
          </p>
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20cannot%20find%20my%20order%20tracking.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl mt-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with {settings.storeName} Support</span>
          </a>
        </div>
      ) : null}

    </div>
  );
};
