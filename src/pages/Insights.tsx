import React from 'react';
import { useLibrary } from '../hooks/useLibrary';
import { getCompletionRate, getStatsByType } from '../analytics';

export default function InsightsPage() {
  const { items } = useLibrary();
  const completion = getCompletionRate(items);
  const stats = getStatsByType(items);

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Insights</h1>
        <p className="text-zinc-600 mt-2">A quick snapshot of your library.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-zinc-500">Completion</p>
          <p className="mt-2 text-4xl font-bold text-zinc-900">{completion}%</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-zinc-500">Movies</p>
          <p className="mt-2 text-4xl font-bold text-zinc-900">{stats.movie.count}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-zinc-500">Books</p>
          <p className="mt-2 text-4xl font-bold text-zinc-900">{stats.book.count}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-zinc-500">Music</p>
          <p className="mt-2 text-4xl font-bold text-zinc-900">{stats.music.count}</p>
        </div>
      </div>
    </section>
  );
}
