'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'primary' | 'success' | 'warning' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = 'primary',
}) => {
  const gradients = {
    primary: 'from-matrix-green/10 to-matrix-green-dim/20',
    success: 'from-matrix-green/10 to-matrix-green-light/20',
    warning: 'from-matrix-green-dim/10 to-matrix-green/20',
    info: 'from-matrix-green-light/10 to-matrix-green/20',
  };

  const iconColors = {
    primary: 'text-matrix-green',
    success: 'text-matrix-green',
    warning: 'text-matrix-green',
    info: 'text-matrix-green',
  };

  return (
    <Card variant="terminal" hover className="relative overflow-hidden">
      <div className={clsx('absolute inset-0 bg-gradient-to-br opacity-50', gradients[variant])} />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-mono uppercase tracking-wider text-matrix-green-dim text-sm mb-1">&gt; {title}</p>
            <p className="font-mono text-matrix-green text-3xl font-bold mb-2 glow-green">{value}</p>
            
            {trend && (
              <div className="flex items-center space-x-1">
                {trend.isPositive ? (
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                )}
                <span
                  className={clsx(
                    'text-sm font-medium',
                    trend.isPositive ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  {trend.value}%
                </span>
              </div>
            )}
          </div>

          <div className={clsx('p-3 bg-matrix-black border-2 border-matrix-green', iconColors[variant])}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};
