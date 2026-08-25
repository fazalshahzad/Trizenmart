import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Check, 
  ArrowLeft, 
  ShoppingBag, 
  Lock, 
  AlertCircle,
  MessageCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/helpers';
import { PAKISTAN_CITIES } from '../data/mockData';
import { PaymentMethodType, ShippingMethodType } from '../types';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    appliedPromo, 
    settings, 
    addOrder, 
    setActiveView, 
    addToast 
  } = useStore();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [shippingMethod, setShippingMethod] = useState<ShippingMethodType>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please add items to your cart before proceeding to checkout in {settings.storeName}.
        </p>
        <button
          type="button"
          onClick={() => setActiveView('products')}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
        >
          Explore Products
        </button>
      </div>
    );
  }

  // Shipping Calculations
  const isFreeShipping = cartSubtotal >= settings.freeShippingThreshold;
  const shippingFee = shippingMethod === 'express'
    ? settings.expressShippingFee 
    : (isFreeShipping ? 0 : settings.standardShippingFee);

  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + shippingFee);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim() || !address.trim() || !city.trim()) {
      addToast('Please complete all required shipping fields', 'warning');
      return;
    }

    if (phoneNumber.trim().length < 10) {
      addToast('Please enter a valid Pakistani phone number (e.g. 0300 1234567)', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = addOrder({
        items: [...cart],
        subtotal: cartSubtotal,
        shippingFee,
        shippingMethod,
        discountAmount: cartDiscount,
        promoCode: appliedPromo?.code,
        total: grandTotal,
        customer: {
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim() || undefined,
          city: city.trim(),
          address: address.trim(),
          province,
          postalCode: postalCode.trim() || undefined,
          orderNotes: orderNotes.trim() || undefined,
        },
        paymentMethod,
      });

      setIsSubmitting(false);
      setActiveView('order-success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="trizenmart-checkout-view">
      
      {/* Navigation Top */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>256-Bit Encrypted Secure Checkout</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Details & Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Customer Information */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delivery & Contact Details</h3>
                <p className="text-xs text-slate-500">Provide shipping address for Cash on Delivery or Prepaid courier.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Recipient Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Usman"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  id="checkout-name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  id="checkout-phone"
                />
                <p className="text-[10px] text-slate-400 mt-1">Rider will call this number prior to arrival.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional for invoice)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  id="checkout-email"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Destination City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500 font-medium"
                  id="checkout-city"
                >
                  {PAKISTAN_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Province <span className="text-rose-500">*</span>
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500 font-medium"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa (KPK)</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">Islamabad (ICT)</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Complete Street Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat No., Street, Sector/Block, Landmark"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500 resize-none"
                  id="checkout-address"
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Special Delivery Instructions <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please deliver after 2 PM, or leave with security."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Select Courier Shipping</h3>
                <p className="text-xs text-slate-500">Tracked deliveries via TCS & Leopard Courier Pakistan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Standard */}
              <label 
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                  shippingMethod === 'standard' 
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="mt-1 text-emerald-600"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Standard Delivery</p>
                    <p className="text-[11px] text-slate-500">2-4 Business Days Nationwide</p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900">
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatPrice(settings.standardShippingFee, settings.currencySymbol)
                  )}
                </span>
              </label>

              {/* Express */}
              <label 
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                  shippingMethod === 'express' 
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="mt-1 text-emerald-600"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Priority Express Overnight</p>
                    <p className="text-[11px] text-slate-500">1-2 Days Fast Track Delivery</p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900">
                  {formatPrice(settings.expressShippingFee, settings.currencySymbol)}
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Select Payment Method</h3>
                <p className="text-xs text-slate-500">Choose between Cash on Delivery or instant online transfer.</p>
              </div>
            </div>

            <div className="space-y-3">
              
              {/* Option 1: Cash on Delivery (COD) */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all block ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-emerald-600"
                    />
                    <div>
                      <span className="text-xs font-extrabold text-slate-900">Cash on Delivery (COD)</span>
                      <span className="ml-2 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Most Popular in Pakistan
                      </span>
                    </div>
                  </div>
                  <span className="text-lg">💵</span>
                </div>
                {paymentMethod === 'cod' && (
                  <p className="text-xs text-slate-600 mt-2.5 pl-6 leading-relaxed">
                    Pay in cash directly to courier rider upon receiving and inspecting your package at your doorstep. No advance payment required.
                  </p>
                )}
              </label>

              {/* Option 2: JazzCash */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all block ${
                  paymentMethod === 'jazzcash'
                    ? 'border-red-500 bg-red-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'jazzcash'}
                      onChange={() => setPaymentMethod('jazzcash')}
                      className="text-red-600"
                    />
                    <span className="text-xs font-extrabold text-slate-900">JazzCash Mobile Wallet</span>
                  </div>
                  <span className="text-xs font-bold text-red-600">JazzCash</span>
                </div>
                {paymentMethod === 'jazzcash' && (
                  <div className="mt-3 pl-6 text-xs text-slate-700 bg-white p-3 rounded-xl border border-red-200 space-y-1">
                    <p className="font-bold">JazzCash Account Details:</p>
                    <p>Account Title: <strong className="text-slate-900">{settings.storeName} Official</strong></p>
                    <p>Account Number: <strong className="text-red-600 font-mono text-sm">{settings.whatsappNumber}</strong></p>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Send payment screenshot on WhatsApp after placing order.
                    </p>
                  </div>
                )}
              </label>

              {/* Option 3: EasyPaisa */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all block ${
                  paymentMethod === 'easypaisa'
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'easypaisa'}
                      onChange={() => setPaymentMethod('easypaisa')}
                      className="text-emerald-600"
                    />
                    <span className="text-xs font-extrabold text-slate-900">EasyPaisa Mobile Account</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">EasyPaisa</span>
                </div>
                {paymentMethod === 'easypaisa' && (
                  <div className="mt-3 pl-6 text-xs text-slate-700 bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                    <p className="font-bold">EasyPaisa Account Details:</p>
                    <p>Account Title: <strong className="text-slate-900">{settings.storeName} Store</strong></p>
                    <p>Account Number: <strong className="text-emerald-700 font-mono text-sm">{settings.whatsappNumber}</strong></p>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Send transaction ID or receipt on WhatsApp.
                    </p>
                  </div>
                )}
              </label>

              {/* Option 4: Bank Transfer */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all block ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-sky-600 bg-sky-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="text-sky-600"
                    />
                    <span className="text-xs font-extrabold text-slate-900">Direct Bank Wire / IBFT</span>
                  </div>
                  <span className="text-xs font-bold text-sky-700">Bank Transfer</span>
                </div>
                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-3 pl-6 text-xs text-slate-700 bg-white p-3 rounded-xl border border-sky-200 space-y-1">
                    <p className="font-bold">Bank Account Details (Meezan Bank Ltd):</p>
                    <p>Account Title: <strong className="text-slate-900">{settings.storeName} TRADERS</strong></p>
                    <p>IBAN: <strong className="text-sky-800 font-mono">PK64MEZN0002140109988221</strong></p>
                  </div>
                )}
              </label>

            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order Button (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-28 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Order Summary</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {cart.length} items
              </span>
            </div>

            {/* Item list in summary */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} × {formatPrice(item.product.price, settings.currencySymbol)}
                    </p>
                  </div>
                  <span className="font-black text-slate-900 shrink-0">
                    {formatPrice(item.product.price * item.quantity, settings.currencySymbol)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(cartSubtotal, settings.currencySymbol)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedPromo?.code})</span>
                  <span>-{formatPrice(cartDiscount, settings.currencySymbol)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(shippingFee, settings.currencySymbol)}
                </span>
              </div>

              <div className="flex justify-between items-baseline border-t border-slate-200 pt-3 text-sm font-extrabold text-slate-900">
                <span>Grand Total (PKR)</span>
                <span className="text-xl text-emerald-700 font-black">
                  {formatPrice(grandTotal, settings.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01]"
              id="checkout-confirm-btn"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Place Order with {settings.storeName}</span>
                </>
              )}
            </button>

            {/* Trust highlights */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Sealed Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nationwide Shipping via TCS Courier</span>
              </div>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};
