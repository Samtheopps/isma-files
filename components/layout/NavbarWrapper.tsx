'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

/**
 * Wrapper client-side pour la Navbar avec détection de route.
 * Désactive l'animation de scroll sur la page /beats.
 */
export function NavbarWrapper() {
  const pathname = usePathname();
  const isBeatsPage = pathname === '/beats';

  return <Navbar disableScrollAnimation={isBeatsPage} />;
}
