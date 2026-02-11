'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </CartProvider>
    </AuthProvider>
  );
}
