'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { IOrder, IDownload } from '@/types';
import gsap from 'gsap';
import { formatPrice } from '@/lib/utils/formatPrice';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [downloads, setDownloads] = useState<IDownload[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingDownloads, setIsLoadingDownloads] = useState(true);

  const headerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const ordersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );

      gsap.fromTo(
        [profileRef.current, ordersRef.current],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, stagger: 0.1, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchDownloads();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchDownloads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/downloads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDownloads(data.downloads || []);
      }
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setIsLoadingDownloads(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen pt-16 pb-32">
      {/* Header */}
      <div ref={headerRef} className="px-4 py-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">My Account</h1>
          <p className="text-gray-400">Manage your profile and purchases</p>
        </div>
      </div>

      {/* Content */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Profile Section */}
          <div ref={profileRef} className="bg-black/80 border border-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm text-gray-400 uppercase tracking-wider">Full Name</label>
                <p className="text-white font-medium mt-2">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-400 uppercase tracking-wider">Email</label>
                <p className="text-white font-medium mt-2">{user?.email}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 uppercase tracking-wider">Member Since</label>
                <p className="text-white font-medium mt-2">
                  {user?.createdAt ? formatDate(user.createdAt) : '-'}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-400 uppercase tracking-wider">Role</label>
                <p className="text-white font-medium mt-2 capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Orders Section */}
          <div ref={ordersRef} className="bg-black/80 border border-white/5 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-semibold text-white">Purchase History</h2>
              <p className="text-sm text-gray-400 mt-1">{orders.length} order{orders.length > 1 ? 's' : ''}</p>
            </div>

            {/* Orders Table */}
            {isLoadingOrders ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-matrix-green/20 border-t-matrix-green rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-4">No orders yet</p>
                <Button variant="primary" onClick={() => router.push('/beats')}>
                  Browse Beats
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <table className="hidden md:table w-full">
                  <thead className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-white/5">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                        Order
                      </th>
                      <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                        Date
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
                        className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                        onClick={() => router.push(`/account/orders/${order._id}`)}
                      >
                        <td className="py-4 px-6">
                          <p className="text-white font-mono font-medium">{order.orderNumber}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-white">{order.items.length} beat{order.items.length > 1 ? 's' : ''}</p>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <p className="text-matrix-green font-bold font-mono">{formatPrice(order.totalAmount)}</p>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'completed'
                                ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green/30'
                                : order.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => router.push(`/account/orders/${order._id}`)}
                      className="bg-black/60 border border-white/5 rounded-lg p-4 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-white font-mono font-medium text-sm">{order.orderNumber}</p>
                          <p className="text-gray-400 text-xs mt-1">{formatDate(order.createdAt)}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            order.status === 'completed'
                              ? 'bg-matrix-green/20 text-matrix-green'
                              : order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                        <span className="text-matrix-green font-bold font-mono">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
