import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import './globals.css';
import './blue-effects.css';
import './ascii-text.css';
import { Providers } from './providers';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { SmoothScroll } from '@/components/effects';
import { locales } from '@/i18n';

// JetBrains Mono pour le code uniquement
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generate metadata with i18n support
export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const t = await getTranslations({ locale, namespace: 'metadata.home' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: ['beats', 'premium', 'cyber', 'terminal', 'digital', 'music'],
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} className={jetbrainsMono.variable}>
      <body className="font-sans bg-ink-black-950 text-fresh-sky-50">
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>
            {/* Main content layer */}
            <div className="relative z-10">
              <Providers>
                <NavbarWrapper />
                {children}
              </Providers>
            </div>
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
