'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IOrder } from '@/types';
import { Card, Badge, Loader, Button } from '@/components/ui';

export default function PurchasesPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
      refunded: 'default',
    };

    const labels: Record<string, string> = {
      completed: 'Complété',
      pending: 'En attente',
      failed: 'Échoué',
      refunded: 'Remboursé',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Chargement de vos achats..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Mes achats</h1>
            <p className="text-gray-400">Historique de vos commandes</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">Aucun achat</h2>
            <p className="text-gray-400 mb-6">Vous n'avez pas encore effectué d'achat</p>
            <Button variant="primary" onClick={() => router.push('/beats')}>
              Parcourir les beats
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} hover>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{order.orderNumber}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-400">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="mt-3 space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="text-sm text-gray-300">
                          {item.beatTitle} - <span className="capitalize">{item.licenseType}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{(order.totalAmount / 100).toFixed(2)}€</p>
                    </div>

                    {order.status === 'completed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push('/account/downloads')}
                      >
                        Télécharger
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
