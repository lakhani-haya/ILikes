import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  const { items } = useLibrary();
  const navigate = useNavigate();

  const addedIds = useMemo(() => new Set(items.filter(item => item.type === 'book').map(item => item.externalId)), [items]);
  const ratingById = useMemo(() => {
    const map = new Map<string, number | null>();
    items
      .filter(item => item.type === 'book')
      .forEach(item => map.set(item.externalId, item.yourRating ?? null));
    return map;
  }, [items]);

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
    navigate(`/books/${result.externalId}`);
  };

  const handleSelectSearch = (result: SearchResult) => {
    navigate(`/books/${result.externalId}`);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Hero Card with Search */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-[40px] font-semibold tracking-tight text-zinc-900">Books</h1>
        <p className="text-zinc-600 mt-2 mb-6">Explore and review your reads.</p>
        <SearchBar onSearch={handleSearch} placeholder="Search books..." isLoading={isLoading} />
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

      {/* Featured Books */}
      {featuredError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-amber-700 text-sm">{featuredError}</p>
        </div>
      )}

      {!featuredError && (
        <div>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Featured Books</h2>
              <p className="text-sm text-zinc-500 mt-1">Curated bestsellers and classics</p>
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
