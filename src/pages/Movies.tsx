import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

  const { addFromSearch } = useLibrary();

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
    addFromSearch('movie', result);
  };

  const handleSelectSearch = (result: SearchResult) => {
    addFromSearch('movie', result);
    setMessage('Added to your library');
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Movies</h1>
        <p className="text-gray-600 mt-2">Find and track your favorite films.</p>
      </header>

      {featuredError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-700 text-sm">{featuredError}</p>
        </div>
      )}

      {!featuredError && (
        <>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Featured Movies</h2>
          <div className="mb-8">
            <SearchResults results={featured} onSelect={handleSelectFeatured} isLoading={featuredLoading} error={undefined} />
          </div>
        </>
      )}

      <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8">Search</h2>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Search movies..." isLoading={isLoading} />
        {message && !error && <p className="mt-3 text-sm text-gray-700">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <SearchResults results={results} onSelect={handleSelectSearch} isLoading={isLoading} error={error || undefined} />
    </section>
  );
}
