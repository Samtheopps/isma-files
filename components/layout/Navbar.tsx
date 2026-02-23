'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@/navigation';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button, Badge } from '@/components/ui';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface NavbarProps {
  disableScrollAnimation?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ disableScrollAnimation = false }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const t = useTranslations('nav');
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  const cartBadgeRef = useRef<HTMLSpanElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // GSAP: Hide/show navbar au scroll (désactivé sur /beats)
  useEffect(() => {
    // Si l'animation est désactivée, on skip tout le useEffect
    if (disableScrollAnimation) return;
    
    if (typeof window === 'undefined' || !navRef.current) return;

    const nav = navRef.current;
    let lastScrollY = 0;
    let ticking = false;

    const updateNavbar = () => {
      const scrollY = window.scrollY;

      if (scrollY > 100) {
        if (scrollY > lastScrollY) {
          // Scroll down - hide
          gsap.to(nav, {
            y: -100,
            duration: 0.3,
            ease: 'power2.out',
          });
        } else {
          // Scroll up - show
          gsap.to(nav, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      } else {
        // Top de la page - show
        gsap.to(nav, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [disableScrollAnimation]);

  // GSAP: Bounce animation sur badge cart quand itemCount change
  useEffect(() => {
    if (itemCount > 0 && cartBadgeRef.current) {
      gsap.fromTo(
        cartBadgeRef.current,
        { scale: 0.8 },
        {
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        }
      );
    }
  }, [itemCount]);

  return (
    <>
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-black/95 border-b border-white/5 transition-all duration-300"
        style={{ willChange: 'transform' }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Completely Left Aligned with Matrix Folder Icon */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* Matrix Folder Icon */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Folder SVG */}
                <svg className="w-12 h-12 text-matrix-green/80 group-hover:text-matrix-green transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {/* Folder back */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  {/* Matrix code lines inside folder */}
                  <line x1="7" y1="11" x2="9" y2="11" strokeWidth={1} className="opacity-40" />
                  <line x1="7" y1="13" x2="11" y2="13" strokeWidth={1} className="opacity-40" />
                  <line x1="7" y1="15" x2="10" y2="15" strokeWidth={1} className="opacity-40" />
                  <line x1="13" y1="11" x2="15" y2="11" strokeWidth={1} className="opacity-40" />
                  <line x1="13" y1="13" x2="17" y2="13" strokeWidth={1} className="opacity-40" />
                  <line x1="13" y1="15" x2="16" y2="15" strokeWidth={1} className="opacity-40" />
                </svg>
                {/* Glow effect on hover - Plus subtil */}
                <div className="absolute inset-0 bg-matrix-green/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-white group-hover:text-matrix-green/90 transition-colors duration-300">{t('logo')}</span>
                <span className="text-xs text-gray-500 font-mono tracking-wider group-hover:text-gray-400 transition-colors duration-300">{t('tagline')}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/beats" 
                className="text-gray-400 hover:text-matrix-green/80 transition-colors duration-300 font-medium"
              >
                {t('beats')}
              </Link>
              
              {user?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="text-red-400 hover:text-red-300 transition-colors font-medium px-3 py-1 rounded-lg border border-red-500/30 bg-red-500/10"
                >
                  {t('admin')}
                </Link>
              )}

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Cart Button - Premium Style */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-400 hover:text-matrix-green/80 transition-all duration-300 rounded-lg hover:bg-white/5 group"
                aria-label={t('cart')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span 
                    ref={cartBadgeRef}
                    className="absolute -top-1 -right-1 bg-matrix-green text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-gray-500 text-sm font-mono">
                    {user.email}
                  </div>
                  <Link href="/account">
                    <Button variant="ghost" size="sm">
                      {t('account')}
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={handleLogout}>
                    {t('logout')}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="primary" size="sm">
                      {t('register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-400 hover:text-matrix-green/80 rounded-lg hover:bg-white/5 transition-colors duration-300"
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
            <div className="md:hidden py-4 border-t border-white/5 bg-black/98 backdrop-blur-xl">
              <div className="flex flex-col gap-4">
                {/* Language Switcher at Top */}
                <div className="px-6">
                  <LanguageSwitcher />
                </div>
                
                <Link 
                  href="/beats" 
                  className="text-gray-400 hover:text-matrix-green/80 transition-colors duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('beats')}
                </Link>
                
                {user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="text-red-400 hover:text-red-300 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('admin')}
                  </Link>
                )}

                {user ? (
                  <>
                    <Link href="/account" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="ghost" size="sm" fullWidth>
                        {t('account')}
                      </Button>
                    </Link>
                    <Button variant="secondary" size="sm" fullWidth onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}>
                      {t('logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="ghost" size="sm" fullWidth>
                        {t('login')}
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="primary" size="sm" fullWidth>
                        {t('register')}
                      </Button>
                    </Link>
                  </>
                )}
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
