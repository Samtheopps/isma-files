'use client';

import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { IBeat, IOrder } from '@/types';

interface DashboardStats {
  overview: {
    totalBeats: number;
    activeBeats: number;
    totalOrders: number;
    completedOrders: number;
    totalRevenue: number;
    monthRevenue: number;
    totalUsers: number;
  };
  topBeats: (IBeat & { salesCount: number })[];
  recentOrders: IOrder[];
  dailyRevenue: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error || 'Failed to load stats'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
        <p className="text-gray-400">Vue d'ensemble de votre plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Beats"
          value={stats.overview.totalBeats}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          }
          variant="primary"
        />

        <StatCard
          title="Chiffre d'Affaires"
          value={formatCurrency(stats.overview.totalRevenue)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          variant="success"
        />

        <StatCard
          title="Commandes"
          value={stats.overview.totalOrders}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          }
          variant="warning"
        />

        <StatCard
          title="Utilisateurs"
          value={stats.overview.totalUsers}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          variant="info"
        />
      </div>

      {/* Revenue Chart (Simple) */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">Revenus des 30 derniers jours</h2>
        <div className="space-y-2">
          {stats.dailyRevenue.length > 0 ? (
            <div className="flex items-end space-x-1 h-48">
              {stats.dailyRevenue.map((day, index) => {
                const maxRevenue = Math.max(...stats.dailyRevenue.map((d) => d.revenue));
                const height = (day.revenue / maxRevenue) * 100;
                
                return (
                  <div
                    key={index}
                    className="flex-1 group relative"
                  >
                    <div
                      className="bg-gradient-to-t from-primary to-primary-light rounded-t hover:opacity-80 transition-opacity"
                      style={{ height: `${height}%` }}
                    />
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-dark-card border border-dark-border rounded text-xs text-white whitespace-nowrap">
                      {formatDate(day.date)}: {formatCurrency(day.revenue)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">Aucune donnée disponible</p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Beats */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-6">Beats les plus vendus</h2>
          <div className="space-y-4">
            {stats.topBeats.length > 0 ? (
              stats.topBeats.map((beat, index) => (
                <div
                  key={beat._id}
                  className="flex items-center space-x-4 p-3 bg-dark-bg rounded-lg hover:bg-dark-border transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">#{index + 1}</span>
                  </div>
                  <img
                    src={beat.coverImage}
                    alt={beat.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{beat.title}</p>
                    <p className="text-gray-400 text-sm">{beat.salesCount} ventes</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">Aucune vente encore</p>
            )}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-6">Dernières commandes</h2>
          <div className="space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-dark-bg rounded-lg hover:bg-dark-border transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{order.orderNumber}</p>
                    <p className="text-gray-400 text-sm truncate">{order.deliveryEmail}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="success">{formatCurrency(order.totalAmount)}</Badge>
                    <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">Aucune commande encore</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
