import { MediaItem, MediaType } from './types';

export interface StatusCounts {
  wishlist: number;
  'in-progress': number;
  completed: number;
}

export interface GenreCount {
  genre: string;
  count: number;
}

export interface RatingBucket {
  range: string;
  count: number;
}

export interface MonthlyCount {
  month: string;
  adds: number;
  completions: number;
}

/**
 * Get status breakdown for items
 */
export function getStatusCounts(items: MediaItem[]): StatusCounts {
  const counts: StatusCounts = {
    wishlist: 0,
    'in-progress': 0,
    completed: 0,
  };

  items.forEach((item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
  });

  return counts;
}

/**
 * Get genre breakdown with counts, sorted by frequency
 */
export function getGenreCounts(items: MediaItem[], limit?: number): GenreCount[] {
  const genreCounts = new Map<string, number>();

  items.forEach((item) => {
    if (item.genreSnapshot && Array.isArray(item.genreSnapshot)) {
      item.genreSnapshot.forEach((genre) => {
        if (genre && genre.trim()) {
          const normalized = genre.trim();
          genreCounts.set(normalized, (genreCounts.get(normalized) || 0) + 1);
        }
      });
    }
  });

  const sorted = Array.from(genreCounts.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);

  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Calculate average rating across items
 */
export function getAverageRating(items: MediaItem[]): number | null {
  const ratedItems = items.filter((item) => item.yourRating !== null);
  if (ratedItems.length === 0) return null;

  const sum = ratedItems.reduce((acc, item) => acc + (item.yourRating ?? 0), 0);
  return sum / ratedItems.length;
}

/**
 * Get rating distribution in buckets
 */
export function getRatingBuckets(items: MediaItem[]): RatingBucket[] {
  const buckets = [
    { range: '0–1', min: 0, max: 1, count: 0 },
    { range: '1–2', min: 1, max: 2, count: 0 },
    { range: '2–3', min: 2, max: 3, count: 0 },
    { range: '3–4', min: 3, max: 4, count: 0 },
    { range: '4–5', min: 4, max: 5, count: 0 },
  ];

  items.forEach((item) => {
    if (item.yourRating !== null) {
      const rating = item.yourRating;
      for (const bucket of buckets) {
        if (rating >= bucket.min && rating <= bucket.max) {
          bucket.count++;
          break;
        }
      }
    }
  });

  return buckets.map(({ range, count }) => ({ range, count }));
}

/**
 * Get recently added or reviewed items
 */
export function getRecentItems(
  items: MediaItem[],
  sortKey: 'createdAt' | 'updatedAt',
  limit: number = 6
): MediaItem[] {
  return [...items]
    .filter((item) => item[sortKey]) // ensure field exists
    .sort((a, b) => new Date(b[sortKey]!).getTime() - new Date(a[sortKey]!).getTime())
    .slice(0, limit);
}

/**
 * Get recently reviewed items (must have rating or review)
 */
export function getRecentlyReviewed(items: MediaItem[], limit: number = 6): MediaItem[] {
  return [...items]
    .filter((item) => item.yourRating !== null || item.yourReview?.trim())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

/**
 * Get monthly trends: adds and completions
 */
export function getMonthlyTrends(items: MediaItem[], months: number = 6): MonthlyCount[] {
  const now = new Date();
  const monthlyData = new Map<string, { adds: number; completions: number }>();

  // Initialize last N months
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData.set(key, { adds: 0, completions: 0 });
  }

  items.forEach((item) => {
    // Count adds
    if (item.createdAt) {
      const createdDate = new Date(item.createdAt);
      const createdKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData.has(createdKey)) {
        monthlyData.get(createdKey)!.adds++;
      }
    }

    // Count completions (if status is completed and we have consumedAt or updatedAt)
    if (item.status === 'completed') {
      const completedDate = new Date(item.consumedAt || item.updatedAt);
      const completedKey = `${completedDate.getFullYear()}-${String(completedDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData.has(completedKey)) {
        monthlyData.get(completedKey)!.completions++;
      }
    }
  });

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      adds: data.adds,
      completions: data.completions,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Format month key to readable label
 */
export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
