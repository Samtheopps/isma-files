'use client';

import React from 'react';
import Image from 'next/image';
import { IBeat } from '@/types';
import { Card, Badge, Button } from '@/components/ui';
import { usePlayer } from '@/context/PlayerContext';
import { useCart } from '@/context/CartContext';

interface BeatCardProps {
  beat: IBeat;
  onClick?: () => void;
}

export const BeatCard: React.FC<BeatCardProps> = ({ beat, onClick }) => {
  const { play, pause, currentBeat, isPlaying } = usePlayer();
  const { addToCart } = useCart();

  const isCurrentBeat = currentBeat?._id === beat._id;
  const isCurrentlyPlaying = isCurrentBeat && isPlaying;

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

  return (
    <Card hover className="cursor-pointer group" onClick={onClick}>
      <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
        <Image
          src={beat.coverImage}
          alt={beat.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={handlePlayPause}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        >
          {isCurrentlyPlaying ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="absolute top-2 right-2 flex gap-1">
          {beat.genre.slice(0, 2).map((g, i) => (
            <Badge key={i} variant="primary" size="sm">
              {g}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-white text-lg truncate">{beat.title}</h3>
        
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>{beat.bpm} BPM</span>
          <span>•</span>
          <span>{beat.key}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {beat.mood.slice(0, 3).map((mood, i) => (
            <Badge key={i} variant="default" size="sm">
              {mood}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-dark-border">
          <span className="text-white font-semibold">À partir de {minPrice}€</span>
          <Button size="sm" variant="primary" onClick={handleAddToCart}>
            Ajouter
          </Button>
        </div>
      </div>
    </Card>
  );
};
