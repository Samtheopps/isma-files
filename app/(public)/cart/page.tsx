'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CartTable } from '@/components/cart/CartTable';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui';
import gsap from 'gsap';

export default function CartPage() {
  const router = useRouter();
  const { items, totalAmount } = useCart();
  const headerRef = useRef<HTMLDivElement>(null);

  // Calculate tax and total
  const TAX_RATE = 0.20; // 20% VAT
  const tax = Math.round(totalAmount * TAX_RATE);
  const total = totalAmount + tax;

  // Header animation
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-md">
          <svg
            className="w-20 h-20 text-gray-600 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-white mb-2">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8">
            Discover our catalog of premium beats and find the perfect sound for your project
          </p>
          <Button variant="primary" size="lg" onClick={() => router.push('/beats')}>
            Browse Beats
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-16 pb-32">
      {/* Page Header */}
      <section ref={headerRef} className="px-4 py-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Table */}
            <div className="lg:col-span-2">
              <CartTable items={items} />
            </div>

            {/* Summary */}
            <div>
              <CartSummary 
                subtotal={totalAmount}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

