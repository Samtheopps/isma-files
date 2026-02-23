'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export const MatrixCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Détection mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const cursor = cursorRef.current;

    // GSAP quickTo pour performance ultra-fluide
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power2.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      // Détection hover sur éléments interactifs
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer');

      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  // Ne rien render sur mobile
  if (isMobile) return null;

  return (
    <>
      {/* Cursor principal */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-screen"
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Cercle intérieur */}
        <div
          className={`transition-all duration-200 rounded-full ${
            isHovering 
              ? 'w-3 h-3 bg-matrix-green' 
              : 'w-2 h-2 bg-matrix-green'
          }`}
          style={{
            boxShadow: isHovering
              ? '0 0 10px rgba(0, 255, 136, 0.6), 0 0 20px rgba(0, 255, 136, 0.3)'
              : '0 0 5px rgba(0, 255, 136, 0.4)',
          }}
        />

        {/* Glow extérieur */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isHovering ? 'scale-150' : 'scale-100'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%)',
            width: '40px',
            height: '40px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Trail effect (optionnel) */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
};
