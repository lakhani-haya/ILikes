import React, { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { searchMovies } from '../providers/moviesOmdb';
import { SearchResult } from '../lib/types';
import { useLibrary } from '../hooks/useLibrary';

export default function MoviesPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const { addFromSearch } = useLibrary();

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

  const handleSelect = (result: SearchResult) => {
    addFromSearch('movie', result);
    setMessage('Added to your library');
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Movies</h1>
        <p className="text-gray-600 mt-2">Find and track your favorite films.</p>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Search movies..." isLoading={isLoading} />
        {message && !error && <p className="mt-3 text-sm text-gray-700">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <SearchResults results={results} onSelect={handleSelect} isLoading={isLoading} error={error || undefined} />
    </section>
  );
}
