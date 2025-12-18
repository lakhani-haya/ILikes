import React, { useEffect, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { searchBooks, getFeaturedBooksByIsbn } from '../providers/booksGoogle';
import { SearchResult } from '../lib/types';
import { useLibrary } from '../hooks/useLibrary';

const FEATURED_ISBNS = [
  '9780132350884',
  '9780201616224',
  '9780735211292',
  '9781455586691',
  '9780857197689',
  '9780062316097',
  '9780399590504',
  '9780061122415',
];

export default function BooksPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  
  const [featured, setFeatured] = useState<SearchResult[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  
  const { addFromSearch } = useLibrary();

  useEffect(() => {
    const loadFeatured = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
        setFeaturedError('Google Books API key is missing. Add VITE_GOOGLE_BOOKS_API_KEY to .env and restart npm run dev.');
        return;
      }

      setFeaturedLoading(true);
      setFeaturedError(null);
      try {
        const data = await getFeaturedBooksByIsbn(FEATURED_ISBNS);
        setFeatured(data);
      } catch (err) {
        console.error(err);
        setFeaturedError('Unable to load featured books.');
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
      const data = await searchBooks(query);
      setResults(data);
      if (!data.length) setMessage('No results found');
    } catch (err) {
      console.error(err);
      setError('Unable to search books right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFeatured = (result: SearchResult) => {
    addFromSearch('book', result);
  };

  const handleSelectSearch = (result: SearchResult) => {
    addFromSearch('book', result);
    setMessage('Added to your library');
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Books</h1>
        <p className="text-zinc-600 mt-2">Explore and review your reads.</p>
      </header>

      {featuredError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8">
          <p className="text-amber-700 text-sm">{featuredError}</p>
        </div>
      )}

      {!featuredError && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 mb-5">Featured Books</h2>
          <SearchResults results={featured} onSelect={handleSelectFeatured} isLoading={featuredLoading} error={undefined} />
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 mb-5">Search</h2>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Search books..." isLoading={isLoading} />
          {message && !error && <p className="mt-3 text-sm text-zinc-600">{message}</p>}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
        <SearchResults results={results} onSelect={handleSelectSearch} isLoading={isLoading} error={error || undefined} />
      </div>
    </section>
  );
}
