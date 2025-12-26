import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../hooks/useLibrary';
import { LibraryTile } from '../components/LibraryTile';
import { LibraryToolbar, SortOption, RatingMode } from '../components/LibraryToolbar';
import { getAvailableGenres } from '../lib/utils';
import type { MediaItem } from '../lib/types';

interface FilterChip {
  label: string;
  key: string;
  category: 'search' | 'status' | 'rating' | 'genre';
}

export default function LibraryMoviesPage() {
  const { itemsByType } = useLibrary();
  const navigate = useNavigate();
  const items = itemsByType.movie;

  // Filter & Sort State
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [ratingMode, setRatingMode] = useState<RatingMode>('any');
  const [minRating, setMinRating] = useState(3.0);
  const [genre, setGenre] = useState('all');
  const [sort, setSort] = useState<SortOption>('recently-added');

  // Get available genres
  const availableGenres = useMemo(() => getAvailableGenres(items), [items]);
  const hasGenreData = availableGenres.length > 0;

  // Build active filter chips
  const activeFilterChips = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = [];
    if (query.trim()) {
      chips.push({ label: `Search: "${query}"`, key: 'search', category: 'search' });
    }
    if (status !== 'all') {
      const statusLabel = status === 'wishlist' ? 'Planned' : status === 'in-progress' ? 'In Progress' : 'Completed';
      chips.push({ label: `Status: ${statusLabel}`, key: 'status', category: 'status' });
    }
    if (ratingMode !== 'any') {
      if (ratingMode === 'rated-only') {
        chips.push({ label: 'Rated Only', key: 'rating-rated', category: 'rating' });
      } else if (ratingMode === 'minimum') {
        chips.push({ label: `Min Rating: ${minRating.toFixed(1)}`, key: 'rating-min', category: 'rating' });
      }
    }
    if (genre !== 'all') {
      chips.push({ label: `Genre: ${genre}`, key: 'genre', category: 'genre' });
    }
    return chips;
  }, [query, status, ratingMode, minRating, genre]);

  // Filter & Sort
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (item) =>
          item.titleSnapshot.toLowerCase().includes(q) ||
          (item.creator ? item.creator.toLowerCase().includes(q) : false)
      );
    }

    // Status filter
    if (status !== 'all') {
      result = result.filter((item) => item.status === status);
    }

    // Rating filter
    if (ratingMode === 'rated-only') {
      result = result.filter((item) => item.yourRating !== null);
    } else if (ratingMode === 'minimum') {
      result = result.filter((item) => item.yourRating !== null && item.yourRating >= minRating);
    }

    // Genre filter
    if (genre !== 'all' && hasGenreData) {
      result = result.filter((item) => item.genreSnapshot && item.genreSnapshot.includes(genre));
    }

    // Sort
    if (sort === 'title') {
      result.sort((a, b) => a.titleSnapshot.localeCompare(b.titleSnapshot));
    } else if (sort === 'rating') {
      result.sort((a, b) => {
        const ratingA = a.yourRating ?? -1;
        const ratingB = b.yourRating ?? -1;
        return ratingB - ratingA;
      });
    } else if (sort === 'year') {
      result.sort((a, b) => (b.yearSnapshot || 0) - (a.yearSnapshot || 0));
    } else if (sort === 'status') {
      const statusOrder: Record<string, number> = { wishlist: 0, 'in-progress': 1, completed: 2 };
      result.sort((a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3));
    } else {
      // recently-added (default)
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [items, query, status, ratingMode, minRating, genre, hasGenreData, sort]);

  const handleClearAll = () => {
    setQuery('');
    setStatus('all');
    setRatingMode('any');
    setMinRating(3.0);
    setGenre('all');
    setSort('recently-added');
  };

  return (
    <section className="min-h-screen bg-zinc-50">
      <LibraryToolbar
        query={query}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        ratingMode={ratingMode}
        setRatingMode={setRatingMode}
        minRating={minRating}
        setMinRating={setMinRating}
        genre={genre}
        setGenre={setGenre}
        sort={sort}
        setSort={setSort}
        availableGenres={availableGenres}
        activeFilterChips={activeFilterChips}
        onClearAll={handleClearAll}
        hasGenreData={hasGenreData}
      />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">All Movies</h1>
            <p className="text-zinc-600">
              {filteredItems.length} of {items.length} saved
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-4">
            <p className="text-sm text-zinc-600">No movies in your library yet.</p>
            <button
              onClick={() => navigate('/movies')}
              className="inline-block px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition"
            >
              Browse and add movies
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-4">
            <p className="text-sm text-zinc-600">No movies match your filters.</p>
            <button
              onClick={handleClearAll}
              className="inline-block px-4 py-2 rounded-lg bg-zinc-200 text-zinc-900 text-sm font-medium hover:bg-zinc-300 transition"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredItems.map((item, idx) => (
              <LibraryTile key={item.id} item={item} index={idx} kind="movie" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
