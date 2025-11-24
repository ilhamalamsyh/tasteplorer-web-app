'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Search from '@/core/components/field/Search';
import CategoryTabs, {
  CategoryTab,
} from '@/core/components/search-results/CategoryTabs';
import SubHeaderText from '@/core/components/search-results/SubHeaderText';
import FilterChips, {
  FilterChip,
} from '@/core/components/search-results/FilterChips';
import RecipeGrid from '@/core/components/search-results/RecipeGrid';

const categoryTabs: CategoryTab[] = [
  { label: 'Everything', value: 'everything' },
  { label: 'Recipes', value: 'recipes' },
  { label: 'Communities', value: 'communities' },
  { label: 'Users', value: 'users' },
  { label: 'Ingredients', value: 'ingredients' },
];

const filterChips: FilterChip[] = [
  { label: 'Ingredients', value: 'ingredients' },
  { label: 'Meal type', value: 'meal-type' },
  { label: 'Diet', value: 'diet' },
  { label: 'Cook time', value: 'cook-time' },
  { label: 'Cuisine', value: 'cuisine' },
  { label: 'Nutrition', value: 'nutrition' },
];

const dummyRecipes = [
  {
    title: 'Spicy Chicken Curry',
    img: '/images/broken-image.png',
    author: 'John Doe',
    time: '45 min',
  },
  {
    title: 'Vegan Avocado Toast',
    img: '/images/broken-image.png',
    author: 'Jane Smith',
    time: '15 min',
  },
  {
    title: 'Classic Beef Stew',
    img: '/images/broken-image.png',
    author: 'Chef Mike',
    time: '1 hr',
  },
  {
    title: 'Fresh Summer Salad',
    img: '/images/broken-image.png',
    author: 'Anna Lee',
    time: '20 min',
  },
];

const dummyUsers = [
  {
    name: 'Ilham Osa',
    avatar: '/images/broken-image.png',
    bio: 'Food lover & chef.',
  },
  {
    name: 'Jane Doe',
    avatar: '/images/broken-image.png',
    bio: 'Recipe creator.',
  },
  {
    name: 'John Smith',
    avatar: '/images/broken-image.png',
    bio: 'Healthy food enthusiast.',
  },
];

const SearchResultsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(categoryTabs[0].value);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chips, setChips] = React.useState(filterChips);
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search_query') || '';

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header is preserved by layout.tsx */}
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8">
        {/* Card-like container for search section */}
        <div className="bg-white rounded-2xl p-6 mb-4">
          {/* Search results text above search field */}
          <div className="text-lg font-semibold text-gray-800 mb-4">
            {searchQuery ? `“${searchQuery}” search results` : 'Search results'}
          </div>
          <Search />
          <CategoryTabs
            tabs={categoryTabs}
            active={activeTab}
            onChange={setActiveTab}
          />
          <SubHeaderText />
          <div className="flex items-center justify-between mt-6 mb-2">
            <h2 className="text-xl font-bold text-gray-900">Recipes</h2>
          </div>
          <FilterChips chips={chips} />
          <RecipeGrid recipes={dummyRecipes} />
        </div>
        {/* Users section below the card container */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Users</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dummyUsers.map((user, idx) => (
              <div
                key={user.name + idx}
                className="flex flex-col items-center p-4 rounded-xl bg-gray-100"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full mb-2 object-cover"
                />
                <div className="font-semibold text-gray-800 text-sm mb-1">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {user.bio}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
