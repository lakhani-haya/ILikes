import React from 'react';
import { SearchResult } from '../lib/types';
import { getImageUrl } from '../lib/utils';

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  isLoading?: boolean;
  error?: string;
  addedIds?: Set<string>;
  ratingById?: Map<string, number | null>;
}

export function SearchResults({ results, onSelect, isLoading = false, error, addedIds = new Set(), ratingById = new Map() }: SearchResultsProps) {
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-1">Search for content</h3>
          <p className="text-sm text-zinc-500">Try searching for Toy Story, Interstellar, or your favorite titles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {results.map(result => {
        const isAdded = addedIds.has(result.externalId);
        const rating = ratingById.get(result.externalId) ?? null;
        return (
          <button
            key={result.id}
            onClick={() => onSelect(result)}
            className="group relative text-left rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
          >
            <div className="relative aspect-[2/3] bg-zinc-100 overflow-hidden">
              <img
                src={getImageUrl(result.image)}
                alt={result.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Gradient overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              {/* Hover pill */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {!isAdded && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur text-zinc-900 text-xs font-semibold rounded-full shadow-lg">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                  </span>
                )}
                {isAdded && rating !== null && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-900/90 text-white text-xs font-semibold rounded-full shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.01 3.104a1 1 0 00.95.69h3.263c.969 0 1.371 1.24.588 1.81l-2.64 1.918a1 1 0 00-.364 1.118l1.01 3.104c.3.921-.755 1.688-1.54 1.118l-2.64-1.918a1 1 0 00-1.176 0l-2.64 1.918c-.784.57-1.838-.197-1.539-1.118l1.01-3.104a1 1 0 00-.364-1.118L2.24 8.531c-.783-.57-.38-1.81.588-1.81h3.263a1 1 0 00.95-.69l1.008-3.104z" />
                    </svg>
                    {rating.toFixed(1)}
                  </span>
                )}
                {isAdded && rating === null && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur text-zinc-800 text-xs font-semibold rounded-full shadow-lg">
                    Not rated
                  </span>
                )}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm line-clamp-2 text-zinc-900 leading-snug">{result.title}</h3>
              <p className="text-xs text-zinc-500 mt-1.5">{result.year}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
