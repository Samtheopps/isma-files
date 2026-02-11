'use client';

import React, { useEffect, useState } from 'react';
import { OrderTable } from '@/components/admin/OrderTable';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { IOrder } from '@/types';

type PopulatedOrder = IOrder & {
  userId?: {
    email: string;
    firstName: string;
    lastName: string;
  };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PopulatedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });

  const [selectedOrder, setSelectedOrder] = useState<PopulatedOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/orders?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderClick = (order: PopulatedOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
    setPage(1);
  };

  const calculateStats = () => {
    const completed = orders.filter((o) => o.status === 'completed');
    const totalRevenue = completed.reduce((sum, o) => sum + o.totalAmount, 0);
    
    return {
      totalOrders: total,
      completedOrders: completed.length,
      totalRevenue,
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Gestion des Commandes</h1>
        <p className="text-gray-400">{total} commandes au total</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Commandes</p>
          <p className="text-white text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Commandes Complétées</p>
          <p className="text-white text-3xl font-bold">{stats.completedOrders}</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Revenu Total</p>
          <p className="text-primary text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Recherche</label>
            <Input
              type="text"
              placeholder="N° commande, email..."
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Statut</label>
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous</option>
              <option value="completed">Complété</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoué</option>
              <option value="refunded">Remboursé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-lg p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">Aucune commande trouvée</h3>
          <p className="text-gray-400">Les commandes apparaîtront ici dès qu'elles seront passées</p>
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
          <OrderTable orders={orders} onClick={handleOrderClick} />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Précédent
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    pageNum === page
                      ? 'bg-primary text-white'
                      : 'bg-dark-border text-gray-400 hover:bg-dark-border/70'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
