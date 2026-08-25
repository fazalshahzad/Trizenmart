import React from 'react';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CompareFloatingBar: React.FC = () => {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    setIsCompareModalOpen,
    isCompareModalOpen
  } = useStore();

  if (compareList.length === 0 || isCompareModalOpen) return null;

  return (
    <aside 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[94%] sm:w-auto bg-slate-900 text-white rounded-3xl p-3 sm:px-5 sm:py-3.5 shadow-2xl border border-slate-700/80 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-6 duration-300 backdrop-blur-md"
      id="trizenmart-compare-floating-bar"
      aria-label="Product comparison tray"
    >
      {/* Thumbnails + Counter */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-bold">
          <Scale className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-2">
            {compareList.map((prod) => (
              <div 
                key={prod.id} 
                className="relative group w-10 h-10 rounded-xl bg-white p-1 border-2 border-slate-900 overflow-visible shrink-0 shadow-xs"
                title={prod.name}
              >
                <img 
                  src={prod.images[0]} 
                  alt={prod.name} 
                  className="w-full h-full object-contain" 
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(prod.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm transition-transform hover:scale-110"
                  title={`Remove ${prod.name}`}
                  aria-label={`Remove ${prod.name}`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}

            {/* Empty slots placeholders up to 4 */}
            {Array.from({ length: Math.max(0, 4 - compareList.length) }).slice(0, 2).map((_, idx) => (
              <div 
                key={`empty-slot-${idx}`} 
                className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/60 flex items-center justify-center text-slate-500 text-[10px] font-bold"
                title="Add more items to compare"
              >
                +
              </div>
            ))}
          </div>

          <div className="hidden sm:flex flex-col text-left pl-1">
            <span className="text-xs font-extrabold text-white">Compare Tray</span>
            <span className="text-[10px] text-slate-400 font-medium">
              {compareList.length} of 4 items selected
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsCompareModalOpen(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-1.5 transition-all shadow-md hover:scale-102"
          id="floating-compare-open-btn"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={clearCompare}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
          title="Clear comparison tray"
          aria-label="Clear all items"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
