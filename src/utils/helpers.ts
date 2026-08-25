import { Order, CartItem, StoreSettings, Product } from '../types';

export const formatPrice = (amount: number, symbol = 'Rs.'): string => {
  return `${symbol} ${Math.round(amount).toLocaleString('en-PK')}`;
};

export const generateOrderId = (prefix = 'TZM'): string => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
};

export const createWhatsAppOrderLink = (
  items: CartItem[],
  total: number,
  settings: StoreSettings,
  customer?: { fullName: string; city: string; address: string; phone: string },
  orderNumber?: string
): string => {
  const storeName = settings.storeName || 'TRIZENMART';
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  let text = `🛍️ *NEW ORDER ON ${storeName.toUpperCase()}*\n`;
  text += `------------------------------------\n`;
  if (orderNumber) {
    text += `*Order ID:* ${orderNumber}\n`;
  }
  text += `*Date:* ${new Date().toLocaleDateString('en-GB')}\n\n`;

  text += `📦 *ITEMS ORDERED:*\n`;
  items.forEach((item, index) => {
    const variantStr = item.selectedVariants 
      ? ` (${Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')})`
      : '';
    text += `${index + 1}. *${item.product.name}*${variantStr}\n`;
    text += `   Qty: ${item.quantity} x ${formatPrice(item.product.price, settings.currencySymbol)} = ${formatPrice(item.product.price * item.quantity, settings.currencySymbol)}\n`;
  });

  text += `\n💰 *TOTAL AMOUNT:* ${formatPrice(total, settings.currencySymbol)} (Cash on Delivery)\n`;

  if (customer && customer.fullName) {
    text += `\n📍 *DELIVERY DETAILS:*\n`;
    text += `*Name:* ${customer.fullName}\n`;
    text += `*Phone:* ${customer.phone}\n`;
    text += `*City:* ${customer.city}\n`;
    text += `*Address:* ${customer.address}\n`;
  }

  text += `\n------------------------------------\n`;
  text += `*Store:* ${storeName} - "Shop smarter. Shop with ${storeName}."\n`;
  text += `Please confirm my order dispatch. Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

export const createWhatsAppProductInquiryLink = (
  product: Product,
  settings: StoreSettings
): string => {
  const storeName = settings.storeName || 'TRIZENMART';
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const text = `Hi *${storeName}* Support team! 👋\n\nI want to inquire about / buy this product:\n\n*Product:* ${product.name}\n*SKU:* ${product.sku}\n*Price:* ${formatPrice(product.price, settings.currencySymbol)}\n*Availability:* In Stock\n\nPlease let me know delivery timeframe to my city. Thanks!\n\n_Ref: ${storeName} Storefront_`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

export const createWhatsAppOrderUpdateLink = (
  order: Order,
  settings: StoreSettings
): string => {
  const cleanCustomerPhone = order.customer.phoneNumber.replace(/[^0-9]/g, '');
  const storeName = settings.storeName || 'TRIZENMART';

  let statusMsg = '';
  if (order.status === 'confirmed') {
    statusMsg = `✅ Your order *${order.orderNumber}* has been *CONFIRMED* and is now being packed at our warehouse.`;
  } else if (order.status === 'shipped') {
    statusMsg = `🚚 Great news! Your order *${order.orderNumber}* has been *DISPATCHED* via ${order.courierName || 'TCS Express'} (Tracking: ${order.trackingNumber || 'TZM-TRACK'}). Estimated delivery is ${order.estimatedDelivery}.`;
  } else if (order.status === 'delivered') {
    statusMsg = `🎉 Your order *${order.orderNumber}* has been *DELIVERED*! Thank you for shopping with ${storeName}. We hope you enjoy your purchase!`;
  } else {
    statusMsg = `ℹ️ Status update for order *${order.orderNumber}*: Current status is *${order.status.toUpperCase()}*.`;
  }

  const text = `Assalam-o-Alaikum ${order.customer.fullName}! 👋\n\n${statusMsg}\n\n*Order Summary:*\nTotal: ${formatPrice(order.total, settings.currencySymbol)} (${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid'})\n\nNeed assistance? Reply to this message or visit our store.\n\n*${storeName}* — "Shop smarter. Shop with ${storeName}."`;

  return `https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(text)}`;
};
