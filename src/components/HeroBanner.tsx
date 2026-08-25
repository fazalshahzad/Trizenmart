import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Truck, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { settings, setActiveView, setSelectedCategory } = useStore();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl my-6 border border-slate-800 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Column: Headline and CTAs */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Storefront • Pakistan</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display">
            {settings.tagline}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
            Discover premier tech gadgets, active noise-cancelling audio, 65W GaN fast chargers, and smart living gear delivered straight to your door with <strong className="text-white">Cash on Delivery</strong>.
          </p>

          {/* Promotional Coupon Tag */}
          <div className="inline-flex flex-wrap items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-2xl text-xs backdrop-blur-xs">
            <Tag className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Use promo code</span>
            <span className="font-mono font-black text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
              TRIZEN10
            </span>
            <span className="text-slate-400">for 10% OFF your entire order</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('products');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] text-sm"
              id="hero-shop-now-btn"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Smart Gadgets & Wearables');
                setActiveView('products');
              }}
              className="w-full sm:w-auto px-6 py-4 bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <span>Smart Gadgets</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fast TCS / Leopard Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official Warranty</span>
            </div>
          </div>

        </div>

        {/* Right Column: Visual Product Showcase Card */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <div className="absolute top-4 right-4 bg-rose-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              Featured Deal
            </div>

            <div className="relative h-56 rounded-2xl overflow-hidden mb-5 bg-slate-950">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="TRIZENMART Apex Pro Wireless Headphones"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-emerald-400 font-bold">
                🎧 Hybrid ANC Noise Reduction
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                {settings.storeName} Flagship
              </p>
              <h3 className="text-lg font-bold text-white line-clamp-1">
                Apex Pro Wireless ANC Headphones
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                40mm Titanium drivers with 55-hour battery life and studio HD microphone.
              </p>

              <div className="pt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-white">Rs. 6,499</span>
                  <span className="text-xs text-slate-400 line-through ml-2">Rs. 8,999</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                  Save 28%
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Audio & Wireless Tech');
                  setActiveView('products');
                }}
                className="w-full mt-3 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-colors text-center"
              >
                View Deal in {settings.storeName}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
