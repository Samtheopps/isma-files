'use client';

import React, { useEffect, useState, useRef } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { Loader } from '@/components/ui/Loader';
import { IBeat, IOrder } from '@/types';
import gsap from 'gsap';

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

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!isLoading && stats) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        gsap.fromTo(
          statsRef.current?.children || [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.2, stagger: 0.1, ease: 'power2.out' }
        );
      });

      return () => ctx.revert();
    }
  }, [isLoading, stats]);

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
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div ref={headerRef}>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400 text-sm uppercase tracking-wider">Admin Overview</p>
      </div>

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Beats"
          value={stats.overview.totalBeats}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          }
          variant="primary"
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.overview.totalRevenue)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          variant="success"
        />

        <StatCard
          title="Total Orders"
          value={stats.overview.totalOrders}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          variant="warning"
        />

        <StatCard
          title="Total Users"
          value={stats.overview.totalUsers}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          variant="info"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-black/80 border border-white/5 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6 uppercase tracking-wider text-sm">Revenue (30 days)</h2>
        {stats.dailyRevenue.length > 0 ? (
          <div className="flex items-end gap-1 h-40">
            {stats.dailyRevenue.map((day, index) => {
              const maxRevenue = Math.max(...stats.dailyRevenue.map((d) => d.revenue));
              const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col justify-end group">
                  <div
                    className="w-full bg-matrix-green/70 hover:bg-matrix-green transition-all duration-200 rounded-t"
                    style={{ height: `${height}%`, minHeight: day.revenue > 0 ? '4px' : '0' }}
                    title={`${formatDate(day.date)}: ${formatCurrency(day.revenue)}`}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12 text-sm">No revenue data</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Beats */}
        <div className="bg-black/80 border border-white/5 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6 uppercase tracking-wider text-sm">Top Beats</h2>
          <div className="space-y-3">
            {stats.topBeats.length > 0 ? (
              stats.topBeats.slice(0, 5).map((beat, index) => (
                <div key={beat._id} className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-lg hover:border-white/10 transition-all">
                  <span className="text-matrix-green font-mono text-sm font-bold w-8">#{index + 1}</span>
                  <img src={beat.coverImage} alt={beat.title} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{beat.title}</p>
                    <p className="text-gray-400 text-xs font-mono">{beat.salesCount} sales</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm">No sales yet</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-black/80 border border-white/5 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6 uppercase tracking-wider text-sm">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg hover:border-white/10 transition-all">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-white text-sm font-mono font-medium">{order.orderNumber}</p>
                    <p className="text-gray-400 text-xs truncate">{order.deliveryEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-matrix-green text-sm font-bold font-mono">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-gray-500 text-xs">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

