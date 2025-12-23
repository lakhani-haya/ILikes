import React from 'react';
import { useLibrary } from '../hooks/useLibrary';
import { LibraryTile } from '../components/LibraryTile';

export default function LibraryMusicPage() {
  const { itemsByType } = useLibrary();
  const items = itemsByType.music;

  return (
    <section className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">All Music</h1>
          <p className="text-zinc-600">{items.length} saved</p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">No music in your library yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <LibraryTile key={item.id} item={item} index={idx} kind="music" />
          ))}
        </div>
      )}
    </section>
  );
}
