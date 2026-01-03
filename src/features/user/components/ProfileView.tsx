'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { CURRENT_USER, MY_RECIPE_LIST_QUERY } from '../services/query';
import { client } from '@/lib/apollo-client';
import { Avatar } from '@/core/components/image/Avatar';
import RecipeCard from '@/core/components/RecipeCard/RecipeCard';
import useSnackbar from '@/core/hooks/useSnackbar';
import Snackbar from '@/core/components/snackbar/Snackbar';

// TypeScript interfaces
interface RecipeImage {
  id: string;
  url: string;
}

interface RecipeIngredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface RecipeInstruction {
  id: string;
  stepNumber: number;
  instruction: string;
}

interface RecipeAuthor {
  id: string;
  name: string;
  email: string;
}

interface MyRecipe {
  id: string;
  title: string;
  description?: string;
  servings?: number;
  cookingTime?: number;
  createdAt: string;
  updatedAt: string;
  image?: RecipeImage;
  ingredients?: RecipeIngredient[];
  instructions?: RecipeInstruction[];
  author?: RecipeAuthor;
}

interface MyRecipeListData {
  myRecipeList: {
    recipes: MyRecipe[];
    meta: {
      total: number;
      endCursor?: string;
      hasNextPage: boolean;
    };
  };
}

export const ProfileView = () => {
  const router = useRouter();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const {
    error: snackbarError,
    showError,
    handleCloseSnackbar,
  } = useSnackbar();

  // Debounce search query - 500ms delay, minimum 3 characters
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery.length === 0) {
        setDebouncedSearchQuery(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch current user
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(CURRENT_USER, {
    client,
    fetchPolicy: 'network-only',
  });

  // Fetch user's recipes
  const {
    loading: recipesLoading,
    error: recipesError,
    data: recipesData,
    fetchMore,
  } = useQuery<MyRecipeListData>(MY_RECIPE_LIST_QUERY, {
    variables: {
      search: debouncedSearchQuery || undefined,
      limit: 24,
      after: undefined,
    },
    skip: !userData?.currentUser, // Skip until user data is loaded
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  // Handle token expired error
  useEffect(() => {
    if (userError) {
      const errorMessage = userError.message.toLowerCase();
      if (
        errorMessage.includes('token') &&
        (errorMessage.includes('expired') ||
          errorMessage.includes('invalid') ||
          errorMessage.includes('unauthorized'))
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showError('Token expired. Please login again.');
        setTimeout(() => {
          router.push('/');
        }, 2000);
        return;
      }
    }
  }, [userError, showError, router]);

  // Handle recipes error
  useEffect(() => {
    if (recipesError) {
      showError(recipesError.message || 'Failed to load recipes');
    }
  }, [recipesError, showError]);

  const recipes = recipesData?.myRecipeList?.recipes || [];
  const meta = recipesData?.myRecipeList?.meta || {
    total: 0,
    hasNextPage: false,
  };

  // Infinite scroll
  useEffect(() => {
    if (!meta.hasNextPage || recipesLoading || isFetchingMore) return;
    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && meta.endCursor) {
          setIsFetchingMore(true);
          fetchMore({
            variables: { after: meta.endCursor },
            updateQuery: (prev, { fetchMoreResult }) => {
              setIsFetchingMore(false);
              if (!fetchMoreResult) return prev;
              return {
                myRecipeList: {
                  ...fetchMoreResult.myRecipeList,
                  recipes: [
                    ...prev.myRecipeList.recipes,
                    ...fetchMoreResult.myRecipeList.recipes,
                  ],
                },
              };
            },
          });
        }
      },
      { threshold: 1 }
    );
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [
    meta.hasNextPage,
    meta.endCursor,
    recipesLoading,
    fetchMore,
    isFetchingMore,
  ]);

  if (userLoading) return <p>Loading...</p>;
  if (userError && !userError.message.toLowerCase().includes('token'))
    return <p>Error: {userError.message}</p>;

  const { username, fullname, image } = userData.currentUser;

  const handleCardClick = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleBookmark = (idx: number, e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    // TODO: Implement bookmark functionality
  };

  const handleMenu = (idx: number, e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    setOpenMenuIndex(idx === openMenuIndex ? null : idx);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      {/* Profile Section */}
      <main className="max-w-3xl mx-auto px-4 md:px-20 lg:px-40 py-8">
        <div className="flex flex-col text-center mb-8">
          <Avatar
            imageUrl={image}
            fullName={fullname}
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-xl font-semibold mb-1 mx-auto text-center truncate max-w-[200px] sm:max-w-[200px] md:max-w-[350px] lg:max-w-[400px]">
            {fullname}
          </h1>
          <p className="text-gray-500 mb-4">{`@${username}`}</p>
          <div className="flex justify-center gap-6 mb-4">
            <div className="text-center">
              <p className="font-semibold">{meta.total}</p>
              <p className="text-gray-500 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">0</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">0</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
          </div>
          <Link href={'/profile/edit'} className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 border-2 border-black text-black font-semibold rounded-3xl hover:bg-black hover:bg-opacity-5 transition active:scale-95"
            >
              Edit Profile
            </button>
          </Link>
        </div>
      </main>

      {/* Recipe Section */}
      <div className="w-full py-6 sm:py-8 md:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
          {/* Search Field */}
          <div className="mb-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Loading State */}
          {recipesLoading && recipes.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Empty State */}
          {!recipesLoading && recipes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 mx-auto mb-4">
                <Image
                  src="https://global-web-assets.cpcdn.com/assets/empty_states/no_results-8613ba06d717993e5429d9907d209dc959106472a8a4089424f1b0ccbbcd5fa9.svg"
                  alt="Empty bowl"
                  width={64}
                  height={64}
                  className="opacity-50"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No recipes found' : 'No cooking activity yet.'}
              </h2>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? 'Try a different search term'
                  : 'From your kitchen to the world - Share your recipes!'}
              </p>
              {!searchQuery && (
                <button className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-3xl hover:bg-orange-600 transition">
                  Post
                </button>
              )}
            </div>
          )}

          {/* Recipe Grid */}
          {recipes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 justify-items-center">
              {recipes.map((recipe, idx) => (
                <RecipeCard
                  key={recipe.id}
                  title={recipe.title}
                  img={recipe.image?.url || '/images/broken-image.png'}
                  rating={0}
                  ingredients={recipe.ingredients?.length || 0}
                  author={fullname}
                  authorAvatar={image}
                  isBookmarked={false}
                  time={
                    recipe.cookingTime ? `${recipe.cookingTime} min` : 'N/A'
                  }
                  onClick={() => handleCardClick(recipe.id)}
                  onBookmark={(e) => handleBookmark(idx, e)}
                  onMenu={(e) => handleMenu(idx, e)}
                  menuOpen={openMenuIndex === idx}
                />
              ))}
            </div>
          )}

          {/* Loader for infinite scroll */}
          <div ref={loaderRef} className="h-8 mt-4" />
          {(recipesLoading || isFetchingMore) && recipes.length > 0 && (
            <div className="flex justify-center py-6">
              <span className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
            </div>
          )}
          {!meta.hasNextPage && recipes.length > 0 && (
            <div className="text-center text-gray-400 py-8">
              No more recipes
            </div>
          )}
        </div>
      </div>

      {/* Snackbar for error messages */}
      <Snackbar
        variant="error"
        message={snackbarError}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};
