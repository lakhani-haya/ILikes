import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MediaItem } from '../lib/types';
import { getImageUrl, formatYear } from '../lib/utils';

interface MiniItemRowProps {
  item: MediaItem;
}

const pathMap: Record<string, string> = {
  movie: '/movies',
  book: '/books',
  music: '/music',
};

export function MiniItemRow({ item }: MiniItemRowProps) {
  const navigate = useNavigate();
  const path = `${pathMap[item.type]}/${item.externalId}`;

  return (
    <button
      onClick={() => navigate(path)}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition text-left w-full group"
    >
      <img
        src={getImageUrl(item.imageSnapshot)}
        alt={item.titleSnapshot}
        className="w-12 h-16 object-cover rounded shadow-sm"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-zinc-900 truncate group-hover:text-zinc-700">
          {item.titleSnapshot}
        </h4>
        <p className="text-xs text-zinc-500">{formatYear(item.yearSnapshot)}</p>
      </div>
      {item.yourRating !== null && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
          <span>★</span>
          <span>{item.yourRating.toFixed(1)}</span>
        </div>
      )}
    </button>
  );
}
