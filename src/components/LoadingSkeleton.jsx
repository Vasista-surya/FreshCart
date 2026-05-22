import React from 'react';

// ─── ProductCardSkeleton ─────────────────────────────────────────
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-100" />
    <div className="p-3 pb-4 space-y-2">
      <div className="h-2 bg-gray-100 rounded w-1/3" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="h-2 bg-gray-100 rounded w-1/4 mt-1" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-8 bg-gray-100 rounded-lg w-16" />
      </div>
    </div>
  </div>
);

// ─── CategorySkeleton ────────────────────────────────────────────
export const CategorySkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center animate-pulse">
    <div className="w-16 h-16 bg-gray-100 rounded-2xl mb-3" />
    <div className="h-3 bg-gray-200 rounded w-20" />
  </div>
);

// ─── PageSkeleton ────────────────────────────────────────────────
export const PageSkeleton = () => (
  <div className="min-h-screen bg-brand-light">
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header skeleton */}
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

// ─── TableRowSkeleton ────────────────────────────────────────────
export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12" /></td>
    <td className="px-4 py-3"><div className="h-6 bg-gray-200 rounded-full w-20" /></td>
  </tr>
);

export default ProductCardSkeleton;
