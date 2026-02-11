'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { IBeat, LicenseType } from '@/types';
import { WaveformPlayer } from '@/components/player/WaveformPlayer';
import { LicenseSelector } from '@/components/license/LicenseSelector';
import { LicenseModal } from '@/components/license/LicenseModal';
import { Badge, Button, Card, Loader } from '@/components/ui';
import { usePlayer } from '@/context/PlayerContext';
import { useCart } from '@/context/CartContext';

export default function BeatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { play, pause, currentBeat, isPlaying } = usePlayer();
  const { addToCart } = useCart();

  const [beat, setBeat] = useState<IBeat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>('basic');
  const [showLicenseModal, setShowLicenseModal] = useState(false);

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
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Chargement du beat..." />
      </div>
    );
  }

  if (!beat) {
    return null;
  }

  const isCurrentBeat = currentBeat?._id === beat._id;
  const selectedLicenseData = beat.licenses.find((l) => l.type === selectedLicense);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 font-mono text-matrix-green-glow hover:text-matrix-green transition-colors hover-flicker"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          &lt; RETOUR_
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Beat Info */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card variant="terminal" padding="none" className="overflow-hidden dither">
              <div className="relative aspect-square">
                <Image
                  src={beat.coverImage}
                  alt={beat.title}
                  fill
                  className="object-cover dither"
                  priority
                />
              </div>
            </Card>

            {/* Beat Details */}
            <Card variant="terminal">
              <h1 className="text-3xl font-mono uppercase tracking-wider text-matrix-green-light mb-4 glow-green">{beat.title}</h1>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-mono text-matrix-green-dim mb-1">&gt; BPM</p>
                  <p className="text-lg font-mono font-semibold text-matrix-green glow-green">{beat.bpm}</p>
                </div>
                <div>
                  <p className="text-sm font-mono text-matrix-green-dim mb-1">&gt; KEY</p>
                  <p className="text-lg font-mono font-semibold text-matrix-green glow-green">{beat.key}</p>
                </div>
                <div>
                  <p className="text-sm font-mono text-matrix-green-dim mb-1">&gt; PLAYS</p>
                  <p className="text-lg font-mono font-semibold text-matrix-green glow-green">{beat.playCount}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-mono text-matrix-green-dim mb-2">// GENRES</p>
                  <div className="flex flex-wrap gap-2">
                    {beat.genre.map((g, i) => (
                      <Badge key={i} variant="primary">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-mono text-matrix-green-dim mb-2">// MOOD</p>
                  <div className="flex flex-wrap gap-2">
                    {beat.mood.map((m, i) => (
                      <Badge key={i} variant="default">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>

                {beat.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-mono text-matrix-green-dim mb-2">// TAGS</p>
                    <div className="flex flex-wrap gap-2">
                      {beat.tags.map((t, i) => (
                        <Badge key={i} variant="default" size="sm">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Player */}
            <Card variant="terminal">
              <h2 className="text-lg font-mono uppercase tracking-wider text-matrix-green-light mb-4 glow-green">&gt; AUDIO PREVIEW</h2>
              <WaveformPlayer
                beat={beat}
                isPlaying={isCurrentBeat && isPlaying}
                onPlayPause={handlePlayPause}
              />
            </Card>
          </div>

          {/* Right Column - Licenses */}
          <div className="space-y-6">
            <Card variant="terminal">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-mono uppercase tracking-wider text-matrix-green-light glow-green">&gt; CHOOSE LICENSE</h2>
                <button
                  onClick={() => setShowLicenseModal(true)}
                  className="text-sm font-mono text-matrix-green hover:text-matrix-green-light transition-colors hover-flicker"
                >
                  [DETAILS]
                </button>
              </div>

              <LicenseSelector
                licenses={beat.licenses}
                selectedLicense={selectedLicense}
                onSelect={setSelectedLicense}
              />
            </Card>

            {/* Purchase Summary */}
            <Card variant="terminal" className="sticky top-8">
              <h3 className="text-lg font-mono uppercase tracking-wider text-matrix-green-light mb-4 glow-green">// SUMMARY</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="font-mono text-matrix-green-dim">Beat</span>
                  <span className="font-mono text-matrix-green font-medium">{beat.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-matrix-green-dim">Licence</span>
                  <span className="font-mono text-matrix-green font-medium capitalize">{selectedLicense}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-dark-border">
                  <span className="text-lg font-mono font-semibold text-matrix-green-light glow-green">Total</span>
                  <span className="text-2xl font-mono font-bold text-matrix-green glow-green-strong">
                    {((selectedLicenseData?.price || 0) / 100).toFixed(2)}€
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={!selectedLicenseData?.available}
              >
                AJOUTER AU PANIER_
              </Button>

              <p className="text-xs font-mono text-matrix-green-dim text-center mt-4">
                // PAIEMENT SÉCURISÉ VIA STRIPE
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* License Modal */}
      <LicenseModal
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        licenses={beat.licenses}
      />
    </div>
  );
}
