'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BeatTable } from '@/components/admin/BeatTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { IBeat, PaginatedResponse } from '@/types';

export default function AdminBeatsPage() {
  const router = useRouter();
  const [beats, setBeats] = useState<IBeat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState({
    status: 'all',
    genre: '',
    search: '',
  });

  useEffect(() => {
    fetchBeats();
  }, [page, filters]);

  const fetchBeats = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.genre && { genre: filters.genre }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/beats?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch beats');
      }

      const data: { data: IBeat[]; pagination: any } = await response.json();
      setBeats(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (beatId: string) => {
    router.push(`/admin/beats/${beatId}/edit`);
  };

  const handleDelete = async (beatId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce beat ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/beats/${beatId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete beat');
      }

      // Refresh the list
      fetchBeats();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (beatId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      
      // Récupérer le beat actuel
      const beatResponse = await fetch(`/api/admin/beats/${beatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!beatResponse.ok) {
        throw new Error('Failed to fetch beat');
      }

      const { data: beat } = await beatResponse.json();

      // Mettre à jour le statut
      const response = await fetch(`/api/admin/beats/${beatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...beat,
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update beat status');
      }

      // Refresh the list
      fetchBeats();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPage(1); // Reset to first page
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestion des Beats</h1>
          <p className="text-gray-400">{total} beats au total</p>
        </div>
        <Button onClick={() => router.push('/admin/beats/new')}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nouveau Beat
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Recherche</label>
            <Input
              type="text"
              placeholder="Rechercher un beat..."
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
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
            <select
              value={filters.genre}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, genre: e.target.value }));
                setPage(1);
              }}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous les genres</option>
              <option value="Trap">Trap</option>
              <option value="Drill">Drill</option>
              <option value="Afro">Afro</option>
              <option value="Boom Bap">Boom Bap</option>
              <option value="R&B">R&B</option>
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
      ) : beats.length === 0 ? (
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
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">Aucun beat trouvé</h3>
          <p className="text-gray-400 mb-6">Commencez par créer votre premier beat</p>
          <Button onClick={() => router.push('/admin/beats/new')}>Créer un beat</Button>
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
          <BeatTable
            beats={beats}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${
                  p === page
                    ? 'bg-primary text-white'
                    : 'bg-dark-border text-gray-400 hover:bg-dark-border/70'
                }`}
              >
                {p}
              </button>
            ))}
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
    </div>
  );
}
