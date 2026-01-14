'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/core/components/image/Avatar';
import RecipeCard from '@/core/components/RecipeCard/RecipeCard';
import useSnackbar from '@/core/hooks/useSnackbar';
import Snackbar from '@/core/components/snackbar/Snackbar';
import { UserSuggestionCard } from './UserSuggestionCard';
import { ProfileTabs } from './ProfileTabs';
import { UserPostsList } from './UserPostsList';

// TypeScript interfaces
interface RecipeImage {
  id?: string;
  url: string;
}

interface RecipeIngredient {
  id: string;
  name?: string;
  ingredient?: string;
  quantity?: string;
  unit?: string;
}

interface RecipeInstruction {
  id: string;
  stepNumber?: number;
  instruction: string;
}

interface Recipe {
  id: string;
  title: string;
  description?: string;
  servings?: number;
  cookingTime?: number;
  createdAt?: string;
  updatedAt?: string;
  image?: RecipeImage;
  ingredients?: RecipeIngredient[];
  instructions?: RecipeInstruction[];
}

interface RecipeListMeta {
  total: number;
  endCursor?: string;
  hasNextPage: boolean;
}

interface ProfileStats {
  posts: number;
  following: number;
  followers: number;
}

interface FeedImage {
  id: string;
  imageUrl: string;
  position: number;
}

interface FeedUser {
  id: number;
  username: string;
  profileImageUrl?: string;
}

interface Feed {
  id: string;
  user: FeedUser;
  recipeId?: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  images: FeedImage[];
}

interface ProfileViewProps {
  // User data
  username: string;
  fullname: string;
  image?: string;

  // Stats
  stats: ProfileStats;

  // Recipe data
  recipes: Recipe[];
  recipesLoading: boolean;
  recipesError?: Error | null;
  recipesMeta: RecipeListMeta;

  // Callbacks
  onFetchMore?: (cursor: string) => void;
  onSearchChange?: (query: string) => void;

  // Action button props
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?: 'edit' | 'follow' | 'following';
  };

  // User Suggestions
  userSuggestions?: {
    users: Array<{
      userId: string;
      username: string;
      fullName: string;
      followerCount: number;
      mutualFollowerCount?: number;
      suggestionReason?: string;
    }>;
    loading?: boolean;
    onFollowToggle: (userId: string) => void;
    onUserClick: (userId: string) => void;
    followingUserIds?: Set<string>;
  };

  // Optional
  isOwnProfile?: boolean;
  emptyStateMessage?: string;

  // Posts/Feeds data
  feeds?: Feed[];
  feedsLoading?: boolean;
  feedsHasMore?: boolean;
  onFetchMoreFeeds?: () => void;
  activeTab?: 'posts' | 'recipes';
  onTabChange?: (tab: 'posts' | 'recipes') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  username,
  fullname,
  image,
  stats,
  recipes,
  recipesLoading,
  recipesError,
  recipesMeta,
  onFetchMore,
  onSearchChange,
  actionButton,
  userSuggestions,
  isOwnProfile = false,
  emptyStateMessage,
  feeds = [],
  feedsLoading = false,
  feedsHasMore = false,
  onFetchMoreFeeds,
  activeTab = 'recipes',
  onTabChange,
}) => {
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

  // Trigger search callback when debounced query changes
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearchChange]);

  // Handle recipes error
  useEffect(() => {
    if (recipesError) {
      showError(recipesError.message || 'Failed to load recipes');
    }
  }, [recipesError, showError]);

  // Infinite scroll
  useEffect(() => {
    if (!recipesMeta.hasNextPage || recipesLoading || isFetchingMore) return;
    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && recipesMeta.endCursor && onFetchMore) {
          setIsFetchingMore(true);
          onFetchMore(recipesMeta.endCursor);
          // Reset fetching state after a delay
          setTimeout(() => setIsFetchingMore(false), 1000);
        }
      },
      { threshold: 1 }
    );
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [
    recipesMeta.hasNextPage,
    recipesMeta.endCursor,
    recipesLoading,
    onFetchMore,
    isFetchingMore,
  ]);

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

  // Get button styling based on variant
  const getButtonStyle = () => {
    if (!actionButton) return '';

    switch (actionButton.variant) {
      case 'edit':
        return 'w-full py-2 border-2 border-black text-black font-semibold rounded-3xl hover:bg-black hover:bg-opacity-5 transition active:scale-95';
      case 'following':
        return 'w-full py-2 bg-gray-200 text-gray-700 font-semibold rounded-3xl hover:bg-gray-300 transition active:scale-95';
      case 'follow':
      default:
        return 'w-full py-2 bg-primary text-white font-semibold rounded-3xl hover:bg-orange-600 transition active:scale-95';
    }
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
              <p className="font-semibold">{stats.posts}</p>
              <p className="text-gray-500 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{stats.following}</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{stats.followers}</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
          </div>

          {/* Action Button */}
          {actionButton && (
            <div className="flex justify-center">
              <button
                type="button"
                className={getButtonStyle()}
                onClick={actionButton.onClick}
              >
                {actionButton.label}
              </button>
            </div>
          )}

          {/* User Suggestions Section */}
          {userSuggestions && userSuggestions.users.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4 text-left">
                Suggested for you
              </h2>

              {userSuggestions.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-3 pb-2">
                    {userSuggestions.users.map((user) => (
                      <div
                        key={user.userId}
                        className="flex-shrink-0 w-[160px]"
                      >
                        <UserSuggestionCard
                          user={user}
                          isFollowing={userSuggestions.followingUserIds?.has(
                            user.userId
                          )}
                          onFollowToggle={userSuggestions.onFollowToggle}
                          onUserClick={userSuggestions.onUserClick}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Content Section with Tabs */}
      <div className="w-full py-6 sm:py-8 md:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
          {/* Tabs */}
          {onTabChange && (
            <div className="mb-6">
              <ProfileTabs activeTab={activeTab} onTabChange={onTabChange} />
            </div>
          )}

          {/* Posts Tab Content */}
          {activeTab === 'posts' && (
            <UserPostsList
              feeds={feeds}
              loading={feedsLoading}
              hasMore={feedsHasMore}
              onFetchMore={onFetchMoreFeeds}
              isOwnProfile={isOwnProfile}
            />
          )}

          {/* Recipes Tab Content */}
          {activeTab === 'recipes' && (
            <>
              {/* Search Field */}
              <div className="mb-6 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search recipes..."
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
                    {searchQuery
                      ? 'No recipes found'
                      : emptyStateMessage || 'No cooking activity yet.'}
                  </h2>
                  <p className="text-gray-500 mb-4">
                    {searchQuery
                      ? 'Try a different search term'
                      : isOwnProfile
                      ? 'From your kitchen to the world - Share your recipes!'
                      : 'This user has not posted any recipes yet.'}
                  </p>
                  {!searchQuery && isOwnProfile && (
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
                      authorAvatar={image || ''}
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
              {!recipesMeta.hasNextPage && recipes.length > 0 && (
                <div className="text-center text-gray-400 py-8">
                  No more recipes
                </div>
              )}
            </>
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
