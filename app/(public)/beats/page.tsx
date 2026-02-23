'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IBeat } from '@/types';
import { BeatTable } from '@/components/beat/BeatTable';
import { BeatGrid } from '@/components/beat/BeatGrid';
import { BeatFiltersBar, FilterState } from '@/components/beat/BeatFiltersBar';
import { StickyPlayer } from '@/components/player/StickyPlayer';
import gsap from 'gsap';

export default function BeatsPage() {
  const [beats, setBeats] = useState<IBeat[]>([]);
  const [filteredBeats, setFilteredBeats] = useState<IBeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const headerRef = useRef<HTMLDivElement>(null);

  // Fetch beats on mount
  useEffect(() => {
    fetchBeats();
  }, []);

  // Filter beats when filters change
  useEffect(() => {
    applyFilters();
  }, [filters, beats, sortBy, sortDirection]);

  // Header animation
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const fetchBeats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/beats?limit=100');
      if (response.ok) {
        const data = await response.json();
        setBeats(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching beats:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...beats];

    // Search filter
    if (filters.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(beat => 
        beat.title.toLowerCase().includes(searchLower) ||
        beat.genre.some(g => g.toLowerCase().includes(searchLower)) ||
        beat.mood.some(m => m.toLowerCase().includes(searchLower))
      );
    }

    // Genre filter
    if (filters.genre && filters.genre !== 'All') {
      result = result.filter(beat => beat.genre.includes(filters.genre!));
    }

    // BPM range filter
    if (filters.bpmRange && filters.bpmRange !== 'All') {
      const [min, max] = filters.bpmRange.split('-').map(s => s.replace('+', '999'));
      result = result.filter(beat => {
        if (max) {
          return beat.bpm >= parseInt(min) && beat.bpm <= parseInt(max);
        }
        return beat.bpm >= parseInt(min);
      });
    }

    // Key filter
    if (filters.key && filters.key !== 'All') {
      result = result.filter(beat => beat.key === filters.key);
    }

    // Mood filter
    if (filters.mood && filters.mood !== 'All') {
      result = result.filter(beat => beat.mood.includes(filters.mood!));
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'bpm':
          comparison = a.bpm - b.bpm;
          break;
        case 'price':
          const priceA = Math.min(...a.licenses.filter(l => l.available).map(l => l.price));
          const priceB = Math.min(...b.licenses.filter(l => l.available).map(l => l.price));
          comparison = priceA - priceB;
          break;
        case 'date':
        default:
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredBeats(result);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-32">
      {/* Page Header */}
      <section ref={headerRef} className="px-4 py-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Beats Catalog</h1>
          <p className="text-gray-400">
            {loading ? 'Loading...' : `${filteredBeats.length} premium beat${filteredBeats.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </section>

      {/* Filters Bar */}
      <BeatFiltersBar 
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Content */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'list' ? (
            <BeatTable 
              beats={filteredBeats}
              loading={loading}
              onSort={handleSort}
              sortField={sortBy}
              sortDirection={sortDirection}
            />
          ) : loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-steel-blue-400">Loading beats...</div>
            </div>
          ) : (
            <BeatGrid 
              beats={{ 
                data: filteredBeats, 
                pagination: {
                  page: 1, 
                  limit: 100, 
                  total: filteredBeats.length, 
                  totalPages: 1 
                }
              }} 
              onPageChange={() => {}}
            />
          )}
        </div>
      </section>

      {/* Sticky Player */}
      <StickyPlayer />
    </main>
  );
}

