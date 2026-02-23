'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import gsap from 'gsap';

interface OrderData {
  order: {
    orderNumber: string;
    totalAmount: number;
    deliveryEmail: string;
    createdAt: string;
    downloadCount: number;
    maxDownloads: number;
    expiresAt: string;
    licenseContract: string;
  };
  items: {
    beatId: string;
    beatTitle: string;
    licenseType: string;
    price: number;
    coverImage: string;
    files: {
      mp3?: string;
      wav?: string;
      stems?: string;
    };
  }[];
}

export default function GuestDownloadPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrderData();
  }, [token]);

  useEffect(() => {
    if (orderData) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          containerRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        );
      });

      return () => ctx.revert();
    }
  }, [orderData]);

  const fetchOrderData = async () => {
    try {
      const response = await fetch(`/api/downloads/guest/${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement');
      }

      setOrderData(data);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      // Incrémenter le compteur
      await fetch(`/api/downloads/guest/${token}`, {
        method: 'POST',
      });

      // Ouvrir le lien de téléchargement
      window.open(url, '_blank');

      // Rafraîchir les données
      await fetchOrderData();
    } catch (err: any) {
      alert('Erreur lors du téléchargement');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-matrix-green/30 border-t-matrix-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
        <div className="max-w-2xl w-full">
          <div className="bg-black/80 border border-red-500/50 rounded-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Accès Impossible</h1>
            <p className="text-red-400 mb-6">{error}</p>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Raisons possibles :</p>
              <ul className="text-left text-gray-400 text-sm space-y-2 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Lien expiré (valable 30 jours)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Limite de téléchargements atteinte (3 max)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Lien invalide ou incorrect</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-sm text-gray-400 mb-4">
                Besoin d'aide ? Contactez le support avec votre numéro de commande.
              </p>
              <Button variant="secondary" onClick={() => router.push('/')}>
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) return null;

  const { order, items } = orderData;
  const remainingDownloads = order.maxDownloads - order.downloadCount;
  const expiresAt = new Date(order.expiresAt);
  const daysRemaining = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <main className="min-h-screen pt-16 pb-32 px-4">
      <div ref={containerRef} className="max-w-5xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-matrix-green/20 border-2 border-matrix-green/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-matrix-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Vos Téléchargements</h1>
              <p className="text-gray-400 text-sm">Commande : {order.orderNumber}</p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3">
            <div className={`px-4 py-2 rounded-lg border ${remainingDownloads > 0 ? 'bg-matrix-green/10 border-matrix-green/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <p className={`text-sm font-semibold ${remainingDownloads > 0 ? 'text-matrix-green' : 'text-red-400'}`}>
                {remainingDownloads} téléchargement{remainingDownloads > 1 ? 's' : ''} restant{remainingDownloads > 1 ? 's' : ''}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${daysRemaining > 7 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
              <p className={`text-sm font-semibold ${daysRemaining > 7 ? 'text-blue-400' : 'text-orange-400'}`}>
                Expire dans {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Warning if low downloads or expiring soon */}
        {(remainingDownloads <= 1 || daysRemaining <= 7) && (
          <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-orange-400 font-semibold text-sm mb-1">⚠️ Attention</p>
                <p className="text-orange-300 text-sm">
                  Vos accès arrivent bientôt à expiration. Créez un compte pour conserver un accès permanent à vos achats.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Create Account CTA */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">💡 Créez un compte pour un accès illimité</h3>
              <p className="text-gray-300 text-sm mb-4">
                Sauvegardez vos achats de manière permanente, téléchargez quand vous voulez, et profitez d'avantages exclusifs.
              </p>
              <Button variant="primary" onClick={() => router.push('/auth/register')}>
                Créer mon compte
              </Button>
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.beatId}
              className="bg-black/60 border border-white/5 rounded-lg p-6 hover:border-matrix-green/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={item.coverImage}
                  alt={item.beatTitle}
                  className="w-20 h-20 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{item.beatTitle}</h3>
                  <p className="text-gray-400 text-sm capitalize">{item.licenseType} License</p>
                  <p className="text-gray-500 text-sm">{item.price}€</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {item.files.mp3 && (
                  <button
                    onClick={() => handleDownload(item.files.mp3!, `${item.beatTitle}.mp3`)}
                    disabled={remainingDownloads === 0}
                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">MP3</span>
                  </button>
                )}
                {item.files.wav && (
                  <button
                    onClick={() => handleDownload(item.files.wav!, `${item.beatTitle}.wav`)}
                    disabled={remainingDownloads === 0}
                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">WAV</span>
                  </button>
                )}
                {item.files.stems && (
                  <button
                    onClick={() => handleDownload(item.files.stems!, `${item.beatTitle}_stems.zip`)}
                    disabled={remainingDownloads === 0}
                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">STEMS</span>
                  </button>
                )}
                {order.licenseContract && (
                  <button
                    onClick={() => handleDownload(order.licenseContract, `license_${order.orderNumber}.pdf`)}
                    disabled={remainingDownloads === 0}
                    className="flex items-center justify-center gap-2 bg-matrix-green/10 hover:bg-matrix-green/20 border border-matrix-green/30 rounded-lg px-4 py-3 text-matrix-green transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">LICENSE</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Support */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-gray-400">
            Questions ou problème ?{' '}
            <a href="mailto:support@ismafiles.com" className="text-matrix-green hover:text-matrix-green/80 transition-colors">
              support@ismafiles.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
