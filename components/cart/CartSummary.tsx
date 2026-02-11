'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Card, Button } from '@/components/ui';

interface CartSummaryProps {
  onCheckout: () => void;
  isLoading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout, isLoading = false }) => {
  const { totalAmount, itemCount } = useCart();

  const fees = 0; // Pas de frais supplémentaires pour le moment
  const total = totalAmount + fees;

  return (
    <Card className="sticky top-8">
      <h2 className="text-xl font-semibold text-white mb-6">Résumé de la commande</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-400">
          <span>Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})</span>
          <span className="text-white">{totalAmount}€</span>
        </div>

        {fees > 0 && (
          <div className="flex justify-between text-gray-400">
            <span>Frais de service</span>
            <span className="text-white">{fees}€</span>
          </div>
        )}

        <div className="pt-3 border-t border-dark-border flex justify-between">
          <span className="text-lg font-semibold text-white">Total</span>
          <span className="text-2xl font-bold text-primary">{total}€</span>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onCheckout}
        isLoading={isLoading}
        disabled={itemCount === 0}
      >
        Payer maintenant
      </Button>

      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Paiement 100% sécurisé via Stripe</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Téléchargement immédiat après paiement</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <span>Contrat de licence PDF inclus</span>
        </div>
      </div>
    </Card>
  );
};
