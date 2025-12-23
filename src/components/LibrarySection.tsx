import React from 'react';
import { MediaItem, MediaType } from '../lib/types';
import { LibraryTile } from './LibraryTile';
import { useNavigate } from 'react-router-dom';

interface LibrarySectionProps {
  title: string;
  type: MediaType;
  items: MediaItem[];
  viewAllPath: string;
  emptyCtaPath: string;
}

export function LibrarySection({ title, type, items, viewAllPath, emptyCtaPath }: LibrarySectionProps) {
  const navigate = useNavigate();
  const limited = items.slice(0, 8);
  const count = items.length;

  const handleOpen = (item: MediaItem) => {
    if (type === 'movie') navigate(`/movies/${item.externalId}`);
    else if (type === 'book') navigate(`/books/${item.externalId}`);
    else navigate(`/music/${item.externalId}`);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
          <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-700 border border-zinc-200">{count}</span>
        </div>
        <button
          onClick={() => navigate(viewAllPath)}
          className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
        >
          View all
        </button>
      </div>

      {count === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 flex items-center justify-between">
          <span>No items yet. Add some to your library.</span>
          <button
            onClick={() => navigate(emptyCtaPath)}
            className="px-3 py-1.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800"
          >
            Browse {title}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {limited.map((item, idx) => (
            <LibraryTile key={item.id} item={item} index={idx} kind={type} />
          ))}
        </div>
      )}
    </section>
  );
}
