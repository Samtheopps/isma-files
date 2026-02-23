'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BeatForm } from '@/components/admin/BeatForm';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { IBeat } from '@/types';

export default function EditBeatPage() {
  const router = useRouter();
  const params = useParams();
  const [beat, setBeat] = useState<IBeat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBeat();
  }, [params.id]);

  const fetchBeat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/beats/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch beat');
      }

      const data = await response.json();
      setBeat(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/beats/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update beat');
      }

      const result = await response.json();
      alert('Beat mis à jour avec succès !');
      router.push('/admin/beats');
    } catch (error: any) {
      console.error('Update beat error:', error);
      alert(error.message || 'Erreur lors de la mise à jour du beat');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !beat) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error || 'Beat non trouvé'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Éditer le beat</h1>
          <p className="text-gray-400">Modifiez les informations de votre beat</p>
        </div>
        
        {/* Bouton d'accès à l'upload */}
        <Button
          variant="secondary"
          onClick={() => router.push(`/admin/beats/${params.id}/upload`)}
        >
          📁 Uploader les fichiers audio
        </Button>
      </div>

      <BeatForm initialData={beat} onSubmit={handleSubmit} isEdit />
    </div>
  );
}
