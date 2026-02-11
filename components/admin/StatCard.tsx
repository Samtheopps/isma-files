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
    primary: 'from-primary/20 to-primary-dark/20',
    success: 'from-green-500/20 to-green-600/20',
    warning: 'from-orange-500/20 to-orange-600/20',
    info: 'from-blue-500/20 to-blue-600/20',
  };

  const iconColors = {
    primary: 'text-primary',
    success: 'text-green-400',
    warning: 'text-orange-400',
    info: 'text-blue-400',
  };

  return (
    <Card hover className="relative overflow-hidden">
      <div className={clsx('absolute inset-0 bg-gradient-to-br opacity-50', gradients[variant])} />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
            <p className="text-white text-3xl font-bold mb-2">{value}</p>
            
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

          <div className={clsx('p-3 rounded-lg bg-dark-border/50', iconColors[variant])}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};
