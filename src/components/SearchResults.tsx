import React from 'react';
import { SearchResult } from '../lib/types';
import { getImageUrl } from '../lib/utils';

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  isLoading?: boolean;
  error?: string;
}

export function SearchResults({ results, onSelect, isLoading = false, error }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="aspect-[2/3] bg-zinc-200"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-zinc-200 rounded"></div>
              <div className="h-3 bg-zinc-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center border-2 border-dashed border-zinc-200 rounded-2xl p-8 max-w-sm">
          <p className="text-zinc-500">No results found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {results.map(result => (
        <button
          key={result.id}
          onClick={() => onSelect(result)}
          className="group text-left rounded-2xl border border-zinc-200 bg-white overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
        >
          <div className="aspect-[2/3] bg-zinc-100 overflow-hidden">
            <img
              src={getImageUrl(result.image)}
              alt={result.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 text-zinc-900">{result.title}</h3>
            <p className="text-xs text-zinc-500 mt-1">{result.year}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
