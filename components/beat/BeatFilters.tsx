'use client';

import React, { useState } from 'react';
import { BeatFilters as BeatFiltersType } from '@/types';
import { Input, Button, Badge } from '@/components/ui';

interface BeatFiltersProps {
  onFilterChange: (filters: BeatFiltersType) => void;
  availableGenres?: string[];
  availableMoods?: string[];
}

const DEFAULT_GENRES = ['Trap', 'Drill', 'Afro', 'RnB', 'Pop', 'Boom Bap', 'Lo-Fi'];
const DEFAULT_MOODS = ['Dark', 'Energetic', 'Melodic', 'Chill', 'Aggressive', 'Emotional'];
const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const BeatFilters: React.FC<BeatFiltersProps> = ({
  onFilterChange,
  availableGenres = DEFAULT_GENRES,
  availableMoods = DEFAULT_MOODS,
}) => {
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | undefined>();
  const [bpmMin, setBpmMin] = useState<number | undefined>();
  const [bpmMax, setBpmMax] = useState<number | undefined>();

  const handleGenreToggle = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
    applyFilters({ genre: newGenres });
  };

  const handleMoodToggle = (mood: string) => {
    const newMoods = selectedMoods.includes(mood)
      ? selectedMoods.filter((m) => m !== mood)
      : [...selectedMoods, mood];
    setSelectedMoods(newMoods);
    applyFilters({ mood: newMoods });
  };

  const handleKeyChange = (key: string) => {
    const newKey = key === selectedKey ? undefined : key;
    setSelectedKey(newKey);
    applyFilters({ key: newKey });
  };

  const handleBpmChange = (min?: number, max?: number) => {
    setBpmMin(min);
    setBpmMax(max);
    applyFilters({ bpmMin: min, bpmMax: max });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    applyFilters({ search: value });
  };

  const applyFilters = (partialFilters: Partial<BeatFiltersType>) => {
    onFilterChange({
      search: partialFilters.search !== undefined ? partialFilters.search : search,
      genre: partialFilters.genre !== undefined ? partialFilters.genre : selectedGenres.length > 0 ? selectedGenres : undefined,
      mood: partialFilters.mood !== undefined ? partialFilters.mood : selectedMoods.length > 0 ? selectedMoods : undefined,
      key: partialFilters.key !== undefined ? partialFilters.key : selectedKey,
      bpmMin: partialFilters.bpmMin !== undefined ? partialFilters.bpmMin : bpmMin,
      bpmMax: partialFilters.bpmMax !== undefined ? partialFilters.bpmMax : bpmMax,
    });
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedGenres([]);
    setSelectedMoods([]);
    setSelectedKey(undefined);
    setBpmMin(undefined);
    setBpmMax(undefined);
    onFilterChange({});
  };

  return (
    <div className="space-y-6">
      <div>
        <Input
          placeholder="Rechercher un beat..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Genre</h3>
        <div className="flex flex-wrap gap-2">
          {availableGenres.map((genre) => (
            <Badge
              key={genre}
              variant={selectedGenres.includes(genre) ? 'primary' : 'default'}
              className="cursor-pointer"
              onClick={() => handleGenreToggle(genre)}
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Mood</h3>
        <div className="flex flex-wrap gap-2">
          {availableMoods.map((mood) => (
            <Badge
              key={mood}
              variant={selectedMoods.includes(mood) ? 'primary' : 'default'}
              className="cursor-pointer"
              onClick={() => handleMoodToggle(mood)}
            >
              {mood}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Tonalité</h3>
        <div className="grid grid-cols-6 gap-2">
          {KEYS.map((key) => (
            <Button
              key={key}
              size="sm"
              variant={selectedKey === key ? 'primary' : 'secondary'}
              onClick={() => handleKeyChange(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">BPM</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Min"
            value={bpmMin || ''}
            onChange={(e) => handleBpmChange(e.target.value ? parseInt(e.target.value) : undefined, bpmMax)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={bpmMax || ''}
            onChange={(e) => handleBpmChange(bpmMin, e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
      </div>

      <Button variant="ghost" fullWidth onClick={resetFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  );
};
