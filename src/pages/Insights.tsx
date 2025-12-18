import React from 'react';
import { useLibrary } from '../hooks/useLibrary';
import { getCompletionRate, getStatsByType } from '../analytics';

export default function InsightsPage() {
  const { items } = useLibrary();
  const completion = getCompletionRate(items);
  const stats = getStatsByType(items);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
        <p className="text-gray-600 mt-2">A quick snapshot of your library.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Completion</p>
          <p className="mt-2 text-3xl font-semibold">{completion}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Movies</p>
          <p className="mt-2 text-3xl font-semibold">{stats.movie.count}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Books</p>
          <p className="mt-2 text-3xl font-semibold">{stats.book.count}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Music</p>
          <p className="mt-2 text-3xl font-semibold">{stats.music.count}</p>
        </div>
      </div>
    </section>
  );
}
