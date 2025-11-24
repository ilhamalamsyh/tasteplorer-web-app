import React from 'react';

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
  const inputValue = value !== undefined ? value : internalValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };

  const handleSearch = () => {
    onSearch?.(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-lg flex items-center bg-white rounded-full shadow-sm overflow-hidden border border-gray-200 mx-auto">
      <input
        type="text"
        placeholder={placeholder || 'Search recipes, ingredients, creators...'}
        className="flex-1 px-6 py-3 text-gray-700 outline-none font-poppins rounded-l-full bg-transparent"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className="bg-primary text-white px-6 py-3 font-semibold rounded-r-full hover:bg-orange-600 transition"
        onClick={handleSearch}
        type="button"
      >
        Search
      </button>
    </div>
  );
};

export default Search;
