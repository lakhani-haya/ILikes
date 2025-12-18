export type MediaType = 'movie' | 'book' | 'music';
export type Status = 'wishlist' | 'in-progress' | 'completed';

export interface MediaItem {
  id: string;
  type: MediaType;
  provider: string;
  externalId: string;
  titleSnapshot: string;
  imageSnapshot: string;
  yearSnapshot: number;
  genreSnapshot: string[];
  yourRating: number | null;
  yourReview: string;
  spoiler: boolean;
  tags: string[];
  status: Status;
  consumedAt: string | null;
  revisitCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEvent {
  type: 'ADD' | 'RATE' | 'STATUS_CHANGE' | 'REVIEW' | 'TAG';
  itemId: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface ApiMovieSearch {
  imdbID: string;
  Title: string;
  Year: string;
  Type?: string;
  Poster?: string;
}

export interface ApiMovie {
  imdbID: string;
  Title: string;
  Poster?: string;
  Year: string;
  Plot?: string;
  Director?: string;
  Genre?: string;
  Runtime?: string;
  imdbRating?: string;
}

export interface ApiBook {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    pageCount?: number;
  };
}

export interface ApiMusic {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
  artworkUrl30?: string;
  trackPrice?: number;
  collectionId?: number;
  releaseDate?: string;
  primaryGenreName?: string;
  kind?: string;
  trackTimeMillis?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  image: string;
  year: string;
  creator: string;
  genres: string[];
  description: string;
  provider: string;
  externalId: string;
}

export interface DetailsResult {
  id: string;
  title: string;
  image: string;
  year: string;
  creator: string;
  genres: string[];
  description: string;
  provider: string;
  externalId: string;
  runtime?: string;
  rating?: string;
}
