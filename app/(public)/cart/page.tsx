'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui';

export default function CartPage() {
  const router = useRouter();
  const { items, totalAmount } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/cart');
      return;
    }

    try {
      setIsCheckingOut(true);

      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            beatId: item.beatId,
            licenseType: item.licenseType,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }

      const data = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Une erreur est survenue lors du paiement. Veuillez réessayer.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <svg
            className="w-24 h-24 text-matrix-green-dim mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h1 className="text-2xl font-mono uppercase tracking-wider text-matrix-green-light mb-2 glow-green">VOTRE PANIER EST VIDE</h1>
          <p className="font-mono text-matrix-green-dim mb-6">
            // Découvrez notre catalogue de beats et trouvez celui qui correspond à votre style
          </p>
          <Button variant="primary" onClick={() => router.push('/beats')}>
            PARCOURIR LES BEATS_
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-mono uppercase tracking-wider text-matrix-green-light mb-2 glow-green">Panier</h1>
          <p className="font-mono text-matrix-green-dim">&gt; {items.length} ITEM(S) IN CART</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <CartItem key={`${item.beatId}-${item.licenseType}-${index}`} item={item} />
            ))}

            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={() => router.push('/beats')}>
                &lt; CONTINUER MES ACHATS_
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <CartSummary onCheckout={handleCheckout} isLoading={isCheckingOut} />
          </div>
        </div>
      </div>
    </div>
  );
}
