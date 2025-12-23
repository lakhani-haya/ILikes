import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MediaItem } from '../lib/types';
import { getImageUrl } from '../lib/utils';

type MediaKind = 'movie' | 'book' | 'music';

interface LibraryTileProps {
  item: MediaItem;
  index: number;
  kind: MediaKind;
}

const statusLabel: Record<string, string> = {
  wishlist: 'Planned',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

function buildPath(kind: MediaKind, externalId: string) {
  if (kind === 'movie') return `/movies/${externalId}`;
  if (kind === 'book') return `/books/${externalId}`;
  return `/music/${externalId}`;
}

export function LibraryTile({ item, index, kind }: LibraryTileProps) {
  const navigate = useNavigate();
  const expandLeft = index % 4 === 3;
  const rating = item.yourRating ?? null;
  const review = item.yourReview?.trim() ?? '';
  const status = statusLabel[item.status] ?? 'Planned';
  const path = buildPath(kind, item.externalId);

  const previewText = review.length > 120 ? `${review.slice(0, 120)}…` : review;

  return (
    <button
      onClick={() => navigate(path)}
      className="group relative w-full text-left rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm transition hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
    >
      <div className="relative aspect-[2/3] bg-zinc-100 overflow-hidden">
        <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-zinc-900 line-clamp-2 leading-snug">{item.title}</h3>
        <p className="text-xs text-zinc-500 mt-1">{item.year || 'Unknown'}</p>
      </div>

      <div
        className={`pointer-events-none absolute top-0 ${expandLeft ? 'right-0' : 'left-0'} h-full w-[calc(200%+1rem)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition duration-200 z-20`}
      >
        <div
          className={`h-full rounded-xl border border-zinc-200 bg-white/95 backdrop-blur shadow-xl p-4 flex flex-col gap-2 ${
            expandLeft ? 'items-end pr-5' : 'items-start pl-5'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <span className="text-amber-500">★</span>
            <span>{rating !== null ? rating.toFixed(1) : 'Not rated'}</span>
          </div>
          <div className="text-xs text-zinc-600">Status: {status}</div>
          {previewText && <p className="text-xs text-zinc-600 leading-relaxed">{previewText}</p>}
        </div>
      </div>
    </button>
  );
}
