import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, placeholder = 'Search...', isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-12 pr-24 py-3 rounded-full border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 focus:border-zinc-300 disabled:bg-zinc-50 disabled:text-zinc-400 transition"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-600">Enter</kbd>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}
