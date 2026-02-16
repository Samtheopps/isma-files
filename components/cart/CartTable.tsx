'use client';

import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { CartItemRow } from './CartItemRow';

interface CartTableProps {
  items: CartItemType[];
}

const CartTableSkeleton: React.FC = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="grid grid-cols-[auto,1fr,auto,auto,auto] items-center gap-4 px-4 py-4 border-b border-white/5 animate-pulse"
        >
          <div className="w-16 h-16 rounded bg-white/5" />
          <div className="space-y-2">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
          <div className="w-20 h-4 bg-white/5 rounded hidden md:block" />
          <div className="w-16 h-4 bg-white/5 rounded" />
          <div className="w-8 h-8 bg-white/5 rounded" />
        </div>
      ))}
    </>
  );
};

const EmptyCart: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <svg className="w-20 h-20 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
      <p className="text-gray-500 text-sm">Add some beats to get started</p>
    </div>
  );
};

export const CartTable: React.FC<CartTableProps> = ({ items }) => {
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="cart-table">
      {/* Table Header - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-[auto,1fr,auto,auto,auto] items-center gap-4 px-4 py-3 border-b border-white/10 bg-black/95 sticky top-16 z-10">
        <span className="w-16"></span> {/* Cover */}
        <span className="text-xs uppercase tracking-wider text-gray-500">ITEM</span>
        <span className="text-xs uppercase tracking-wider text-gray-500">LICENSE</span>
        <span className="text-xs uppercase tracking-wider text-gray-500">PRICE</span>
        <span className="w-8"></span> {/* Remove */}
      </div>

      {/* Cart Items */}
      <div>
        {items.map((item) => (
          <CartItemRow key={item.beatId} item={item} />
        ))}
      </div>
    </div>
  );
};
