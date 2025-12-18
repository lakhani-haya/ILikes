import { MediaItem, ActivityEvent } from '../lib/types';
import { getMonthYear } from '../lib/utils';

export function getRatingsDistribution(items: MediaItem[]): Record<number, number> {
  const distribution: Record<number, number> = {};

  for (let i = 0; i <= 5; i += 0.5) {
    distribution[i] = 0;
  }

  items.forEach(item => {
    if (item.yourRating !== null) {
      distribution[item.yourRating] = (distribution[item.yourRating] || 0) + 1;
    }
  });

  return distribution;
}

export function getAverageRatingByType(items: MediaItem[]): Record<string, number> {
  const grouped: Record<string, { sum: number; count: number }> = {
    movie: { sum: 0, count: 0 },
    book: { sum: 0, count: 0 },
    music: { sum: 0, count: 0 },
  };

  items.forEach(item => {
    if (item.yourRating !== null) {
      grouped[item.type].sum += item.yourRating;
      grouped[item.type].count += 1;
    }
  });

  const result: Record<string, number> = {};
  Object.keys(grouped).forEach(type => {
    result[type] = grouped[type].count > 0 ? grouped[type].sum / grouped[type].count : 0;
  });

  return result;
}

export function getTopTags(items: MediaItem[], limit: number = 10): Array<{ tag: string; count: number }> {
  const tagCounts: Record<string, number> = {};

  items.forEach(item => {
    item.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getActivityByMonth(
  activityLog: ActivityEvent[]
): Record<string, number> {
  const monthCounts: Record<string, number> = {};

  activityLog.forEach(event => {
    const monthYear = getMonthYear(event.timestamp);
    monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
  });

  return monthCounts;
}

export function getCompletionRate(items: MediaItem[]): number {
  if (items.length === 0) return 0;
  const completed = items.filter(item => item.status === 'completed').length;
  return Math.round((completed / items.length) * 100);
}

export function getStatsByType(items: MediaItem[]): Record<string, { count: number; completed: number; rated: number }> {
  const stats: Record<string, { count: number; completed: number; rated: number }> = {
    movie: { count: 0, completed: 0, rated: 0 },
    book: { count: 0, completed: 0, rated: 0 },
    music: { count: 0, completed: 0, rated: 0 },
  };

  items.forEach(item => {
    stats[item.type].count += 1;
    if (item.status === 'completed') {
      stats[item.type].completed += 1;
    }
    if (item.yourRating !== null) {
      stats[item.type].rated += 1;
    }
  });

  return stats;
}

export function getMostRecentActivity(activityLog: ActivityEvent[], limit: number = 10): ActivityEvent[] {
  return activityLog.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
}
