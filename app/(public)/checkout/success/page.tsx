'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui';
import gsap from 'gsap';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
      <div ref={containerRef} className="max-w-2xl w-full">
        <div className="bg-black/80 border border-white/5 rounded-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-matrix-green/20 border-2 border-matrix-green/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Payment Successful!</h1>
            <p className="text-gray-400">Thank you for your purchase</p>
          </div>

          {/* Info */}
          <div className="bg-black/60 border border-white/5 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">What happens now?</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-matrix-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm">A confirmation email has been sent with all order details</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-matrix-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Your files are available immediately in your downloads section</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-matrix-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Your PDF license contract is included with your downloads</span>
              </li>
            </ul>
          </div>

          {/* Session ID (if available) */}
          {sessionId && (
            <div className="mb-6 text-sm text-gray-400">
              <p className="uppercase tracking-wider text-xs mb-1">Transaction Reference</p>
              <p className="font-mono text-gray-500 text-xs break-all">{sessionId}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={() => router.push('/account')}>
              View My Downloads
            </Button>
            <Button variant="secondary" onClick={() => router.push('/beats')}>
              Browse More Beats
            </Button>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-sm text-gray-400">
              Questions?{' '}
              <a href="mailto:support@ismafiles.com" className="text-matrix-green hover:text-matrix-green/80 transition-colors">
                support@ismafiles.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
