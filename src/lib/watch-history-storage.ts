const STORAGE_KEY = 'moonplay_history';
const MAX_HISTORY_ITEMS = 50;

export interface WatchHistoryEntry {
  slug: string;
  name: string;
  origin_name: string;
  thumb_url: string;
  episode_slug: string;
  episode_name: string;
  timestamp: number;
}

/**
 * Add an entry to watch history
 * Deduplicates by slug+episode_slug, keeps newest first, max 50 items
 */
export function addToHistory(entry: WatchHistoryEntry): void {
  try {
    const history = getHistory();

    // Remove existing entry with same slug+episode_slug
    const filtered = history.filter(
      item => !(item.slug === entry.slug && item.episode_slug === entry.episode_slug)
    );

    // Add new entry at the beginning
    const updated = [entry, ...filtered];

    // Limit to max items
    const limited = updated.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Failed to save watch history:', error);
  }
}

/**
 * Get all watch history entries, newest first
 */
export function getHistory(): WatchHistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load watch history:', error);
    return [];
  }
}

/**
 * Clear all watch history
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear watch history:', error);
  }
}
