'use client';

import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'glow';
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  padding = 'md',
  variant = 'default',
  className,
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const variants = {
    default: 'bg-black/60 backdrop-blur-sm border border-white/5 shadow-lg',
    glass: 'bg-black/80 backdrop-blur-sm border border-white/5 shadow-lg',
    glow: 'bg-black/70 backdrop-blur-sm border border-matrix-green/30 shadow-xl shadow-matrix-green/5',
  };

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-lg transition-all duration-300',
        variants[variant],
        hover && 'hover:border-matrix-green/30 hover:shadow-xl cursor-pointer',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
