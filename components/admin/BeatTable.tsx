'use client';

import React from 'react';
import { IBeat } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { clsx } from 'clsx';
import { formatPrice } from '@/lib/utils/formatPrice';

interface BeatTableProps {
  beats: IBeat[];
  onEdit: (beatId: string) => void;
  onDelete: (beatId: string) => void;
  onToggleActive: (beatId: string, isActive: boolean) => void;
}

export const BeatTable: React.FC<BeatTableProps> = ({
  beats,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const formatPriceRange = (licenses: IBeat['licenses']) => {
    const prices = licenses.filter((l) => l.available).map((l) => l.price);
    if (prices.length === 0) return 'N/A';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="hidden md:table w-full">
        <thead className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-white/5">
          <tr>
            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">Beat</th>
            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">BPM</th>
            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">Key</th>
            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">Genre</th>
            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">Price</th>
            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">Sales</th>
            <th className="text-center py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">Status</th>
            <th className="text-right py-4 px-6 text-xs uppercase tracking-wider text-gray-400 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {beats.map((beat) => (
            <tr
              key={beat._id}
              className="border-b border-white/5 hover:bg-white/5 transition-all duration-200"
            >
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={beat.coverImage}
                    alt={beat.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{beat.title}</p>
                    <p className="text-gray-400 text-xs font-mono">{beat.playCount} plays</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-white font-mono">{beat.bpm}</td>
              <td className="py-4 px-6 text-white font-mono">{beat.key}</td>
              <td className="py-4 px-6">
                <div className="flex flex-wrap gap-1">
                  {beat.genre.slice(0, 2).map((g, i) => (
                    <Badge key={i} variant="default" size="sm">
                      {g}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="py-4 px-6 text-white font-mono text-sm">{formatPriceRange(beat.licenses)}</td>
              <td className="py-4 px-6 text-white font-mono">{beat.salesCount}</td>
              <td className="py-4 px-6 text-center">
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    beat.isActive
                      ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {beat.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-end space-x-1">
                  <button
                    onClick={() => onEdit(beat._id)}
                    className="p-2 text-gray-400 hover:text-matrix-green hover:bg-white/5 rounded transition-all"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onToggleActive(beat._id, beat.isActive)}
                    className={clsx(
                      'p-2 rounded transition-all',
                      beat.isActive
                        ? 'text-gray-400 hover:text-yellow-400 hover:bg-white/5'
                        : 'text-gray-400 hover:text-green-400 hover:bg-white/5'
                    )}
                    title={beat.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          beat.isActive
                            ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                            : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        }
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(beat._id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded transition-all"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-4">
        {beats.map((beat) => (
          <div key={beat._id} className="bg-black/60 border border-white/5 rounded-lg p-4 hover:bg-white/5 transition-all">
            <div className="flex items-start space-x-3 mb-4">
              <img
                src={beat.coverImage}
                alt={beat.title}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium mb-1 truncate">{beat.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400 font-mono">
                  <span>{beat.bpm} BPM</span>
                  <span>•</span>
                  <span>{beat.key}</span>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded mt-2 ${
                    beat.isActive
                      ? 'bg-matrix-green/20 text-matrix-green'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {beat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Price</p>
                <p className="text-white font-medium font-mono">{formatPriceRange(beat.licenses)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Sales</p>
                <p className="text-white font-medium font-mono">{beat.salesCount}</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/5">
              <button
                onClick={() => onEdit(beat._id)}
                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white rounded transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => onToggleActive(beat._id, beat.isActive)}
                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white rounded transition-all"
              >
                {beat.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => onDelete(beat._id)}
                className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
