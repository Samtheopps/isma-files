'use client';

import React, { useState } from 'react';
import { License, LicenseType } from '@/types';
import { Badge } from '@/components/ui';
import { clsx } from 'clsx';

interface LicenseSelectorProps {
  licenses: License[];
  selectedLicense: LicenseType;
  onSelect: (licenseType: LicenseType) => void;
}

export const LicenseSelector: React.FC<LicenseSelectorProps> = ({
  licenses,
  selectedLicense,
  onSelect,
}) => {
  const getLicenseLabel = (type: LicenseType): string => {
    const labels: Record<LicenseType, string> = {
      basic: 'Basic',
      standard: 'Standard',
      pro: 'Pro',
      unlimited: 'Unlimited',
      exclusive: 'Exclusive',
    };
    return labels[type];
  };

  const formatFeature = (key: string, value: any): string => {
    if (key === 'streams' || key === 'physicalSales') {
      return value === -1 ? 'Illimité' : value.toLocaleString();
    }
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }
    return String(value);
  };

  return (
    <div className="space-y-3">
      {licenses.map((license) => {
        const isSelected = selectedLicense === license.type;
        const isAvailable = license.available;

        return (
          <div
            key={license.type}
            onClick={() => isAvailable && onSelect(license.type)}
            className={clsx(
              'border rounded-lg p-4 transition-all cursor-pointer',
              isSelected && isAvailable && 'border-primary bg-primary/5 ring-2 ring-primary',
              !isSelected && isAvailable && 'border-dark-border hover:border-gray-600',
              !isAvailable && 'opacity-50 cursor-not-allowed border-dark-border'
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected && isAvailable ? 'border-primary bg-primary' : 'border-gray-500'
                  )}
                >
                  {isSelected && isAvailable && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {getLicenseLabel(license.type)}
                  </h3>
                  {!isAvailable && (
                    <Badge variant="danger" size="sm" className="mt-1">
                      Indisponible
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{(license.price / 100).toFixed(2)}€</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <svg className={clsx('w-4 h-4', license.features.mp3 ? 'text-green-400' : 'text-gray-500')} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">MP3</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className={clsx('w-4 h-4', license.features.wav ? 'text-green-400' : 'text-gray-500')} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">WAV</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className={clsx('w-4 h-4', license.features.stems ? 'text-green-400' : 'text-gray-500')} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">Stems</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className={clsx('w-4 h-4', license.features.exclusivity ? 'text-green-400' : 'text-gray-500')} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">Exclusivité</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-dark-border text-xs text-gray-400 space-y-1">
              <div>Streams: {formatFeature('streams', license.features.streams)}</div>
              <div>Ventes physiques: {formatFeature('physicalSales', license.features.physicalSales)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
