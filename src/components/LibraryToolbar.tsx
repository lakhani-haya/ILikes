import React from 'react';
import { cn } from '../lib/utils';

export type SortOption = 'recently-added' | 'title' | 'rating' | 'year' | 'status';
export type RatingMode = 'any' | 'rated-only' | 'minimum';

interface FilterChip {
  label: string;
  key: string;
  category: 'search' | 'status' | 'rating' | 'genre';
}

interface LibraryToolbarProps {
  query: string;
  setQuery: (value: string) => void;
  status: string; // 'all' | 'wishlist' | 'in-progress' | 'completed'
  setStatus: (value: string) => void;
  ratingMode: RatingMode;
  setRatingMode: (value: RatingMode) => void;
  minRating: number;
  setMinRating: (value: number) => void;
  genre: string; // 'all' or specific genre
  setGenre: (value: string) => void;
  sort: SortOption;
  setSort: (value: SortOption) => void;
  availableGenres: string[];
  activeFilterChips: FilterChip[];
  onClearAll: () => void;
  hasGenreData: boolean;
}

export function LibraryToolbar({
  query,
  setQuery,
  status,
  setStatus,
  ratingMode,
  setRatingMode,
  minRating,
  setMinRating,
  genre,
  setGenre,
  sort,
  setSort,
  availableGenres,
  activeFilterChips,
  onClearAll,
  hasGenreData,
}: LibraryToolbarProps) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-6 py-4 space-y-4">
        {/* Main Toolbar Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search by title, creator..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>

          {/* Dropdowns and Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="wishlist">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Rating Filter */}
            <select
              value={ratingMode}
              onChange={(e) => setRatingMode(e.target.value as RatingMode)}
              className="px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            >
              <option value="any">Any Rating</option>
              <option value="rated-only">Rated Only</option>
              <option value="minimum">Min Rating</option>
            </select>

            {/* Minimum Rating Input (if selected) */}
            {ratingMode === 'minimum' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600">Min:</span>
                <input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value) || 0)}
                  className="w-12 px-2 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-center focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
            )}

            {/* Genre Filter (if available) */}
            {hasGenreData && availableGenres.length > 0 && (
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value="all">All Genres</option>
                {availableGenres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            >
              <option value="recently-added">Recently Added</option>
              <option value="title">Title (A–Z)</option>
              <option value="rating">Rating (High → Low)</option>
              <option value="year">Year (New → Old)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Active Filters Row */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-600 font-medium">Active filters:</span>
            {activeFilterChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => {
                  if (chip.category === 'search') setQuery('');
                  else if (chip.category === 'status') setStatus('all');
                  else if (chip.category === 'rating') {
                    setRatingMode('any');
                    setMinRating(0);
                  } else if (chip.category === 'genre') setGenre('all');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-700 hover:bg-zinc-200 transition"
              >
                {chip.label}
                <span className="ml-0.5 leading-none">×</span>
              </button>
            ))}
            <button
              onClick={onClearAll}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
