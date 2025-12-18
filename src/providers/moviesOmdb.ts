import axios from 'axios';
import { SearchResult, DetailsResult, ApiMovie, ApiMovieSearch } from '../lib/types';
import { getImageUrl } from '../lib/utils';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
  console.warn('VITE_OMDB_API_KEY not configured. Movies search will not work.');
}

export async function searchMovies(query: string): Promise<SearchResult[]> {
  if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
    return [];
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  try {
    const response = await axios.get<{
      Search?: ApiMovieSearch[];
      Response: string;
      Error?: string;
    }>(BASE_URL, {
      params: {
        s: trimmedQuery,
        type: 'movie',
        apikey: API_KEY,
      },
    });

    if (response.data.Response === 'False' || !response.data.Search) {
      return [];
    }

    return response.data.Search.map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      image: getImageUrl(movie.Poster),
      year: movie.Year || 'Unknown',
      creator: 'Unknown',
      genres: [],
      description: '',
      provider: 'omdb',
      externalId: movie.imdbID,
    }));
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

export async function getMovieDetails(imdbId: string): Promise<DetailsResult | null> {
  if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
    return null;
  }

  try {
    const response = await axios.get<ApiMovie>(BASE_URL, {
      params: {
        i: imdbId,
        apikey: API_KEY,
      },
    });

    const genres = response.data.Genre
      ? response.data.Genre.split(',').map(g => g.trim()).filter(Boolean)
      : [];
    const rating = response.data.imdbRating && response.data.imdbRating !== 'N/A'
      ? response.data.imdbRating
      : undefined;

    return {
      id: response.data.imdbID,
      title: response.data.Title,
      image: getImageUrl(response.data.Poster),
      year: response.data.Year || 'Unknown',
      creator: response.data.Director || 'Unknown',
      genres,
      description: response.data.Plot || '',
      provider: 'omdb',
      externalId: response.data.imdbID,
      runtime: response.data.Runtime || undefined,
      rating,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}
