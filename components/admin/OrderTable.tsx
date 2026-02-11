'use client';

import React from 'react';
import { IOrder } from '@/types';
import { Badge } from '@/components/ui/Badge';

type PopulatedOrder = IOrder & {
  userId?: {
    email: string;
    firstName: string;
    lastName: string;
  };
};

interface OrderTableProps {
  orders: PopulatedOrder[];
  onClick: (order: PopulatedOrder) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders, onClick }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
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

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="hidden md:table w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">N° Commande</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Date</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Client</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Beats</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Total</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Statut</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              onClick={() => onClick(order)}
              className="border-b border-dark-border hover:bg-dark-border/50 transition-colors cursor-pointer"
            >
              <td className="py-4 px-4">
                <p className="text-white font-medium">{order.orderNumber}</p>
              </td>
              <td className="py-4 px-4 text-gray-400 text-sm">{formatDate(order.createdAt)}</td>
              <td className="py-4 px-4">
                <div>
                  <p className="text-white font-medium">
                    {order.userId
                      ? `${order.userId.firstName} ${order.userId.lastName}`
                      : 'N/A'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {order.userId?.email || order.deliveryEmail}
                  </p>
                </div>
              </td>
              <td className="py-4 px-4 text-white">{order.items.length} beat(s)</td>
              <td className="py-4 px-4 text-white font-semibold">
                {formatCurrency(order.totalAmount)}
              </td>
              <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => onClick(order)}
            className="bg-dark-card border border-dark-border rounded-lg p-4 cursor-pointer hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-medium mb-1">{order.orderNumber}</p>
                <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Client</span>
                <span className="text-white">
                  {order.userId
                    ? `${order.userId.firstName} ${order.userId.lastName}`
                    : order.deliveryEmail}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Beats</span>
                <span className="text-white">{order.items.length}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span className="text-gray-400">Total</span>
                <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
