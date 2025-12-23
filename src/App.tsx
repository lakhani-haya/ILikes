import React from 'react';
import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import MoviesPage from './pages/Movies';
import BooksPage from './pages/Books';
import MusicPage from './pages/Music';
import InsightsPage from './pages/Insights';
import MovieDetailPage from './pages/MovieDetail';
import BookDetailPage from './pages/BookDetail';
import MusicDetailPage from './pages/MusicDetail';
import LibraryPage from './pages/Library';
import LibraryMoviesPage from './pages/LibraryMovies';
import LibraryBooksPage from './pages/LibraryBooks';
import LibraryMusicPage from './pages/LibraryMusic';

function TopNav() {
  const base = 'px-4 py-2 rounded-full text-sm font-medium transition';
  const active = 'bg-zinc-900/90 text-white';
  const inactive = 'text-zinc-600 hover:bg-zinc-100';
  return (
    <nav className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/70 backdrop-blur shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-16 flex items-center gap-3">
          <span className="mr-6 text-lg font-semibold tracking-tight">ILikes</span>
          <NavLink to="/movies" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Movies</NavLink>
          <NavLink to="/books" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Books</NavLink>
          <NavLink to="/music" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Music</NavLink>
          <NavLink to="/library" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>ILibrary</NavLink>
          <div className="flex-1" />
          <NavLink to="/insights" className={({ isActive }) => `${base} border border-zinc-200 ${isActive ? active : inactive}`}>Insights</NavLink>
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
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/music/:id" element={<MusicDetailPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/library/movies" element={<LibraryMoviesPage />} />
        <Route path="/library/books" element={<LibraryBooksPage />} />
        <Route path="/library/music" element={<LibraryMusicPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
    </div>
  );
}
