import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  X, 
  ArrowUpDown, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './Skeleton';
import { formatPrice } from '../utils/helpers';

export const ProductListingView: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    settings,
    isLoadingProducts
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const bSet = new Set(products.map(p => p.brand));
    return Array.from(bSet);
  }, [products]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      // Category filter
      if (selectedCategory && prod.category !== selectedCategory) {
        return false;
      }
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          prod.name.toLowerCase().includes(q) ||
          prod.category.toLowerCase().includes(q) ||
          prod.brand.toLowerCase().includes(q) ||
          prod.tags.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      // Price
      if (prod.price > priceMax) {
        return false;
      }
      // In stock
      if (onlyInStock && !prod.inStock) {
        return false;
      }
      // Brand
      if (selectedBrand !== 'all' && prod.brand !== selectedBrand) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, priceMax, onlyInStock, selectedBrand, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setPriceMax(10000);
    setOnlyInStock(false);
    setSelectedBrand('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="trizenmart-products-listing">
      
      {/* Top Title & Active Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            {settings.storeName} Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {selectedCategory || (searchQuery ? `Search results for "${searchQuery}"` : 'All Products')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> available items with Nationwide Cash on Delivery.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden px-4 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-emerald-500 shadow-xs"
            >
              <option value="featured">Featured & Best Deals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <div className={`md:block space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 sticky top-28">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                <span>Filters</span>
              </span>

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-rose-500 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Categories Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800">Categories</h4>
              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    selectedCategory === null 
                      ? 'bg-emerald-50 text-emerald-700 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === cat.name 
                        ? 'bg-emerald-50 text-emerald-700 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      {cat.itemCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Max Price:</span>
                <span className="text-emerald-600">{formatPrice(priceMax, settings.currencySymbol)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="250"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Rs. 1,000</span>
                <span>Rs. 10,000</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800">Brand</h4>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="all">All Brands</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>In Stock items only</span>
              </label>
            </div>

          </div>
        </div>

        {/* Product Grid Area (3 cols) */}
        <div className="md:col-span-3">
          {isLoadingProducts ? (
            <ProductGridSkeleton count={6} columns="3" id="catalog-products-skeleton" />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No products found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your filter settings or search terms for {settings.storeName}.
                </p>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {filteredProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
