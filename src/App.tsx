import React from 'react';
import { NavLink, Route, Routes, Navigate } from 'react-router-dom';

function TopNav() {
  const base = 'px-3 py-2 rounded-md text-sm font-medium';
  const active = 'bg-blue-600 text-white';
  const inactive = 'text-blue-700 hover:bg-blue-100';
  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-14 flex items-center gap-2">
          <NavLink to="/movies" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Movies</NavLink>
          <NavLink to="/books" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Books</NavLink>
          <NavLink to="/music" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Music</NavLink>
          <div className="flex-1" />
          <NavLink to="/insights" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Insights</NavLink>
        </div>
      </div>
    </nav>
  );
}

function Page({ title }: { title: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-gray-600 mt-2">Placeholder content.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/movies" replace />} />
        <Route path="/movies" element={<Page title="Movies" />} />
        <Route path="/books" element={<Page title="Books" />} />
        <Route path="/music" element={<Page title="Music" />} />
        <Route path="/insights" element={<Page title="Insights" />} />
      </Routes>
    </div>
  );
}
