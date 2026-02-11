'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { items, totalAmount, itemCount, clearCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    onClose();
    router.push('/cart');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-dark-bg border-l border-dark-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div>
            <h2 className="text-xl font-semibold text-white">Panier</h2>
            <p className="text-sm text-gray-400">{itemCount} article{itemCount > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-400 mb-2">Votre panier est vide</p>
              <Button variant="primary" onClick={() => { onClose(); router.push('/beats'); }}>
                Parcourir les beats
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <CartItem key={`${item.beatId}-${item.licenseType}-${index}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-dark-border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-2xl font-bold text-primary">{totalAmount}€</span>
            </div>

            <div className="space-y-2">
              <Button variant="primary" size="lg" fullWidth onClick={handleCheckout}>
                Passer à la caisse
              </Button>
              <Button variant="ghost" fullWidth onClick={clearCart}>
                Vider le panier
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
