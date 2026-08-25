import React, { useState } from 'react';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Package
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/helpers';
import { ProductCard } from './ProductCard';

export const AccountView: React.FC = () => {
  const { orders, wishlist, products, settings, setActiveView, setSelectedOrder } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="trizenmart-account-view">
      
      {/* Account Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-xl">
            T
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{settings.storeName} Member Portal</span>
            <h1 className="text-2xl font-black text-white">Customer Account & Orders</h1>
            <p className="text-xs text-slate-300 mt-0.5">Manage your order history, parcel tracking, and saved wishlist.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveView('order-tracking')}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
        >
          <Truck className="w-4 h-4" />
          <span>Track Live Parcel</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3.5 border-b-2 flex items-center gap-2 transition-colors ${
            activeSubTab === 'orders'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('wishlist')}
          className={`pb-3.5 border-b-2 flex items-center gap-2 transition-colors ${
            activeSubTab === 'wishlist'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlist.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3.5 border-b-2 flex items-center gap-2 transition-colors ${
            activeSubTab === 'profile'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Address</span>
        </button>
      </div>

      {/* Orders Tab */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
              <p className="text-xs text-slate-500">Your future purchases on {settings.storeName} will appear here.</p>
              <button
                type="button"
                onClick={() => setActiveView('products')}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            orders.map(ord => (
              <div key={ord.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <span className="font-mono font-black text-slate-900 text-sm">{ord.orderNumber}</span>
                    <span className="text-slate-400 text-xs ml-3">
                      {new Date(ord.date).toLocaleDateString('en-GB')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      ord.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ord.status.toUpperCase()}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrder(ord);
                        setActiveView('order-tracking');
                      }}
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <span>Track Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Recipient & City</span>
                    <p className="font-bold text-slate-800 mt-0.5">{ord.customer.fullName} ({ord.customer.city})</p>
                    <p className="text-slate-500 truncate">{ord.customer.address}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Payment & Total</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5">
                      {formatPrice(ord.total, settings.currencySymbol)}
                    </p>
                    <p className="text-slate-500 uppercase text-[11px]">{ord.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid'}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Estimated Arrival</span>
                    <p className="font-bold text-emerald-700 mt-0.5">{ord.estimatedDelivery}</p>
                    <p className="text-slate-500 text-[11px] font-mono">{ord.trackingNumber || 'Processing'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0 text-xs">
                      <img src={it.product.images[0]} alt="item" className="w-6 h-6 object-contain" />
                      <span className="font-medium text-slate-800 truncate max-w-[150px]">{it.product.name}</span>
                      <span className="text-slate-500 text-[11px]">x{it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeSubTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Heart className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500">Save your favorite tech products while exploring {settings.storeName}.</p>
              <button
                type="button"
                onClick={() => setActiveView('products')}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile & Address Tab */}
      {activeSubTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Registered Customer Profile</h3>
          
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-400 uppercase">Primary Delivery Address (Pakistan)</span>
              <p className="text-sm font-bold text-slate-800">{orders[0]?.customer.fullName || 'Muhammad Hamza'}</p>
              <p className="text-slate-600">{orders[0]?.customer.address || 'House 14-C, Sector G, Phase 5 DHA, Lahore, Punjab'}</p>
              <p className="text-slate-600">Phone: {orders[0]?.customer.phoneNumber || '+92 303 0679449'}</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-emerald-900">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified {settings.storeName} Customer Account</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Eligible for priority Cash on Delivery and fast nationwide return service.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
