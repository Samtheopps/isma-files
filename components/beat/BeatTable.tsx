'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IBeat } from '@/types';
import { BeatListItem } from './BeatListItem';

interface BeatTableProps {
  beats: IBeat[];
  loading?: boolean;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const BeatListSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[auto,auto,1fr,auto,auto,auto,auto,auto] items-center gap-4 px-4 py-3 border-b border-ink-black-800/30 animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-fresh-sky-500/10" />
          <div className="w-12 h-12 rounded bg-fresh-sky-500/10" />
          <div className="space-y-2">
            <div className="h-4 bg-fresh-sky-500/10 rounded w-3/4" />
            <div className="h-3 bg-fresh-sky-500/10 rounded w-1/2" />
          </div>
          <div className="w-16 h-4 bg-fresh-sky-500/10 rounded" />
          <div className="w-12 h-4 bg-fresh-sky-500/10 rounded" />
          <div className="w-32 h-6 bg-fresh-sky-500/10 rounded" />
          <div className="w-20 h-4 bg-fresh-sky-500/10 rounded" />
          <div className="w-8 h-8 bg-fresh-sky-500/10 rounded" />
        </div>
      ))}
    </>
  );
};

const EmptyState: React.FC<{ message?: string }> = ({ message = 'No beats found' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <svg className="w-16 h-16 text-steel-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
      <p className="text-steel-blue-400 text-sm">{message}</p>
    </div>
  );
};

export const BeatTable: React.FC<BeatTableProps> = ({ 
  beats, 
  loading = false,
  onSort,
  sortField,
  sortDirection = 'asc'
}) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSort = (field: string) => {
    if (onSort) onSort(field);
  };

  const handleBeatClick = (beatId: string) => {
    router.push(`/beats/${beatId}`);
  };

  const SortIcon: React.FC<{ active: boolean }> = ({ active }) => (
    <svg 
      className={`w-3 h-3 ml-1 transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path d="M5 10l5-5 5 5H5z" />
    </svg>
  );

  return (
    <div className="beat-table">
      {/* Table Header - Hidden on mobile */}
      {!isMobile && (
        <div className="sticky top-20 z-10 bg-ink-black-950/95 backdrop-blur-xl border-b border-ink-black-800/30 grid grid-cols-[auto,auto,1fr,auto,auto,auto,auto,auto] items-center gap-4 px-4 py-3">
          <span className="w-10"></span> {/* Play */}
          <span className="w-12"></span> {/* Cover */}
          
          <button 
            onClick={() => handleSort('title')}
            className="flex items-center text-xs uppercase tracking-wider text-steel-blue-400 hover:text-fresh-sky-400 transition-colors group"
          >
            TITLE
            <SortIcon active={sortField === 'title'} />
          </button>
          
          <button 
            onClick={() => handleSort('bpm')}
            className="flex items-center justify-center text-xs uppercase tracking-wider text-steel-blue-400 hover:text-fresh-sky-400 transition-colors group w-16"
          >
            BPM
            <SortIcon active={sortField === 'bpm'} />
          </button>
          
          <span className="text-xs uppercase tracking-wider text-steel-blue-400 w-12 text-center">KEY</span>
          
          <span className="text-xs uppercase tracking-wider text-steel-blue-400 w-32">GENRE</span>
          
          <button 
            onClick={() => handleSort('price')}
            className="flex items-center justify-end text-xs uppercase tracking-wider text-steel-blue-400 hover:text-fresh-sky-400 transition-colors group w-20"
          >
            PRICE
            <SortIcon active={sortField === 'price'} />
          </button>
          
          <span className="w-8"></span> {/* Actions */}
        </div>
      )}
      
      {/* Beats List */}
      <div className="beats-list">
        {loading ? (
          <BeatListSkeleton count={10} />
        ) : beats.length === 0 ? (
          <EmptyState message="No beats match your filters" />
        ) : (
          beats.map((beat) => (
            <BeatListItem 
              key={beat._id} 
              beat={beat}
              compact={isMobile}
              onClick={() => handleBeatClick(beat._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
