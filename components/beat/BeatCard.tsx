'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { IBeat } from '@/types';
import { Card, Badge, Button } from '@/components/ui';
import { usePlayer } from '@/context/PlayerContext';
import { useCart } from '@/context/CartContext';
import gsap from 'gsap';
import { useFadeInScroll } from '@/lib/hooks/useScrollTrigger';
import { formatPriceRounded } from '@/lib/utils/formatPrice';

interface BeatCardProps {
  beat: IBeat;
  onClick?: () => void;
}

export const BeatCard: React.FC<BeatCardProps> = ({ beat, onClick }) => {
  const { play, pause, currentBeat, isPlaying } = usePlayer();
  const { addToCart } = useCart();
  const t = useTranslations('beats.card');
  
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);

  const isCurrentBeat = currentBeat?._id === beat._id;
  const isCurrentlyPlaying = isCurrentBeat && isPlaying;

  // Fade in au scroll
  useFadeInScroll(cardRef, { y: 30, duration: 0.8 });

  // 3D Tilt effect
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8; // Max 8deg
      const rotateY = ((x - centerX) / centerX) * 8;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      });

      // Image zoom
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      // Play button scale
      if (playButtonRef.current) {
        gsap.to(playButtonRef.current, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
      }

      if (playButtonRef.current) {
        gsap.to(playButtonRef.current, {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

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

      // Animation feedback
      if (priceRef.current) {
        gsap.fromTo(
          priceRef.current,
          { scale: 1 },
          {
            scale: 1.2,
            duration: 0.2,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
          }
        );
      }
    }
  };

  const minPrice = Math.min(...beat.licenses.filter((l) => l.available).map((l) => l.price));

  return (
    <div ref={cardRef} className="will-change-transform min-w-[240px] max-w-[340px] w-full mx-auto" style={{ transformStyle: 'preserve-3d' }}>
      <div 
        className="cursor-pointer group bg-ink-black-900/60 backdrop-blur-sm border border-ink-black-800/30 hover:border-fresh-sky-500/40 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-glow h-full flex flex-col" 
        onClick={onClick}
      >
        {/* Cover Image avec Play Overlay */}
        <div className="relative aspect-square overflow-hidden">
          <div ref={imageRef} className="w-full h-full">
            <Image
              src={beat.coverImage}
              alt={beat.title}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Gradient overlay bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-ink-black-950/0 group-hover:bg-ink-black-950/40 transition-all duration-300 flex items-center justify-center">
            <button
              ref={playButtonRef}
              onClick={handlePlayPause}
              className="w-16 h-16 bg-fresh-sky-500 hover:bg-fresh-sky-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90 shadow-xl will-change-transform"
            >
              {isCurrentlyPlaying ? (
                <svg className="w-7 h-7 text-ink-black-950" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-ink-black-950 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Genre badges - Top right */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            {beat.genre.slice(0, 2).map((g, i) => (
              <span 
                key={i} 
                className="px-2 py-1 text-xs font-medium bg-ink-black-950/80 backdrop-blur-sm text-fresh-sky-400 rounded-md border border-fresh-sky-500/20"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Playing indicator - Top left */}
          {isCurrentlyPlaying && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-fresh-sky-500/90 backdrop-blur-sm rounded-md">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-3 bg-ink-black-950 animate-waveform" style={{ animationDelay: '0ms' }} />
                <div className="w-0.5 h-3 bg-ink-black-950 animate-waveform" style={{ animationDelay: '150ms' }} />
                <div className="w-0.5 h-3 bg-ink-black-950 animate-waveform" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-semibold text-ink-black-950">{t('playing')}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          {/* Title + Producer */}
          <div className="flex-1">
            <h3 className="font-semibold text-white text-base leading-tight mb-1.5 line-clamp-2 group-hover:text-fresh-sky-400 transition-colors">
              {beat.title}
            </h3>
            <p className="text-xs text-steel-blue-400 truncate">Isma</p>
          </div>

          {/* Metadata inline */}
          <div className="flex items-center gap-2 text-xs text-steel-blue-300 font-mono flex-wrap">
            <span className="whitespace-nowrap">{beat.bpm} BPM</span>
            <span className="text-steel-blue-600">•</span>
            <span className="whitespace-nowrap">{beat.key}</span>
            {beat.mood[0] && (
              <>
                <span className="text-steel-blue-600">•</span>
                <span className="capitalize whitespace-nowrap">{beat.mood[0]}</span>
              </>
            )}
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between pt-3 border-t border-ink-black-800/30">
            <span ref={priceRef} className="text-fresh-sky-500 font-bold text-xl whitespace-nowrap">
              {formatPriceRounded(minPrice)}
            </span>
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-fresh-sky-500/10 hover:bg-fresh-sky-500/20 rounded-lg transition-all group/btn flex-shrink-0"
              title={t('addToCart')}
              aria-label={t('addToCart')}
            >
              <svg className="w-5 h-5 text-fresh-sky-500 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
