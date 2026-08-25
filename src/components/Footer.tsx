import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard,
  Heart
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setActiveView, setSelectedCategory, categories } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800" id="trizenmart-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proportions Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Nationwide Delivery</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Fast shipping across Karachi, Lahore, Islamabad, and all cities of Pakistan via TCS & Leopard.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Cash on Delivery</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                100% safe & risk-free COD. Inspect your sealed package and pay cash upon delivery at your doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">7-Day Easy Return</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Hassle-free replacement guarantee for any manufacturing defects or damaged parcels.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">24/7 WhatsApp Support</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Direct live chat support for product queries, order updates, and warranty assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-lg">
                T
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                {settings.storeName}
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              "{settings.tagline}"
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Pakistan's premium online destination for authentic audio gear, smart wearables, fast GaN power accessories, and innovative tech lifestyle essentials.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setActiveView('products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('order-tracking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('saved-items');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Saved Items (Wishlist)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  My Account & Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('terms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Shipping & Return Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20need%20help%20with%20my%20order.`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 font-semibold hover:underline flex items-center gap-1 mt-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Direct Chat</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Payment Methods</h4>
            <p className="text-xs text-slate-400 mb-3">
              We accept reliable, verified payment options across Pakistan:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-200">
              <div className="bg-slate-800/80 border border-slate-700/60 p-2 rounded-lg text-center">
                💵 Cash on Delivery
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 p-2 rounded-lg text-center text-red-400">
                JazzCash
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 p-2 rounded-lg text-center text-emerald-400">
                EasyPaisa
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 p-2 rounded-lg text-center text-sky-400">
                Bank Wire / IBFT
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300 font-semibold">{settings.storeName}</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={() => setActiveView('about')} 
              className="hover:text-slate-300 transition-colors"
            >
              About {settings.storeName}
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => setActiveView('terms')} 
              className="hover:text-slate-300 transition-colors"
            >
              Privacy & Terms
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => setActiveView('admin')} 
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Admin Dashboard
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
