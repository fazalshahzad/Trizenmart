import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Eye, 
  MessageCircle, 
  DollarSign, 
  RotateCcw, 
  Send,
  Sparkles,
  Save,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, createWhatsAppOrderUpdateLink } from '../utils/helpers';
import { Order, Product, StoreSettings } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetSettingsToDefault, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus, 
    categories, 
    addToast,
    setActiveView,
    setSelectedOrder
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'settings' | 'templates'>('overview');
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: categories[0]?.name || 'Smart Gadgets & Wearables',
    brand: 'TRIZENMART Pro',
    price: 3500,
    originalPrice: 4500,
    discountPercentage: 22,
    stockCount: 30,
    sku: `TZM-${Math.floor(100 + Math.random() * 900)}`,
    shortDescription: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    isFlashDeal: false,
    badge: 'New Arrival',
  });

  // Orders Filter State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Metrics Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const shippedOrdersCount = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  const handleCreateOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name.trim()) {
      addToast('Product name is required', 'warning');
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productFormData.name,
        category: productFormData.category,
        brand: productFormData.brand,
        price: Number(productFormData.price),
        originalPrice: Number(productFormData.originalPrice),
        discountPercentage: Number(productFormData.discountPercentage),
        stockCount: Number(productFormData.stockCount),
        shortDescription: productFormData.shortDescription,
        description: productFormData.description,
        images: [productFormData.image],
        isFeatured: productFormData.isFeatured,
        isFlashDeal: productFormData.isFlashDeal,
        badge: productFormData.badge,
      });
      setEditingProductId(null);
    } else {
      addProduct({
        name: productFormData.name,
        category: productFormData.category,
        brand: productFormData.brand,
        price: Number(productFormData.price),
        originalPrice: Number(productFormData.originalPrice),
        discountPercentage: Number(productFormData.discountPercentage),
        stockCount: Number(productFormData.stockCount),
        sku: productFormData.sku,
        inStock: true,
        shortDescription: productFormData.shortDescription || `${productFormData.name} available at ${settings.storeName}`,
        description: productFormData.description || `Original authentic product by ${productFormData.brand}. Covered by ${settings.storeName} official warranty.`,
        images: [productFormData.image],
        features: ['High quality build', 'Fast shipping across Pakistan', 'Official warranty included'],
        specs: {
          'Brand': productFormData.brand,
          'SKU': productFormData.sku,
          'Warranty': 'Official TRIZENMART Warranty',
        },
        tags: [productFormData.category, 'Featured'],
        isFeatured: productFormData.isFeatured,
        isFlashDeal: productFormData.isFlashDeal,
        badge: productFormData.badge,
        rating: 5.0,
        reviewCount: 1,
      });
    }

    setIsAddProductOpen(false);
    // Reset form
    setProductFormData({
      name: '',
      category: categories[0]?.name || 'Smart Gadgets & Wearables',
      brand: 'TRIZENMART Pro',
      price: 3500,
      originalPrice: 4500,
      discountPercentage: 22,
      stockCount: 30,
      sku: `TZM-${Math.floor(100 + Math.random() * 900)}`,
      shortDescription: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      isFeatured: true,
      isFlashDeal: false,
      badge: 'New Arrival',
    });
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductFormData({
      name: prod.name,
      category: prod.category,
      brand: prod.brand,
      price: prod.price,
      originalPrice: prod.originalPrice,
      discountPercentage: prod.discountPercentage,
      stockCount: prod.stockCount,
      sku: prod.sku,
      shortDescription: prod.shortDescription,
      description: prod.description,
      image: prod.images[0] || '',
      isFeatured: !!prod.isFeatured,
      isFlashDeal: !!prod.isFlashDeal,
      badge: prod.badge || '',
    });
    setIsAddProductOpen(true);
  };

  const filteredOrders = orders.filter(ord => {
    const matchesSearch = 
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customer.phoneNumber.includes(orderSearch) ||
      ord.customer.city.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="trizenmart-admin-dashboard">
      
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Store Control Room
            </span>
            <span className="text-emerald-400 font-bold text-xs">● Live & Synced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {settings.storeName} Management Console
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Control branding, process COD orders, manage inventory, and configure Pakistani courier logistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveView('home')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors"
          >
            Preview Storefront
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingProductId(null);
              setIsAddProductOpen(true);
            }}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Catalog ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings & Branding</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'templates'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp & Email Templates</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Volume</span>
              <p className="text-2xl font-black text-slate-900 font-display">
                {formatPrice(totalRevenue, settings.currencySymbol)}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span>↑ Active store revenue</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
              <p className="text-2xl font-black text-slate-900 font-display">
                {orders.length}
              </p>
              <p className="text-[11px] text-slate-500">
                {deliveredOrdersCount} delivered successfully
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending COD Orders</span>
              <p className="text-2xl font-black text-amber-600 font-display">
                {pendingOrdersCount}
              </p>
              <p className="text-[11px] text-amber-700 font-semibold">
                Requires customer phone call / verification
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Inventory</span>
              <p className="text-2xl font-black text-purple-700 font-display">
                {products.length} Products
              </p>
              <p className="text-[11px] text-slate-500">
                {categories.length} product categories
              </p>
            </div>
          </div>

          {/* Quick Action Alert */}
          <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-purple-950">Official Storefront: {settings.storeName}</h3>
              <p className="text-xs text-purple-800">
                All customer notifications, WhatsApp messages, invoice receipts, and metadata are calibrated to <strong>{settings.storeName}</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              Configure Store Details
            </button>
          </div>

          {/* Recent Orders in Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">Recent Customer Orders</h3>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                View all orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">City</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {orders.slice(0, 5).map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                      <td className="py-3 font-bold text-slate-800">{ord.customer.fullName}</td>
                      <td className="py-3">{ord.customer.city}</td>
                      <td className="py-3 font-black text-slate-900">{formatPrice(ord.total, settings.currencySymbol)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          ord.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {ord.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(ord);
                            setActiveView('order-tracking');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Filter / Search Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Order ID, Customer name, Phone, City..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-bold shrink-0">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer & Contact</th>
                    <th className="p-4">Shipping Destination</th>
                    <th className="p-4">Items & Total</th>
                    <th className="p-4">Status Action</th>
                    <th className="p-4 text-right">WhatsApp Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No orders match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(ord => (
                      <tr key={ord.id} className="hover:bg-slate-50/70">
                        <td className="p-4 font-medium">
                          <p className="font-mono font-bold text-slate-900 text-sm">{ord.orderNumber}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(ord.date).toLocaleDateString('en-GB')}
                          </p>
                        </td>

                        <td className="p-4 font-medium">
                          <p className="font-bold text-slate-900">{ord.customer.fullName}</p>
                          <p className="text-slate-500 text-[11px] font-mono">{ord.customer.phoneNumber}</p>
                        </td>

                        <td className="p-4 text-slate-600 max-w-xs">
                          <p className="font-bold text-slate-800">{ord.customer.city}</p>
                          <p className="text-[11px] text-slate-400 truncate">{ord.customer.address}</p>
                        </td>

                        <td className="p-4 font-medium">
                          <p className="font-black text-slate-900 text-sm">
                            {formatPrice(ord.total, settings.currencySymbol)}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {ord.items.length} items • {ord.paymentMethod.toUpperCase()}
                          </p>
                        </td>

                        <td className="p-4">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                              ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              ord.status === 'shipped' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                              ord.status === 'processing' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                              ord.status === 'confirmed' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                              ord.status === 'pending' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                              'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-4 text-right">
                          <a
                            href={createWhatsAppOrderUpdateLink(ord, settings)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                            title="Send WhatsApp status update"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Notify Customer</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              Inventory Catalog ({products.length} Products)
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingProductId(null);
                setIsAddProductOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(prod => (
              <div key={prod.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex gap-4">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-20 h-20 rounded-2xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      {prod.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-black text-slate-900">
                      {formatPrice(prod.price, settings.currencySymbol)}
                      <span className="text-slate-400 font-normal line-through ml-2 text-[11px]">
                        {formatPrice(prod.originalPrice, settings.currencySymbol)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Stock: <strong className="text-slate-800">{prod.stockCount} units</strong></span>
                  <span className="font-mono text-[10px] text-slate-400">SKU: {prod.sku}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleEditProductClick(prod)}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProduct(prod.id)}
                    className="py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: STORE SETTINGS & BRANDING */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {settings.storeName} Store Settings
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize store branding, pricing currency (PKR), support numbers, and shipping rates.
              </p>
            </div>

            <button
              type="button"
              onClick={resetSettingsToDefault}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Default TRIZENMART</span>
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Store Branding */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Brand Identity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                    id="settings-store-name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Brand Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500"
                    id="settings-tagline"
                  />
                </div>
              </div>
            </div>

            {/* Currency & Logistics */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Currency & Shipping Rules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Currency Code</label>
                  <input
                    type="text"
                    value={settingsForm.currency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={settingsForm.currencySymbol}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Free Shipping Min (Rs.)</label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Standard Shipping Fee (Rs.)</label>
                  <input
                    type="number"
                    value={settingsForm.standardShippingFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Express Shipping Fee (Rs.)</label>
                  <input
                    type="number"
                    value={settingsForm.expressShippingFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, expressShippingFee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Pakistan Address */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Customer Support & WhatsApp Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">WhatsApp Business Number (no + or spaces)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Display Helpline Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Warehouse Address (Pakistan)</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Announcement Banner */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">4. Top Header Announcement</h3>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Banner Announcement Text</label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                />
              </div>
            </div>

            {/* Save Action */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                id="save-settings-btn"
              >
                <Save className="w-4 h-4" />
                <span>Save Storefront Settings</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* TAB 5: TEMPLATES SIMULATOR */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* WhatsApp Template Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Customer Notification Preview</span>
            </div>

            <div className="bg-emerald-950 text-emerald-100 p-5 rounded-2xl font-mono text-xs leading-relaxed space-y-2 border border-emerald-800">
              <p className="text-emerald-400 font-bold">🛍️ *NEW ORDER ON {settings.storeName.toUpperCase()}*</p>
              <p>------------------------------------</p>
              <p>*Order ID:* TZM-90412</p>
              <p>*Date:* 25/08/2026</p>
              <p className="pt-1 text-white">*ITEMS ORDERED:*</p>
              <p>1. *Apex Pro Wireless ANC Headphones*</p>
              <p>   Qty: 1 x Rs. 6,499 = Rs. 6,499</p>
              <p className="pt-1 text-emerald-300 font-bold">💰 *TOTAL AMOUNT:* Rs. 6,499 (Cash on Delivery)</p>
              <p className="pt-1">*DELIVERY DESTINATION:*</p>
              <p>Name: Hamza Tariq</p>
              <p>City: Lahore, Punjab</p>
              <p>------------------------------------</p>
              <p>*Store:* {settings.storeName} - "{settings.tagline}"</p>
            </div>
            <p className="text-xs text-slate-500">
              This message is automatically formatted whenever a customer checks out or clicks "Order on WhatsApp".
            </p>
          </div>

          {/* Email Invoice Preview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span>Email Confirmation Invoice Preview</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-extrabold text-base text-slate-900">{settings.storeName}</span>
                <span className="text-emerald-700 font-bold">Tax Invoice</span>
              </div>
              <p className="text-slate-600">Dear Customer,</p>
              <p className="text-slate-600 leading-relaxed">
                Thank you for choosing <strong>{settings.storeName}</strong>! Your order is being packed at our Karachi / Lahore warehouse.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <p>Courier Partner: <strong>TCS Logistics Pakistan</strong></p>
                <p>Payment: <strong>Cash on Delivery</strong></p>
              </div>
              <p className="text-slate-500 text-[11px] pt-2 border-t border-slate-200">
                "{settings.tagline}" • Helpline: {settings.phone}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingProductId ? 'Edit Product Details' : `Add Product to ${settings.storeName}`}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="e.g. TRIZEN Fast GaN Charger 65W"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Brand</label>
                  <input
                    type="text"
                    value={productFormData.brand}
                    onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Selling Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={productFormData.stockCount}
                    onChange={(e) => setProductFormData({ ...productFormData, stockCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Image URL</label>
                <input
                  type="url"
                  value={productFormData.image}
                  onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Short Description</label>
                <input
                  type="text"
                  value={productFormData.shortDescription}
                  onChange={(e) => setProductFormData({ ...productFormData, shortDescription: e.target.value })}
                  placeholder="Highlights for search cards..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                >
                  {editingProductId ? 'Save Product Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
