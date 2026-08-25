import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    'Track my order status',
    'Do you deliver Cash on Delivery to my city?',
    'What is your replacement warranty?',
    'Help me choose the right headphones',
  ];

  const handleSend = (textToSend?: string) => {
    const message = textToSend || customMsg || `Hi ${settings.storeName}, I have an inquiry about your products.`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40" id="trizenmart-floating-whatsapp">
      
      {/* Expanded Quick Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden mb-2 animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shadow-xs">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">{settings.storeName} Support</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>Online • Typically replies in 5 mins</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3 text-xs">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="font-bold text-slate-900">👋 Welcome to {settings.storeName}!</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                How can our customer team help you today with your order or product inquiries in Pakistan?
              </p>
            </div>

            {/* Quick Chips */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Inquiries</p>
              <div className="flex flex-col gap-1.5">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="text-left text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all font-medium"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all duration-200"
        title={`Chat with ${settings.storeName} on WhatsApp`}
        id="floating-whatsapp-btn"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

    </div>
  );
};
