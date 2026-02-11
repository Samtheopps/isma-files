'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { clsx } from 'clsx';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: 'Beats',
      href: '/admin/beats',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
    },
    {
      label: 'Commandes',
      href: '/admin/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-matrix-black border-r-2 border-matrix-green flex flex-col scanlines">
      {/* Header */}
      <div className="p-6 border-b-2 border-matrix-green-dim">
        <Link href="/admin" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-matrix-black border-2 border-matrix-green flex items-center justify-center">
            <span className="text-matrix-green font-bold text-xl">IF</span>
          </div>
          <div>
            <h1 className="font-mono uppercase tracking-wider text-matrix-green-light text-lg glow-green">ISMA FILES</h1>
            <p className="font-mono text-matrix-green-dim text-xs">// ADMIN TERMINAL</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-matrix-green-dim">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-matrix-black border-2 border-matrix-green flex items-center justify-center">
            <span className="text-matrix-green font-semibold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-matrix-green-light text-sm truncate glow-green">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="font-mono text-matrix-green-dim text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center space-x-3 px-4 py-3 font-mono transition-all duration-200',
              isActive(item.href)
                ? 'bg-matrix-green text-matrix-black shadow-glow-green'
                : 'text-matrix-green-glow hover:bg-matrix-green-dim/20 hover:text-matrix-green border border-matrix-green-dim hover:border-matrix-green'
            )}
          >
            {item.icon}
            <span className="uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t-2 border-matrix-green-dim">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 font-mono uppercase tracking-wider bg-matrix-black border-2 border-matrix-green-dim hover:border-matrix-green text-matrix-green-glow hover:text-matrix-green transition-all duration-200 hover-flicker"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>LOGOUT_</span>
        </button>
      </div>
    </aside>
  );
};
