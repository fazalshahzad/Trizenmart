import React from 'react';
import { 
  Watch, 
  Headphones, 
  Zap, 
  Laptop, 
  Home, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const iconMap: Record<string, React.ReactNode> = {
  Watch: <Watch className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Laptop: <Laptop className="w-6 h-6" />,
  Home: <Home className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
};

export const CategoryList: React.FC = () => {
  const { categories, setSelectedCategory, setActiveView, settings } = useStore();

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6" id="trizenmart-categories-section">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            {settings.storeName} Collections
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Shop by Category
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedCategory(null);
            setActiveView('products');
          }}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
        >
          <span>View All Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryClick(cat.name)}
            className="group relative bg-white p-5 rounded-3xl border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center shadow-xs">
              {iconMap[cat.icon] || <Sparkles className="w-6 h-6" />}
            </div>

            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {cat.itemCount} items
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
