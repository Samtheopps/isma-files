'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IBeat, PaginatedResponse } from '@/types';
import { BeatCard } from './BeatCard';
import { Button } from '@/components/ui';

interface BeatGridProps {
  beats: PaginatedResponse<IBeat>;
  onPageChange?: (page: number) => void;
}

export const BeatGrid: React.FC<BeatGridProps> = ({ beats, onPageChange }) => {
  const router = useRouter();

  if (beats.data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-steel-blue-400 text-lg">Aucun beat trouvé</p>
      </div>
    );
  }

  return (
    <div>
      {/* Grid responsive optimisé - cards plus larges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 auto-rows-fr">
        {beats.data.map((beat) => (
          <BeatCard
            key={beat._id}
            beat={beat}
            onClick={() => router.push(`/beats/${beat._id}`)}
          />
        ))}
      </div>

      {beats.pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            onClick={() => onPageChange?.(beats.pagination.page - 1)}
            disabled={beats.pagination.page === 1}
          >
            Précédent
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: beats.pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === beats.pagination.page ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="secondary"
            onClick={() => onPageChange?.(beats.pagination.page + 1)}
            disabled={beats.pagination.page === beats.pagination.totalPages}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};
