/**
 * Search History Utility
 * Manages search keyword history with cookies
 */

export interface SearchHistoryItem {
  keyword: string;
  occurredAt: string; // ISO date string
}

const COOKIE_NAME = 'search_history';
const MAX_HISTORY = 8;
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Get search history from cookies
 */
export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const cookies = document.cookie.split(';');
    const historyCookie = cookies.find((c) =>
      c.trim().startsWith(`${COOKIE_NAME}=`)
    );

    if (!historyCookie) return [];

    const value = historyCookie.split('=')[1];
    const decoded = decodeURIComponent(value);
    const history = JSON.parse(decoded) as SearchHistoryItem[];

    // Sort by occurredAt descending (most recent first)
    return history.sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
};

/**
 * Add a keyword to search history
 */
export const addSearchHistory = (keyword: string): void => {
  if (typeof window === 'undefined' || !keyword.trim()) return;

  try {
    const currentHistory = getSearchHistory();
    const trimmedKeyword = keyword.trim().toLowerCase();

    // Remove duplicate if exists
    const filteredHistory = currentHistory.filter(
      (item) => item.keyword.toLowerCase() !== trimmedKeyword
    );

    // Add new item at the beginning
    const newHistory: SearchHistoryItem[] = [
      {
        keyword: keyword.trim(),
        occurredAt: new Date().toISOString(),
      },
      ...filteredHistory,
    ].slice(0, MAX_HISTORY); // Keep only MAX_HISTORY items

    // Save to cookie
    const encoded = encodeURIComponent(JSON.stringify(newHistory));
    document.cookie = `${COOKIE_NAME}=${encoded}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Strict`;
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = (): void => {
  if (typeof window === 'undefined') return;

  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
};

/**
 * Remove a specific keyword from history
 */
export const removeSearchHistoryItem = (keyword: string): void => {
  if (typeof window === 'undefined') return;

  try {
    const currentHistory = getSearchHistory();
    const filteredHistory = currentHistory.filter(
      (item) => item.keyword.toLowerCase() !== keyword.toLowerCase()
    );

    const encoded = encodeURIComponent(JSON.stringify(filteredHistory));
    document.cookie = `${COOKIE_NAME}=${encoded}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Strict`;
  } catch (error) {
    console.error('Error removing search history item:', error);
  }
};
