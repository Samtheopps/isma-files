'use client';

import React from 'react';
import { IBeat } from '@/types';
import { usePlayer } from '@/context/PlayerContext';

interface SimpleAudioPlayerProps {
  beat: IBeat;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export const SimpleAudioPlayer: React.FC<SimpleAudioPlayerProps> = ({
  beat,
  isPlaying = false,
  onPlayPause,
}) => {
  // Utiliser les données du PlayerContext
  const { currentTime, duration, volume, setVolume, seek } = usePlayer();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
        {/* Progress */}
        <div
          className="absolute inset-y-0 left-0 bg-matrix-green rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        
        {/* Seek bar */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={onPlayPause}
          className="w-12 h-12 bg-matrix-green hover:bg-matrix-green/90 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0"
        >
          {isPlaying ? (
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Time Display */}
        <div className="text-sm text-gray-300 font-mono flex-shrink-0">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1">
          <svg className="w-5 h-5 text-matrix-green flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 1px solid #e5e7eb;
        }
        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
};
