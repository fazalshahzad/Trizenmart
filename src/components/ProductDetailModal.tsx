import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Heart, 
  Scale,
  Facebook,
  Twitter,
  Copy,
  Share2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, createWhatsAppProductInquiryLink } from '../utils/helpers';

export const ProductDetailModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    settings, 
    addToCart, 
    toggleWishlist, 
    isWishlisted,
    toggleCompare,
    isInCompare,
    setSelectedProduct,
    setActiveView,
    addToast
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wishlisted = isWishlisted(product.id);
  const compared = isInCompare(product.id);

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariant(prev => ({ ...prev, [variantName]: option }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    setQuickViewProduct(null);
  };

  const handleWhatsAppOrder = () => {
    const link = createWhatsAppProductInquiryLink(product, settings);
    window.open(link, '_blank');
  };

  const handleViewFullDetails = () => {
    setSelectedProduct(product);
    setActiveView('product-detail');
    setQuickViewProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out ${product.name} on ${settings.storeName} for only ${formatPrice(product.price, settings.currencySymbol)}!`;

  const handleShareWhatsApp = () => {
    const textToShare = `${shareText}\n${productUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=620,height=500');
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=620,height=500');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(productUrl).then(() => {
        setCopiedLink(true);
        addToast('Product link copied to clipboard!', 'success');
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {
        addToast('Product link copied!', 'success');
      });
    } else {
      addToast('Product link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
          id="close-quick-view-btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Gallery side */}
          <div className="bg-slate-50 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-200/80 p-4 flex items-center justify-center">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-md">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl p-1 bg-white border-2 overflow-hidden transition-all ${
                      selectedImageIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  {settings.storeName} • {product.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-700">{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(product.price, settings.currencySymbol)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.originalPrice, settings.currencySymbol)}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Cash on Delivery Available
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Variants Selector */}
              {product.variants && product.variants.map(variant => (
                <div key={variant.id} className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-800">
                    {variant.name}: <span className="font-normal text-slate-500">{selectedVariant[variant.name] || variant.options[0]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(opt => {
                      const isSelected = (selectedVariant[variant.name] || variant.options[0]) === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleVariantSelect(variant.name, opt)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                            isSelected 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-bold text-slate-800">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-800 min-w-8 text-center bg-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Order</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{wishlisted ? 'Saved' : 'Wishlist'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCompare(product)}
                    className={`flex items-center gap-1.5 font-medium transition-colors ${
                      compared ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-emerald-600'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{compared ? 'In Compare' : 'Compare'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleViewFullDetails}
                  className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
                >
                  <span>Full details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Social Sharing Bar in Modal */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Share2 className="w-3 h-3 text-emerald-600" />
                  <span>Share:</span>
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 transition-colors"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareFacebook}
                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-blue-200 transition-colors"
                    title="Share on Facebook"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 transition-colors"
                    title="Share on Twitter"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      copiedLink ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 hover:bg-slate-200 text-slate-600 border-slate-200'
                    }`}
                    title="Copy Link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
