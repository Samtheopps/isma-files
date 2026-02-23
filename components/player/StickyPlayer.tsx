'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { usePlayer } from '@/context/PlayerContext';
import { useCart } from '@/context/CartContext';
import gsap from 'gsap';

export const StickyPlayer: React.FC = () => {
  const { currentBeat, isPlaying, play, pause, resume, currentTime, duration } = usePlayer();
  const { addToCart } = useCart();
  const playerRef = useRef<HTMLDivElement>(null);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Slide up animation when beat starts playing
  useEffect(() => {
    if (!playerRef.current) return;

    if (currentBeat) {
      gsap.to(playerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      gsap.to(playerRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [currentBeat]);

  const handleAddToCart = () => {
    if (!currentBeat) return;
    
    const basicLicense = currentBeat.licenses.find((l) => l.type === 'basic');
    if (basicLicense && basicLicense.available) {
      addToCart({
        beatId: currentBeat._id,
        beat: currentBeat,
        licenseType: 'basic',
        price: basicLicense.price,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentBeat) return null;

  return (
    <div
      ref={playerRef}
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/5"
      style={{ opacity: 0, transform: 'translateY(100px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Beat info */}
          <div className="flex items-center gap-3 min-w-0 flex-1 max-w-xs">
            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
              <Image 
                src={currentBeat.coverImage} 
                alt={currentBeat.title} 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">{currentBeat.title}</h4>
              <p className="text-xs text-gray-500 truncate">Isma</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => (isPlaying ? pause() : resume())}
              className="w-10 h-10 rounded-full bg-matrix-green hover:bg-matrix-green/90 flex items-center justify-center transition-all"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-gray-500 font-mono w-10">
              {formatTime(currentTime || 0)}
            </span>
            <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group">
              <div 
                className="h-full bg-matrix-green rounded-full transition-all group-hover:bg-matrix-green/80" 
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
              />
            </div>
            <span className="text-xs text-gray-500 font-mono w-10">
              {formatTime(duration || 0)}
            </span>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-matrix-green text-black text-sm font-semibold rounded-lg hover:bg-matrix-green/90 transition-all flex-shrink-0"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
