'use client';

import React, { useState, useEffect } from 'react';
import { IBeat, PaginatedResponse, BeatFilters as BeatFiltersType } from '@/types';
import { BeatGrid } from '@/components/beat/BeatGrid';
import { BeatFilters } from '@/components/beat/BeatFilters';
import { Loader } from '@/components/ui';

export default function BeatsPage() {
  const [beats, setBeats] = useState<PaginatedResponse<IBeat> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<BeatFiltersType>({});
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBeats();
  }, [filters, page]);

  const fetchBeats = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(filters.search && { search: filters.search }),
        ...(filters.genre && { genre: filters.genre.join(',') }),
        ...(filters.mood && { mood: filters.mood.join(',') }),
        ...(filters.key && { key: filters.key }),
        ...(filters.bpmMin && { bpmMin: filters.bpmMin.toString() }),
        ...(filters.bpmMax && { bpmMax: filters.bpmMax.toString() }),
      });

      const response = await fetch(`/api/beats?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBeats(data);
      }
    } catch (error) {
      console.error('Error fetching beats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: BeatFiltersType) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Catalogue de Beats</h1>
          <p className="text-gray-400">Découvrez notre sélection de beats premium</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <BeatFilters onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Mobile Filters Toggle */}
          <div className="lg:hidden fixed bottom-4 right-4 z-40">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtres
            </button>
          </div>

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-dark-bg border-l border-dark-border p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Filtres</h2>
                  <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <BeatFilters onFilterChange={(f) => { handleFilterChange(f); setShowFilters(false); }} />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader size="lg" text="Chargement des beats..." />
              </div>
            ) : beats ? (
              <BeatGrid beats={beats} onPageChange={handlePageChange} />
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400">Erreur lors du chargement des beats</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
