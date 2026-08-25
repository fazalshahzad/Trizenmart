import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  MessageCircle, 
  Tag, 
  Check, 
  Sparkles,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, createWhatsAppOrderLink } from '../utils/helpers';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    cartDiscount, 
    cartItemCount, 
    settings, 
    appliedPromo, 
    applyPromoCode, 
    removePromoCode, 
    setActiveView 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  // Free shipping math
  const freeShippingThreshold = settings.freeShippingThreshold || 3000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const finalTotal = Math.max(0, cartSubtotal - cartDiscount + (remainingForFreeShipping === 0 ? 0 : settings.standardShippingFee));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyPromoCode(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppCheckout = () => {
    const link = createWhatsAppOrderLink(cart, finalTotal, settings);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="trizenmart-cart-drawer">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Your Shopping Cart</h3>
                <p className="text-xs text-slate-500">{cartItemCount} items in {settings.storeName}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
              id="close-cart-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                {remainingForFreeShipping === 0 ? (
                  <span>🎉 You unlocked <strong>FREE Nationwide Delivery</strong>!</span>
                ) : (
                  <span>Add {formatPrice(remainingForFreeShipping, settings.currencySymbol)} more for Free Shipping</span>
                )}
              </span>
              <span className="text-[10px] text-emerald-700 font-mono font-black">{Math.round(freeShippingProgress)}%</span>
            </div>

            <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                style={{ width: `${freeShippingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">Your cart is empty</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Explore high quality gadgets and accessories on {settings.storeName}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('products');
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const variantKey = item.selectedVariants 
                  ? Object.entries(item.selectedVariants).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${v}`).join('|')
                  : undefined;

                return (
                  <div 
                    key={`${item.product.id}-${variantKey || index}`} 
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-slate-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </h4>

                      {item.selectedVariants && (
                        <p className="text-[11px] text-slate-500">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-black text-slate-900">
                          {formatPrice(item.product.price, settings.currencySymbol)}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden text-xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, variantKey)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 font-bold min-w-6 text-center text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, variantKey)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id, variantKey)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer / Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              
              {/* Promo Code Input */}
              <div className="space-y-1.5">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-100/80 border border-emerald-300 p-2 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedPromo.code} Applied ({appliedPromo.description})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-rose-600 font-bold text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="Coupon Code (e.g. TRIZEN10)"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl uppercase font-mono tracking-wider focus:outline-hidden focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartSubtotal, settings.currencySymbol)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount Savings</span>
                    <span>-{formatPrice(cartDiscount, settings.currencySymbol)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping Delivery</span>
                  <span className="font-bold">
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(settings.standardShippingFee, settings.currencySymbol)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Estimated Total</span>
                  <span className="text-base text-emerald-700">{formatPrice(finalTotal, settings.currencySymbol)}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                  id="cart-proceed-checkout-btn"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-400 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Order via WhatsApp Direct</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
