'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { IBeat, LicenseType } from '@/types';

const beatSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  bpm: z.number().min(60).max(200),
  key: z.string().min(1, 'La clé est requise'),
  genre: z.array(z.string()).min(1, 'Au moins un genre requis'),
  mood: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type BeatFormData = z.infer<typeof beatSchema>;

interface BeatFormProps {
  initialData?: Partial<IBeat>;
  onSubmit: (data: any) => Promise<void>;
  isEdit?: boolean;
}

export const BeatForm: React.FC<BeatFormProps> = ({ initialData, onSubmit, isEdit = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    preview: false,
    mp3: false,
    wav: false,
    stems: false,
    cover: false,
  });

  const [files, setFiles] = useState({
    preview: initialData?.previewUrl || '',
    mp3: initialData?.files?.mp3 || '',
    wav: initialData?.files?.wav || '',
    stems: initialData?.files?.stems || '',
    cover: initialData?.coverImage || '',
  });

  const [licenses, setLicenses] = useState(
    initialData?.licenses || [
      {
        type: 'basic' as LicenseType,
        price: 2900,
        available: true,
        features: {
          mp3: true,
          wav: false,
          stems: false,
          streams: 10000,
          physicalSales: 500,
          exclusivity: false,
        },
      },
      {
        type: 'standard' as LicenseType,
        price: 4900,
        available: true,
        features: {
          mp3: true,
          wav: true,
          stems: false,
          streams: 50000,
          physicalSales: 2000,
          exclusivity: false,
        },
      },
      {
        type: 'pro' as LicenseType,
        price: 9900,
        available: true,
        features: {
          mp3: true,
          wav: true,
          stems: true,
          streams: -1,
          physicalSales: -1,
          exclusivity: false,
        },
      },
    ]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BeatFormData>({
    resolver: zodResolver(beatSchema),
    defaultValues: {
      title: initialData?.title || '',
      bpm: initialData?.bpm || 140,
      key: initialData?.key || 'C',
      genre: initialData?.genre || [],
      mood: initialData?.mood || [],
      tags: initialData?.tags || [],
    },
  });

  const handleFileUpload = async (
    file: File,
    type: 'preview' | 'mp3' | 'wav' | 'stems' | 'cover'
  ) => {
    setUploadProgress((prev) => ({ ...prev, [type]: true }));

    try {
      // Convertir le file en base64
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      setFiles((prev) => ({ ...prev, [type]: base64 }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload du fichier');
    } finally {
      setUploadProgress((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleLicenseChange = (index: number, field: string, value: any) => {
    setLicenses((prev) => {
      const newLicenses = [...prev];
      if (field === 'price') {
        const priceValue = parseFloat(value);
        newLicenses[index] = { 
          ...newLicenses[index], 
          price: isNaN(priceValue) ? 0 : Math.round(priceValue * 100)
        };
      } else if (field.startsWith('features.')) {
        const featureKey = field.split('.')[1];
        const numValue = parseInt(value);
        newLicenses[index] = {
          ...newLicenses[index],
          features: {
            ...newLicenses[index].features,
            [featureKey]: typeof value === 'boolean' ? value : (isNaN(numValue) ? 0 : numValue),
          },
        };
      } else {
        newLicenses[index] = { ...newLicenses[index], [field]: value };
      }
      return newLicenses;
    });
  };

  const onFormSubmit = async (data: BeatFormData) => {
    // Vérifier les fichiers manquants
    const missingFiles = [];
    if (!files.preview) missingFiles.push('Preview MP3');
    if (!files.mp3) missingFiles.push('MP3 complet');
    if (!files.wav) missingFiles.push('WAV');
    if (!files.stems) missingFiles.push('Stems (ZIP)');
    if (!files.cover) missingFiles.push('Image de couverture');

    if (missingFiles.length > 0) {
      alert(`Fichiers manquants :\n• ${missingFiles.join('\n• ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...data,
        previewUrl: files.preview,
        coverImage: files.cover,
        files: {
          mp3: files.mp3,
          wav: files.wav,
          stems: files.stems,
        },
        licenses,
        waveformData: { peaks: [], duration: 0 }, // À générer côté serveur
      });
    } catch (error) {
      console.error('Form submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const genreOptions = ['Trap', 'Drill', 'Afro', 'Boom Bap', 'R&B', 'Pop', 'Rap', 'Hip-Hop'];
  const moodOptions = ['Dark', 'Energetic', 'Chill', 'Aggressive', 'Melodic', 'Sad'];
  const keyOptions = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
    'Cm',
    'C#m',
    'Dm',
    'D#m',
    'Em',
    'Fm',
    'F#m',
    'Gm',
    'G#m',
    'Am',
    'A#m',
    'Bm',
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pb-32">
      {/* Progress indicator */}
      <Card>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Progression du formulaire</h3>
            <span className="text-sm text-matrix-green">
              {[files.preview, files.mp3, files.wav, files.stems, files.cover].filter(Boolean).length}/5 fichiers
            </span>
          </div>
          <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-matrix-green transition-all duration-300"
              style={{
                width: `${([files.preview, files.mp3, files.wav, files.stems, files.cover].filter(Boolean).length / 5) * 100}%`
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {watch('title') ? '✓' : '○'} Titre • 
            {(watch('genre')?.length || 0) > 0 ? ' ✓' : ' ○'} Genres • 
            {files.preview && files.mp3 && files.wav && files.stems && files.cover ? ' ✓' : ' ○'} Fichiers
          </p>
        </div>
      </Card>

      {/* Informations de base */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">Informations de base</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Titre du beat *
            </label>
            <Input {...register('title')} placeholder="Ex: Dark Trap Beat" />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">BPM *</label>
            <Input
              type="number"
              {...register('bpm', { valueAsNumber: true })}
              min={60}
              max={200}
            />
            {errors.bpm && <p className="text-red-400 text-sm mt-1">{errors.bpm.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Clé *</label>
            <select
              {...register('key')}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {keyOptions.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Genres, Moods, Tags */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">Genres et Ambiance</h2>
        
        <div className="space-y-6">
          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Genres * (au moins 1 requis)
            </label>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map((genre) => {
                const isSelected = watch('genre')?.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => {
                      const current = watch('genre') || [];
                      if (isSelected) {
                        setValue('genre', current.filter(g => g !== genre));
                      } else {
                        setValue('genre', [...current, genre]);
                      }
                    }}
                    className={clsx(
                      'px-4 py-2 rounded-lg border transition-all',
                      isSelected
                        ? 'bg-matrix-green/20 border-matrix-green text-matrix-green'
                        : 'bg-dark-bg border-dark-border text-gray-400 hover:border-gray-600'
                    )}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
            {errors.genre && <p className="text-red-400 text-sm mt-2">{errors.genre.message}</p>}
          </div>

          {/* Moods */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Ambiance (optionnel)
            </label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((mood) => {
                const isSelected = watch('mood')?.includes(mood);
                return (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => {
                      const current = watch('mood') || [];
                      if (isSelected) {
                        setValue('mood', current.filter(m => m !== mood));
                      } else {
                        setValue('mood', [...current, mood]);
                      }
                    }}
                    className={clsx(
                      'px-4 py-2 rounded-lg border transition-all',
                      isSelected
                        ? 'bg-matrix-green/20 border-matrix-green text-matrix-green'
                        : 'bg-dark-bg border-dark-border text-gray-400 hover:border-gray-600'
                    )}
                  >
                    {mood}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Tags (optionnel, séparés par des virgules)
            </label>
            <Input
              placeholder="Ex: dark, trap, 808, piano"
              onChange={(e) => {
                const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                setValue('tags', tags);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Upload fichiers */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">Fichiers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Preview MP3 (30-60s) *
            </label>
            <input
              type="file"
              accept="audio/mp3,audio/mpeg"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'preview')}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white"
            />
            {files.preview && <p className="text-green-400 text-sm mt-1">✓ Fichier uploadé</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Fichier MP3 complet *
            </label>
            <input
              type="file"
              accept="audio/mp3,audio/mpeg"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'mp3')}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white"
            />
            {files.mp3 && <p className="text-green-400 text-sm mt-1">✓ Fichier uploadé</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Fichier WAV *</label>
            <input
              type="file"
              accept="audio/wav,audio/x-wav"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'wav')}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white"
            />
            {files.wav && <p className="text-green-400 text-sm mt-1">✓ Fichier uploadé</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Stems (ZIP) *</label>
            <input
              type="file"
              accept=".zip,application/zip"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'stems')}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white"
            />
            {files.stems && <p className="text-green-400 text-sm mt-1">✓ Fichier uploadé</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Image de couverture *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cover')}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white"
            />
            {files.cover && (
              <img src={files.cover} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded" />
            )}
          </div>
        </div>
      </Card>

      {/* Licences */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">Configuration des licences</h2>
        
        <div className="space-y-6">
          {licenses.map((license, index) => (
            <div key={index} className="p-4 bg-dark-bg rounded-lg border border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white capitalize">{license.type}</h3>
                <label className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Disponible</span>
                  <input
                    type="checkbox"
                    checked={license.available}
                    onChange={(e) => handleLicenseChange(index, 'available', e.target.checked)}
                    className="rounded bg-dark-card border-dark-border text-primary focus:ring-primary"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Prix (€)</label>
                  <Input
                    type="number"
                    value={isNaN(license.price / 100) ? 0 : license.price / 100}
                    onChange={(e) => handleLicenseChange(index, 'price', e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Streams (-1 = illimité)</label>
                  <Input
                    type="number"
                    value={isNaN(license.features.streams) ? 0 : license.features.streams}
                    onChange={(e) =>
                      handleLicenseChange(index, 'features.streams', e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={license.features.mp3}
                    onChange={(e) =>
                      handleLicenseChange(index, 'features.mp3', e.target.checked)
                    }
                    className="rounded bg-dark-card border-dark-border text-primary"
                  />
                  <span className="text-sm text-gray-400">MP3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={license.features.wav}
                    onChange={(e) =>
                      handleLicenseChange(index, 'features.wav', e.target.checked)
                    }
                    className="rounded bg-dark-card border-dark-border text-primary"
                  />
                  <span className="text-sm text-gray-400">WAV</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-end space-x-4 relative z-50">
        <Button type="button" variant="ghost" onClick={() => window.history.back()}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
          disabled={
            isSubmitting || 
            !files.preview || 
            !files.mp3 || 
            !files.wav || 
            !files.stems || 
            !files.cover ||
            !watch('title') ||
            (watch('genre')?.length || 0) === 0
          }
        >
          {isEdit ? 'Mettre à jour' : 'Créer le beat'}
        </Button>
      </div>
      {(!files.preview || !files.mp3 || !files.wav || !files.stems || !files.cover || !watch('title') || (watch('genre')?.length || 0) === 0) && (
        <div className="flex justify-end">
          <p className="text-sm text-gray-500">
            Complétez tous les champs requis pour activer le bouton
          </p>
        </div>
      )}
    </form>
  );
};
