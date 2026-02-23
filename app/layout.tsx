import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import './blue-effects.css';
import './ascii-text.css';
import { Providers } from './providers';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { SmoothScroll } from '@/components/effects';

// JetBrains Mono pour le code uniquement
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ISMA FILES // SKY BEATS',
  description: '[SYSTEM] Plateforme de distribution d\'instrumentales // Premium Blue Protocol',
  keywords: ['beats', 'premium', 'cyber', 'terminal', 'digital', 'music'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={jetbrainsMono.variable}>
      <body className="font-sans bg-ink-black-950 text-fresh-sky-50">
        <SmoothScroll>
          {/* Main content layer */}
          <div className="relative z-10">
            <Providers>
              <NavbarWrapper />
              {children}
            </Providers>
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
