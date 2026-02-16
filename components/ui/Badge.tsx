import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-white/5 border border-white/10 text-gray-400 backdrop-blur-sm',
    primary: 'bg-matrix-green/10 border border-matrix-green/30 text-matrix-green backdrop-blur-sm',
    success: 'bg-green-500/10 border border-green-500/30 text-green-400 backdrop-blur-sm',
    warning: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 backdrop-blur-sm',
    danger: 'bg-red-500/10 border border-red-500/30 text-red-400 backdrop-blur-sm',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-sans tracking-wide relative rounded-full transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </span>
  );
};
