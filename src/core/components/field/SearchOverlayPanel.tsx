'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  getSearchHistory,
  removeSearchHistoryItem,
  clearSearchHistory,
  type SearchHistoryItem,
} from '@/utils/search-history';

interface SearchOverlayPanelProps {
  onHistoryClick?: (keyword: string) => void;
}

const SearchOverlayPanel: React.FC<SearchOverlayPanelProps> = ({
  onHistoryClick,
}) => {
  const [history, setHistory] = React.useState<SearchHistoryItem[]>([]);
  const router = useRouter();

  // Load search history on mount
  React.useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  const handleChipClick = (keyword: string) => {
    onHistoryClick?.(keyword);
    router.push(`/search?search_query=${encodeURIComponent(keyword)}`);
  };

  const handleRemoveItem = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    removeSearchHistoryItem(keyword);
    setHistory(getSearchHistory());
  };

  const handleClearAll = () => {
    clearSearchHistory();
    setHistory([]);
  };

  return (
    <div className="absolute left-0 top-full z-20 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-200 overflow-y-auto mt-2">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-base text-left">
              Riwayat Pencarian
            </h3>
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                title="Clear all history"
                aria-label="Clear all search history"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
          {history.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {history.map((item, index) => (
                <button
                  key={`${item.keyword}-${index}`}
                  onClick={() => handleChipClick(item.keyword)}
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                  <span>{item.keyword}</span>
                  <span
                    onClick={(e) => handleRemoveItem(e, item.keyword)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-600"
                    title="Remove"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No recent searches</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-base text-left">
            Pencarian Populer
          </h3>
          {/* Dummy list here */}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-base text-left">
            Destinasi Trending
          </h3>
          {/* Dummy list here */}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlayPanel;
