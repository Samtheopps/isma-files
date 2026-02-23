'use client';

import React, { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import gsap from 'gsap';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
      <div ref={containerRef} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">{t('title')}</h1>
          <p className="text-gray-400">{t('subtitle')}</p>
        </div>

        <div className="bg-black/80 border border-white/5 rounded-lg p-8">
          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {t('noAccount')}{' '}
              <Link href="/auth/register" className="text-matrix-green hover:text-matrix-green/80 transition-colors font-medium">
                {t('register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
