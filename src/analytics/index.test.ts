import { describe, it, expect } from 'vitest';
import {
  getRatingsDistribution,
  getAverageRatingByType,
  getTopTags,
  getCompletionRate,
  getActivityByMonth,
  getStatsByType,
} from './index';
import { MediaItem, ActivityEvent } from '../lib/types';

describe('Analytics Functions', () => {
  describe('getRatingsDistribution', () => {
    it('should count ratings by star value', () => {
      const items: MediaItem[] = [
        {
          id: '1',
          type: 'movie',
          yourRating: 5,
          yourReview: '',
          spoiler: false,
          tags: [],
          status: 'completed',
          consumedAt: null,
          revisitCount: 0,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          provider: 'omdb',
          externalId: 'tt1234567',
          titleSnapshot: 'Test Movie',
          imageSnapshot: '',
          yearSnapshot: 2025,
          genreSnapshot: [],
        },
        {
          id: '2',
          type: 'movie',
          yourRating: 5,
          yourReview: '',
          spoiler: false,
          tags: [],
          status: 'completed',
          consumedAt: null,
          revisitCount: 0,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          provider: 'omdb',
          externalId: 'tt1234568',
          titleSnapshot: 'Test Movie 2',
          imageSnapshot: '',
          yearSnapshot: 2025,
          genreSnapshot: [],
        },
        {
          id: '3',
          type: 'movie',
          yourRating: 3.5,
          yourReview: '',
          spoiler: false,
          tags: [],
          status: 'completed',
          consumedAt: null,
          revisitCount: 0,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          provider: 'omdb',
          externalId: 'tt1234569',
          titleSnapshot: 'Test Movie 3',
          imageSnapshot: '',
          yearSnapshot: 2025,
          genreSnapshot: [],
        },
      ];

      const distribution = getRatingsDistribution(items);
      expect(distribution[5]).toBe(2);
      expect(distribution[3.5]).toBe(1);
    });

    it('should handle items without ratings', () => {
      const items: MediaItem[] = [
        {
          id: '1',
          type: 'movie',
          yourRating: null,
          yourReview: '',
          spoiler: false,
          tags: [],
          status: 'wishlist',
          consumedAt: null,
          revisitCount: 0,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          provider: 'omdb',
          externalId: 'tt1234567',
          titleSnapshot: 'Test Movie',
          imageSnapshot: '',
          yearSnapshot: 2025,
          genreSnapshot: [],
        },
      ];

      const distribution = getRatingsDistribution(items);
      expect(distribution[0]).toBe(0);
    });
  });

  describe('getCompletionRate', () => {
    it('should calculate completion percentage correctly', () => {
      const items: MediaItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        type: 'movie',
        yourRating: null,
        yourReview: '',
        spoiler: false,
        tags: [],
        status: i < 3 ? 'completed' : 'in-progress',
        consumedAt: null,
        revisitCount: 0,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        provider: 'omdb',
        externalId: `tt${i}`,
        titleSnapshot: 'Test',
        imageSnapshot: '',
        yearSnapshot: 2025,
        genreSnapshot: [],
      }));

      const rate = getCompletionRate(items);
      expect(rate).toBe(30);
    });

    it('should return 0 for empty list', () => {
      const rate = getCompletionRate([]);
      expect(rate).toBe(0);
    });
  });

  describe('getAverageRatingByType', () => {
    it('should calculate average ratings by media type', () => {
      const items: MediaItem[] = [
        {
          id: '1',
          type: 'movie',
          yourRating: 5,
          yourReview: '',
          spoiler: false,
          tags: [],
          status: 'completed',
          consumedAt: null,
          revisitCount: 0,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          provider: 'omdb',
          externalId: 'tt1234567',
          titleSnapshot: 'Test Movie',
          imageSnapshot: '',
          yearSnapshot: 2025,
          genreSnapshot: [],
        },
        {
          id: '2',
          type: 'movie',
          yourRating: 3,
          yourReview: '',
          spoiler: false,
          tags: [],
          status: 'completed',
          consumedAt: null,
          revisitCount: 0,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          provider: 'omdb',
          externalId: 'tt1234568',
          titleSnapshot: 'Test Movie 2',
          imageSnapshot: '',
          yearSnapshot: 2025,
          genreSnapshot: [],
        },
      ];

      const avg = getAverageRatingByType(items);
      expect(avg['movie']).toBe(4);
      expect(avg['book']).toBe(0);
    });
  });

  describe('getTopTags', () => {
    it('should return most frequent tags', () => {
      const items: MediaItem[] = [
        {
          id: '1',
          type: 'movie',
          yourRating: null,
          yourReview: '',
          spoiler: false,
          tags: ['action', 'sci-fi'],
          status: 'completed',
          consumedAt: null,
          revisitCount: 0,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          provider: 'omdb',
          externalId: 'tt1234567',
          titleSnapshot: 'Test Movie',
          imageSnapshot: '',
          yearSnapshot: 2025,
          genreSnapshot: [],
        },
        {
          id: '2',
          type: 'movie',
          yourRating: null,
          yourReview: '',
          spoiler: false,
          tags: ['action', 'drama'],
          status: 'completed',
          consumedAt: null,
          revisitCount: 0,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          provider: 'omdb',
          externalId: 'tt1234568',
          titleSnapshot: 'Test Movie 2',
          imageSnapshot: '',
          yearSnapshot: 2025,
          genreSnapshot: [],
        },
      ];

      const tags = getTopTags(items);
      expect(tags[0]).toEqual({ tag: 'action', count: 2 });
      expect(tags.length).toBeGreaterThan(0);
    });
  });

  describe('getActivityByMonth', () => {
    it('should group activity events by month', () => {
      const activity: ActivityEvent[] = [
        {
          type: 'ADD',
          itemId: '1',
          timestamp: '2025-01-15T10:00:00Z',
          payload: {},
        },
        {
          type: 'RATE',
          itemId: '1',
          timestamp: '2025-01-20T10:00:00Z',
          payload: {},
        },
        {
          type: 'RATE',
          itemId: '2',
          timestamp: '2025-02-01T10:00:00Z',
          payload: {},
        },
      ];

      const byMonth = getActivityByMonth(activity);
      expect(byMonth['2025-01']).toBe(2);
      expect(byMonth['2025-02']).toBe(1);
    });
  });

  describe('getStatsByType', () => {
    it('should provide counts and stats by media type', () => {
      const items: MediaItem[] = [
        {
          id: '1',
          type: 'movie',
          yourRating: 5,
          yourReview: '',
          spoiler: false,
          tags: [],
          status: 'completed',
          consumedAt: null,
          revisitCount: 0,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          provider: 'omdb',
          externalId: 'tt1234567',
          titleSnapshot: 'Test Movie',
          imageSnapshot: '',
          yearSnapshot: 2025,
          genreSnapshot: [],
        },
        {
          id: '2',
          type: 'book',
          yourRating: null,
          yourReview: '',
          spoiler: false,
          tags: [],
          status: 'in-progress',
          consumedAt: null,
          revisitCount: 0,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          provider: 'google-books',
          externalId: 'book123',
          titleSnapshot: 'Test Book',
          imageSnapshot: '',
          yearSnapshot: 2025,
          genreSnapshot: [],
        },
      ];

      const stats = getStatsByType(items);
      expect(stats['movie'].count).toBe(1);
      expect(stats['movie'].completed).toBe(1);
      expect(stats['movie'].rated).toBe(1);
      expect(stats['book'].count).toBe(1);
      expect(stats['book'].completed).toBe(0);
    });
  });
});
