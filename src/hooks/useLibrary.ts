import { useCallback, useEffect, useMemo, useState } from 'react';
import { storage } from '../lib/storage';
import { ActivityEvent, MediaItem, MediaType, SearchResult, Status } from '../lib/types';

interface ReviewPayload {
  review: string;
  spoiler: boolean;
}

export function useLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);

  const refresh = useCallback(() => {
    setItems(storage.getAllItems());
    setActivity(storage.getActivity());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handleStorage = () => refresh();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refresh]);

  const syncItem = useCallback((updated: MediaItem | null) => {
    if (!updated) return null;
    setItems(prev => prev.map(item => (item.id === updated.id ? updated : item)));
    setActivity(storage.getActivity());
    return updated;
  }, []);

  const addFromSearch = useCallback(
    (type: MediaType, result: SearchResult): MediaItem => {
      const newItem = storage.addItem(
        type,
        result.provider,
        result.externalId,
        result.title,
        result.image,
        result.year,
        result.genres
      );
      setItems(prev => [...prev, newItem]);
      setActivity(storage.getActivity());
      return newItem;
    },
    []
  );

  const rateItem = useCallback((id: string, rating: number | null) => syncItem(storage.updateRating(id, rating)), [syncItem]);

  const reviewItem = useCallback(
    (id: string, payload: ReviewPayload) => syncItem(storage.updateReview(id, payload.review, payload.spoiler)),
    [syncItem]
  );

  const setStatus = useCallback((id: string, status: Status) => syncItem(storage.updateStatus(id, status)), [syncItem]);

  const setTags = useCallback((id: string, tags: string[]) => syncItem(storage.updateTags(id, tags)), [syncItem]);

  const removeItem = useCallback((id: string) => {
    const deleted = storage.deleteItem(id);
    if (deleted) {
      setItems(prev => prev.filter(item => item.id !== id));
      setActivity(storage.getActivity());
    }
    return deleted;
  }, []);

  const itemsByType = useMemo(() => ({
    movie: items.filter(item => item.type === 'movie'),
    book: items.filter(item => item.type === 'book'),
    music: items.filter(item => item.type === 'music'),
  }), [items]);

  return {
    items,
    activity,
    itemsByType,
    refresh,
    addFromSearch,
    rateItem,
    reviewItem,
    setStatus,
    setTags,
    removeItem,
  };
}
