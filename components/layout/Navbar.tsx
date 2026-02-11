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
      <nav className="bg-dark-card border-b border-dark-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Isma Files</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/beats" className="text-gray-300 hover:text-white transition-colors">
                Catalogue
              </Link>
              
              {user?.role === 'admin' && (
                <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
                  Admin
                </Link>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <Badge variant="danger" size="sm" className="absolute -top-1 -right-1">
                    {itemCount}
                  </Badge>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/account">
                    <Button variant="ghost" size="sm">
                      Mon compte
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={handleLogout}>
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="primary" size="sm">
                      Inscription
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
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
            <div className="md:hidden py-4 border-t border-dark-border">
              <div className="flex flex-col gap-4">
                <Link href="/beats" className="text-gray-300 hover:text-white transition-colors">
                  Catalogue
                </Link>
                
                {user?.role === 'admin' && (
                  <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => { setShowCart(true); setShowMobileMenu(false); }}
                  className="flex items-center justify-between text-gray-300 hover:text-white transition-colors"
                >
                  <span>Panier</span>
                  {itemCount > 0 && (
                    <Badge variant="danger" size="sm">
                      {itemCount}
                    </Badge>
                  )}
                </button>

                <div className="pt-4 border-t border-dark-border">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <Link href="/account">
                        <Button variant="ghost" size="sm" fullWidth>
                          Mon compte
                        </Button>
                      </Link>
                      <Button variant="secondary" size="sm" fullWidth onClick={handleLogout}>
                        Déconnexion
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/auth/login">
                        <Button variant="ghost" size="sm" fullWidth>
                          Connexion
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button variant="primary" size="sm" fullWidth>
                          Inscription
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};
