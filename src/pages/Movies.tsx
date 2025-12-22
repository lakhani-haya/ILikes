import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { searchMovies } from '../providers/moviesOmdb';
import { ApiMovie, SearchResult } from '../lib/types';
import { useLibrary } from '../hooks/useLibrary';

const BASE_URL = 'https://www.omdbapi.com/';

const FEATURED_IDS = [
  'tt0114709',
  'tt1375666',
  'tt0816692',
  'tt0468569',
  'tt0109830',
  'tt0110912',
  'tt0133093',
  'tt0120737',
  'tt6751668',
  'tt4154796',
];

export default function MoviesPage() {
  const [featured, setFeatured] = useState<SearchResult[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const { items } = useLibrary();
  const navigate = useNavigate();

  const addedIds = useMemo(() => new Set(items.filter(item => item.type === 'movie').map(item => item.externalId)), [items]);
  const ratingById = useMemo(() => {
    const map = new Map<string, number | null>();
    items
      .filter(item => item.type === 'movie')
      .forEach(item => map.set(item.externalId, item.yourRating ?? null));
    return map;
  }, [items]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
      setFeaturedError('OMDb API key is missing. Add a .env file in the project root (next to package.json) with VITE_OMDB_API_KEY=your_key and restart npm run dev so the env loads.');
      return;
    }

    let mounted = true;
    async function loadFeatured() {
      setFeaturedLoading(true);
      setFeaturedError(null);
      try {
        const responses = await Promise.allSettled(
          FEATURED_IDS.map(id =>
            axios.get(BASE_URL, {
              params: { i: id, apikey: apiKey },
            })
          )
        );

        const mapped: SearchResult[] = responses
          .flatMap(result => {
            if (result.status !== 'fulfilled') return [];
            const data = result.value.data as ApiMovie;
            if ((data as { Response?: string; Error?: string }).Response === 'False') {
              return [];
            }
            return [{
              id: data.imdbID,
              title: data.Title,
              year: data.Year,
              image: !data.Poster || data.Poster === 'N/A' ? '' : data.Poster,
              creator: 'Unknown',
              genres: [],
              description: '',
              provider: 'omdb',
              externalId: data.imdbID,
            }];
          });

        if (mounted) {
          if (!mapped.length) {
            setFeaturedError('Unable to load featured movies.');
          }
          setFeatured(mapped);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setFeaturedError('Unable to load featured movies.');
      } finally {
        if (mounted) setFeaturedLoading(false);
      }
    }

    loadFeatured();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = async (query: string) => {
    setMessage('');
    setError(null);
    setIsLoading(true);
    try {
      const data = await searchMovies(query);
      setResults(data);
      if (!data.length) setMessage('No results found');
    } catch (err) {
      console.error(err);
      setError('Unable to search movies right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFeatured = (result: SearchResult) => {
    navigate(`/movies/${result.externalId}`);
  };

  const handleSelectSearch = (result: SearchResult) => {
    navigate(`/movies/${result.externalId}`);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Hero Card with Search */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-[40px] font-semibold tracking-tight text-zinc-900">Movies</h1>
        <p className="text-zinc-600 mt-2 mb-6">Find and track your favorite films.</p>
        <SearchBar onSearch={handleSearch} placeholder="Search movies..." isLoading={isLoading} />
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

      {/* Featured Movies */}
      {featuredError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-red-700 text-sm">{featuredError}</p>
        </div>
      )}

      {!featuredError && (
        <div>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Featured Movies</h2>
              <p className="text-sm text-zinc-500 mt-1">Curated classics and favorites</p>
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
