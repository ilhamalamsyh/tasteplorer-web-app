import React from 'react';

export type CategoryTab = {
  label: string;
  value: string;
};

interface CategoryTabsProps {
  tabs: CategoryTab[];
  active: string;
  onChange: (value: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  tabs,
  active,
  onChange,
}) => (
  <div className="flex gap-2 mt-6 mb-2">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
          active === tab.value
            ? 'bg-primary text-white shadow'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => onChange(tab.value)}
        type="button"
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default CategoryTabs;
