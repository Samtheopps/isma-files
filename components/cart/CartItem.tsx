'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { Badge } from '@/components/ui';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="flex gap-4 p-4 bg-dark-card border border-dark-border rounded-lg">
      {/* Beat Cover */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={item.beat.coverImage}
          alt={item.beat.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Beat Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate mb-1">{item.beat.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>{item.beat.bpm} BPM</span>
          <span>•</span>
          <span>{item.beat.key}</span>
        </div>
        <Badge variant="primary" size="sm">
          Licence {item.licenseType}
        </Badge>
      </div>

      {/* Price & Remove */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeFromCart(item.beatId, item.licenseType)}
          className="text-gray-400 hover:text-red-400 transition-colors p-1"
          aria-label="Retirer du panier"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p className="text-lg font-bold text-white">{item.price}€</p>
      </div>
    </div>
  );
};
