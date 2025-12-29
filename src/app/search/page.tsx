'use client';
import React, { useState } from 'react';
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
import UserCard from '@/core/components/UserCard/UserCard';
import { RECIPE_LIST_QUERY } from '@/features/recipe/services/query';
import { USERS_QUERY } from '@/features/user/services/query';

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

// User interfaces
interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersData {
  users: {
    data: User[];
    total: number;
    nextCursor?: string;
    hasMore: boolean;
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

const SearchResultsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(categoryTabs[0].value);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chips, setChips] = React.useState(filterChips);
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search_query') || '';
  const router = useRouter();
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());

  // Fetch recipes from API
  const { data, loading, error } = useQuery<RecipeListData>(RECIPE_LIST_QUERY, {
    variables: {
      search: searchQuery || undefined,
      after: undefined,
    },
    skip: !searchQuery, // Only fetch when there's a search query
  });

  // Fetch users from API
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery<UsersData>(USERS_QUERY, {
    variables: {
      input: {
        search: searchQuery || undefined,
        cursor: null,
        limit: 4,
      },
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
  const users = usersData?.users?.data || [];
  const totalUsers = usersData?.users?.total || 0;

  const handleSeeAllResults = React.useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search_query', searchQuery);
    }
    const url = `/recipes${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
  }, [searchQuery, router]);

  const handleSeeAllUsers = React.useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search_query', searchQuery);
    }
    const url = `/users${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
  }, [searchQuery, router]);

  const handleUserClick = (userId: string) => {
    // TODO: Navigate to user profile
    console.log('Navigate to user:', userId);
  };

  const handleFollowToggle = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowingUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
    // TODO: Implement API call to follow/unfollow user
  };

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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Users</h2>
            {totalUsers > 0 && (
              <button
                type="button"
                className="hidden md:block text-sm text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                onClick={handleSeeAllUsers}
              >
                See all {totalUsers} results
              </button>
            )}
          </div>

          {/* Users Loading state */}
          {usersLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Users Error state */}
          {usersError && (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">
                Failed to load users. Please try again.
              </p>
            </div>
          )}

          {/* Users Empty state */}
          {!usersLoading && !usersError && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <Image
                src="/icons/not_found_icon.svg"
                alt="No users found"
                width={100}
                height={100}
                className="mb-4 opacity-50"
              />
              <p className="text-gray-500 text-sm">
                No users found. Try a different keyword!
              </p>
            </div>
          )}

          {/* Users Grid */}
          {!usersLoading && !usersError && users.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    variant="list"
                    isFollowing={followingUsers.has(user.id)}
                    onFollowToggle={handleFollowToggle}
                    onClick={handleUserClick}
                  />
                ))}
              </div>
              {/* See all button for mobile - shown below the grid */}
              {totalUsers > 0 && (
                <div className="flex justify-center mt-6 md:hidden">
                  <button
                    type="button"
                    className="text-base md:text-sm text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                    onClick={handleSeeAllUsers}
                  >
                    See all {totalUsers} results
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
