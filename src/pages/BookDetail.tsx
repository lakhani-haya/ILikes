import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookDetails } from '../providers/booksGoogle';
import { DetailsResult, SearchResult, Status } from '../lib/types';
import { useLibrary } from '../hooks/useLibrary';

const statusOptions: { value: Status; label: string }[] = [
  { value: 'wishlist', label: 'Planned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

function toSearchResult(details: DetailsResult): SearchResult {
  return {
    id: details.id,
    title: details.title,
    image: details.image || '',
    year: details.year || 'Unknown',
    creator: details.creator || 'Unknown',
    genres: details.genres || [],
    description: details.description || '',
    provider: details.provider,
    externalId: details.externalId,
  };
}

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, addFromSearch, removeItem, rateItem, reviewItem, setStatus } = useLibrary();

  const libraryItem = useMemo(
    () => items.find(item => item.type === 'book' && item.externalId === id),
    [id, items]
  );

  const [details, setDetails] = useState<DetailsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState<number | null>(libraryItem?.yourRating ?? null);
  const [review, setReviewText] = useState<string>(libraryItem?.yourReview ?? '');
  const [status, setStatusValue] = useState<Status>(libraryItem?.status ?? 'wishlist');

  useEffect(() => {
    setRating(libraryItem?.yourRating ?? null);
    setReviewText(libraryItem?.yourReview ?? '');
    setStatusValue(libraryItem?.status ?? 'wishlist');
  }, [libraryItem]);

  useEffect(() => {
    if (!id) {
      setError('Missing book id');
      return;
    }

    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getBookDetails(id);
        if (mounted) {
          if (!result) {
            setError('Unable to load book details.');
          } else {
            setDetails(result);
          }
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError('Unable to load book details.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const inLibrary = Boolean(libraryItem);

  const handleAdd = () => {
    if (!details) return;
    addFromSearch('book', toSearchResult(details));
  };

  const handleRemove = () => {
    if (libraryItem) {
      removeItem(libraryItem.id);
    }
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
    if (libraryItem) {
      rateItem(libraryItem.id, value);
    }
  };

  const handleSaveReview = () => {
    if (!libraryItem) return;
    reviewItem(libraryItem.id, { review, spoiler: false });
    setStatus(libraryItem.id, status);
    if (rating !== libraryItem.yourRating) {
      rateItem(libraryItem.id, rating);
    }
  };

  const meta = useMemo(() => {
    const entries: { label: string; value: string }[] = [];
    if (details?.creator) entries.push({ label: 'Author', value: details.creator });
    if (details?.year) entries.push({ label: 'Year', value: details.year });
    if (details?.runtime) entries.push({ label: 'Pages', value: details.runtime });
    return entries;
  }, [details]);

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-zinc-600">Loading…</p>
      </section>
    );
  }

  if (error || !details) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-red-600">{error || 'Book not found.'}</p>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <button onClick={() => navigate(-1)} className="text-sm text-zinc-500 hover:text-zinc-700">← Back</button>
      <div className="grid md:grid-cols-[240px,1fr] gap-8 items-start">
        <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
          <img src={details.image} alt={details.title} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">{details.title}</h1>
          <p className="text-zinc-600">{details.description || 'No description available.'}</p>
          <div className="flex flex-wrap gap-2">
            {meta.map(item => (
              <span key={item.label} className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-sm border border-zinc-200">
                {item.label}: {item.value}
              </span>
            ))}
            {(details.genres || []).map(genre => (
              <span key={genre} className="px-3 py-1 rounded-full bg-zinc-50 text-zinc-700 text-sm border border-zinc-200">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            {!inLibrary ? (
              <button onClick={handleAdd} className="px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800">
                Add to Library
              </button>
            ) : (
              <button onClick={handleRemove} className="px-4 py-2 rounded-full bg-white text-zinc-900 border border-zinc-200 text-sm font-medium hover:bg-zinc-50">
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">Your rating</h2>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={rating ?? 0}
              onChange={e => handleRatingChange(parseFloat(e.target.value))}
              disabled={!inLibrary}
              className="flex-1 accent-zinc-900"
            />
            <span className="text-sm text-zinc-700 w-12 text-right">{rating ? rating.toFixed(1) : '0.0'}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">Status</h2>
          <select
            value={status}
            onChange={e => setStatusValue(e.target.value as Status)}
            disabled={!inLibrary}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Your review</h2>
          <button
            onClick={handleSaveReview}
            disabled={!inLibrary}
            className="px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 disabled:bg-zinc-300"
          >
            Save
          </button>
        </div>
        <textarea
          value={review}
          onChange={e => setReviewText(e.target.value)}
          disabled={!inLibrary}
          placeholder="What did you think?"
          className="w-full min-h-[120px] rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 disabled:bg-zinc-50"
        />
      </div>
    </section>
  );
}
