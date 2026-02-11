import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'terminal' | 'glow';
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
    md: 'p-4',
    lg: 'p-6',
  };

  const variants = {
    default: 'bg-matrix-black/80 border border-matrix-green-dim backdrop-blur-sm',
    terminal: 'bg-matrix-black border-2 border-matrix-green shadow-glow-green',
    glow: 'bg-matrix-black/90 border border-matrix-green box-glow-green',
  };

  return (
    <div
      className={clsx(
        'relative overflow-hidden transition-all duration-300',
        variants[variant],
        hover && 'hover:border-matrix-green hover:shadow-glow-green hover:scale-[1.02] hover-flicker',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {/* Corner brackets effect */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-matrix-green"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-matrix-green"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-matrix-green"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-matrix-green"></div>
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-matrix-green/5 to-transparent animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
