import React from 'react';
import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import MoviesPage from './pages/Movies';
import BooksPage from './pages/Books';
import MusicPage from './pages/Music';
import InsightsPage from './pages/Insights';

function TopNav() {
  const base = 'px-3 py-2 rounded-md text-sm font-medium';
  const active = 'bg-blue-600 text-white shadow-sm';
  const inactive = 'text-blue-700 hover:bg-blue-100';
  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-14 flex items-center gap-2">
          <span className="mr-4 text-base font-semibold tracking-tight">ILikes</span>
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

export default function App() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/movies" replace />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
    </div>
  );
}
