import React from 'react';
import { clsx } from 'clsx';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className, text }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      <div className={clsx('relative', sizes[size])}>
        <div className="absolute inset-0 border-4 border-dark-border rounded-full" />
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
};
