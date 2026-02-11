'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { Badge, Card } from '@/components/ui';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart } = useCart();

  return (
    <Card variant="terminal" className="flex gap-4 p-4">
      {/* Beat Cover */}
      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
        <Image
          src={item.beat.coverImage}
          alt={item.beat.title}
          fill
          className="object-cover dither"
        />
      </div>

      {/* Beat Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-mono uppercase tracking-wider text-matrix-green-light truncate mb-1 glow-green">{item.beat.title}</h3>
        <div className="flex items-center gap-2 text-sm font-mono text-matrix-green mb-2">
          <span>BPM: {item.beat.bpm}</span>
          <span>•</span>
          <span>KEY: {item.beat.key}</span>
        </div>
        <Badge variant="primary" size="sm">
          LICENSE: {item.licenseType.toUpperCase()}
        </Badge>
      </div>

      {/* Price & Remove */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeFromCart(item.beatId, item.licenseType)}
          className="font-mono text-matrix-green-dim hover:text-matrix-green transition-colors p-1 hover-flicker"
          aria-label="[REMOVE]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p className="text-lg font-mono font-bold text-matrix-green glow-green">{item.price}€</p>
      </div>
    </Card>
  );
};
