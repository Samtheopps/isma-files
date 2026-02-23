'use client';

import React, { ButtonHTMLAttributes, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import gsap from 'gsap';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  magnetic?: boolean; // Enable magnetic effect
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  magnetic = true, // Enabled by default
  className,
  disabled,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  // Magnetic effect avec GSAP quickTo (créé dans le useEffect pour éviter null)
  useEffect(() => {
    if (!buttonRef.current || !magnetic || disabled || isLoading) return;

    const button = buttonRef.current;

    // Créer quickTo APRÈS que le ref soit monté
    const xTo = gsap.quickTo(button, 'x', { duration: 0.3, ease: 'power2.out' });
    const yTo = gsap.quickTo(button, 'y', { duration: 0.3, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Magnetic pull (max 8px)
      const maxDistance = 100;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      
      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        xTo(distanceX * force * 0.3);
        yTo(distanceY * force * 0.3);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [magnetic, disabled, isLoading]);

  // Glow effect au hover (subtil)
  useEffect(() => {
    if (!glowRef.current || (variant !== 'primary' && variant !== 'danger')) return;

    const glow = glowRef.current;

    const handleMouseEnter = () => {
      gsap.to(glow, {
        opacity: 0.6,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(glow, {
        opacity: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const button = buttonRef.current;
    if (button) {
      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (button) {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [variant]);

  const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold tracking-wide focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group rounded-lg will-change-transform transition-all duration-300';
  
  const variants = {
    primary: 'bg-matrix-green text-black hover:bg-matrix-green/90 shadow-lg',
    secondary: 'bg-transparent border border-matrix-green/30 text-matrix-green hover:border-matrix-green/50 hover:bg-white/5',
    ghost: 'bg-transparent text-gray-400 hover:text-matrix-green/80 hover:bg-white/5',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={buttonRef}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Glow effect (primary/danger only, très subtil) */}
      {(variant === 'primary' || variant === 'danger') && (
        <span
          ref={glowRef}
          className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
          style={{
            boxShadow: variant === 'danger' 
              ? '0 0 20px rgba(239, 68, 68, 0.2), 0 0 40px rgba(239, 68, 68, 0.1)'
              : '0 0 20px rgba(0, 255, 136, 0.2), 0 0 40px rgba(0, 255, 136, 0.1)',
          }}
        />
      )}
      
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </button>
  );
};
