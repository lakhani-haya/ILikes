import { v4 as uuidv4 } from 'uuid';
import { MediaItem, ActivityEvent, Status } from './types';

const STORAGE_KEY = 'ilikes_library';
const ACTIVITY_KEY = 'ilikes_activity';
const RATING_MIN = 0;
const RATING_MAX = 5;

function persistItems(items: MediaItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error writing library:', error);
  }
}

function persistActivity(activity: ActivityEvent[]): void {
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
  } catch (error) {
    console.error('Error writing activity:', error);
  }
}

function sanitizeYear(year: number | string): number {
  if (typeof year === 'number' && Number.isFinite(year)) return year;
  const parsed = parseInt(String(year), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeRating(value: number | null): number | null {
  if (value === null) return null;
  const clamped = Math.min(RATING_MAX, Math.max(RATING_MIN, value));
  return Math.round(clamped * 2) / 2;
}

function cleanGenres(genres: string[]): string[] {
  return Array.isArray(genres) ? genres.filter(Boolean) : [];
}

function cleanText(text: string): string {
  return text?.trim() || 'Untitled';
}

function cleanImage(url: string): string {
  return url || '';
}

export const storage = {
  getAllItems(): MediaItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading library:', error);
      return [];
    }
  },

  getItemById(id: string): MediaItem | null {
    const items = this.getAllItems();
    return items.find(item => item.id === id) || null;
  },

  getItemsByType(type: 'movie' | 'book' | 'music'): MediaItem[] {
    const items = this.getAllItems();
    return items.filter(item => item.type === type);
  },

  addItem(
    type: 'movie' | 'book' | 'music',
    provider: string,
    externalId: string,
    titleSnapshot: string,
    imageSnapshot: string,
    yearSnapshot: number | string,
    genreSnapshot: string[]
  ): MediaItem {
    const items = this.getAllItems();
    const existing = items.find(item => item.type === type && item.externalId === externalId);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const newItem: MediaItem = {
      id: uuidv4(),
      type,
      provider,
      externalId,
      titleSnapshot: cleanText(titleSnapshot),
      imageSnapshot: cleanImage(imageSnapshot),
      yearSnapshot: sanitizeYear(yearSnapshot),
      genreSnapshot: cleanGenres(genreSnapshot),
      yourRating: null,
      yourReview: '',
      spoiler: false,
      tags: [],
      status: 'wishlist',
      consumedAt: null,
      revisitCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    persistItems(items);
    this.addActivity('ADD', newItem.id, { type, externalId });
    return newItem;
  },

  updateItem(id: string, updates: Partial<MediaItem>): MediaItem | null {
    const items = this.getAllItems();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updatedItem;
    persistItems(items);
    return updatedItem;
  },

  updateRating(id: string, rating: number | null): MediaItem | null {
    const normalized = normalizeRating(rating);
    const item = this.updateItem(id, { yourRating: normalized });
    if (item) {
      this.addActivity('RATE', id, { rating: normalized });
    }
    return item;
  },

  updateReview(id: string, review: string, spoiler: boolean): MediaItem | null {
    const item = this.updateItem(id, { yourReview: review, spoiler });
    if (item) {
      this.addActivity('REVIEW', id, { review, spoiler });
    }
    return item;
  },

  updateStatus(id: string, status: Status): MediaItem | null {
    const current = this.getItemById(id);
    const consumedAt = status === 'completed' ? current?.consumedAt ?? new Date().toISOString() : current?.consumedAt ?? null;
    const item = this.updateItem(id, { status, consumedAt });
    if (item) {
      this.addActivity('STATUS_CHANGE', id, { status });
    }
    return item;
  },

  updateTags(id: string, tags: string[]): MediaItem | null {
    const item = this.updateItem(id, { tags });
    if (item) {
      this.addActivity('TAG', id, { tags });
    }
    return item;
  },

  deleteItem(id: string): boolean {
    const items = this.getAllItems();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    persistItems(filtered);
    return true;
  },

  getActivity(): ActivityEvent[] {
    try {
      const data = localStorage.getItem(ACTIVITY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading activity:', error);
      return [];
    }
  },

  addActivity(type: ActivityEvent['type'], itemId: string, payload: Record<string, unknown>): void {
    const activity = this.getActivity();
    const event: ActivityEvent = {
      type,
      itemId,
      timestamp: new Date().toISOString(),
      payload,
    };
    activity.push(event);
    persistActivity(activity);
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
  },
};
