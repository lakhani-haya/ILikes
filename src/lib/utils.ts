export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatYear(year: string | number): string {
  const y = typeof year === 'string' ? year : year.toString();
  return y.split('-')[0] || 'Unknown';
}

export function getImageUrl(url: string | undefined): string {
  if (!url || url === 'N/A') {
    return 'https://via.placeholder.com/300x450?text=No+Image';
  }
  return url;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getMonthYear(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getAvailableGenres(items: any[]): string[] {
  const genreSet = new Set<string>();
  items.forEach((item) => {
    if (item.genreSnapshot && Array.isArray(item.genreSnapshot)) {
      item.genreSnapshot.forEach((g: string) => {
        if (g && g.trim()) {
          genreSet.add(g.trim());
        }
      });
    }
  });
  return Array.from(genreSet).sort();
}
