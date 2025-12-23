import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LibrarySection } from '../components/LibrarySection';
import { useLibrary } from '../hooks/useLibrary';

export default function LibraryPage() {
  const { itemsByType } = useLibrary();
  const navigate = useNavigate();

  return (
    <section className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">Library</h1>
        <p className="text-zinc-600">Your saved movies, books, and music in one place.</p>
      </header>

      <LibrarySection
        title="Movies"
        type="movie"
        items={itemsByType.movie}
        viewAllPath="/library/movies"
        emptyCtaPath="/movies"
      />

      <LibrarySection
        title="Books"
        type="book"
        items={itemsByType.book}
        viewAllPath="/library/books"
        emptyCtaPath="/books"
      />

      <LibrarySection
        title="Music"
        type="music"
        items={itemsByType.music}
        viewAllPath="/library/music"
        emptyCtaPath="/music"
      />
    </section>
  );
}
