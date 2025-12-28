import React, { useState, useMemo } from 'react';
import { useLibrary } from '../hooks/useLibrary';
import { StatCard } from '../components/StatCard';
import { BarRow } from '../components/BarRow';
import { MiniItemRow } from '../components/MiniItemRow';
import {
  getStatusCounts,
  getGenreCounts,
  getAverageRating,
  getRatingBuckets,
  getRecentItems,
  getRecentlyReviewed,
  getMonthlyTrends,
  formatMonthLabel,
} from '../lib/insights';
import type { MediaItem, MediaType } from '../lib/types';

type TabValue = 'all' | 'movie' | 'book' | 'music';

export default function InsightsPage() {
  const { items, itemsByType } = useLibrary();
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [showAllGenres, setShowAllGenres] = useState(false);

  // Get current items based on active tab
  const currentItems = useMemo<MediaItem[]>(() => {
    if (activeTab === 'all') return items;
    return itemsByType[activeTab as MediaType];
  }, [activeTab, items, itemsByType]);

  // KPI calculations
  const totalItems = currentItems.length;
  const statusCounts = useMemo(() => getStatusCounts(currentItems), [currentItems]);
  const completedPercent = totalItems > 0 ? Math.round((statusCounts.completed / totalItems) * 100) : 0;
  const avgRating = useMemo(() => getAverageRating(currentItems), [currentItems]);
  const inProgressCount = statusCounts['in-progress'];

  // Breakdowns
  const genreCounts = useMemo(() => getGenreCounts(currentItems), [currentItems]);
  const topGenres = genreCounts.slice(0, 8);
  const ratingBuckets = useMemo(() => getRatingBuckets(currentItems), [currentItems]);

  // Recent items
  const recentlyAdded = useMemo(() => getRecentItems(currentItems, 'createdAt', 6), [currentItems]);
  const recentlyReviewed = useMemo(() => getRecentlyReviewed(currentItems, 6), [currentItems]);

  // Monthly trends
  const monthlyTrends = useMemo(() => getMonthlyTrends(currentItems, 6), [currentItems]);

  const tabs: { label: string; value: TabValue }[] = [
    { label: 'All', value: 'all' },
    { label: 'Movies', value: 'movie' },
    { label: 'Books', value: 'book' },
    { label: 'Music', value: 'music' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Hero Header */}
      <header className="space-y-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">Insights</h1>
          <p className="text-zinc-600 mt-2">A snapshot of your library, taste, and progress.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-200">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
                activeTab === tab.value
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {totalItems === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-600">No items in your library yet. Start adding movies, books, or music!</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Items" value={totalItems} />
            <StatCard label="Completed" value={`${completedPercent}%`} subtitle={`${statusCounts.completed} items`} />
            <StatCard
              label="Avg Rating"
              value={avgRating !== null ? avgRating.toFixed(1) : '—'}
              subtitle={avgRating !== null ? 'out of 5.0' : 'No ratings yet'}
            />
            <StatCard label="In Progress" value={inProgressCount} />
          </div>

          {/* Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Breakdown */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900">Status Breakdown</h2>
              {totalItems > 0 ? (
                <div className="space-y-3">
                  <BarRow label="Planned" count={statusCounts.wishlist} total={totalItems} color="bg-blue-500" />
                  <BarRow label="In Progress" count={statusCounts['in-progress']} total={totalItems} color="bg-amber-500" />
                  <BarRow label="Completed" count={statusCounts.completed} total={totalItems} color="bg-green-500" />
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No data available.</p>
              )}
            </div>

            {/* Genre Breakdown */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900">Genre Breakdown</h2>
              {genreCounts.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {(showAllGenres ? genreCounts : topGenres).map((item) => (
                      <BarRow
                        key={item.genre}
                        label={item.genre}
                        count={item.count}
                        total={totalItems}
                        color="bg-purple-500"
                      />
                    ))}
                  </div>
                  {genreCounts.length > 8 && (
                    <button
                      onClick={() => setShowAllGenres(!showAllGenres)}
                      className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition"
                    >
                      {showAllGenres ? 'Show less' : `View all ${genreCounts.length} genres`}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-zinc-500">No genre data available.</p>
              )}
            </div>
          </div>

          {/* Ratings Distribution */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Ratings Distribution</h2>
            {avgRating !== null ? (
              <div className="space-y-3">
                {ratingBuckets.map((bucket) => (
                  <BarRow
                    key={bucket.range}
                    label={bucket.range}
                    count={bucket.count}
                    total={totalItems}
                    color="bg-amber-500"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Rate a few items to unlock rating insights.</p>
            )}
          </div>

          {/* Recently Added & Reviewed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recently Added */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900">Recently Added</h2>
              {recentlyAdded.length > 0 ? (
                <div className="space-y-1">
                  {recentlyAdded.map((item) => (
                    <MiniItemRow key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No recent additions.</p>
              )}
            </div>

            {/* Recently Reviewed */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900">Recently Reviewed</h2>
              {recentlyReviewed.length > 0 ? (
                <div className="space-y-1">
                  {recentlyReviewed.map((item) => (
                    <MiniItemRow key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No reviews yet. Rate or review an item to see it here.</p>
              )}
            </div>
          </div>

          {/* Monthly Trends */}
          {monthlyTrends.some((m) => m.adds > 0 || m.completions > 0) && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900">Trends (Last 6 Months)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="text-left py-2 px-3 font-medium text-zinc-600">Month</th>
                      <th className="text-center py-2 px-3 font-medium text-zinc-600">Added</th>
                      <th className="text-center py-2 px-3 font-medium text-zinc-600">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyTrends.map((trend) => (
                      <tr key={trend.month} className="border-b border-zinc-100 hover:bg-zinc-50">
                        <td className="py-2 px-3 text-zinc-700">{formatMonthLabel(trend.month)}</td>
                        <td className="text-center py-2 px-3 text-zinc-900 font-medium">{trend.adds}</td>
                        <td className="text-center py-2 px-3 text-zinc-900 font-medium">{trend.completions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
