import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SearchResults } from '../components/SearchResults';
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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addFromSearch } = useLibrary();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    console.log('API Key status:', apiKey ? 'present' : 'missing', 'Length:', apiKey?.length);
    console.log('All env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
      setError('OMDb API key is missing. Add a .env file in the project root (next to package.json) with VITE_OMDB_API_KEY=your_key and restart npm run dev so the env loads.');
      return;
    }

    let mounted = true;
    async function loadFeatured() {
      setIsLoading(true);
      setError(null);
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
            setError('Unable to load featured movies.');
          }
          setResults(mapped);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError('Unable to load featured movies.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadFeatured();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSelect = (result: SearchResult) => {
    addFromSearch('movie', result);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Featured Movies</h1>
        <p className="text-gray-600 mt-2">Hand-picked films loaded for you.</p>
      </header>

      <SearchResults results={results} onSelect={handleSelect} isLoading={isLoading} error={error || undefined} />
    </section>
  );
}
