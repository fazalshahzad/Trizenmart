export interface StoreSettings {
  storeName: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  phone: string;
  whatsappNumber: string;
  supportEmail: string;
  address: string;
  city: string;
  country: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  announcementText: string;
  isAnnouncementEnabled: boolean;
  orderPrefix: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'capacity' | 'edition';
  options: string[];
  selected?: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  userCity?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  shortDescription: string;
  description: string;
  images: string[];
  features: string[];
  specs: Record<string, string>;
  tags: string[];
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  badge?: string;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface CustomerDetails {
  fullName: string;
  phoneNumber: string;
  email?: string;
  city: string;
  address: string;
  province: string;
  postalCode?: string;
  orderNotes?: string;
}

export type PaymentMethodType = 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'card';
export type OrderStatusType = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ShippingMethodType = 'standard' | 'express';

export interface OrderTimelineEvent {
  timestamp: string;
  title: string;
  description: string;
  status: OrderStatusType;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  shippingMethod: ShippingMethodType;
  discountAmount: number;
  promoCode?: string;
  total: number;
  customer: CustomerDetails;
  paymentMethod: PaymentMethodType;
  status: OrderStatusType;
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  timeline: OrderTimelineEvent[];
  paymentStatus: 'pending' | 'paid' | 'cash_on_delivery';
}

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  description: string;
  active: boolean;
}

export type ActiveView = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'saved-items'
  | 'wishlist'
  | 'cart' 
  | 'checkout' 
  | 'order-success' 
  | 'order-tracking' 
  | 'account' 
  | 'admin'
  | 'about'
  | 'contact'
  | 'terms';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  title?: string;
}
