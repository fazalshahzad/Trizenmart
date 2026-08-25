import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  Category, 
  StoreSettings, 
  CartItem, 
  Order, 
  PromoCode, 
  ActiveView, 
  ToastMessage,
  ShippingMethodType 
} from '../types';
import { 
  DEFAULT_STORE_SETTINGS, 
  CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_PROMO_CODES, 
  INITIAL_ORDERS 
} from '../data/mockData';
import { generateOrderId } from '../utils/helpers';

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetSettingsToDefault: () => void;
  
  products: Product[];
  addProduct: (prod: Omit<Product, 'id' | 'slug'>) => Product;
  updateProduct: (id: string, prod: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  categories: Category[];
  
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productId: string, variantKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantKey?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  addAllWishlistToCart: () => void;
  isWishlisted: (productId: string) => boolean;
  
  promoCodes: PromoCode[];
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  
  orders: Order[];
  addOrder: (orderData: {
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    shippingMethod: ShippingMethodType;
    discountAmount: number;
    promoCode?: string;
    total: number;
    customer: Order['customer'];
    paymentMethod: Order['paymentMethod'];
  }) => Order;
  updateOrderStatus: (
    orderId: string, 
    newStatus: Order['status'], 
    courierInfo?: { courierName?: string; trackingNumber?: string }
  ) => void;
  
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', title?: string) => void;
  removeToast: (id: string) => void;
  
  cartSubtotal: number;
  cartDiscount: number;
  cartItemCount: number;

  isLoadingProducts: boolean;
  setIsLoadingProducts: (loading: boolean) => void;
  refreshProducts: () => Promise<void>;

  // Compare feature
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('trizenmart_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new phone number is reflected if previously default
        if (!parsed.phone || parsed.phone === '+92 300 8749366' || parsed.whatsappNumber === '923008749366') {
          parsed.phone = DEFAULT_STORE_SETTINGS.phone;
          parsed.whatsappNumber = DEFAULT_STORE_SETTINGS.whatsappNumber;
        }
        return { ...DEFAULT_STORE_SETTINGS, ...parsed };
      }
      return DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('trizenmart_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Categories
  const [categories] = useState<Category[]>(CATEGORIES);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('trizenmart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('trizenmart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Promo Codes
  const [promoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('trizenmart_promos');
      return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
    } catch {
      return INITIAL_PROMO_CODES;
    }
  });
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('trizenmart_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Navigation and UI state
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Compare state
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('trizenmart_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Initial product fetching simulation for skeleton perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingProducts(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const saved = localStorage.getItem('trizenmart_products');
      if (saved) {
        setProducts(JSON.parse(saved));
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
    } catch {
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('trizenmart_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('trizenmart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('trizenmart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('trizenmart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('trizenmart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('trizenmart_compare', JSON.stringify(compareList));
  }, [compareList]);

  // Toast Notification System
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Settings Handlers
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('Store settings updated successfully', 'success', 'TRIZENMART Settings');
  };

  const resetSettingsToDefault = () => {
    setSettings(DEFAULT_STORE_SETTINGS);
    addToast('Settings reset to default TRIZENMART configuration', 'info');
  };

  // Product Handlers
  const addProduct = (prodData: Omit<Product, 'id' | 'slug'>): Product => {
    const id = `tzm-prod-${Date.now().toString().slice(-4)}`;
    const slug = prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProd: Product = {
      ...prodData,
      id,
      slug,
      rating: prodData.rating || 5.0,
      reviewCount: prodData.reviewCount || 0,
      reviews: prodData.reviews || [],
    };
    setProducts(prev => [newProd, ...prev]);
    addToast(`"${newProd.name}" added to inventory`, 'success', 'Product Added');
    return newProd;
  };

  const updateProduct = (id: string, prodData: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...prodData } : p)));
    addToast('Product details updated', 'success');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast(`"${prod?.name || 'Product'}" removed from catalog`, 'info');
  };

  // Cart Handlers
  const getVariantKey = (variants?: Record<string, string>) => {
    if (!variants) return '';
    return Object.entries(variants).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${v}`).join('|');
  };

  const addToCart = (product: Product, quantity = 1, selectedVariants?: Record<string, string>) => {
    setCart(prev => {
      const vKey = getVariantKey(selectedVariants);
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && getVariantKey(item.selectedVariants) === vKey
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedVariants }];
      }
    });

    addToast(`Added ${quantity}x "${product.name}" to cart!`, 'success', 'Cart Updated');
  };

  const removeFromCart = (productId: string, variantKey?: string) => {
    setCart(prev => prev.filter(item => {
      if (item.product.id !== productId) return true;
      if (variantKey !== undefined) {
        return getVariantKey(item.selectedVariants) !== variantKey;
      }
      return false;
    }));
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number, variantKey?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantKey);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        if (variantKey !== undefined && getVariantKey(item.selectedVariants) !== variantKey) {
          return item;
        }
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Wishlist Handlers
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from saved items', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('Saved to your wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    addToast('Saved items list cleared', 'info');
  };

  const addAllWishlistToCart = () => {
    const savedProducts = products.filter(p => wishlist.includes(p.id));
    if (savedProducts.length === 0) {
      addToast('No saved items to add', 'warning');
      return;
    }
    savedProducts.forEach(prod => {
      const defaultVariant = prod.variants ? { [prod.variants[0].name]: prod.variants[0].options[0] } : undefined;
      addToCart(prod, 1, defaultVariant);
    });
    addToast(`Added ${savedProducts.length} saved item${savedProducts.length > 1 ? 's' : ''} to your cart! 🛍️`, 'success');
    setIsCartOpen(true);
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Compare Handlers
  const addToCompare = (product: Product): boolean => {
    if (compareList.some(p => p.id === product.id)) {
      addToast(`"${product.name}" is already in comparison tray.`, 'info', 'Compare Products');
      return false;
    }
    if (compareList.length >= 4) {
      addToast('You can compare up to 4 items at once. Please remove one item to add another.', 'warning', 'Comparison Limit (4)');
      return false;
    }
    const updated = [...compareList, product];
    setCompareList(updated);
    addToast(`Added "${product.name}" to comparison (${updated.length}/4)`, 'success', 'Compare Specifications');
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
    addToast('Item removed from comparison', 'info');
  };

  const toggleCompare = (product: Product) => {
    if (compareList.some(p => p.id === product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    addToast('Product comparison list cleared', 'info');
  };

  const isInCompare = (productId: string) => {
    return compareList.some(p => p.id === productId);
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (cartSubtotal < appliedPromo.minOrderAmount) return 0;
    if (appliedPromo.type === 'percentage') {
      return Math.round((cartSubtotal * appliedPromo.value) / 100);
    }
    return Math.min(appliedPromo.value, cartSubtotal);
  }, [appliedPromo, cartSubtotal]);

  // Promo Code Validation
  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = promoCodes.find(p => p.code.toUpperCase() === cleanCode && p.active);

    if (!found) {
      return { success: false, message: 'Invalid or expired promo coupon code.' };
    }

    if (cartSubtotal < found.minOrderAmount) {
      return { 
        success: false, 
        message: `Minimum order of ${settings.currencySymbol} ${found.minOrderAmount.toLocaleString()} required for this coupon.` 
      };
    }

    setAppliedPromo(found);
    addToast(`Coupon "${found.code}" applied successfully!`, 'success');
    return { success: true, message: `Coupon applied: ${found.description}` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    addToast('Coupon code removed', 'info');
  };

  // Orders
  const addOrder = (orderData: {
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    shippingMethod: ShippingMethodType;
    discountAmount: number;
    promoCode?: string;
    total: number;
    customer: Order['customer'];
    paymentMethod: Order['paymentMethod'];
  }): Order => {
    const orderNumber = generateOrderId(settings.orderPrefix || 'TZM');
    const now = new Date();
    
    // Estimate delivery date 2-3 business days
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + (orderData.shippingMethod === 'express' ? 2 : 3));
    const estimatedDelivery = estDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: now.toISOString(),
      items: orderData.items,
      subtotal: orderData.subtotal,
      shippingFee: orderData.shippingFee,
      shippingMethod: orderData.shippingMethod,
      discountAmount: orderData.discountAmount,
      promoCode: orderData.promoCode,
      total: orderData.total,
      customer: orderData.customer,
      paymentMethod: orderData.paymentMethod,
      status: 'pending',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'cash_on_delivery' : 'paid',
      courierName: 'TCS Express Pakistan',
      trackingNumber: `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery,
      timeline: [
        {
          timestamp: now.toLocaleString(),
          title: `Order Received at ${settings.storeName}`,
          description: `Order successfully booked with ${orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}.`,
          status: 'pending',
          completed: true,
        },
        {
          timestamp: 'Pending Verification',
          title: 'Order Verification & Dispatch Preparation',
          description: 'Our customer support team is verifying details before warehouse packaging.',
          status: 'confirmed',
          completed: false,
        },
        {
          timestamp: 'Upcoming',
          title: 'Dispatched via Courier',
          description: 'Package handed to courier partner with tracking details.',
          status: 'shipped',
          completed: false,
        },
        {
          timestamp: `Estimated: ${estimatedDelivery}`,
          title: 'Delivered',
          description: 'Delivered to recipient address with COD collection if applicable.',
          status: 'delivered',
          completed: false,
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setSelectedOrder(newOrder);
    addToast(`Order ${orderNumber} placed successfully!`, 'success', 'Order Confirmed');
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    newStatus: Order['status'], 
    courierInfo?: { courierName?: string; trackingNumber?: string }
  ) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const now = new Date().toLocaleString();
        let statusTitle = '';
        let statusDesc = '';

        if (newStatus === 'confirmed') {
          statusTitle = `Verified by ${settings.storeName} Staff`;
          statusDesc = 'Customer contact and shipping address confirmed.';
        } else if (newStatus === 'processing') {
          statusTitle = 'Packed in Warehouse';
          statusDesc = 'Item checked, boxed with safety seals, ready for courier pickup.';
        } else if (newStatus === 'shipped') {
          statusTitle = `Dispatched via ${courierInfo?.courierName || ord.courierName || 'TCS Express'}`;
          statusDesc = `Courier Tracking: ${courierInfo?.trackingNumber || ord.trackingNumber || 'Available'}`;
        } else if (newStatus === 'delivered') {
          statusTitle = 'Delivered to Customer';
          statusDesc = 'Order delivered successfully to recipient.';
        } else if (newStatus === 'cancelled') {
          statusTitle = 'Order Cancelled';
          statusDesc = 'Order was cancelled per customer or warehouse request.';
        }

        const updatedTimeline = ord.timeline.map(t => {
          if (t.status === newStatus) {
            return { ...t, timestamp: now, completed: true, title: statusTitle || t.title, description: statusDesc || t.description };
          }
          return t;
        });

        // If newly added status not present in timeline, append
        if (!updatedTimeline.some(t => t.status === newStatus)) {
          updatedTimeline.push({
            timestamp: now,
            title: statusTitle,
            description: statusDesc,
            status: newStatus,
            completed: true,
          });
        }

        return {
          ...ord,
          status: newStatus,
          courierName: courierInfo?.courierName || ord.courierName,
          trackingNumber: courierInfo?.trackingNumber || ord.trackingNumber,
          paymentStatus: newStatus === 'delivered' && ord.paymentMethod === 'cod' ? 'paid' : ord.paymentStatus,
          timeline: updatedTimeline,
        };
      }
      return ord;
    }));

    addToast(`Order status updated to ${newStatus.toUpperCase()}`, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettingsToDefault,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        clearWishlist,
        addAllWishlistToCart,
        isWishlisted,
        promoCodes,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        orders,
        addOrder,
        updateOrderStatus,
        activeView,
        setActiveView,
        selectedProduct,
        setSelectedProduct,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedOrder,
        setSelectedOrder,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        addToast,
        removeToast,
        cartSubtotal,
        cartDiscount,
        cartItemCount,
        isLoadingProducts,
        setIsLoadingProducts,
        refreshProducts,
        compareList,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
