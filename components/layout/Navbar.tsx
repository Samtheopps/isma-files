'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Button, Badge } from '@/components/ui';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <nav className="bg-matrix-black border-b-2 border-matrix-green sticky top-0 z-40 backdrop-blur-sm bg-matrix-black/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Matrix Style */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-matrix-black border-2 border-matrix-green flex items-center justify-center group-hover:shadow-glow-green transition-all group-hover:scale-110">
                <svg className="w-6 h-6 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-mono uppercase tracking-wider text-matrix-green glow-green">ISMA FILES</span>
                <span className="text-xs font-mono text-matrix-green-dim">// MATRIX PROTOCOL</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/beats" 
                className="text-matrix-green-glow hover:text-matrix-green transition-colors font-mono uppercase text-sm tracking-wider hover-flicker glow-green"
              >
                {'> BEATS_'}
              </Link>
              
              {user?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="text-red-400 hover:text-red-300 transition-colors font-mono uppercase text-sm tracking-wider border border-red-500 px-2 py-1"
                >
                  [ADMIN]
                </Link>
              )}

              {/* Cart Button - Matrix Style */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-matrix-green-glow hover:text-matrix-green transition-all border border-matrix-green-dim hover:border-matrix-green hover:shadow-glow-green group"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <Badge variant="primary" size="sm" className="absolute -top-1 -right-1 animate-pulse">
                    {itemCount}
                  </Badge>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-matrix-green-dim font-mono text-sm">
                    {'<'}{user.email}{'>'}
                  </div>
                  <Link href="/account">
                    <Button variant="ghost" size="sm">
                      ACCOUNT_
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={handleLogout}>
                    LOGOUT_
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      LOGIN_
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="primary" size="sm">
                      REGISTER_
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-matrix-green border border-matrix-green-dim hover:border-matrix-green"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-matrix-green-dim">
              <div className="flex flex-col gap-4">
                <Link 
                  href="/beats" 
                  className="text-matrix-green-glow hover:text-matrix-green transition-colors font-mono uppercase text-sm"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {'> BEATS_'}
                </Link>
                
                {user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="text-red-400 hover:text-red-300 transition-colors font-mono uppercase text-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    [ADMIN]
                  </Link>
                )}

                {user ? (
                  <>
                    <Link href="/account" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="ghost" size="sm" fullWidth>
                        ACCOUNT_
                      </Button>
                    </Link>
                    <Button variant="secondary" size="sm" fullWidth onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}>
                      LOGOUT_
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="ghost" size="sm" fullWidth>
                        LOGIN_
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="primary" size="sm" fullWidth>
                        REGISTER_
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.1) 2px, rgba(0, 255, 65, 0.1) 4px)'
          }}></div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};
