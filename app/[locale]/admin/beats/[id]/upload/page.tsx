'use client';

import React, { useEffect, useState, useRef, DragEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { IBeat } from '@/types';
import { clsx } from 'clsx';
import gsap from 'gsap';

interface FileUploadState {
  file: File | null;
  fileName: string | null;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error: string | null;
  url: string | null;
}

export default function BeatUploadPage() {
  const router = useRouter();
  const params = useParams();
  const [beat, setBeat] = useState<IBeat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // États des uploads
  const [mp3State, setMp3State] = useState<FileUploadState>({
    file: null,
    fileName: null,
    progress: 0,
    status: 'idle',
    error: null,
    url: null,
  });

  const [wavState, setWavState] = useState<FileUploadState>({
    file: null,
    fileName: null,
    progress: 0,
    status: 'idle',
    error: null,
    url: null,
  });

  const [stemsState, setStemsState] = useState<FileUploadState>({
    file: null,
    fileName: null,
    progress: 0,
    status: 'idle',
    error: null,
    url: null,
  });

  // Refs pour les animations GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    fetchBeat();
  }, [params.id]);

  // Animation Matrix d'entrée
  useEffect(() => {
    if (!containerRef.current || isLoading) return;

    const ctx = gsap.context(() => {
      // Titre avec effet glitch
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Cards d'upload apparaissent en cascade
      gsap.from('.upload-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading]);

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

      // Pré-remplir les URLs existantes
      if (data.data.files.mp3 && !data.data.files.mp3.startsWith('cloudinary://')) {
        setMp3State((prev) => ({ ...prev, url: data.data.files.mp3 }));
      }
      if (data.data.files.wav && !data.data.files.wav.startsWith('cloudinary://')) {
        setWavState((prev) => ({ ...prev, url: data.data.files.wav }));
      }
      if (data.data.files.stems && !data.data.files.stems.startsWith('cloudinary://')) {
        setStemsState((prev) => ({ ...prev, url: data.data.files.stems }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du Drag & Drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    type: 'mp3' | 'wav' | 'stems',
    setState: React.Dispatch<React.SetStateAction<FileUploadState>>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      validateAndSetFile(file, type, setState);
    }
  };

  // Gestion de la sélection de fichier
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'mp3' | 'wav' | 'stems',
    setState: React.Dispatch<React.SetStateAction<FileUploadState>>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      validateAndSetFile(file, type, setState);
    }
  };

  // Validation et enregistrement du fichier
  const validateAndSetFile = (
    file: File,
    type: 'mp3' | 'wav' | 'stems',
    setState: React.Dispatch<React.SetStateAction<FileUploadState>>
  ) => {
    const validations: Record<string, { extensions: string[]; maxSize: number }> = {
      mp3: { extensions: ['.mp3'], maxSize: 50 * 1024 * 1024 },
      wav: { extensions: ['.wav'], maxSize: 200 * 1024 * 1024 },
      stems: { extensions: ['.zip'], maxSize: 500 * 1024 * 1024 },
    };

    const validation = validations[type];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validation.extensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExtension) {
      setState({
        file: null,
        fileName: null,
        progress: 0,
        status: 'error',
        error: `Extension invalide. Attendu: ${validation.extensions.join(', ')}`,
        url: null,
      });
      return;
    }

    if (file.size > validation.maxSize) {
      const maxSizeMB = validation.maxSize / (1024 * 1024);
      setState({
        file: null,
        fileName: null,
        progress: 0,
        status: 'error',
        error: `Fichier trop volumineux (max ${maxSizeMB}MB)`,
        url: null,
      });
      return;
    }

    setState({
      file,
      fileName: file.name,
      progress: 0,
      status: 'idle',
      error: null,
      url: null,
    });
  };

  // Upload de tous les fichiers
  const handleUploadAll = async () => {
    if (!mp3State.file && !wavState.file && !stemsState.file) {
      alert('Veuillez sélectionner au moins un fichier');
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      if (mp3State.file) formData.append('mp3', mp3State.file);
      if (wavState.file) formData.append('wav', wavState.file);
      if (stemsState.file) formData.append('stems', stemsState.file);

      // Simuler la progression (en réalité, XMLHttpRequest serait mieux pour le vrai suivi)
      const progressInterval = setInterval(() => {
        if (mp3State.file) {
          setMp3State((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90),
            status: 'uploading',
          }));
        }
        if (wavState.file) {
          setWavState((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90),
            status: 'uploading',
          }));
        }
        if (stemsState.file) {
          setStemsState((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90),
            status: 'uploading',
          }));
        }
      }, 300);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/beats/${params.id}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de l\'upload');
      }

      const result = await response.json();

      // Mettre à jour les états avec succès
      if (result.uploadedUrls.mp3) {
        setMp3State((prev) => ({
          ...prev,
          progress: 100,
          status: 'success',
          url: result.uploadedUrls.mp3,
        }));
      }
      if (result.uploadedUrls.wav) {
        setWavState((prev) => ({
          ...prev,
          progress: 100,
          status: 'success',
          url: result.uploadedUrls.wav,
        }));
      }
      if (result.uploadedUrls.stems) {
        setStemsState((prev) => ({
          ...prev,
          progress: 100,
          status: 'success',
          url: result.uploadedUrls.stems,
        }));
      }

      // Animation de succès
      gsap.to('.success-indicator', {
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      });

      setTimeout(() => {
        alert('Upload terminé avec succès !');
        router.push('/admin/beats');
      }, 1500);
    } catch (error: any) {
      console.error('Upload error:', error);
      if (mp3State.file) {
        setMp3State((prev) => ({ ...prev, status: 'error', error: error.message }));
      }
      if (wavState.file) {
        setWavState((prev) => ({ ...prev, status: 'error', error: error.message }));
      }
      if (stemsState.file) {
        setStemsState((prev) => ({ ...prev, status: 'error', error: error.message }));
      }
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Chargement..." />
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
    <div ref={containerRef} className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header Matrix-themed */}
      <div className="space-y-2">
        <h1
          ref={titleRef}
          className="text-4xl font-bold text-matrix-green font-clash tracking-tight text-glow"
        >
          Upload Fichiers Audio
        </h1>
        <p className="text-gray-400 text-lg">
          Beat: <span className="text-white font-semibold">{beat.title}</span>
        </p>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* MP3 Upload */}
        <UploadCard
          title="Fichier MP3"
          description="Format standard (max 50MB)"
          state={mp3State}
          setState={setMp3State}
          type="mp3"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
        />

        {/* WAV Upload */}
        <UploadCard
          title="Fichier WAV"
          description="Haute qualité non compressée (max 200MB)"
          state={wavState}
          setState={setWavState}
          type="wav"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
        />

        {/* Stems Upload */}
        <UploadCard
          title="Stems (ZIP)"
          description="Fichiers séparés des pistes (max 500MB)"
          state={stemsState}
          setState={setStemsState}
          type="stems"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-matrix-green/20">
        <Button variant="ghost" onClick={() => router.push('/admin/beats')} disabled={isSaving}>
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleUploadAll}
          isLoading={isSaving}
          disabled={!mp3State.file && !wavState.file && !stemsState.file}
          className="min-w-[180px]"
        >
          {isSaving ? 'Upload en cours...' : 'Uploader les fichiers'}
        </Button>
      </div>
    </div>
  );
}

