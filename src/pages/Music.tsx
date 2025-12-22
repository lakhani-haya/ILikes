import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { searchMusic, getFeaturedMusic } from '../providers/musicItunes';
import { SearchResult } from '../lib/types';
import { useLibrary } from '../hooks/useLibrary';

export default function MusicPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const [featured, setFeatured] = useState<SearchResult[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  const { items } = useLibrary();
  const navigate = useNavigate();

  const addedIds = useMemo(() => new Set(items.filter(item => item.type === 'music').map(item => item.externalId)), [items]);
  const ratingById = useMemo(() => {
    const map = new Map<string, number | null>();
    items
      .filter(item => item.type === 'music')
      .forEach(item => map.set(item.externalId, item.yourRating ?? null));
    return map;
  }, [items]);

  useEffect(() => {
    const loadFeatured = async () => {
      setFeaturedLoading(true);
      setFeaturedError(null);
      try {
        const data = await getFeaturedMusic();
        if (!data.length) {
          setFeaturedError('Unable to load featured music.');
        }
        setFeatured(data);
      } catch (err) {
        console.error(err);
        setFeaturedError('Unable to load featured music.');
      } finally {
        setFeaturedLoading(false);
      }
    };

    loadFeatured();
  }, []);

  const handleSearch = async (query: string) => {
    setMessage('');
    setError(null);
    setIsLoading(true);
    try {
      const data = await searchMusic(query);
      setResults(data);
      if (!data.length) setMessage('No results found');
    } catch (err) {
      console.error(err);
      setError('Unable to search music right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFeatured = (result: SearchResult) => {
    navigate(`/music/${result.externalId}`);
  };

  const handleSelectSearch = (result: SearchResult) => {
    navigate(`/music/${result.externalId}`);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Hero Card with Search */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-[40px] font-semibold tracking-tight text-zinc-900">Music</h1>
        <p className="text-zinc-600 mt-2 mb-6">Collect and rate tracks and albums.</p>
        <SearchBar onSearch={handleSearch} placeholder="Search music..." isLoading={isLoading} />
        {message && !error && <p className="mt-3 text-sm text-zinc-600">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Search Results</h2>
              <p className="text-sm text-zinc-500 mt-1">Click to view details</p>
            </div>
          </div>
          <SearchResults
            results={results}
            onSelect={handleSelectSearch}
            isLoading={isLoading}
            error={error || undefined}
            addedIds={addedIds}
            ratingById={ratingById}
          />
        </div>
      )}

      {/* Featured Music */}
      {featuredError && !featured.length && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-amber-700 text-sm">{featuredError}</p>
        </div>
      )}

      {featured.length > 0 && (
        <div>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Featured Albums</h2>
              <p className="text-sm text-zinc-500 mt-1">Handpicked albums and artists</p>
            </div>
            <button
              disabled
              className="px-4 py-1.5 text-sm font-medium text-zinc-400 bg-zinc-100 rounded-full cursor-not-allowed"
              title="Refresh featured (coming soon)"
            >
              Refresh
            </button>
          </div>
          <SearchResults
            results={featured}
            onSelect={handleSelectFeatured}
            isLoading={featuredLoading}
            error={undefined}
            addedIds={addedIds}
            ratingById={ratingById}
          />
        </div>
      )}
    </section>
  );
}
