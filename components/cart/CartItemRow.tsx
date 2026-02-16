'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { useFadeInScroll } from '@/lib/hooks/useScrollTrigger';

interface CartItemProps {
  item: CartItemType;
}

export const CartItemRow: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart } = useCart();
  const rowRef = useRef<HTMLDivElement>(null);

  useFadeInScroll(rowRef, { y: 10, duration: 0.4 });

  const price = (item.price / 100).toFixed(0);

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-[auto,1fr,auto,auto,auto] md:grid-cols-[auto,1fr,auto,auto,auto] items-center gap-4 px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-all duration-200"
    >
      {/* Cover Image */}
      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
        <Image 
          src={item.beat.coverImage} 
          alt={item.beat.title} 
          fill 
          className="object-cover" 
        />
      </div>

      {/* Beat Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-white truncate">{item.beat.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-1">
          <span>{item.beat.bpm} BPM</span>
          <span>•</span>
          <span>{item.beat.key}</span>
        </div>
      </div>

      {/* License Type */}
      <div className="text-sm text-gray-400 capitalize hidden md:block">
        {item.licenseType}
      </div>

      {/* Price */}
      <div className="text-sm font-semibold text-matrix-green whitespace-nowrap">
        {price}€
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.beatId, item.licenseType)}
        className="w-8 h-8 rounded-lg bg-transparent hover:bg-red-500/10 flex items-center justify-center transition-all group"
        title="Remove from cart"
      >
        <svg 
          className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
