'use client';

import React, { useEffect, ReactNode, useRef } from 'react';
import { clsx } from 'clsx';
import gsap from 'gsap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyOpenRef = useRef(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      // Animation d'entrée seulement si ce n'était pas ouvert avant
      if (!previouslyOpenRef.current && backdropRef.current && modalRef.current) {
        const ctx = gsap.context(() => {
          // Backdrop fade in
          gsap.fromTo(
            backdropRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
          );

          // Modal scale + fade in
          gsap.fromTo(
            modalRef.current,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
          );
        });

        previouslyOpenRef.current = true;

        return () => ctx.revert();
      }
    } else {
      previouslyOpenRef.current = false;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Animation de sortie
  const handleClose = () => {
    if (backdropRef.current && modalRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out',
      });

      gsap.to(modalRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay plus sombre et subtil */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/90 backdrop-blur-md"
        onClick={handleClose}
        style={{ opacity: 0 }}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={clsx(
            'relative w-full bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl',
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()}
          style={{ opacity: 0, willChange: 'transform, opacity' }}
        >
          {/* Border glow subtil */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-matrix-green/10 via-matrix-green/20 to-matrix-green/10 rounded-2xl opacity-30 blur-sm -z-10"></div>

          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              {title && (
                <h2 className="text-xl font-semibold text-white">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg group"
                >
                  <svg
                    className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
};
