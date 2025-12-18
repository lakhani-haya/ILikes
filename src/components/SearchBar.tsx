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
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 rounded-full border-zinc-200 bg-white px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 disabled:bg-zinc-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 px-5 py-2.5 font-medium disabled:bg-zinc-400 transition"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}
