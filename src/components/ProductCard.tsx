import React from 'react';
import { Heart, ShoppingBag, Star, MessageCircle, Eye, Check, Scale } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatPrice, createWhatsAppProductInquiryLink } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    settings, 
    addToCart, 
    toggleWishlist, 
    isWishlisted, 
    toggleCompare,
    isInCompare,
    setSelectedProduct, 
    setActiveView,
    setQuickViewProduct
  } = useStore();

  const wishlisted = isWishlisted(product.id);
  const compared = isInCompare(product.id);

  const handleCardClick = () => {
    setSelectedProduct(product);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants ? { [product.variants[0].name]: product.variants[0].options[0] } : undefined;
    addToCart(product, 1, defaultVariant);
  };

  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = createWhatsAppProductInquiryLink(product, settings);
    window.open(link, '_blank');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border ${
        compared ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/90 hover:border-emerald-500/50'
      } shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer`}
      id={`product-card-${product.id}`}
    >
      {/* Badges / Discount Tag */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.discountPercentage > 0 && (
          <span className="bg-rose-500 text-white text-[11px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide shadow-xs">
            -{product.discountPercentage}%
          </span>
        )}
        {product.badge && (
          <span className="bg-slate-900/90 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-xs">
            {product.badge}
          </span>
        )}
        {compared && (
          <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <Check className="w-2.5 h-2.5" />
            Comparing
          </span>
        )}
      </div>

      {/* Action Buttons (Wishlist + Compare) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all ${
            wishlisted 
              ? 'bg-rose-50 text-rose-500 scale-105 shadow-xs' 
              : 'bg-white/85 text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          id={`wishlist-btn-${product.id}`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all ${
            compared
              ? 'bg-emerald-600 text-white scale-105 shadow-md ring-2 ring-emerald-400/30'
              : 'bg-white/85 text-slate-400 hover:text-emerald-600 hover:bg-white shadow-xs'
          }`}
          title={compared ? 'Remove from Comparison' : 'Compare Specs'}
          id={`compare-btn-${product.id}`}
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image Box */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain object-center group-hover:scale-108 transition-transform duration-500"
        />

        {/* Quick View Button on Desktop Hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            type="button"
            onClick={handleQuickView}
            className="px-4 py-2 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="text-emerald-600 font-bold uppercase tracking-wider">{product.category}</span>
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating} ({product.reviewCount})</span>
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Stock Status */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {formatPrice(product.price, settings.currencySymbol)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through ml-2 font-medium">
                  {formatPrice(product.originalPrice, settings.currencySymbol)}
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3 text-emerald-600" />
              In Stock
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              id={`add-to-cart-${product.id}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppBuy}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              title="Order directly via WhatsApp with Cash on Delivery"
              id={`whatsapp-buy-${product.id}`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
