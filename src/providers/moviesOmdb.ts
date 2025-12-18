import axios from 'axios';
import { SearchResult, DetailsResult, ApiMovie, ApiMovieSearch } from '../lib/types';
import { getImageUrl } from '../lib/utils';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

const missingKey = !API_KEY || API_KEY === 'YOUR_KEY_HERE';
if (missingKey) {
  console.warn('OMDb API key not configured. Movies search will be disabled.');
}

export async function searchMovies(query: string): Promise<SearchResult[]> {
  if (missingKey) return [];

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  try {
    const response = await axios.get<{
      Search?: ApiMovieSearch[];
      Response: string;
      Error?: string;
    }>(BASE_URL, {
      params: {
        s: encodeURIComponent(trimmedQuery),
        type: 'movie',
        apikey: API_KEY,
      },
    });

    if (response.data.Response !== 'True' || !response.data.Search) {
      if (response.data.Error?.toLowerCase().includes('invalid api key')) {
        console.warn('OMDb API key rejected by server.');
      }
      return [];
    }

    return response.data.Search.map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      image: !movie.Poster || movie.Poster === 'N/A' ? '' : movie.Poster,
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
  if (missingKey) return null;

  try {
    const response = await axios.get<ApiMovie>(BASE_URL, {
      params: {
        i: imdbId,
        apikey: API_KEY,
      },
    });

    if ((response.data as { Response?: string; Error?: string }).Response === 'False') {
      const errMsg = (response.data as { Error?: string }).Error || '';
      if (errMsg.toLowerCase().includes('invalid api key')) {
        console.warn('OMDb API key rejected by server.');
      }
      return null;
    }

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
