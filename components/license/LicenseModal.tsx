'use client';

import React from 'react';
import { License } from '@/types';
import { Modal, Badge } from '@/components/ui';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  licenses: License[];
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose, licenses }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails des licences" size="lg">
      <div className="space-y-6">
        <p className="text-gray-400">
          Choisissez la licence qui correspond le mieux à vos besoins. Toutes les licences incluent
          un contrat de licence PDF téléchargeable.
        </p>

        {licenses.map((license) => (
          <div key={license.type} className="border border-dark-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white capitalize">{license.type}</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary">{(license.price / 100).toFixed(2)}€</span>
                {!license.available && (
                  <Badge variant="danger">Indisponible</Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Formats inclus</p>
                  <div className="flex gap-2">
                    {license.features.mp3 && <Badge variant="success">MP3</Badge>}
                    {license.features.wav && <Badge variant="success">WAV</Badge>}
                    {license.features.stems && <Badge variant="success">Stems</Badge>}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Exclusivité</p>
                  <Badge variant={license.features.exclusivity ? 'success' : 'default'}>
                    {license.features.exclusivity ? 'Exclusive' : 'Non-exclusive'}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Droits d'utilisation</p>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {license.features.streams === -1
                      ? 'Streams illimités'
                      : `Jusqu'à ${license.features.streams.toLocaleString()} streams`}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {license.features.physicalSales === -1
                      ? 'Ventes physiques illimitées'
                      : `Jusqu'à ${license.features.physicalSales.toLocaleString()} ventes physiques`}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Clips vidéo YouTube/Spotify autorisés
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Performances live autorisées
                  </li>
                  {license.features.exclusivity && (
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Droits exclusifs - beat retiré de la vente
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Important</h4>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Tous les achats incluent un contrat de licence PDF</li>
            <li>Les téléchargements sont limités à 3 fois par achat</li>
            <li>Les liens de téléchargement sont valables 30 jours</li>
            <li>Le crédit producteur est obligatoire pour toutes les licences non-exclusives</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
