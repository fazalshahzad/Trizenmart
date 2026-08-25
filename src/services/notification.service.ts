import { Order, StoreSettings } from '../types';
import { formatPrice } from '../utils/helpers';
import { sanitizePhoneNumber } from '../lib/sanitizer';

export class NotificationService {
  /**
   * Generates a direct WhatsApp link to send customer order notification
   */
  public static createOrderWhatsAppUrl(order: Order, settings: StoreSettings): string {
    const rawPhone = settings.whatsappNumber || '+92 300 1234567';
    const cleanPhone = sanitizePhoneNumber(rawPhone);

    const itemsSummary = order.items
      .map(i => `• ${i.product.name} (x${i.quantity}) - ${formatPrice(i.product.price * i.quantity, settings.currency)}`)
      .join('\n');

    const message = `🛍️ *NEW ORDER PLACED - ${settings.storeName.toUpperCase()}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *Order ID:* #${order.orderNumber || order.id}\n` +
      `👤 *Customer:* ${order.customer.fullName}\n` +
      `📞 *Phone:* ${order.customer.phoneNumber}\n` +
      `📍 *Address:* ${order.customer.address}, ${order.customer.city}\n\n` +
      `🛒 *Order Summary:*\n${itemsSummary}\n\n` +
      `💳 *Payment Method:* ${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod.toUpperCase()}\n` +
      `💰 *Total Payable:* ${formatPrice(order.total, settings.currency)}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💬 *Note:* ${order.customer.orderNotes || 'Please dispatch promptly.'}\n\n` +
      `_Thank you for choosing ${settings.storeName}!_`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Generates a customer-facing status update WhatsApp link
   */
  public static createCustomerStatusUrl(order: Order, settings: StoreSettings): string {
    const cleanPhone = sanitizePhoneNumber(order.customer.phoneNumber);
    const trackingMsg = `Assalam-o-Alaikum ${order.customer.fullName}!\n\n` +
      `Update on your order *#${order.orderNumber || order.id}* from *${settings.storeName}*:\n` +
      `📦 *Status:* ${order.status.toUpperCase()}\n` +
      `💰 *Amount Due on Delivery:* ${formatPrice(order.total, settings.currency)}\n\n` +
      (order.trackingNumber ? `🚚 *Courier Tracking:* ${order.trackingNumber}\n\n` : '') +
      `For any questions, feel free to reply directly to this message. Thank you!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(trackingMsg)}`;
  }
}
