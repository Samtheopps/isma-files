'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales } from '@/i18n';
import { useState, useTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-1.5 bg-white/5 rounded-lg p-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          disabled={isPending}
          className={`
            px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all duration-200
            ${locale === loc 
              ? 'bg-matrix-green text-black shadow-sm' 
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }
            ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          aria-label={`Switch to ${loc === 'fr' ? 'French' : 'English'}`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
