import React from 'react';
import { 
  CheckCircle2, 
  MessageCircle, 
  Truck, 
  Printer, 
  ArrowRight, 
  Copy, 
  Check, 
  MapPin, 
  Phone,
  PackageCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, createWhatsAppOrderLink } from '../utils/helpers';

export const OrderSuccessView: React.FC = () => {
  const { selectedOrder, settings, setActiveView, addToast } = useStore();

  const [copied, setCopied] = React.useState(false);

  if (!selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">No active order found</h2>
        <button
          type="button"
          onClick={() => setActiveView('home')}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs"
        >
          Return to {settings.storeName}
        </button>
      </div>
    );
  }

  const order = selectedOrder;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    addToast('Order ID copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppConfirm = () => {
    const link = createWhatsAppOrderLink(
      order.items, 
      order.total, 
      settings, 
      {
        fullName: order.customer.fullName,
        phone: order.customer.phoneNumber,
        city: order.customer.city,
        address: order.customer.address
      },
      order.orderNumber
    );
    window.open(link, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8" id="trizenmart-order-success">
      
      {/* Success Badge Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {settings.storeName} Official Order
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 pt-2">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Thank you, <strong className="text-slate-900">{order.customer.fullName}</strong>. We have received your order and our dispatch center is preparing your shipment.
          </p>
        </div>

        {/* Order ID Tag */}
        <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold">Order Reference:</span>
          <span className="font-mono font-black text-sm text-emerald-700">{order.orderNumber}</span>
          <button
            type="button"
            onClick={handleCopyOrderId}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
            title="Copy Order ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Quick Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Order Date</span>
            <p className="font-bold text-slate-800 mt-0.5">{new Date(order.date).toLocaleDateString('en-GB')}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Payment Mode</span>
            <p className="font-bold text-slate-800 mt-0.5 uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Estimated Arrival</span>
            <p className="font-bold text-emerald-700 mt-0.5">{order.estimatedDelivery}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Courier Partner</span>
            <p className="font-bold text-slate-800 mt-0.5">{order.courierName || 'TCS Express'}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</h3>
          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.product.name}</h4>
                    <p className="text-slate-500 text-[11px]">Qty: {item.quantity} × {formatPrice(item.product.price, settings.currencySymbol)}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  {formatPrice(item.product.price * item.quantity, settings.currencySymbol)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Totals */}
        <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-bold">{formatPrice(order.subtotal, settings.currencySymbol)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Discount</span>
              <span>-{formatPrice(order.discountAmount, settings.currencySymbol)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-bold">{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee, settings.currencySymbol)}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
            <span>Total Payable</span>
            <span className="text-base text-emerald-700">{formatPrice(order.total, settings.currencySymbol)}</span>
          </div>
        </div>

        {/* Shipping Address Summary */}
        <div className="border-t border-slate-200 pt-4 text-xs space-y-1.5 text-slate-600">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider">Delivery Destination:</h4>
          <p className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{order.customer.address}, {order.customer.city}, {order.customer.province}</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{order.customer.phoneNumber} ({order.customer.fullName})</span>
          </p>
        </div>

        {/* CTAs & WhatsApp Confirmation */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleWhatsAppConfirm}
              className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
              id="success-whatsapp-confirm-btn"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm / Chat on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('order-tracking')}
              className="py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-2xl flex items-center justify-center gap-2 transition-colors"
              id="success-track-btn"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Track Order Live</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice Receipt</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Back to {settings.storeName} Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
