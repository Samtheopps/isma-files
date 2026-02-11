'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, Button } from '@/components/ui';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mon compte</h1>
          <p className="text-gray-400">Gérez votre compte et vos achats</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Informations personnelles</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Nom complet</label>
                <p className="text-white font-medium mt-1">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white font-medium mt-1">{user?.email}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400">Membre depuis</label>
                <p className="text-white font-medium mt-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-'}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-400">Rôle</label>
                <p className="text-white font-medium mt-1 capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-dark-border">
              <Button variant="danger" onClick={handleLogout}>
                Se déconnecter
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card hover className="cursor-pointer" onClick={() => router.push('/account/purchases')}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Mes achats</h3>
                  <p className="text-sm text-gray-400">Historique des commandes</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>

            <Card hover className="cursor-pointer" onClick={() => router.push('/account/downloads')}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Téléchargements</h3>
                  <p className="text-sm text-gray-400">Accéder aux fichiers</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>

            <Card hover className="cursor-pointer" onClick={() => router.push('/beats')}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Catalogue</h3>
                  <p className="text-sm text-gray-400">Parcourir les beats</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
