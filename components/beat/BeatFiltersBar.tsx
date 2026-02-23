'use client';

import React, { useState, useEffect } from 'react';

interface BeatFiltersBarProps {
  onFilterChange?: (filters: FilterState) => void;
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
}

export interface FilterState {
  genre?: string;
  bpmRange?: string;
  key?: string;
  mood?: string;
  search?: string;
}

const genres = ['All', 'Trap', 'Drill', 'Lo-Fi', 'Boom Bap', 'R&B', 'Pop', 'Afrobeat'];
const bpmRanges = ['All', '60-90', '90-120', '120-140', '140-160', '160+'];
const keys = ['All', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'C#m', 'Dm'];
const moods = ['All', 'Dark', 'Chill', 'Energetic', 'Emotional', 'Aggressive', 'Melodic'];

export const BeatFiltersBar: React.FC<BeatFiltersBarProps> = ({
  onFilterChange,
  viewMode = 'list',
  onViewModeChange,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    genre: 'All',
    bpmRange: 'All',
    key: 'All',
    mood: 'All',
    search: '',
  });

  const [searchInput, setSearchInput] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Notify parent on filter change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      genre: 'All',
      bpmRange: 'All',
      key: 'All',
      mood: 'All',
      search: '',
    });
    setSearchInput('');
  };

  const hasActiveFilters = 
    filters.genre !== 'All' || 
    filters.bpmRange !== 'All' || 
    filters.key !== 'All' || 
    filters.mood !== 'All' || 
    filters.search !== '';

  return (
    <div className="sticky top-20 z-30 bg-black/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Genre */}
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:border-white/20 focus:border-matrix-green/50 focus:outline-none transition-all cursor-pointer"
          >
            {genres.map(g => (
              <option key={g} value={g} className="bg-black">{g === 'All' ? 'All Genres' : g}</option>
            ))}
          </select>

          {/* BPM */}
          <select
            value={filters.bpmRange}
            onChange={(e) => handleFilterChange('bpmRange', e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:border-white/20 focus:border-matrix-green/50 focus:outline-none transition-all cursor-pointer"
          >
            {bpmRanges.map(b => (
              <option key={b} value={b} className="bg-black">{b === 'All' ? 'All BPM' : `${b} BPM`}</option>
            ))}
          </select>

          {/* Key */}
          <select
            value={filters.key}
            onChange={(e) => handleFilterChange('key', e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:border-white/20 focus:border-matrix-green/50 focus:outline-none transition-all cursor-pointer"
          >
            {keys.map(k => (
              <option key={k} value={k} className="bg-black">{k === 'All' ? 'All Keys' : k}</option>
            ))}
          </select>

          {/* Mood */}
          <select
            value={filters.mood}
            onChange={(e) => handleFilterChange('mood', e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:border-white/20 focus:border-matrix-green/50 focus:outline-none transition-all cursor-pointer"
          >
            {moods.map(m => (
              <option key={m} value={m} className="bg-black">{m === 'All' ? 'All Moods' : m}</option>
            ))}
          </select>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <input
              type="search"
              placeholder="Search beats..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-gray-500 hover:border-white/20 focus:border-matrix-green/50 focus:outline-none transition-all"
            />
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange?.('list')}
              className={`p-2 rounded transition-all ${
                viewMode === 'list' 
                  ? 'bg-matrix-green/20 text-matrix-green' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange?.('grid')}
              className={`p-2 rounded transition-all ${
                viewMode === 'grid' 
                  ? 'bg-matrix-green/20 text-matrix-green' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
