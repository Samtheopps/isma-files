'use client';

import React from 'react';
import { IOrder } from '@/types';
import { formatPriceIntl } from '@/lib/utils/formatPrice';

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
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-matrix-green/20 text-matrix-green border border-matrix-green/30">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white border border-white/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="hidden md:table w-full">
        <thead className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-white/5">
          <tr>
            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Order Number
            </th>
            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Date
            </th>
            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Customer
            </th>
            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Items
            </th>
            <th className="text-right py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Total
            </th>
            <th className="text-center py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              onClick={() => onClick(order)}
              className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <td className="py-4 px-6">
                <p className="text-white font-mono font-medium">{order.orderNumber}</p>
              </td>
              <td className="py-4 px-6 text-gray-400 text-sm">{formatDate(order.createdAt)}</td>
              <td className="py-4 px-6">
                <div>
                  <p className="text-white font-medium text-sm">
                    {order.userId
                      ? `${order.userId.firstName} ${order.userId.lastName}`
                      : 'N/A'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {order.userId?.email || order.deliveryEmail}
                  </p>
                </div>
              </td>
              <td className="py-4 px-6 text-white font-mono">{order.items.length} beat{order.items.length > 1 ? 's' : ''}</td>
              <td className="py-4 px-6 text-right">
                <p className="text-matrix-green font-bold font-mono">{formatPriceIntl(order.totalAmount)}</p>
              </td>
              <td className="py-4 px-6 text-center">{getStatusBadge(order.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-4">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => onClick(order)}
            className="bg-black/60 border border-white/5 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-mono font-medium text-sm">{order.orderNumber}</p>
                <p className="text-gray-400 text-xs mt-1">{formatDate(order.createdAt)}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Customer</span>
                <span className="text-white text-xs">
                  {order.userId
                    ? `${order.userId.firstName} ${order.userId.lastName}`
                    : order.deliveryEmail}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Items</span>
                <span className="text-white font-mono">{order.items.length}</span>
              </div>
              <div className="flex items-center justify-between font-semibold pt-2 border-t border-white/5">
                <span className="text-gray-400">Total</span>
                <span className="text-matrix-green font-mono">{formatPriceIntl(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
