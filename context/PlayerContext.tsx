'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { IBeat } from '@/types';

interface PlayerContextType {
  currentBeat: IBeat | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: IBeat[];
  play: (beat: IBeat) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (beat: IBeat) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentBeat, setCurrentBeat] = useState<IBeat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueue] = useState<IBeat[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (beat: IBeat) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setCurrentBeat(beat);
    setIsPlaying(true);

    // Create new audio element
    const audio = new Audio(beat.previewUrl);
    audio.volume = volume;
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      playNext();
    });

    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    });
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current && currentBeat) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentBeat(null);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  const addToQueue = (beat: IBeat) => {
    setQueue((prev) => [...prev, beat]);
  };

  const playNext = () => {
    if (queue.length > 0 && currentBeat) {
      const currentIndex = queue.findIndex((b) => b._id === currentBeat._id);
      if (currentIndex >= 0 && currentIndex < queue.length - 1) {
        play(queue[currentIndex + 1]);
      }
    }
  };

  const playPrevious = () => {
    if (queue.length > 0 && currentBeat) {
      const currentIndex = queue.findIndex((b) => b._id === currentBeat._id);
      if (currentIndex > 0) {
        play(queue[currentIndex - 1]);
      }
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentBeat,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        play,
        pause,
        resume,
        stop,
        seek,
        setVolume,
        addToQueue,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
