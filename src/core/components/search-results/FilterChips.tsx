import React from 'react';

export type FilterChip = {
  label: string;
  value: string;
  active?: boolean;
};

interface FilterChipsProps {
  chips: FilterChip[];
  onClick?: (value: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ chips, onClick }) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {chips.map((chip) => (
      <button
        key={chip.value}
        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
          chip.active
            ? 'bg-primary text-white border-primary'
            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
        }`}
        onClick={() => onClick?.(chip.value)}
        type="button"
      >
        {chip.label}
      </button>
    ))}
  </div>
);

export default FilterChips;
