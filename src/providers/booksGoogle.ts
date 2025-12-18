import axios from 'axios';
import { SearchResult, DetailsResult, ApiBook } from '../lib/types';
import { formatYear, getImageUrl } from '../lib/utils';

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
  console.warn('VITE_GOOGLE_BOOKS_API_KEY not configured. Books search will not work.');
}

export async function searchBooks(query: string): Promise<SearchResult[]> {
  if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
    return [];
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  try {
    const response = await axios.get<{
      items?: ApiBook[];
    }>(BASE_URL, {
      params: {
        q: trimmedQuery,
        key: API_KEY,
        maxResults: 20,
        printType: 'books',
      },
    });

    return (response.data.items || []).map(book => {
      const volumeInfo = book.volumeInfo || {};
      const title = volumeInfo.title || 'Untitled';

      return {
        id: book.id,
        title,
        image: getImageUrl(volumeInfo.imageLinks?.thumbnail),
        year: volumeInfo.publishedDate ? formatYear(volumeInfo.publishedDate) : 'Unknown',
        creator: volumeInfo.authors?.join(', ') || 'Unknown',
        genres: volumeInfo.categories || [],
        description: volumeInfo.description || '',
        provider: 'google-books',
        externalId: book.id,
      };
    });
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
}

export async function getBookDetails(bookId: string): Promise<DetailsResult | null> {
  if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
    return null;
  }

  try {
    const response = await axios.get<ApiBook>(`${BASE_URL}/${bookId}`, {
      params: {
        key: API_KEY,
      },
    });

    const volumeInfo = response.data.volumeInfo || {};
    const runtime = volumeInfo.pageCount ? `${volumeInfo.pageCount} pages` : undefined;

    return {
      id: response.data.id,
      title: volumeInfo.title || 'Untitled',
      image: getImageUrl(volumeInfo.imageLinks?.thumbnail),
      year: volumeInfo.publishedDate ? formatYear(volumeInfo.publishedDate) : 'Unknown',
      creator: volumeInfo.authors?.join(', ') || 'Unknown',
      genres: volumeInfo.categories || [],
      description: volumeInfo.description || '',
      provider: 'google-books',
      externalId: response.data.id,
      runtime,
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
}
