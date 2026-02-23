'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BeatForm } from '@/components/admin/BeatForm';

export default function NewBeatPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/beats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create beat');
      }

      const result = await response.json();
      alert('Beat créé avec succès !');
      router.push('/admin/beats');
    } catch (error: any) {
      console.error('Create beat error:', error);
      alert(error.message || 'Erreur lors de la création du beat');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Créer un nouveau beat</h1>
        <p className="text-gray-400">Remplissez tous les champs pour ajouter un beat à votre catalogue</p>
      </div>

      <BeatForm onSubmit={handleSubmit} />
    </div>
  );
}
