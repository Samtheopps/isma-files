'use client';

import React, { useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui';
import { formatPrice, formatPriceRounded } from '@/lib/utils/formatPrice';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { items, totalAmount, itemCount, clearCart, removeFromCart } = useCart();
  const t = useTranslations('cart');

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

  const subtotal = totalAmount;
  const total = subtotal;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-black border-l border-white/10 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-semibold text-white">{t('title')}</h2>
            <p className="text-sm text-gray-400 font-mono">{t('itemCount', { count: itemCount })}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-400 mb-4">{t('empty')}</p>
              <Button variant="primary" onClick={() => { onClose(); router.push('/beats'); }}>
                {t('continueShopping')}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={`${item.beatId}-${item.licenseType}-${index}`}
                  className="bg-black/60 border border-white/5 rounded-lg p-3 hover:bg-white/5 transition-all duration-200"
                >
                  <div className="flex gap-3">
                    {/* Cover */}
                    <img
                      src={item.beat.coverImage}
                      alt={item.beat.title}
                      className="w-16 h-16 rounded object-cover"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate mb-1">
                        {item.beat.title}
                      </p>
                      <p className="text-xs text-gray-400 capitalize mb-2">
                        {t('item.license', { type: item.licenseType })}
                      </p>
                      <p className="text-sm font-bold text-matrix-green font-mono">
                        {formatPriceRounded(item.price)}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.beatId, item.licenseType)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1 h-8"
                      aria-label={t('item.remove')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/5 p-6 space-y-4 bg-black/60">
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>{t('summary.subtotal')}</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-white/5">
                <span className="font-semibold text-white">{t('summary.total')}</span>
                <span className="font-bold text-matrix-green">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="primary" size="lg" fullWidth onClick={handleCheckout}>
                {t('summary.checkout')}
              </Button>
              <Button variant="ghost" fullWidth onClick={clearCart}>
                {t('clearCart')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
