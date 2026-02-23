'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IOrder, IDownload, LicenseType, IBeat } from '@/types';
import { Card, Badge, Loader, Button } from '@/components/ui';
import gsap from 'gsap';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/formatPrice';

// Type étendu pour les items enrichis avec beat info
interface EnrichedOrderItem {
  beatId: string;
  beatTitle: string;
  licenseType: LicenseType;
  price: number;
  beat?: {
    _id: string;
    title: string;
    coverImage: string;
    licenses: IBeat['licenses'];
  };
}

interface EnrichedOrder extends Omit<IOrder, 'items'> {
  items: EnrichedOrderItem[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<EnrichedOrder | null>(null);
  const [downloads, setDownloads] = useState<IDownload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animation au chargement
  useEffect(() => {
    if (!isLoading && order) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        gsap.fromTo(
          contentRef.current?.children || [],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [isLoading, order]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Récupérer la commande
      const orderResponse = await fetch(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (orderResponse.status === 404) {
        setError('Commande introuvable');
        return;
      }

      if (orderResponse.status === 403) {
        router.push('/account');
        return;
      }

      if (!orderResponse.ok) {
        throw new Error('Erreur lors de la récupération de la commande');
      }

      const orderData = await orderResponse.json();
      setOrder(orderData.order);

      // Récupérer les downloads associés
      const downloadsResponse = await fetch(`/api/downloads?orderId=${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (downloadsResponse.ok) {
        const downloadsData = await downloadsResponse.json();
        console.log('[ORDER DETAIL] Downloads reçus:', downloadsData.downloads);
        setDownloads(downloadsData.downloads || []);
      } else {
        console.error('[ORDER DETAIL] Erreur downloads:', await downloadsResponse.text());
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Impossible de charger les détails de la commande');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (downloadId: string, fileType: string) => {
    const downloadKey = `${downloadId}-${fileType}`;
    
    try {
      // 🚀 OPTIMISATION 1 : Feedback instantané (UI optimiste)
      // Afficher le loader seulement 50ms pour feedback tactile
      setDownloadingFile(downloadKey);
      
      // Timer pour retirer le loader automatiquement après 150ms
      const loaderTimeout = setTimeout(() => {
        setDownloadingFile(null);
      }, 150);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/downloads/${downloadId}/${fileType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        clearTimeout(loaderTimeout);
        setDownloadingFile(null);
        const error = await response.json();
        alert(error.error || 'Erreur lors du téléchargement');
        return;
      }

      // Récupérer l'URL du fichier
      const data = await response.json();
      
      if (!data.url) {
        clearTimeout(loaderTimeout);
        setDownloadingFile(null);
        alert('URL de téléchargement non disponible');
        return;
      }

      // 🚀 SOLUTION ANTI-POPUP-BLOCKER : Téléchargement via <a> temporaire
      // Bypass total des popup blockers (Chrome, Firefox, Safari)
      const link = document.createElement('a');
      link.href = data.url;
      link.download = ''; // Force le téléchargement au lieu d'ouvrir dans un onglet
      link.target = '_blank'; // Fallback si download ne fonctionne pas
      link.rel = 'noopener noreferrer'; // Sécurité
      
      // Ajouter au DOM (requis pour Firefox)
      document.body.appendChild(link);
      
      // Déclencher le téléchargement
      link.click();
      
      // Nettoyer le DOM immédiatement
      document.body.removeChild(link);

      // Le loader est déjà retiré par le timeout (retrait garanti)
      clearTimeout(loaderTimeout);
      setDownloadingFile(null);
      
      // Rafraîchir les downloads en arrière-plan (sans bloquer l'UI)
      setTimeout(() => fetchOrderDetails(), 500);
    } catch (err) {
      console.error('Download error:', err);
      alert('Erreur lors du téléchargement');
      setDownloadingFile(null);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
      refunded: 'default',
    };

    const labels: Record<string, string> = {
      completed: 'Complété',
      pending: 'En attente',
      failed: 'Échoué',
      refunded: 'Remboursé',
    };

    return (
      <Badge variant={variants[status] || 'default'} size="md">
        {labels[status] || status}
      </Badge>
    );
  };

  const getLicenseFeatures = (licenseType: LicenseType, beatLicenses?: IBeat['licenses']) => {
    if (!beatLicenses) {
      // Fallback par défaut
      return {
        mp3: true,
        wav: licenseType !== 'basic',
        stems: licenseType === 'pro' || licenseType === 'unlimited' || licenseType === 'exclusive',
      };
    }

    const license = beatLicenses.find((l) => l.type === licenseType);
    return license?.features || { mp3: true, wav: false, stems: false };
  };

  const isDownloadAvailable = (download: IDownload) => {
    const now = new Date();
    const expiresAt = new Date(download.expiresAt);
    const isExpired = now > expiresAt;
    
    // Limite de téléchargements désactivée
    // const limitReached = download.downloadCount >= download.maxDownloads;
    // return !isExpired && !limitReached;
    
    return !isExpired; // Seulement vérifier l'expiration
  };

  const getDownloadForItem = (itemBeatId: string) => {
    return downloads.find((d) => {
      // Gérer le cas où beatId est un objet (populated) ou un string
      const downloadBeatId = typeof d.beatId === 'object' && d.beatId !== null && '_id' in d.beatId
        ? (d.beatId as any)._id.toString()
        : d.beatId.toString();
      return downloadBeatId === itemBeatId;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader size="lg" text="Chargement de votre commande..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Card className="text-center max-w-md" padding="lg">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Commande introuvable</h2>
          <p className="text-gray-400 mb-6">{error || 'Cette commande n\'existe pas ou a été supprimée.'}</p>
          <Button variant="primary" onClick={() => router.push('/account')}>
            Retour au compte
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen pt-16 pb-32">
      {/* Header */}
      <div ref={headerRef} className="px-4 py-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/account')}
            className="mb-4 flex items-center gap-2 text-gray-400 hover:text-matrix-green transition-colors group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux commandes
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">
                {order.orderNumber}
              </h1>
              <p className="text-gray-400">Détails de votre commande</p>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="px-4 py-8">
        <div ref={contentRef} className="max-w-7xl mx-auto space-y-6">
          
          {/* Informations de la commande */}
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-white mb-6">Informations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm text-gray-400 uppercase tracking-wider block mb-2">Date d'achat</label>
                <p className="text-white font-medium">{formatDate(order.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 uppercase tracking-wider block mb-2">Montant total</label>
                <p className="text-matrix-green font-bold font-mono text-xl">{formatPrice(order.totalAmount)}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 uppercase tracking-wider block mb-2">Email de livraison</label>
                <p className="text-white font-medium break-all">{order.deliveryEmail}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 uppercase tracking-wider block mb-2">Stripe Payment ID</label>
                <p className="text-gray-500 font-mono text-xs break-all">{order.stripePaymentId}</p>
              </div>
            </div>
          </Card>

          {/* Beats achetés */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Beats achetés</h2>
            
            {order.items.map((item, index) => {
              const download = getDownloadForItem(item.beatId);
              console.log(`[ORDER DETAIL] Item ${item.beatTitle} (${item.beatId}):`, download ? 'Download trouvé' : 'PAS DE DOWNLOAD');
              const licenseFeatures = getLicenseFeatures(item.licenseType, item.beat?.licenses);
              const isAvailable = download ? isDownloadAvailable(download) : false;
              const isExpired = download ? new Date() > new Date(download.expiresAt) : false;
              // Limite désactivée - on ne check plus
              // const limitReached = download ? download.downloadCount >= download.maxDownloads : false;

              return (
                <Card key={index} variant="glass" padding="lg" hover>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image du beat */}
                    <div className="relative w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                      {item.beat?.coverImage ? (
                        <Image
                          src={item.beat.coverImage}
                          alt={item.beatTitle}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info du beat */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.beatTitle}</h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="primary" size="md">
                            {item.licenseType.toUpperCase()}
                          </Badge>
                          <span className="text-gray-400">•</span>
                          <span className="text-white font-semibold">{formatPrice(item.price)}</span>
                        </div>
                      </div>

                      {/* Statut des téléchargements */}
                      {!download ? (
                        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-sm">
                            <p className="text-yellow-400 font-semibold">Téléchargements en préparation</p>
                            <p className="text-yellow-300/80 mt-1">
                              Vos fichiers seront disponibles dans quelques instants. Actualisez la page si nécessaire.
                            </p>
                          </div>
                        </div>
                       ) : (
                        <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-white/10">
                          {/* Compteur supprimé - téléchargements illimités */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Valide jusqu'au</span>
                            <span className={`font-semibold ${isExpired ? 'text-red-400' : 'text-matrix-green'}`}>
                              {new Date(download.expiresAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Téléchargements</span>
                            <span className="font-semibold text-matrix-green">Illimités ✓</span>
                          </div>
                          
                          {isExpired && (
                            <div className="flex items-start gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <div className="text-sm">
                                <p className="text-red-400 font-semibold">Téléchargements expirés</p>
                                <p className="text-red-300/80 mt-1">
                                  Contactez le support pour obtenir de l'aide
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Boutons de téléchargement */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Fichiers disponibles</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {/* MP3 */}
                          {licenseFeatures.mp3 && (
                            <Button
                              variant={isAvailable ? 'secondary' : 'ghost'}
                              size="sm"
                              fullWidth
                              disabled={!download || !isAvailable || downloadingFile === `${download._id}-mp3`}
                              isLoading={downloadingFile === `${download?._id}-mp3`}
                              onClick={() => download && handleDownload(download._id, 'mp3')}
                              className="flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                              </svg>
                              MP3
                            </Button>
                          )}

                          {/* WAV */}
                          {licenseFeatures.wav && (
                            <Button
                              variant={isAvailable ? 'secondary' : 'ghost'}
                              size="sm"
                              fullWidth
                              disabled={!download || !isAvailable || downloadingFile === `${download._id}-wav`}
                              isLoading={downloadingFile === `${download?._id}-wav`}
                              onClick={() => download && handleDownload(download._id, 'wav')}
                              className="flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                              </svg>
                              WAV
                            </Button>
                          )}

                          {/* Stems */}
                          {licenseFeatures.stems && (
                            <Button
                              variant={isAvailable ? 'secondary' : 'ghost'}
                              size="sm"
                              fullWidth
                              disabled={!download || !isAvailable || downloadingFile === `${download._id}-stems`}
                              isLoading={downloadingFile === `${download?._id}-stems`}
                              onClick={() => download && handleDownload(download._id, 'stems')}
                              className="flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              STEMS
                            </Button>
                          )}

                          {/* Contract PDF (toujours disponible) */}
                          <Button
                            variant={isAvailable ? 'secondary' : 'ghost'}
                            size="sm"
                            fullWidth
                            disabled={!download || !isAvailable || downloadingFile === `${download._id}-contract`}
                            isLoading={downloadingFile === `${download?._id}-contract`}
                            onClick={() => download && handleDownload(download._id, 'contract')}
                            className="flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            CONTRAT
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Support */}
          <Card variant="glass" padding="lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Besoin d'aide ?</h3>
                <p className="text-gray-400 text-sm">
                  Contactez notre support si vous rencontrez des problèmes avec vos téléchargements.
                </p>
              </div>
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push('/contact')}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contacter le support
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
