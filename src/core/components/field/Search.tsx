'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import SearchOverlayPanel from './SearchOverlayPanel';

interface SearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({
  placeholder,
  onSearch,
  value,
  onChange,
}) => {
  const [internalValue, setInternalValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputValue = value !== undefined ? value : internalValue;
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      router.push(
        `/search?search_query=${encodeURIComponent(inputValue.trim())}`
      );
    }
    onSearch?.(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
      setIsFocused(false); // Close overlay panel on Enter
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  // Delay blur to allow click inside overlay
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 120);
  };

  // Close overlay when clicking outside
  React.useEffect(() => {
    if (!isFocused) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFocused]);

  return (
    <div
      className="w-full max-w-lg flex flex-col items-center relative mx-auto"
      ref={wrapperRef}
    >
      <div className="w-full flex items-center bg-white rounded-full shadow-sm overflow-hidden border border-gray-200">
        <input
          ref={inputRef}
          type="text"
          placeholder={
            placeholder || 'Search recipes, ingredients, creators...'
          }
          className="flex-1 px-6 py-3 text-gray-700 outline-none font-poppins rounded-l-full bg-transparent"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button
          className="bg-primary text-white px-6 py-3 font-semibold rounded-r-full hover:bg-orange-600 transition"
          onClick={handleSearch}
          type="button"
        >
          Search
        </button>
      </div>
      {isFocused && <SearchOverlayPanel />}
    </div>
  );
};

export default Search;
