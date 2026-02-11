import type { Metadata } from 'next';
import { Share_Tech_Mono, VT323 } from 'next/font/google';
import './globals.css';
import './matrix-effects.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { MatrixRain } from '@/components/effects/MatrixRain';

const shareTechMono = Share_Tech_Mono({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech',
});

const vt323 = VT323({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
});

export const metadata: Metadata = {
  title: 'ISMA FILES // MATRIX BEATS',
  description: '[SYSTEM] Plateforme de distribution d\'instrumentales // Code Matrix Protocol',
  keywords: ['beats', 'matrix', 'cyber', 'terminal', 'digital', 'code'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${shareTechMono.variable} ${vt323.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${shareTechMono.className} bg-matrix-black text-matrix-green-glow crt-effect screen-distort`}>
        <MatrixRain />
        <div className="relative z-10 scanlines">
          <Providers>
            <Navbar />
            <div className="grain">
              {children}
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}
