'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const t = useTranslations('checkout.success');
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');

  const containerRef = useRef<HTMLDivElement>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [hasCleared, setHasCleared] = useState(false);

  const isGuest = !user;

  useEffect(() => {
    // Clear cart on successful payment (only once)
    if (!hasCleared) {
      clearCart();
      setHasCleared(true);
      
      // Si guest, récupérer l'email du localStorage (si disponible)
      if (isGuest) {
        const storedEmail = localStorage.getItem('guestCheckoutEmail');
        if (storedEmail) {
          setGuestEmail(storedEmail);
          localStorage.removeItem('guestCheckoutEmail');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <h1 className="text-4xl font-bold text-white mb-3">{t('title')}</h1>
            <p className="text-gray-400">{t('subtitle')}</p>
          </div>

          {/* Info */}
          <div className="bg-black/60 border border-white/5 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('whatNow.title')}</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-matrix-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm">
                  {isGuest 
                    ? t('whatNow.emailGuest', { email: guestEmail || t('whatNow.yourEmail') })
                    : t('whatNow.emailUser')}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-matrix-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">
                  {isGuest
                    ? t('whatNow.downloadGuest')
                    : t('whatNow.downloadUser')}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-matrix-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{t('whatNow.license')}</span>
              </li>
            </ul>
          </div>

          {/* Guest Notice */}
          {isGuest && (
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-blue-400 font-semibold mb-2">{t('guestNotice.title')}</h3>
                  <p className="text-blue-300 text-sm mb-4">
                    {t('guestNotice.description')}
                  </p>
                  <Button variant="primary" size="sm" onClick={() => router.push('/auth/register')}>
                    {t('guestNotice.button')}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Session ID (if available) */}
          {sessionId && (
            <div className="mb-6 text-sm text-gray-400">
              <p className="uppercase tracking-wider text-xs mb-1">{t('transactionRef')}</p>
              <p className="font-mono text-gray-500 text-xs break-all">{sessionId}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!isGuest ? (
              <>
                <Button variant="primary" onClick={() => router.push('/account')}>
                  {t('actions.viewDownloads')}
                </Button>
                <Button variant="secondary" onClick={() => router.push('/beats')}>
                  {t('actions.browseMore')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => router.push('/beats')}>
                  {t('actions.browseMore')}
                </Button>
              </>
            )}
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-sm text-gray-400">
              {t('support.question')}{' '}
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
