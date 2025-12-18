import axios from 'axios';
import { SearchResult, DetailsResult, ApiMusic } from '../lib/types';
import { formatYear, getImageUrl } from '../lib/utils';

const SEARCH_URL = 'https://itunes.apple.com/search';
const LOOKUP_URL = 'https://itunes.apple.com/lookup';

function formatRuntime(ms?: number): string | undefined {
  if (!ms) return undefined;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export async function searchMusic(query: string): Promise<SearchResult[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  try {
    const response = await axios.get<{
      results: ApiMusic[];
    }>(SEARCH_URL, {
      params: {
        term: trimmedQuery,
        media: 'music',
        entity: 'musicTrack',
        limit: 20,
      },
    });

    return response.data.results
      .filter(item => Boolean(item.trackId))
      .map(item => {
        const id = item.trackId!.toString();
        const title = item.trackName || item.collectionName || 'Untitled';
        const creator = item.artistName || 'Unknown';

        return {
          id,
          title,
          image: getImageUrl(item.artworkUrl100),
          year: item.releaseDate ? formatYear(item.releaseDate) : 'Unknown',
          creator,
          genres: item.primaryGenreName ? [item.primaryGenreName] : [],
          description: item.collectionName ? `${creator} — ${item.collectionName}` : creator,
          provider: 'itunes',
          externalId: id,
        };
      });
  } catch (error) {
    console.error('Error searching music:', error);
    return [];
  }
}

export async function getMusicDetails(trackId: string): Promise<DetailsResult | null> {
  if (!trackId.trim()) return null;

  try {
    const response = await axios.get<{
      results: ApiMusic[];
    }>(LOOKUP_URL, {
      params: {
        id: trackId,
        entity: 'musicTrack',
      },
    });

    if (!response.data.results.length) {
      return null;
    }

    const item = response.data.results.find(result => result.trackId?.toString() === trackId) || response.data.results[0];
    if (!item.trackId) return null;

    const id = item.trackId.toString();
    const creator = item.artistName || 'Unknown';

    return {
      id,
      title: item.trackName || item.collectionName || 'Untitled',
      image: getImageUrl(item.artworkUrl100),
      year: item.releaseDate ? formatYear(item.releaseDate) : 'Unknown',
      creator,
      genres: item.primaryGenreName ? [item.primaryGenreName] : [],
      description: item.collectionName ? `${creator} — ${item.collectionName}` : creator,
      provider: 'itunes',
      externalId: id,
      runtime: formatRuntime(item.trackTimeMillis),
    };
  } catch (error) {
    console.error('Error fetching music details:', error);
    return null;
  }
}

function upgradeImageUrl(url?: string): string {
  if (!url) return '';
  return url.replace('100x100', '600x600');
}

export async function getFeaturedMusic(): Promise<SearchResult[]> {
  const terms = ['taylor swift', 'drake', 'coldplay', 'daft punk', 'billie eilish'];

  try {
    const responses = await Promise.allSettled(
      terms.map(term =>
        axios.get<{ results: ApiMusic[] }>(SEARCH_URL, {
          params: {
            term,
            entity: 'album',
            limit: 5,
          },
        })
      )
    );

    const allResults: ApiMusic[] = [];
    responses.forEach(result => {
      if (result.status === 'fulfilled' && result.value.data.results) {
        allResults.push(...result.value.data.results);
      }
    });

    const seen = new Set<number>();
    const uniqueAlbums = allResults.filter(item => {
      if (!item.collectionId || seen.has(item.collectionId)) return false;
      seen.add(item.collectionId);
      return true;
    });

    return uniqueAlbums.map(item => ({
      id: String(item.collectionId || ''),
      title: item.collectionName || 'Untitled',
      year: item.releaseDate?.slice(0, 4) ?? '',
      image: upgradeImageUrl(item.artworkUrl100),
      creator: item.artistName || 'Unknown',
      genres: item.primaryGenreName ? [item.primaryGenreName] : [],
      description: '',
      provider: 'itunes',
      externalId: String(item.collectionId || ''),
    }));
  } catch (error) {
    console.error('Error fetching featured music:', error);
    return [];
  }
}
