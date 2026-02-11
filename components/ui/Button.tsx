import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-mono uppercase tracking-wider transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group hover-flicker';
  
  const variants = {
    primary: 'bg-matrix-black border-2 border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-matrix-black hover:shadow-glow-green focus:shadow-glow-green-strong',
    secondary: 'bg-transparent border border-matrix-green-dim text-matrix-green-glow hover:border-matrix-green hover:shadow-glow-green',
    ghost: 'bg-transparent text-matrix-green-glow hover:text-matrix-green hover:bg-matrix-black/50',
    danger: 'bg-matrix-black border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-black hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      data-text={typeof children === 'string' ? children : ''}
      {...props}
    >
      {/* Glitch overlay on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-matrix-green/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
      
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
          <span className="glow-green">[LOADING...]</span>
        </>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </button>
  );
};
