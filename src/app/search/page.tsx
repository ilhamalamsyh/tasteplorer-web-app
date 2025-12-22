'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import Search from '@/core/components/field/Search';
import CategoryTabs, {
  CategoryTab,
} from '@/core/components/search-results/CategoryTabs';
import SubHeaderText from '@/core/components/search-results/SubHeaderText';
import FilterChips, {
  FilterChip,
} from '@/core/components/search-results/FilterChips';
import RecipeGrid from '@/core/components/search-results/RecipeGrid';
import { RECIPE_LIST_QUERY } from '@/features/recipe/services/query';

// TypeScript interfaces for GraphQL response
interface RecipeAuthor {
  id: string;
  username: string;
  image?: string;
}

interface RecipeImage {
  id: string;
  url: string;
}

interface RecipeIngredient {
  id: string;
  ingredient: string;
}

interface RecipeInstruction {
  id: string;
  instruction: string;
}

interface Recipe {
  id: string;
  title: string;
  description?: string;
  servings?: number;
  cookingTime?: number;
  author?: RecipeAuthor;
  image?: RecipeImage;
  ingredients?: RecipeIngredient[];
  instructions?: RecipeInstruction[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

interface RecipeListMeta {
  total: number;
  hasNextPage: boolean;
  endCursor?: string;
}

interface RecipeListData {
  recipeList: {
    recipes: Recipe[];
    meta: RecipeListMeta;
  };
}

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
  const router = useRouter();

  // Fetch recipes from API
  const { data, loading, error } = useQuery<RecipeListData>(RECIPE_LIST_QUERY, {
    variables: {
      search: searchQuery || undefined,
      after: undefined,
    },
    skip: !searchQuery, // Only fetch when there's a search query
  });

  // Transform API data to match RecipeCard props
  const transformRecipes = React.useMemo(() => {
    if (!data?.recipeList?.recipes) return [];

    return data.recipeList.recipes
      .slice(0, 4) // Limit to 4 items
      .map((recipe: Recipe) => ({
        id: recipe.id,
        title: recipe.title,
        img: recipe.image?.url || '/images/broken-image.png',
        author: recipe.author?.username || 'Anonymous',
        authorAvatar: recipe.author?.image || '',
        time: recipe.cookingTime ? `${recipe.cookingTime} min` : 'N/A',
        ingredients: recipe.ingredients?.length || 0,
        rating: 0, // Default rating as API doesn't provide this
        isBookmarked: false,
        menuOpen: false,
        onClick: () => router.push(`/recipes/${recipe.id}`),
        onBookmark: (e: React.MouseEvent) => {
          e.stopPropagation();
          // TODO: Implement bookmark functionality
        },
        onMenu: (e: React.MouseEvent) => {
          e.stopPropagation();
          // TODO: Implement menu functionality
        },
      }));
  }, [data, router]);

  const totalRecipes = data?.recipeList?.meta?.total || 0;

  const handleSeeAllResults = React.useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search_query', searchQuery);
    }
    const url = `/recipes${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
  }, [searchQuery, router]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header is preserved by layout.tsx */}
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8">
        {/* Card-like container for search section */}
        <div className="bg-white rounded-2xl p-6 mb-4">
          {/* Search results text above search field */}
          <div className="text-lg font-semibold text-gray-800 mb-4">
            {searchQuery ? `"${searchQuery}" search results` : 'Search results'}
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
            {totalRecipes > 0 && (
              <button
                type="button"
                className="hidden md:block text-sm text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                onClick={handleSeeAllResults}
              >
                See all {totalRecipes} results
              </button>
            )}
          </div>
          <FilterChips chips={chips} />

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-sm">
                Failed to load recipes. Please try again.
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && transformRecipes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Image
                src="/icons/not_found_icon.svg"
                alt="No results found"
                width={120}
                height={120}
                className="mb-4"
              />
              <p className="text-gray-500 text-base font-medium">
                No recipes found. Try a new keyword!
              </p>
            </div>
          )}

          {/* Recipe grid */}
          {!loading && !error && transformRecipes.length > 0 && (
            <>
              <RecipeGrid recipes={transformRecipes} />
              {/* See all button for mobile - shown below the grid */}
              {totalRecipes > 0 && (
                <div className="flex justify-center mt-6 md:hidden">
                  <button
                    type="button"
                    className="text-base md:text-sm text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                    onClick={handleSeeAllResults}
                  >
                    See all {totalRecipes} results
                  </button>
                </div>
              )}
            </>
          )}
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
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={56}
                  height={56}
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
