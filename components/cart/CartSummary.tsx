'use client';

import React from 'react';

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, tax, total }) => {
  const formatPrice = (cents: number) => (cents / 100).toFixed(2);

  return (
    <div className="bg-black/80 border border-white/5 rounded-lg p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white font-medium">{formatPrice(subtotal)}€</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Tax (20%)</span>
          <span className="text-white font-medium">{formatPrice(tax)}€</span>
        </div>
        
        <div className="border-t border-white/5 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-white">Total</span>
            <span className="text-xl font-bold text-matrix-green">{formatPrice(total)}€</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <a
          href="/checkout"
          className="block w-full px-6 py-3 bg-matrix-green text-black text-center font-semibold rounded-lg hover:bg-matrix-green/90 transition-all"
        >
          Proceed to Checkout
        </a>
        
        <a
          href="/beats"
          className="block w-full px-6 py-3 bg-transparent border border-white/10 text-white text-center font-medium rounded-lg hover:bg-white/5 transition-all"
        >
          Continue Shopping
        </a>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-matrix-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Secure payment powered by Stripe</span>
        </div>
      </div>
    </div>
  );
};

