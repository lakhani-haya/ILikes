import axios from 'axios';
import { SearchResult, DetailsResult, ApiMovie } from '../lib/types';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
  console.warn('VITE_OMDB_API_KEY not configured. Movies search will not work.');
}

export async function searchMovies(query: string): Promise<SearchResult[]> {
  if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
    return [];
  }

  try {
    const response = await axios.get<{
      Search?: ApiMovie[];
      Response: string;
      Error?: string;
    }>(BASE_URL, {
      params: {
        s: query,
        type: 'movie',
        apikey: API_KEY,
      },
    });

    if (response.data.Response === 'False') {
      return [];
    }

    return (response.data.Search || []).map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      image: movie.Poster,
      year: movie.Year,
      creator: movie.Director,
      genres: movie.Genre.split(',').map(g => g.trim()),
      description: movie.Plot,
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

    return {
      id: response.data.imdbID,
      title: response.data.Title,
      image: response.data.Poster,
      year: response.data.Year,
      creator: response.data.Director,
      genres: response.data.Genre.split(',').map(g => g.trim()),
      description: response.data.Plot,
      provider: 'omdb',
      externalId: response.data.imdbID,
      runtime: response.data.Runtime,
      rating: response.data.imdbRating,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}
