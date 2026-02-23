'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IOrder } from '@/types';
import { formatPriceIntl } from '@/lib/utils/formatPrice';

type PopulatedOrder = IOrder & {
  userId?: {
    email: string;
    firstName: string;
    lastName: string;
  };
};

interface OrderDetailModalProps {
  order: PopulatedOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Complété</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'failed':
        return <Badge variant="danger">Échoué</Badge>;
      case 'refunded':
        return <Badge variant="default">Remboursé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDownloadContract = () => {
    if (order.licenseContract) {
      window.open(order.licenseContract, '_blank');
    } else {
      alert('Contrat non disponible');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Commande ${order.orderNumber}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-dark-border">
          <div>
            <p className="text-gray-400 text-sm mb-1">Date de commande</p>
            <p className="text-white font-medium">{formatDate(order.createdAt)}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Client Info */}
        <div>
          <h3 className="text-white font-semibold mb-3">Informations client</h3>
          <div className="bg-dark-bg rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Nom</span>
              <span className="text-white">
                {order.userId
                  ? `${order.userId.firstName} ${order.userId.lastName}`
                  : 'Client non enregistré'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Email</span>
              <span className="text-white">{order.userId?.email || order.deliveryEmail}</span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-white font-semibold mb-3">Articles commandés</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="bg-dark-bg rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium mb-1">{item.beatTitle}</p>
                  <p className="text-gray-400 text-sm capitalize">Licence {item.licenseType}</p>
                </div>
                <p className="text-white font-semibold">{formatPriceIntl(item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-dark-border">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold text-lg">Total</span>
            <span className="text-primary font-bold text-2xl">
              {formatPriceIntl(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <div>
          <h3 className="text-white font-semibold mb-3">Informations de paiement</h3>
          <div className="bg-dark-bg rounded-lg p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">ID Paiement Stripe</span>
              <span className="text-white font-mono">{order.stripePaymentId}</span>
            </div>
            {order.stripeSessionId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">ID Session</span>
                <span className="text-white font-mono">{order.stripeSessionId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-dark-border">
          {order.licenseContract && (
            <Button variant="secondary" onClick={handleDownloadContract}>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Télécharger le contrat
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
