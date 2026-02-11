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
    default: 'bg-matrix-black border border-matrix-green-dim text-matrix-green-glow',
    primary: 'bg-matrix-green/10 border border-matrix-green text-matrix-green glow-green',
    success: 'bg-green-500/10 border border-green-500 text-green-400',
    warning: 'bg-yellow-500/10 border border-yellow-500 text-yellow-400',
    danger: 'bg-red-500/10 border border-red-500 text-red-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-mono uppercase tracking-wider relative',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">[{children}]</span>
    </span>
  );
};
