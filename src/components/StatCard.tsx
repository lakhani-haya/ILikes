import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

export function StatCard({ label, value, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
    </div>
  );
}
