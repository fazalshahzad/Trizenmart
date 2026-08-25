import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  User, 
  LayoutDashboard, 
  Sparkles,
  ChevronDown,
  ArrowRight,
  Scale
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/helpers';

export const Header: React.FC = () => {
  const { 
    settings, 
    cartItemCount, 
    cartSubtotal, 
    setIsCartOpen, 
    wishlist, 
    activeView, 
    setActiveView, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct,
    compareList,
    setIsCompareModalOpen
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search filtered suggestions
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('products');
      setIsSearchFocused(false);
    }
  };

  const handleSelectProduct = (prod: typeof products[0]) => {
    setSelectedProduct(prod);
    setActiveView('product-detail');
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs" id="trizenmart-header">
      {/* Top Announcement Bar */}
      {settings.isAnnouncementEnabled && (
        <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs font-medium border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase">
                {settings.storeName}
              </span>
              <span className="truncate">{settings.announcementText}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <a 
                href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20have%20an%20inquiry.`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {settings.phone}</span>
              </a>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-slate-200 font-semibold">
                🇵🇰 {settings.currency} ({settings.currencySymbol})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('home');
              }}
              className="flex items-center gap-2.5 text-left group"
              id="trizenmart-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="font-extrabold text-xl tracking-tighter">T</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 leading-none group-hover:text-emerald-600 transition-colors">
                  {settings.storeName}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">
                  Pakistan Official
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar with Live Suggestions */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder={`Search headphones, smartwatches, chargers in ${settings.storeName}...`}
                  className="w-full pl-11 pr-24 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-emerald-500/15 transition-all"
                  id="header-search-input"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold transition-colors shadow-xs"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 overflow-hidden">
                <div className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Products in {settings.storeName}
                </div>
                {searchResults.map(prod => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelectProduct(prod)}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-emerald-50/70 text-left transition-colors"
                  >
                    <img 
                      src={prod.images[0]} 
                      alt={prod.name} 
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{prod.name}</p>
                      <p className="text-xs text-emerald-600 font-bold">{formatPrice(prod.price, settings.currencySymbol)}</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      {prod.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Track Order Button */}
            <button
              type="button"
              onClick={() => setActiveView('order-tracking')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeView === 'order-tracking' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              id="header-track-order-btn"
            >
              <Truck className="w-4 h-4 text-emerald-500" />
              <span>Track Order</span>
            </button>

            {/* Wishlist / Saved Items Button */}
            <button
              type="button"
              onClick={() => setActiveView('saved-items')}
              className={`relative p-2.5 rounded-xl transition-colors ${
                activeView === 'saved-items' || activeView === 'wishlist'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-700 hover:text-rose-600 hover:bg-slate-100'
              }`}
              title={`Saved Items (${wishlist.length})`}
              id="header-wishlist-btn"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Compare Products Button */}
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Compare Products Specifications"
              id="header-compare-btn"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all group"
              id="header-cart-btn"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left text-xs leading-tight">
                <span className="text-emerald-100 text-[10px] font-medium">My Cart</span>
                <span className="font-bold">{formatPrice(cartSubtotal, settings.currencySymbol)}</span>
              </div>
            </button>

            {/* Admin Dashboard Switcher Badge */}
            <button
              type="button"
              onClick={() => setActiveView(activeView === 'admin' ? 'home' : 'admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeView === 'admin'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
              }`}
              title="Toggle TRIZENMART Admin Management"
              id="header-admin-toggle-btn"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden xl:inline">{activeView === 'admin' ? 'Exit Admin' : 'Admin Panel'}</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl md:hidden"
              id="header-mobile-menu-btn"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between border-t border-slate-100 py-2.5 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-6">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-1.5 text-slate-900 font-bold hover:text-emerald-600 transition-colors"
                id="header-category-dropdown-btn"
              >
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isCategoryMenuOpen && (
                <div 
                  className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50"
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      setActiveView('products');
                      setIsCategoryMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors ${
                      selectedCategory === null ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    All Products Catalog
                  </button>
                  <div className="h-px bg-slate-100 my-1"></div>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setActiveView('products');
                        setIsCategoryMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between transition-colors ${
                        selectedCategory === cat.name ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                        {cat.itemCount}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('home');
              }}
              className={`hover:text-emerald-600 transition-colors ${activeView === 'home' ? 'text-emerald-600 font-bold' : ''}`}
            >
              Storefront
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('products');
              }}
              className={`hover:text-emerald-600 transition-colors ${activeView === 'products' ? 'text-emerald-600 font-bold' : ''}`}
            >
              Shop All
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Audio & Wireless Tech');
                setActiveView('products');
              }}
              className="hover:text-emerald-600 transition-colors"
            >
              Audio & Headphones
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Smart Gadgets & Wearables');
                setActiveView('products');
              }}
              className="hover:text-emerald-600 transition-colors"
            >
              Smart Watches
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Fast Charging & Power');
                setActiveView('products');
              }}
              className="hover:text-emerald-600 transition-colors"
            >
              Fast Chargers
            </button>

            {/* Saved Items Nav Link */}
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('saved-items');
              }}
              className={`flex items-center gap-1.5 transition-colors ${
                activeView === 'saved-items' || activeView === 'wishlist'
                  ? 'text-rose-600 font-bold' 
                  : 'hover:text-rose-600'
              }`}
              id="header-nav-saved-items-link"
            >
              <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>Saved Items</span>
              {wishlist.length > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Original Products Guaranteed
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              💵 Cash on Delivery
            </span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${settings.storeName}...`}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('home');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800"
            >
              Home Storefront
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('products');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800"
            >
              Browse All Products
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('order-tracking');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800 flex items-center justify-between"
            >
              <span>Track My Order</span>
              <Truck className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('saved-items');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800 flex items-center justify-between"
              id="mobile-nav-saved-items-btn"
            >
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                <span>Saved Items</span>
              </div>
              {wishlist.length > 0 && (
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCompareModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800 flex items-center justify-between"
            >
              <span>Compare Products ({compareList.length})</span>
              <Scale className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('account');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-800"
            >
              Customer Account & Orders
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-bold text-purple-700 bg-purple-50 rounded-lg"
            >
              Admin Dashboard & Settings
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setActiveView('products');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-2 py-1.5 rounded hover:bg-slate-50 text-slate-700 truncate"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
