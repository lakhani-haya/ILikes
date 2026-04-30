import axios from 'axios';
import { SearchResult, DetailsResult, ApiMusic } from '../lib/types';

const BASE_URL = 'https://itunes.apple.com/search';

export async function searchMusic(query: string): Promise<SearchResult[]> {
  try {
    const response = await axios.get<{
      results: ApiMusic[];
    }>(BASE_URL, {
      params: {
        term: query,
        entity: 'song,album,artist',
        limit: 20,
      },
    });

    return response.data.results.map(item => ({
      id: item.trackId.toString(),
      title: item.trackName || item.collectionName || item.artistName,
      image: item.artworkUrl100 || '',
      year: item.releaseDate || 'Unknown',
      creator: item.artistName,
      genres: item.primaryGenreName ? [item.primaryGenreName] : [],
      description: `${item.artistName} - ${item.collectionName || 'Single'}`,
      provider: 'itunes',
      externalId: item.trackId.toString(),
    }));
  } catch (error) {
    console.error('Error searching music:', error);
    return [];
  }
}

export async function getMusicDetails(trackId: string): Promise<DetailsResult | null> {
  try {
    const response = await axios.get<{
      results: ApiMusic[];
    }>(BASE_URL, {
      params: {
        id: trackId,
        entity: 'song',
      },
    });

    if (!response.data.results.length) {
      return null;
    }

    const item = response.data.results[0];
    return {
      id: item.trackId.toString(),
      title: item.trackName,
      image: item.artworkUrl100 || '',
      year: item.releaseDate || 'Unknown',
      creator: item.artistName,
      genres: item.primaryGenreName ? [item.primaryGenreName] : [],
      description: `${item.artistName} - ${item.collectionName || 'Single'}`,
      provider: 'itunes',
      externalId: item.trackId.toString(),
      runtime: `$${item.trackPrice}`,
    };
  } catch (error) {
    console.error('Error fetching music details:', error);
    return null;
  }
}
