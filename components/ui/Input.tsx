import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-mono uppercase tracking-wider text-matrix-green mb-2 glow-green">
            &gt; {label}
          </label>
        )}
        
        <div className="relative group">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-matrix-green-dim">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-2.5 bg-matrix-black border-2 font-mono text-matrix-green-glow placeholder-matrix-green-dim transition-all duration-200',
              'focus:outline-none focus:border-matrix-green focus:shadow-glow-green',
              'caret-matrix-green',
              error ? 'border-red-500' : 'border-matrix-green-dim hover:border-matrix-green/50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          
          {/* Terminal cursor blink effect when focused */}
          <div className="absolute inset-0 pointer-events-none border border-matrix-green opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-matrix-green-dim">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1.5 text-sm font-mono text-red-400">[ERROR] {error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1.5 text-xs font-mono text-matrix-green-dim opacity-70">// {helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
