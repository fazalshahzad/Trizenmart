import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroBanner } from './components/HeroBanner';
import { CategoryList } from './components/CategoryList';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { AccountView } from './components/AccountView';
import { SavedItemsView } from './components/SavedItemsView';
import { ProductListingView } from './components/ProductListingView';
import { AboutView, ContactView, TermsView } from './components/StaticPages';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { ToastContainer } from './components/Toast';
import { ProductGridSkeleton } from './components/Skeleton';
import { CompareModal } from './components/CompareModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MessageCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    products, 
    settings, 
    setSelectedCategory,
    isLoadingProducts,
    refreshProducts
  } = useStore();

  const flashDeals = products.filter(p => p.isFlashDeal);
  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-800 font-sans antialiased selection:bg-emerald-500 selection:text-white" id="trizenmart-app-root">
      
      {/* Top Main Navigation Header */}
      <Header />

      {/* Main Dynamic View Switcher */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div className="space-y-12 sm:space-y-16 pb-16">
            
            {/* Hero Interactive Carousel */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
              <HeroBanner />
            </div>

            {/* Shop by Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CategoryList />
            </div>

            {/* Flash Deals Section */}
            {(isLoadingProducts || flashDeals.length > 0) && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xs">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Limited Time Flash Sale</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Today's Exclusive Tech Steals
                      </h2>
                      <p className="text-xs text-slate-600">
                        Extra discounts available exclusively on {settings.storeName} with Nationwide Cash on Delivery.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(null);
                        setActiveView('products');
                      }}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all self-start sm:self-auto flex items-center gap-1.5"
                    >
                      <span>Explore All Deals</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isLoadingProducts ? (
                    <ProductGridSkeleton count={3} columns="3" id="home-flash-deals-skeleton" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                      {flashDeals.map(prod => (
                        <ProductCard key={prod.id} product={prod} />
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Featured Products Showcase */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Top Rated on {settings.storeName}</span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Trending In-Demand Gadgets
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => refreshProducts()}
                    disabled={isLoadingProducts}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh product catalog"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin text-emerald-600' : ''}`} />
                    <span>{isLoadingProducts ? 'Loading...' : 'Refresh'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      setActiveView('products');
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
                  >
                    <span>See Full Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isLoadingProducts ? (
                <ProductGridSkeleton count={8} columns="4" id="home-featured-products-skeleton" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
                  {featuredProducts.slice(0, 8).map(prod => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp Direct Ordering Featurette Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-800">
                <div className="space-y-3 z-10 max-w-xl text-center md:text-left">
                  <span className="bg-emerald-800/80 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-700">
                    Seamless Pakistani Ecommerce
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Order in 30 Seconds via WhatsApp or Web Checkout
                  </h3>
                  <p className="text-emerald-200 text-xs sm:text-sm leading-relaxed">
                    Have questions about specs, delivery times to your city, or prefer placing an order via direct voice note? Our {settings.storeName} representative is active on WhatsApp 7 days a week.
                  </p>
                </div>

                <div className="z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20${encodeURIComponent(settings.storeName)}%2C%20I%20would%20like%20to%20order%20products.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      setActiveView('products');
                    }}
                    className="px-6 py-3.5 bg-emerald-800/60 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl border border-emerald-700 transition-colors"
                  >
                    Browse Online Store
                  </button>
                </div>

                {/* Decorative glow */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
              </div>
            </div>

            {/* Why Buy from TRIZENMART Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">Nationwide COD</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Reliable courier delivery across all 150+ Pakistani cities with Cash on Delivery payment.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">100% Genuine Sealed</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Authentic brand-sealed hardware tested for high performance and durability.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">7 Days Easy Return</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Hassle-free replacement guarantee if your parcel has any transit or factory defects.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">24/7 WhatsApp Care</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Real human customer support available at your fingertips for all store inquiries.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Products Listing View */}
        {activeView === 'products' && <ProductListingView />}

        {/* Product Single Detail View */}
        {activeView === 'product-detail' && <ProductDetailView />}

        {/* Saved Items & Wishlist View */}
        {(activeView === 'saved-items' || activeView === 'wishlist') && <SavedItemsView />}

        {/* Checkout Process */}
        {activeView === 'checkout' && <CheckoutView />}

        {/* Order Success Confirmation */}
        {activeView === 'order-success' && <OrderSuccessView />}

        {/* Live Parcel Order Tracking */}
        {activeView === 'order-tracking' && <OrderTrackingView />}

        {/* Customer Account & Saved Orders */}
        {activeView === 'account' && <AccountView />}

        {/* Admin Store Dashboard */}
        {activeView === 'admin' && <AdminDashboard />}

        {/* Static Informational Pages */}
        {activeView === 'about' && <AboutView />}
        {activeView === 'contact' && <ContactView />}
        {activeView === 'terms' && <TermsView />}
      </main>

      {/* Global Modals, Drawers, Floating Bars, Toasts, and WhatsApp Floating Button */}
      <ProductDetailModal />
      <CompareModal />
      <CartDrawer />
      <CompareFloatingBar />
      <WhatsAppFloatingButton />
      <ToastContainer />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}

export default App;
