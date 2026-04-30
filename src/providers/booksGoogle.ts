import axios from 'axios';
import { SearchResult, DetailsResult, ApiBook } from '../lib/types';

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
  console.warn('VITE_GOOGLE_BOOKS_API_KEY not configured. Books search will not work.');
}

export async function searchBooks(query: string): Promise<SearchResult[]> {
  if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
    return [];
  }

  try {
    const response = await axios.get<{
      items?: ApiBook[];
    }>(BASE_URL, {
      params: {
        q: query,
        key: API_KEY,
        maxResults: 20,
      },
    });

    return (response.data.items || []).map(book => {
      const volumeInfo = book.volumeInfo;
      return {
        id: book.id,
        title: volumeInfo.title,
        image: volumeInfo.imageLinks?.thumbnail || '',
        year: volumeInfo.publishedDate || 'Unknown',
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

    const volumeInfo = response.data.volumeInfo;
    return {
      id: response.data.id,
      title: volumeInfo.title,
      image: volumeInfo.imageLinks?.thumbnail || '',
      year: volumeInfo.publishedDate || 'Unknown',
      creator: volumeInfo.authors?.join(', ') || 'Unknown',
      genres: volumeInfo.categories || [],
      description: volumeInfo.description || '',
      provider: 'google-books',
      externalId: response.data.id,
      runtime: `${volumeInfo.pageCount} pages`,
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
}
