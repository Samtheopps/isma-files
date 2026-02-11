import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  padding = 'md',
  className,
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={clsx(
        'bg-dark-card border border-dark-border rounded-lg',
        hover && 'transition-all duration-200 hover:border-gray-600 hover:shadow-lg hover:shadow-black/20',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
