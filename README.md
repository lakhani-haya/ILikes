# ILikes


ILikes is a personal media library application that allows users to discover, track, rate, and review movies, books, and music in one place. The application integrates multiple public APIs and provides a unified interface for managing and analyzing personal media preferences.

The goal of the project is to combine API integration, modern frontend development, and lightweight analytics to create a polished personal library experience.

---

## Features

### Media Discovery
- Search and explore movies, books, and music
- External data fetched from multiple APIs
- Detailed media pages with metadata and descriptions

### Personal Library
- Add movies, books, and music to a personal library
- Track status such as **Planned**, **In Progress**, or **Completed**
- Add ratings and written reviews
- Hover previews showing rating, status, and review summary

### ILibrary Dashboard
- Dedicated library page showing saved items grouped by media type
- Movies, Books, and Music sections with preview grids
- Hover expansion cards displaying user feedback
- "View All" pages with filtering and sorting options

### Filtering and Sorting
- Search within your saved library
- Filter by status, rating, or genre
- Sort by rating, title, year, or recently added

### Insights Dashboard
- Summary of library statistics
- Completion metrics
- Media distribution by type
- Genre breakdowns
- Rating distribution
- Recently added and recently reviewed items

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### APIs
- OMDb API (Movies)
- Google Books API (Books)
- iTunes Search API (Music)

### State & Storage
- Custom React hooks
- LocalStorage persistence

---

## Project Structure

```text
src
 ├── components
 │    ├── SearchBar
 │    ├── SearchResults
 │    ├── LibraryTile
 │    └── LibrarySection
 │
 ├── pages
 │    ├── Movies
 │    ├── Books
 │    ├── Music
 │    ├── Library
 │    ├── Insights
 │    └── Detail pages
 │
 ├── providers
 │    ├── moviesOmdb
 │    ├── booksGoogle
 │    └── musicItunes
 │
 ├── hooks
 │    └── useLibrary
 │
 └── lib
      ├── types
      └── utilities
