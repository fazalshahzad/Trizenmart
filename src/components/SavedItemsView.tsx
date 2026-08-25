import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  SlidersHorizontal, 
  Sparkles, 
  MessageCircle, 
  Share2, 
  Package, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { formatPrice } from '../utils/helpers';
import { Product } from '../types';

export const SavedItemsView: React.FC = () => {
  const { 
    wishlist, 
    products, 
    settings, 
    clearWishlist, 
    addAllWishlistToCart, 
    setActiveView, 
    setSelectedCategory,
    addToast 
  } = useStore();

  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Filter & sort the user's wishlisted products
  const savedProducts = useMemo(() => {
    let list = products.filter(p => wishlist.includes(p.id));

    if (selectedCategoryFilter !== 'all') {
      list = list.filter(p => p.category === selectedCategoryFilter);
    }

    if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, wishlist, selectedCategoryFilter, sortBy]);

  // Categories present in saved items
  const savedCategories = useMemo(() => {
    const allWishlisted = products.filter(p => wishlist.includes(p.id));
    const cats = new Set<string>();
    allWishlisted.forEach(p => cats.add(p.category));
    return Array.from(cats);
  }, [products, wishlist]);

  // Total value of saved items
  const totalSavedValue = useMemo(() => {
    return savedProducts.reduce((sum, p) => sum + p.price, 0);
  }, [savedProducts]);

  // Recommended products for empty or discovery state
  const recommendedProducts = useMemo(() => {
    return products.filter(p => !wishlist.includes(p.id)).slice(0, 4);
  }, [products, wishlist]);

  const handleShareSavedItems = () => {
    if (navigator.share && wishlist.length > 0) {
      navigator.share({
        title: `My Saved Items on ${settings.storeName}`,
        text: `Check out my favorite gadgets and tech products saved on ${settings.storeName}!`,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard?.writeText(window.location.href);
        addToast('Link copied to clipboard!', 'success');
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast('Saved items link copied to clipboard!', 'success');
    }
  };

  const handleWhatsAppInquiryAll = () => {
    if (savedProducts.length === 0) return;
    const itemsListText = savedProducts.map((p, idx) => `${idx + 1}. ${p.name} (${formatPrice(p.price, settings.currencySymbol)})`).join('\n');
    const message = encodeURIComponent(
      `Assalam o Alaikum ${settings.storeName}!\n\nI have saved these ${savedProducts.length} items on your store and want to inquire about availability or special bundle discount:\n\n${itemsListText}\n\nTotal: ${formatPrice(totalSavedValue, settings.currencySymbol)}\n\nPlease assist me with placing an order!`
    );
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="saved-items-view">
      
      {/* Breadcrumb Header */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
        <button 
          type="button" 
          onClick={() => setActiveView('home')} 
          className="hover:text-emerald-600 transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">Saved Items</span>
      </nav>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>Personal Wishlist</span>
              </span>
              {wishlist.length > 0 && (
                <span className="bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-700">
                  {wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              My Saved Items
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Keep track of your favorite gadgets, earphones, and accessories. Add them to your cart anytime with 1 click or request a bundle quote on WhatsApp.
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={addAllWishlistToCart}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 hover:scale-102 active:scale-98 transition-all"
                id="add-all-saved-to-cart-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add All to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppInquiryAll}
                className="px-4 py-3 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-2 transition-colors"
                title="Inquire entire wishlist via WhatsApp"
                id="whatsapp-inquire-all-saved-btn"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Quote</span>
              </button>

              <button
                type="button"
                onClick={handleShareSavedItems}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-colors"
                title="Share saved items"
                aria-label="Share saved items"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {wishlist.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center space-y-6 shadow-xs max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl border border-rose-100 flex items-center justify-center text-rose-500 mx-auto shadow-xs">
            <Heart className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Your Saved Items is Empty</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Explore our tech store catalog and tap the <strong className="text-rose-500 font-semibold">heart icon</strong> on any product card to save items for future orders.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('products');
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-sm transition-all hover:scale-102"
              id="explore-products-empty-wishlist-btn"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products Catalog</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors"
            >
              Return to Storefront
            </button>
          </div>

          {/* Recommended products preview */}
          {recommendedProducts.length > 0 && (
            <div className="pt-10 border-t border-slate-100 text-left space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">Trending Gadgets You Might Like</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendedProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Populated State with Controls & Grid */
        <div className="space-y-6">
          
          {/* Controls Bar: Category pills, Sort dropdown, and Clear button */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline mr-1">
                Filter:
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({wishlist.length})
              </button>

              {savedCategories.map(cat => {
                const count = products.filter(p => wishlist.includes(p.id) && p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                      selectedCategoryFilter === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Sort & Bulk Clear Actions */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-100 hover:bg-slate-200 border-none rounded-xl text-xs font-bold text-slate-700 py-1.5 px-3 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  id="saved-items-sort-select"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearWishlist}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200/80 transition-colors flex items-center gap-1.5"
                title="Clear all saved items"
                id="clear-wishlist-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>

          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" id="saved-items-product-grid">
            {savedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Value Summary Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Estimated Total of Saved Items</p>
                <p className="text-lg font-black text-slate-900">{formatPrice(totalSavedValue, settings.currencySymbol)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={addAllWishlistToCart}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add All to Cart</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Trust & Guarantee Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-slate-600 text-xs">
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200/80">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span><strong>100% Genuine Tech</strong> with warranty support</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200/80">
          <Package className="w-5 h-5 text-emerald-600 shrink-0" />
          <span><strong>Free Delivery</strong> on orders over {formatPrice(settings.freeShippingThreshold, settings.currencySymbol)}</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200/80">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span><strong>Cash on Delivery</strong> available all over Pakistan</span>
        </div>
      </div>

    </div>
  );
};
