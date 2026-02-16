'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  variant = 'primary',
}) => {
  const colors = {
    primary: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    success: 'text-matrix-green bg-matrix-green/10 border-matrix-green/20',
    warning: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    info: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="bg-black/80 border border-white/5 rounded-lg p-6 hover:border-white/10 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">{title}</p>
          <p className="text-white text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colors[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
