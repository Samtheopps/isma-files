'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { IBeat } from '@/types';
import { Badge, Button } from '@/components/ui';
import { usePlayer } from '@/context/PlayerContext';
import { useCart } from '@/context/CartContext';
import { useFadeInScroll } from '@/lib/hooks/useScrollTrigger';
import { formatPriceRounded } from '@/lib/utils/formatPrice';

interface BeatListItemProps {
  beat: IBeat;
  compact?: boolean;
  onClick?: () => void;
}

export const BeatListItem: React.FC<BeatListItemProps> = ({ 
  beat, 
  compact = false,
  onClick 
}) => {
  const { play, pause, currentBeat, isPlaying } = usePlayer();
  const { addToCart } = useCart();
  const rowRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('beats.card');

  const isCurrentBeat = currentBeat?._id === beat._id;
  const isCurrentlyPlaying = isCurrentBeat && isPlaying;

  // Fade in au scroll
  useFadeInScroll(rowRef, { y: 20, duration: 0.5 });

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(beat);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const basicLicense = beat.licenses.find((l) => l.type === 'basic');
    if (basicLicense && basicLicense.available) {
      addToCart({
        beatId: beat._id,
        beat,
        licenseType: 'basic',
        price: basicLicense.price,
      });
    }
  };

  const minPrice = Math.min(...beat.licenses.filter((l) => l.available).map((l) => l.price));

  if (compact) {
    // Mobile compact layout
    return (
      <div
        ref={rowRef}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3 border-b border-ink-black-800/30 hover:bg-fresh-sky-500/5 transition-all duration-200 cursor-pointer group"
      >
        {/* Play Button */}
        <button
          onClick={handlePlayPause}
          className="w-10 h-10 rounded-full bg-fresh-sky-500/10 hover:bg-fresh-sky-500/20 flex items-center justify-center flex-shrink-0 transition-all"
        >
          {isCurrentlyPlaying ? (
            <svg className="w-4 h-4 text-fresh-sky-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-fresh-sky-500 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Cover */}
        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
          <Image src={beat.coverImage} alt={beat.title} fill className="object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">{beat.title}</h3>
          <div className="flex items-center gap-2 text-xs text-steel-blue-300 font-mono">
            <span>{beat.bpm} BPM</span>
            <span>•</span>
            <span>{beat.key}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <span className="text-sm font-semibold text-fresh-sky-500">{formatPriceRounded(minPrice)}</span>
        </div>
      </div>
    );
  }

  // Desktop full layout
  return (
    <div
      ref={rowRef}
      onClick={onClick}
      className="grid grid-cols-[auto,auto,1fr,auto,auto,auto,auto,auto] items-center gap-4 px-4 py-3 border-b border-ink-black-800/30 hover:bg-fresh-sky-500/5 transition-all duration-200 cursor-pointer group"
    >
      {/* Play Button */}
      <button
        onClick={handlePlayPause}
        className="w-10 h-10 rounded-full bg-fresh-sky-500/10 hover:bg-fresh-sky-500/20 flex items-center justify-center transition-all"
      >
        {isCurrentlyPlaying ? (
          <svg className="w-4 h-4 text-fresh-sky-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-fresh-sky-500 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Cover Image */}
      <div className="relative w-12 h-12 rounded overflow-hidden">
        <Image src={beat.coverImage} alt={beat.title} fill className="object-cover" />
      </div>

      {/* Title + Producer */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-fresh-sky-400 transition-colors">
          {beat.title}
        </h3>
        <p className="text-xs text-steel-blue-300 truncate">Isma</p>
      </div>

      {/* BPM */}
      <span className="font-mono text-sm text-steel-blue-300 w-16 text-center">{beat.bpm}</span>

      {/* Key */}
      <span className="font-mono text-sm text-steel-blue-300 w-12 text-center">{beat.key}</span>

      {/* Genre tags */}
      <div className="flex gap-1 w-32">
        {beat.genre.slice(0, 2).map((g, i) => (
          <Badge key={i} variant="default" size="sm">
            {g}
          </Badge>
        ))}
      </div>

      {/* Price */}
      <div className="w-20 text-right">
        <span className="text-sm font-semibold text-fresh-sky-500">{formatPriceRounded(minPrice)}</span>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        className="w-8 h-8 rounded-lg bg-transparent hover:bg-fresh-sky-500/10 flex items-center justify-center transition-all"
        title={t('addToCart')}
        aria-label={t('addToCart')}
      >
        <svg className="w-4 h-4 text-steel-blue-300 hover:text-fresh-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>
    </div>
  );
};
