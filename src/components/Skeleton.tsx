import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
  width,
  height,
  style,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded-md h-4';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
      default:
        return 'rounded-2xl';
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-200/80 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent ${getVariantClasses()} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden relative"
      id={id || 'product-card-skeleton'}
      aria-busy="true"
      aria-label="Loading product"
    >
      {/* Top badges placeholder */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <Skeleton className="w-12 h-5 !rounded-md bg-slate-200" />
      </div>

      {/* Wishlist button placeholder */}
      <div className="absolute top-3 right-3 z-10">
        <Skeleton variant="circular" className="w-8 h-8 bg-slate-200/90" />
      </div>

      {/* Product Image placeholder */}
      <div className="relative aspect-square w-full bg-slate-100/90 overflow-hidden flex items-center justify-center p-6">
        <div className="w-3/4 h-3/4 rounded-xl bg-slate-200/60 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent" />
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <Skeleton className="w-24 h-3.5 !rounded-sm bg-slate-200" />
            <Skeleton className="w-14 h-3.5 !rounded-sm bg-slate-200" />
          </div>

          {/* Title (2 lines) */}
          <div className="space-y-1.5 pt-1">
            <Skeleton className="w-11/12 h-4 !rounded bg-slate-200" />
            <Skeleton className="w-4/5 h-4 !rounded bg-slate-200" />
          </div>

          {/* Short description */}
          <div className="space-y-1 pt-1">
            <Skeleton className="w-full h-3 !rounded bg-slate-200/70" />
            <Skeleton className="w-3/4 h-3 !rounded bg-slate-200/70" />
          </div>
        </div>

        {/* Pricing & Stock Status */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-6 !rounded-md bg-slate-200" />
              <Skeleton className="w-12 h-4 !rounded-md bg-slate-200/60" />
            </div>
            <Skeleton className="w-16 h-5 !rounded-full bg-slate-200/70" />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Skeleton className="w-full h-9 !rounded-xl bg-slate-200" />
            <Skeleton className="w-full h-9 !rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{
  count?: number;
  columns?: '3' | '4';
  id?: string;
}> = ({ count = 4, columns = '4', id = 'product-grid-skeleton' }) => {
  const gridClasses = columns === '3'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';

  return (
    <div className={gridClasses} id={id} role="status" aria-label="Loading products">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={`skeleton-card-${idx}`} id={`${id}-item-${idx}`} />
      ))}
      <span className="sr-only">Loading products...</span>
    </div>
  );
};

export const CategoryListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4" role="status" aria-label="Loading categories">
      <div className="flex items-center justify-between">
        <Skeleton className="w-40 h-6 !rounded bg-slate-200" />
        <Skeleton className="w-20 h-4 !rounded bg-slate-200" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5 flex flex-col items-center">
            <Skeleton variant="circular" className="w-12 h-12 bg-slate-200" />
            <Skeleton className="w-16 h-3.5 !rounded bg-slate-200" />
            <Skeleton className="w-10 h-2.5 !rounded bg-slate-200/60" />
          </div>
        ))}
      </div>
    </div>
  );
};
