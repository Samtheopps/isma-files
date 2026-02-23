'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { formatPrice, formatPriceRounded } from '@/lib/utils/formatPrice';

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations('checkout');
  const { items, totalAmount, itemCount, isLoading: isCartLoading } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const isGuest = !user;

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    country: 'FR',
  });

  // Pré-remplir l'email si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }));
    }
  }, [user]);

  // Rediriger uniquement si le chargement est terminé ET le panier est vide
  useEffect(() => {
    console.log('[Checkout] isCartLoading:', isCartLoading, 'items.length:', items.length);
    if (!isCartLoading && items.length === 0) {
      router.push('/cart');
    }
  }, [isCartLoading, items, router]);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );

      gsap.fromTo(
        formRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );

      gsap.fromTo(
        summaryRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  const subtotal = totalAmount;
  const total = subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Si mode guest, valider l'email
      if (isGuest && (!formData.email || !formData.email.includes('@'))) {
        throw new Error(t('form.errors.invalidEmail'));
      }

      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            beatId: item.beatId,
            licenseType: item.licenseType,
            price: item.price,
          })),
          ...(isGuest && { guestEmail: formData.email }),
          billingInfo: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('form.errors.paymentFailed'));
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || t('form.errors.general'));
      setIsLoading(false);
    }
  };

  // Afficher un loader pendant le chargement du panier
  if (isCartLoading) {
    return (
      <main className="min-h-screen pt-16 pb-32 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-matrix-green/20 border-t-matrix-green rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-mono">{t('loading')}</p>
        </div>
      </main>
    );
  }

  // Ne rien afficher si le panier est vide (la redirection va se déclencher)
  if (items.length === 0) return null;

  return (
    <main className="min-h-screen pt-16 pb-32">
      {/* Header */}
      <div ref={headerRef} className="px-4 py-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/cart')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToCart')}
          </button>
          <h1 className="text-4xl font-bold text-white">{t('title')}</h1>
          <p className="text-gray-400 mt-2">{t('subtitle')}</p>
        </div>
      </div>

      {/* Content */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Billing Form */}
            <div ref={formRef}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step Indicator */}
                <div className="bg-black/60 border border-white/5 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-matrix-green/20 border border-matrix-green/30">
                      <span className="text-matrix-green font-bold font-mono">1</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{t('form.step1.title')}</h2>
                      <p className="text-sm text-gray-400">{t('form.step1.subtitle')}</p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Guest Notice */}
                {isGuest && (
                  <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-blue-400 text-sm font-semibold mb-1">{t('guest.title')}</p>
                        <p className="text-blue-300 text-sm">
                          {t('guest.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <div className="bg-black/60 border border-white/5 rounded-lg p-6 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 uppercase tracking-wider mb-2">
                      {t('form.fields.email.label')} {isGuest && <span className="text-blue-400">({t('form.fields.email.guestHint')})</span>}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isGuest}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-matrix-green/50 focus:bg-white/10 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 uppercase tracking-wider mb-2">
                        {t('form.fields.firstName.label')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-matrix-green/50 focus:bg-white/10 transition-all duration-200 focus:outline-none"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 uppercase tracking-wider mb-2">
                        {t('form.fields.lastName.label')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-matrix-green/50 focus:bg-white/10 transition-all duration-200 focus:outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 uppercase tracking-wider mb-2">
                      {t('form.fields.country.label')}
                    </label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-matrix-green/50 focus:bg-white/10 transition-all duration-200 focus:outline-none"
                    >
                      <option value="FR">France</option>
                      <option value="BE">Belgium</option>
                      <option value="CH">Switzerland</option>
                      <option value="CA">Canada</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="ES">Spain</option>
                      <option value="IT">Italy</option>
                    </select>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-black/60 border border-white/5 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-matrix-green/20 border border-matrix-green/30">
                      <span className="text-matrix-green font-bold font-mono">2</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{t('form.step2.title')}</h2>
                      <p className="text-sm text-gray-400">{t('form.step2.subtitle')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                    <svg className="w-5 h-5 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t('form.step2.security')}</span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? t('form.step2.processing') : t('form.step2.button')}
                  </Button>

                  <div className="flex items-center justify-center gap-4 mt-4">
                    <svg className="h-6 text-gray-500" viewBox="0 0 60 25" fill="currentColor">
                      <path d="M0 12.5C0 5.596 5.596 0 12.5 0h35C54.404 0 60 5.596 60 12.5S54.404 25 47.5 25h-35C5.596 25 0 19.404 0 12.5z" />
                    </svg>
                    <span className="text-xs text-gray-500">Powered by Stripe</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div ref={summaryRef}>
              <div className="bg-black/80 border border-white/5 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-6">{t('summary.title')}</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.map((item, index) => (
                    <div
                      key={`${item.beatId}-${item.licenseType}-${index}`}
                      className="flex items-center gap-3 pb-4 border-b border-white/5"
                    >
                      <img
                        src={item.beat.coverImage}
                        alt={item.beat.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{item.beat.title}</p>
                        <p className="text-sm text-gray-400 capitalize">{item.licenseType} License</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatPriceRounded(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-white/5 pt-6">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>{t('summary.subtotal', { count: itemCount })}</span>
                    <span className="font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xl pt-3 border-t border-white/5">
                    <span className="font-semibold text-white">{t('summary.total')}</span>
                    <span className="font-bold text-matrix-green">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t('summary.instantDownload')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                    <svg className="w-4 h-4 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t('summary.licenseIncluded')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
