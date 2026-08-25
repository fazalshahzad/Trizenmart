import React, { useState } from 'react';
import { 
  Star, 
  ShoppingBag, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Heart, 
  ChevronRight, 
  Zap, 
  Share2,
  ThumbsUp,
  UserCheck,
  Scale,
  Facebook,
  Twitter,
  Copy
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, createWhatsAppProductInquiryLink, createWhatsAppOrderLink } from '../utils/helpers';
import { ProductCard } from './ProductCard';

export const ProductDetailView: React.FC = () => {
  const { 
    selectedProduct, 
    products, 
    settings, 
    addToCart, 
    toggleWishlist, 
    isWishlisted, 
    setActiveView, 
    setSelectedCategory,
    addToast,
    setIsCartOpen,
    toggleCompare,
    isInCompare,
    setIsCompareModalOpen
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  // Interactive review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState(selectedProduct?.reviews || []);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <button
          type="button"
          onClick={() => setActiveView('products')}
          className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold"
        >
          Return to {settings.storeName} Catalog
        </button>
      </div>
    );
  }

  const product = selectedProduct;
  const wishlisted = isWishlisted(product.id);

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: option }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariants);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppOrder = () => {
    const link = createWhatsAppProductInquiryLink(product, settings);
    window.open(link, '_blank');
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

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} - ${settings.storeName}`,
        text: shareText,
        url: productUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      addToast('Please enter your name and review message', 'warning');
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      userName: reviewAuthor.trim(),
      userCity: reviewCity.trim() || 'Pakistan',
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment.trim(),
      verified: true,
    };

    setLocalReviews(prev => [newRev, ...prev]);
    setReviewAuthor('');
    setReviewCity('');
    setReviewComment('');
    addToast('Thank you! Your verified review has been published.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12" id="trizenmart-product-detail-view">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto pb-1">
        <button 
          type="button" 
          onClick={() => setActiveView('home')} 
          className="hover:text-emerald-600 transition-colors"
        >
          {settings.storeName}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button 
          type="button" 
          onClick={() => {
            setSelectedCategory(product.category);
            setActiveView('products');
          }} 
          className="hover:text-emerald-600 transition-colors shrink-0"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        
        {/* Left Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-white border border-slate-200/90 shadow-xs p-6 flex items-center justify-center overflow-hidden">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain transform hover:scale-110 transition-transform duration-500"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-md">
                -{product.discountPercentage}% OFF
              </span>
            )}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={handleNativeShare}
                className="p-3 rounded-full backdrop-blur-md bg-white/90 text-slate-600 hover:text-emerald-600 hover:bg-white shadow-xs transition-all"
                title="Share this product"
                id="pdp-quick-share-image-btn"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-full backdrop-blur-md transition-all shadow-xs ${
                  wishlisted ? 'bg-rose-50 text-rose-500 scale-110' : 'bg-white/90 text-slate-600 hover:text-rose-500'
                }`}
                title={wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                id="pdp-quick-wishlist-image-btn"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl p-2 bg-white border-2 overflow-hidden shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-emerald-500 ring-4 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Perks Bar */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-slate-600 font-medium">
            <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-2xl">
              <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span>TCS Express (2-3 Days)</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-2xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span>100% Cash on Delivery</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-2xl">
              <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span>7-Day Easy Return</span>
            </div>
          </div>
        </div>

        {/* Right Product Buy Box (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md">
                {product.brand} Official
              </span>
              <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Customer Count */}
            <div className="flex items-center gap-3 text-xs pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-900">{product.rating}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600 font-semibold">{localReviews.length} Verified Customer Ratings</span>
            </div>
          </div>

          {/* Pricing Highlight Box */}
          <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-3xl p-5 space-y-2">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {formatPrice(product.price, settings.currencySymbol)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-slate-400 line-through font-bold">
                  {formatPrice(product.originalPrice, settings.currencySymbol)}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-xs font-black text-rose-600 bg-rose-100 px-2.5 py-1 rounded-lg">
                  Save {formatPrice(product.originalPrice - product.price, settings.currencySymbol)}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Inclusive of all taxes. Free shipping on orders above {formatPrice(settings.freeShippingThreshold, settings.currencySymbol)}.</span>
            </p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants && product.variants.map(variant => (
            <div key={variant.id} className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Select {variant.name}: <span className="text-emerald-700 font-normal">{selectedVariants[variant.name] || variant.options[0]}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {variant.options.map(opt => {
                  const isSelected = (selectedVariants[variant.name] || variant.options[0]) === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleVariantSelect(variant.name, opt)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20' 
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

          {/* Quantity Stepper & Stock Status */}
          <div className="flex items-center gap-6 pt-2">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 text-base font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-black text-slate-900 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 text-base font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800">Stock Availability:</span>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>In Stock ({product.stockCount} units available)</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                id="pdp-add-to-cart-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                id="pdp-buy-now-btn"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now (Cash on Delivery)</span>
              </button>
            </div>

            {/* Direct WhatsApp Instant Buy Button */}
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-500 text-emerald-800 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
              id="pdp-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>1-Click WhatsApp Quick Order</span>
            </button>

            {/* Secondary Action Row (Compare & Wishlist) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => toggleCompare(product)}
                className={`py-2.5 px-3 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isInCompare(product.id)
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
                id="pdp-compare-toggle-btn"
              >
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>{isInCompare(product.id) ? 'Comparing (In Tray)' : 'Compare Specs'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`py-2.5 px-3 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  wishlisted
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
                id="pdp-wishlist-toggle-btn"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                <span>{wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Social Media Sharing Section */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2.5" id="pdp-social-share-section">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Share this product:</span>
                </span>
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="text-[11px] font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
                  id="pdp-share-native-btn"
                >
                  Quick Share
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 rounded-xl text-xs font-bold transition-all shadow-2xs group"
                  title="Share on WhatsApp"
                  id="share-whatsapp-btn"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                  <span className="truncate">WhatsApp</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-blue-50 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-blue-200 hover:border-[#1877F2] rounded-xl text-xs font-bold transition-all shadow-2xs group"
                  title="Share on Facebook"
                  id="share-facebook-btn"
                >
                  <Facebook className="w-4 h-4 text-[#1877F2] group-hover:text-white transition-colors" />
                  <span className="truncate">Facebook</span>
                </button>

                {/* Twitter / X */}
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-200 hover:border-slate-900 rounded-xl text-xs font-bold transition-all shadow-2xs group"
                  title="Share on Twitter / X"
                  id="share-twitter-btn"
                >
                  <Twitter className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
                  <span className="truncate">Twitter</span>
                </button>

                {/* Copy Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 border rounded-xl text-xs font-bold transition-all shadow-2xs ${
                    copiedLink
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                  title="Copy Product Link"
                  id="share-copylink-btn"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="truncate">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span className="truncate">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Product Information Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 text-sm font-bold bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 border-b-2 transition-colors ${
              activeTab === 'overview' 
                ? 'border-emerald-600 text-emerald-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Key Highlights & Features
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 border-b-2 transition-colors ${
              activeTab === 'specs' 
                ? 'border-emerald-600 text-emerald-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'reviews' 
                ? 'border-emerald-600 text-emerald-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
              {localReviews.length}
            </span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Tab 1: Overview & Features */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Product Overview</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
              </div>

              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Features:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Specifications</h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 text-xs sm:text-sm p-3.5">
                    <span className="font-bold text-slate-500">{key}</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Reviews List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Verified Customer Reviews</h3>
                
                {localReviews.length === 0 ? (
                  <p className="text-slate-500 text-sm">No reviews yet. Be the first to review this product!</p>
                ) : (
                  localReviews.map(rev => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{rev.userName}</span>
                          {rev.userCity && (
                            <span className="text-xs text-slate-400">({rev.userCity})</span>
                          )}
                          {rev.verified && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <UserCheck className="w-3 h-3" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{rev.date}</span>
                      </div>

                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              <div className="lg:col-span-5 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <h4 className="text-base font-bold text-slate-900">Write a Customer Review</h4>
                <form onSubmit={handleAddReview} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Asad Ali"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={reviewCity}
                      onChange={(e) => setReviewCity(e.target.value)}
                      placeholder="e.g. Lahore, Karachi"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 ml-2">{reviewRating} out of 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Experience / Feedback</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share what you liked about this product..."
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Submit Review to {settings.storeName}
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900">
              More from {settings.storeName}
            </h3>
            <button
              type="button"
              onClick={() => setActiveView('products')}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
