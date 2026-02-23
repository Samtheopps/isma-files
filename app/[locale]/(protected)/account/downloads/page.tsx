'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/navigation';
import Image from 'next/image';
import { IDownload } from '@/types';
import { Card, Badge, Loader, Button } from '@/components/ui';
import { useTranslations, useFormatter } from 'next-intl';

export default function DownloadsPage() {
  const router = useRouter();
  const t = useTranslations('account.downloads');
  const format = useFormatter();
  const [downloads, setDownloads] = useState<IDownload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/downloads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDownloads(data.downloads || []);
      }
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (downloadId: string, fileType: 'mp3' | 'wav' | 'stems' | 'contract') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/downloads/${downloadId}/${fileType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Forcer le téléchargement avec Cloudinary en ajoutant fl_attachment
        let downloadUrl = data.url;
        if (downloadUrl.includes('cloudinary.com') && downloadUrl.includes('/upload/')) {
          downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
        }
        
        // Utiliser un lien temporaire au lieu de window.open pour éviter le popup blocker
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const error = await response.json();
        alert(error.error || t('errors.download'));
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert(t('errors.download'));
    }
  };

  const isExpired = (expiresAt: Date) => {
    return new Date(expiresAt) < new Date();
  };

  const canDownload = (download: IDownload) => {
    return !isExpired(download.expiresAt);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text={t('loading')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back')}
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
            <p className="text-gray-400">{t('subtitle')}</p>
          </div>
        </div>

        {downloads.length === 0 ? (
          <Card className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">{t('empty')}</h2>
            <p className="text-gray-400 mb-6">{t('emptyDescription')}</p>
            <Button variant="primary" onClick={() => router.push('/beats')}>
              {t('browseBelts')}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {downloads.map((download) => {
              const expired = isExpired(download.expiresAt);
              const downloadable = canDownload(download);

              return (
                <Card key={download._id}>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Beat Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-4">
                        <Badge variant="primary" className="capitalize">
                          {download.licenseType}
                        </Badge>
                        {expired && <Badge variant="danger">{t('status.expired')}</Badge>}
                      </div>

                      <div className="space-y-2 text-sm text-gray-400">
                        <p>
                          <span className="text-matrix-green font-semibold">{t('status.unlimited')}</span>
                        </p>
                        <p>
                          {t('status.expiresOn', {
                            date: format.dateTime(new Date(download.expiresAt), {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-400 mb-3">{t('files.title')}</h3>
                      
                      {download.files.mp3 && (
                        <Button
                          variant="secondary"
                          size="sm"
                          fullWidth
                          disabled={!downloadable}
                          onClick={() => handleDownload(download._id, 'mp3')}
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          {t('files.mp3')}
                        </Button>
                      )}

                      {download.files.wav && (
                        <Button
                          variant="secondary"
                          size="sm"
                          fullWidth
                          disabled={!downloadable}
                          onClick={() => handleDownload(download._id, 'wav')}
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          {t('files.wav')}
                        </Button>
                      )}

                      {download.files.stems && (
                        <Button
                          variant="secondary"
                          size="sm"
                          fullWidth
                          disabled={!downloadable}
                          onClick={() => handleDownload(download._id, 'stems')}
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          {t('files.stems')}
                        </Button>
                      )}

                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        disabled={!downloadable}
                        onClick={() => handleDownload(download._id, 'contract')}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        {t('files.contract')}
                      </Button>
                    </div>
                  </div>

                  {expired && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-sm text-red-400">
                      {t('expired.message')}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {downloads.length > 0 && (
          <Card className="mt-6">
            <h3 className="font-semibold text-white mb-2">{t('support.title')}</h3>
            <p className="text-sm text-gray-400 mb-4">
              {t('support.description')}
            </p>
            <Button variant="secondary" size="sm">
              {t('support.button')}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
