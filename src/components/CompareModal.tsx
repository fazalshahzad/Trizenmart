import React, { useState, useMemo } from 'react';
import { 
  X, 
  Scale, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  MessageCircle, 
  Star, 
  Check, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Search
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, createWhatsAppProductInquiryLink } from '../utils/helpers';
import { Product } from '../types';

export const CompareModal: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    addToCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
    products,
    settings,
    addToCart,
    setSelectedProduct,
    setActiveView
  } = useStore();

  const [highlightDifferences, setHighlightDifferences] = useState<boolean>(false);
  const [isAddPickerOpen, setIsAddPickerOpen] = useState<boolean>(false);
  const [pickerSearch, setPickerSearch] = useState<string>('');

  // Collect all unique specification keys across all compared products
  const allSpecKeys = useMemo(() => {
    const keys = new Set<string>();
    compareList.forEach(prod => {
      if (prod.specs) {
        Object.keys(prod.specs).forEach(k => keys.add(k));
      }
    });
    return Array.from(keys);
  }, [compareList]);

  // Available products to add to comparison (not currently in compare list)
  const availableToAdd = useMemo(() => {
    const compareIds = new Set(compareList.map(p => p.id));
    return products
      .filter(p => !compareIds.has(p.id))
      .filter(p => {
        if (!pickerSearch.trim()) return true;
        const q = pickerSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      });
  }, [products, compareList, pickerSearch]);

  if (!isCompareModalOpen) return null;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
    setIsCompareModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product) => {
    const defaultVariant = product.variants ? { [product.variants[0].name]: product.variants[0].options[0] } : undefined;
    addToCart(product, 1, defaultVariant);
  };

  const handleWhatsAppOrder = (product: Product) => {
    const link = createWhatsAppProductInquiryLink(product, settings);
    window.open(link, '_blank');
  };

  // Helper to check if values differ for a specific spec key
  const hasSpecDifference = (key: string) => {
    if (compareList.length <= 1) return false;
    const firstVal = compareList[0].specs?.[key] || '—';
    return compareList.some(p => (p.specs?.[key] || '—') !== firstVal);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      id="compare-products-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="compare-modal-title" className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Compare Product Specifications
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {compareList.length} of 4 items
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Detailed side-by-side analysis of features, hardware specs, pricing & warranty.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {compareList.length > 1 && (
              <button
                type="button"
                onClick={() => setHighlightDifferences(!highlightDifferences)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                  highlightDifferences
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
                title="Highlight specifications that differ"
                id="toggle-highlight-differences"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Highlight Differences</span>
              </button>
            )}

            {compareList.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
                title="Clear all compared items"
                id="clear-all-compare-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
              aria-label="Close comparison modal"
              id="close-compare-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {compareList.length === 0 ? (
            /* Empty State */
            <div className="py-12 px-4 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
                <Scale className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">Your Comparison Tray is Empty</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Select up to 4 products from TRIZENMART catalog to view full hardware specifications, features, and pricing side-by-side.
                </p>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Gadgets to Compare</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {products.slice(0, 4).map(prod => (
                    <div 
                      key={prod.id} 
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-contain rounded-lg bg-white p-1 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                          <p className="text-[11px] font-extrabold text-emerald-600">{formatPrice(prod.price, settings.currencySymbol)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCompare(prod)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Comparison Table Container */
            <div className="space-y-6">
              
              {/* Reminder when only 1 item is selected */}
              {compareList.length === 1 && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 text-xs font-medium">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Select at least <strong>1 more product</strong> to enable side-by-side specification comparison.</span>
                  </div>
                  {availableToAdd.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddPickerOpen(true)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Second Product</span>
                    </button>
                  )}
                </div>
              )}

              {/* Responsive Scrollable Comparison Grid */}
              <div className="overflow-x-auto pb-4">
                <table className="w-full min-w-[650px] border-collapse" id="compare-specifications-table">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="p-4 text-left w-48 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 rounded-tl-2xl">
                        Product
                      </th>
                      {compareList.map(product => (
                        <th key={product.id} className="p-4 align-top text-left min-w-[220px] max-w-[260px] relative bg-white border-l border-slate-100">
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove from comparison"
                            aria-label={`Remove ${product.name} from compare`}
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Product Header Card */}
                          <div className="space-y-3 pr-6">
                            <div 
                              onClick={() => handleProductClick(product)}
                              className="cursor-pointer group aspect-square w-full rounded-2xl bg-slate-50 border border-slate-200/80 p-3 flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-colors relative"
                            >
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                              />
                              {product.discountPercentage > 0 && (
                                <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                                  -{product.discountPercentage}%
                                </span>
                              )}
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                                {product.brand}
                              </span>
                              <h4 
                                onClick={() => handleProductClick(product)}
                                className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-emerald-600 cursor-pointer transition-colors leading-snug mt-0.5"
                              >
                                {product.name}
                              </h4>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2">
                              <span className="text-base sm:text-lg font-black text-slate-900">
                                {formatPrice(product.price, settings.currencySymbol)}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-xs text-slate-400 line-through">
                                  {formatPrice(product.originalPrice, settings.currencySymbol)}
                                </span>
                              )}
                            </div>

                            {/* Quick Action CTAs */}
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => handleAddToCart(product)}
                                className="py-2 px-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                                title="Add to cart"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Cart</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleWhatsAppOrder(product)}
                                className="py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                                title="Order via WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>WA Order</span>
                              </button>
                            </div>
                          </div>
                        </th>
                      ))}

                      {/* Add Extra Column slot if < 4 items */}
                      {compareList.length < 4 && (
                        <th className="p-4 align-middle text-center min-w-[180px] bg-slate-50/40 border-l border-dashed border-slate-200 rounded-tr-2xl">
                          <button
                            type="button"
                            onClick={() => setIsAddPickerOpen(true)}
                            className="w-full py-12 px-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl bg-white/60 hover:bg-white text-slate-500 hover:text-emerald-700 flex flex-col items-center justify-center gap-2 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition-colors">
                              <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold">Add Another Product</span>
                            <span className="text-[10px] text-slate-400">Up to 4 products</span>
                          </button>
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-xs">
                    
                    {/* Basic Attributes Section */}
                    <tr className="bg-slate-100/60 font-bold text-slate-800">
                      <td colSpan={compareList.length + 1 + (compareList.length < 4 ? 1 : 0)} className="py-2 px-4 uppercase tracking-wider text-[11px] text-slate-500">
                        General & Pricing
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/30">Category</td>
                      {compareList.map(p => (
                        <td key={p.id} className="py-3 px-4 text-slate-800 border-l border-slate-100">
                          {p.category}
                        </td>
                      ))}
                      {compareList.length < 4 && <td className="border-l border-dashed border-slate-200"></td>}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/30">Customer Rating</td>
                      {compareList.map(p => (
                        <td key={p.id} className="py-3 px-4 text-slate-800 border-l border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <span className="flex items-center gap-1 font-bold text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {p.rating}
                            </span>
                            <span className="text-slate-400 text-[11px]">({p.reviewCount} reviews)</span>
                          </div>
                        </td>
                      ))}
                      {compareList.length < 4 && <td className="border-l border-dashed border-slate-200"></td>}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/30">Stock & Delivery</td>
                      {compareList.map(p => (
                        <td key={p.id} className="py-3 px-4 text-slate-800 border-l border-slate-100">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Check className="w-3 h-3 text-emerald-600" />
                              In Stock ({p.stockCount} left)
                            </span>
                            <p className="text-[11px] text-slate-500">TCS Express (2-3 Days)</p>
                          </div>
                        </td>
                      ))}
                      {compareList.length < 4 && <td className="border-l border-dashed border-slate-200"></td>}
                    </tr>

                    {/* Hardware & Technical Specs Section */}
                    {allSpecKeys.length > 0 && (
                      <tr className="bg-slate-100/60 font-bold text-slate-800">
                        <td colSpan={compareList.length + 1 + (compareList.length < 4 ? 1 : 0)} className="py-2 px-4 uppercase tracking-wider text-[11px] text-slate-500">
                          Hardware & Technical Specifications
                        </td>
                      </tr>
                    )}

                    {allSpecKeys.map(specKey => {
                      const isDiff = hasSpecDifference(specKey);
                      const isHighlighted = highlightDifferences && isDiff;

                      return (
                        <tr 
                          key={specKey} 
                          className={isHighlighted ? 'bg-amber-50/60 transition-colors' : 'hover:bg-slate-50/40 transition-colors'}
                        >
                          <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/40 flex items-center justify-between gap-1">
                            <span>{specKey}</span>
                            {isHighlighted && (
                              <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-200/70 px-1.5 py-0.5 rounded">
                                Diff
                              </span>
                            )}
                          </td>

                          {compareList.map(product => {
                            const specValue = product.specs?.[specKey] || '—';
                            return (
                              <td 
                                key={product.id} 
                                className={`py-3 px-4 text-slate-800 border-l border-slate-100 font-medium ${
                                  isHighlighted ? 'text-amber-950 font-semibold' : ''
                                }`}
                              >
                                {specValue}
                              </td>
                            );
                          })}

                          {compareList.length < 4 && <td className="border-l border-dashed border-slate-200"></td>}
                        </tr>
                      );
                    })}

                    {/* Features Section */}
                    <tr className="bg-slate-100/60 font-bold text-slate-800">
                      <td colSpan={compareList.length + 1 + (compareList.length < 4 ? 1 : 0)} className="py-2 px-4 uppercase tracking-wider text-[11px] text-slate-500">
                        Key Features & Highlights
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/30 align-top">Highlights</td>
                      {compareList.map(product => (
                        <td key={product.id} className="py-3 px-4 text-slate-700 border-l border-slate-100 align-top">
                          <ul className="space-y-1.5 list-disc list-inside text-[11px] leading-relaxed">
                            {product.features.map((feat, idx) => (
                              <li key={idx} className="text-slate-600">
                                <span className="text-slate-800">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                      {compareList.length < 4 && <td className="border-l border-dashed border-slate-200"></td>}
                    </tr>

                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>All products backed by 7-Day Replacement Guarantee & Pakistan Cash on Delivery.</span>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length < 4 && availableToAdd.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAddPickerOpen(true)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                id="footer-add-product-to-compare"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add Product</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCompareModalOpen(false)}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              id="close-compare-footer-btn"
            >
              Close
            </button>
          </div>
        </div>

        {/* Product Picker Drawer Overlay */}
        {isAddPickerOpen && (
          <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
              
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Add Product to Comparison</h3>
                  <p className="text-[11px] text-slate-500">Select a product to view specifications side-by-side</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddPickerOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-3 border-b border-slate-100">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder="Search by name, brand, category..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>
              </div>

              {/* Products List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-72">
                {availableToAdd.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6">No matching products found.</p>
                ) : (
                  availableToAdd.map(prod => (
                    <div
                      key={prod.id}
                      className="p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                          <p className="text-[10px] text-slate-400">{prod.category} • <strong className="text-emerald-700">{formatPrice(prod.price, settings.currencySymbol)}</strong></p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          addToCompare(prod);
                          setIsAddPickerOpen(false);
                          setPickerSearch('');
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Compare</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
                <button
                  type="button"
                  onClick={() => setIsAddPickerOpen(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