// Composant UploadCard réutilisable
interface UploadCardProps {
  title: string;
  description: string;
  state: FileUploadState;
  setState: React.Dispatch<React.SetStateAction<FileUploadState>>;
  type: 'mp3' | 'wav' | 'stems';
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (
    e: DragEvent<HTMLDivElement>,
    type: 'mp3' | 'wav' | 'stems',
    setState: React.Dispatch<React.SetStateAction<FileUploadState>>
  ) => void;
  onFileSelect: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'mp3' | 'wav' | 'stems',
    setState: React.Dispatch<React.SetStateAction<FileUploadState>>
  ) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({
  title,
  description,
  state,
  setState,
  type,
  onDragOver,
  onDrop,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptTypes: Record<string, string> = {
    mp3: '.mp3',
    wav: '.wav',
    stems: '.zip',
  };

  return (
    <div
      className={clsx(
        'upload-card bg-dark-card border-2 rounded-xl p-6 transition-all duration-300',
        state.status === 'success' && 'border-matrix-green shadow-glow-strong success-indicator',
        state.status === 'error' && 'border-red-500/50',
        state.status === 'uploading' && 'border-matrix-green/50 animate-pulse',
        state.status === 'idle' && 'border-matrix-green/20 hover:border-matrix-green/40'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white font-clash">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        <StatusBadge status={state.status} />
      </div>

      {/* URL actuelle (si existe) */}
      {state.url && !state.file && (
        <div className="mb-4 p-3 bg-matrix-green/5 border border-matrix-green/20 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">URL actuelle:</p>
          <p className="text-sm text-matrix-green font-mono truncate">{state.url}</p>
        </div>
      )}

      {/* Zone de Drop */}
      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, type, setState)}
        onClick={() => fileInputRef.current?.click()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300',
          state.status === 'uploading' && 'pointer-events-none opacity-50',
          state.status === 'success' && 'border-matrix-green/40 bg-matrix-green/5',
          state.status === 'error' && 'border-red-500/40 bg-red-500/5',
          state.status === 'idle' && 'border-gray-600 hover:border-matrix-green/60 hover:bg-matrix-green/5'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes[type]}
          onChange={(e) => onFileSelect(e, type, setState)}
          className="hidden"
        />

        {state.fileName ? (
          <div className="space-y-2">
            <div className="text-matrix-green text-4xl">📁</div>
            <p className="text-white font-semibold">{state.fileName}</p>
            <p className="text-xs text-gray-500">Cliquez pour changer</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-500 text-4xl">⬆️</div>
            <p className="text-gray-400">
              Glissez-déposez ou <span className="text-matrix-green font-semibold">cliquez</span>
            </p>
            <p className="text-xs text-gray-500">{acceptTypes[type]}</p>
          </div>
        )}
      </div>

      {/* Barre de progression */}
      {state.status === 'uploading' && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Upload en cours...</span>
            <span className="text-matrix-green font-semibold">{state.progress}%</span>
          </div>
          <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-matrix-green to-matrix-green-light transition-all duration-300 ease-out"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {state.status === 'error' && state.error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{state.error}</p>
        </div>
      )}

      {/* Message de succès */}
      {state.status === 'success' && (
        <div className="mt-4 p-3 bg-matrix-green/10 border border-matrix-green/30 rounded-lg">
          <p className="text-sm text-matrix-green font-semibold">✓ Upload réussi</p>
        </div>
      )}
    </div>
  );
};

// Badge de statut
const StatusBadge: React.FC<{ status: FileUploadState['status'] }> = ({ status }) => {
  const styles: Record<string, string> = {
    idle: 'bg-gray-700 text-gray-300',
    uploading: 'bg-matrix-green/20 text-matrix-green animate-pulse',
    success: 'bg-matrix-green text-black',
    error: 'bg-red-500/20 text-red-400',
  };

  const labels: Record<string, string> = {
    idle: 'En attente',
    uploading: 'Upload...',
    success: 'Terminé',
    error: 'Erreur',
  };

  return (
    <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold', styles[status])}>
      {labels[status]}
    </span>
  );
};
