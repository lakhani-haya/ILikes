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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 h-64 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {results.map(result => (
        <button
          key={result.id}
          onClick={() => onSelect(result)}
          className="text-left hover:opacity-80 transition"
        >
          <img
            src={getImageUrl(result.image)}
            alt={result.title}
            className="w-full h-64 object-cover rounded-lg mb-2"
          />
          <h3 className="font-semibold text-sm line-clamp-2">{result.title}</h3>
          <p className="text-xs text-gray-500">{result.year}</p>
        </button>
      ))}
    </div>
  );
}
