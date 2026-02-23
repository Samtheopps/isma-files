'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { IBeat, LicenseType } from '@/types';
import { SimpleAudioPlayer } from '@/components/player/SimpleAudioPlayer';
import { Badge, Button } from '@/components/ui';
import { usePlayer } from '@/context/PlayerContext';
import { useCart } from '@/context/CartContext';
import gsap from 'gsap';
import { formatPrice, formatPriceRounded } from '@/lib/utils/formatPrice';

export default function BeatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { play, pause, currentBeat, isPlaying } = usePlayer();
  const { addToCart } = useCart();

  const [beat, setBeat] = useState<IBeat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>('basic');

  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchBeat = async (id: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/beats/${id}`, {
          signal: abortController.signal,
        });
        
        if (!isMounted) return;
        
        if (response.ok) {
          const data = await response.json();
          if (!isMounted) return;
          
          setBeat(data.beat);
          
          // Set default license to first available
          const firstAvailable = data.beat.licenses.find((l: any) => l.available);
          if (firstAvailable) {
            setSelectedLicense(firstAvailable.type);
          }
        } else {
          router.push('/beats');
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Error fetching beat:', error);
        if (isMounted) {
          router.push('/beats');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (params.id) {
      fetchBeat(params.id as string);
    }

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [params.id, router]);

  // Entrance animations
  useEffect(() => {
    if (!isLoading && beat) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
        
        gsap.fromTo(
          leftColRef.current,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
        );
        
        gsap.fromTo(
          rightColRef.current,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power2.out' }
        );
      });

      return () => ctx.revert();
    }
  }, [isLoading, beat]);

  const handlePlayPause = () => {
    if (!beat) return;
    
    const isCurrentBeat = currentBeat?._id === beat._id;
    if (isCurrentBeat && isPlaying) {
      pause();
    } else {
      play(beat);
    }
  };

  const handleAddToCart = () => {
    if (!beat) return;

    const license = beat.licenses.find((l) => l.type === selectedLicense);
    if (license && license.available) {
      addToCart({
        beatId: beat._id,
        beat,
        licenseType: selectedLicense,
        price: license.price,
      });
      router.push('/cart');
    }
  };

  // License description helper
  const getLicenseDescription = (type: LicenseType): string => {
    const descriptions: Record<LicenseType, string> = {
      basic: 'MP3 only, limited distribution',
      standard: 'MP3 + WAV, standard distribution',
      pro: 'MP3 + WAV + Stems, unlimited streams',
      unlimited: 'All files, unlimited distribution',
      exclusive: 'Full rights, exclusive ownership',
    };
    return descriptions[type];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-matrix-green/20 border-t-matrix-green rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading beat...</p>
        </div>
      </div>
    );
  }

  if (!beat) return null;

  const isCurrentBeat = currentBeat?._id === beat._id;
  const selectedLicenseData = beat.licenses.find((l) => l.type === selectedLicense);

  return (
    <main className="min-h-screen pt-16 pb-32">
      {/* Back Button */}
      <div ref={headerRef} className="px-4 py-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/beats')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Catalog
          </button>
        </div>
      </div>

      {/* Content */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Cover + Info */}
            <div ref={leftColRef} className="space-y-6">
              {/* Cover Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden border border-white/5">
                <Image
                  src={beat.coverImage}
                  alt={beat.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Beat Title & Info */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">{beat.title}</h1>
                <p className="text-gray-400 text-sm mb-4">Produced by Isma</p>
                
                <div className="flex items-center gap-6 text-sm font-mono">
                  <div>
                    <span className="text-gray-500">BPM: </span>
                    <span className="text-white">{beat.bpm}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Key: </span>
                    <span className="text-white">{beat.key}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Plays: </span>
                    <span className="text-white">{beat.playCount}</span>
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={handlePlayPause}
                className="w-full px-6 py-4 bg-matrix-green/10 hover:bg-matrix-green/20 border border-matrix-green/30 rounded-lg flex items-center justify-center gap-3 transition-all group"
              >
                {isCurrentBeat && isPlaying ? (
                  <>
                    <svg className="w-6 h-6 text-matrix-green" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                    <span className="text-matrix-green font-semibold">Pause Preview</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-matrix-green" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="text-matrix-green font-semibold">Play Preview</span>
                  </>
                )}
              </button>

              {/* Waveform */}
              <div className="bg-black/60 border border-white/5 rounded-lg p-6">
                <SimpleAudioPlayer
                  beat={beat}
                  isPlaying={isCurrentBeat && isPlaying}
                  onPlayPause={handlePlayPause}
                />
              </div>

              {/* Details */}
              <div className="bg-black/60 border border-white/5 rounded-lg p-6 space-y-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Details</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">MP3 + WAV + Stems included</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Instant download after purchase</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">PDF license contract included</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">Commercial use allowed</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {beat.genre.map((g, i) => (
                    <Badge key={i} variant="primary" size="sm">{g}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Mood</h3>
                <div className="flex flex-wrap gap-2">
                  {beat.mood.map((m, i) => (
                    <Badge key={i} variant="default" size="sm">{m}</Badge>
                  ))}
                </div>
              </div>

              {beat.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {beat.tags.map((t, i) => (
                      <Badge key={i} variant="default" size="sm">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - License Selection */}
            <div ref={rightColRef}>
              <div className="bg-black/80 border border-white/5 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-6">Choose License</h2>

                {/* License Radio Buttons */}
                <div className="space-y-3 mb-6">
                  {beat.licenses.map((license) => (
                    <button
                      key={license.type}
                      onClick={() => license.available && setSelectedLicense(license.type)}
                      disabled={!license.available}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedLicense === license.type
                          ? 'border-matrix-green bg-matrix-green/10'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      } ${!license.available && 'opacity-50 cursor-not-allowed'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedLicense === license.type
                              ? 'border-matrix-green'
                              : 'border-gray-500'
                          }`}>
                            {selectedLicense === license.type && (
                              <div className="w-3 h-3 rounded-full bg-matrix-green"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white capitalize">{license.type}</p>
                            <p className="text-xs text-gray-500">{getLicenseDescription(license.type)}</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-matrix-green">
                          {formatPriceRounded(license.price)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t border-white/5 pt-6 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{formatPrice(selectedLicenseData?.price || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xl">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-bold text-matrix-green">
                      {formatPrice(selectedLicenseData?.price || 0)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={!selectedLicenseData?.available}
                >
                  Add to Cart
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

