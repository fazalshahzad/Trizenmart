import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Send,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutView: React.FC = () => {
  const { settings, setActiveView } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10" id="trizenmart-about-page">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About {settings.storeName}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          "{settings.tagline}"
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Welcome to <strong>{settings.storeName}</strong>, Pakistan’s premier online store for authentic audio gadgets, smart wearables, rapid GaN power supplies, and modern desk setups.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">100% Genuine Tech</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every product in {settings.storeName} is directly sourced, sealed, and backed by our replacement guarantee.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Nationwide COD</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fast, secure Cash on Delivery service to Karachi, Lahore, Islamabad, Peshawar, Quetta, and all 150+ Pakistani cities.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Instant WhatsApp Care</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Chat with real support representatives for order verification, tracking updates, and technical setup guidance.
          </p>
        </div>
      </div>

      {/* Story & Vision */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">Our Commitment</h2>
        <p>
          At <strong>{settings.storeName}</strong>, we believe Pakistani shoppers deserve high-grade technology with transparent pricing in Pakistani Rupees (Rs.), prompt delivery without hidden customs fees, and friendly after-sales support.
        </p>
        <p>
          Whether you need hybrid ANC headphones for your daily commute, a reliable GaN charger for your laptop, or a smart fitness watch, {settings.storeName} delivers quality straight to your hands.
        </p>
      </div>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => setActiveView('products')}
          className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all"
        >
          Explore {settings.storeName} Storefront
        </button>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const { settings, addToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;

    setSent(true);
    addToast('Your inquiry has been sent to our customer care team!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8" id="trizenmart-contact-page">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Contact {settings.storeName} Support</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Have questions about a product, delivery timeframe, or bulk order? Get in touch with our team in Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">Helpline & Warehouse</h3>
          
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Warehouse & Office:</strong>
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Phone Helpline:</strong>
                <span>{settings.phone} (Mon - Sat, 10 AM - 8 PM PKT)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">WhatsApp Official Support:</strong>
                <a 
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-bold hover:underline"
                >
                  +{settings.whatsappNumber} (Instant Response)
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Email Inquiries:</strong>
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-bold">Fast Order Confirmation:</p>
            <p className="text-[11px] text-emerald-800">
              For instant dispatch verification of your Cash on Delivery orders, chat with us on WhatsApp directly.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Send an Online Message</h3>

          {sent ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Message Received!</h4>
              <p className="text-xs text-emerald-800">Our representative will call or WhatsApp you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Muhammad Ali"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Message / Product Inquiry</label>
                <textarea
                  required
                  rows={4}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="How can we assist you today?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send to {settings.storeName}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export const TermsView: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed" id="trizenmart-terms-page">
      <div className="text-center space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {settings.storeName} Policies & Terms
        </h1>
        <p className="text-xs text-slate-500">
          Shipping, Returns, Cash on Delivery, and Warranty Policy in Pakistan.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">1. Shipping & Nationwide Delivery</h2>
          <p>
            {settings.storeName} partners with TCS Logistics and Leopard Courier for express deliveries across Pakistan. Standard orders are dispatched within 24 hours of booking and arrive in 2–4 business days. Free shipping applies to orders with cart subtotal above <strong>Rs. {settings.freeShippingThreshold.toLocaleString()}</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">2. Cash on Delivery (COD) Guidelines</h2>
          <p>
            Cash on Delivery is available nationwide. Customers are requested to keep exact change ready upon rider arrival. All shipments are sealed with tamper-evident {settings.storeName} security tape.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">3. 7-Day Easy Return & Replacement</h2>
          <p>
            If your item arrives defective or damaged, contact our WhatsApp helpline (+{settings.whatsappNumber}) within 7 days of receiving the package for a swift replacement or store credit voucher.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">4. Privacy & Data Security</h2>
          <p>
            Your delivery address and phone number are strictly used to fulfill courier consignments and order verification. We do not sell or share customer data with third-party advertisers.
          </p>
        </section>

      </div>
    </div>
  );
};
