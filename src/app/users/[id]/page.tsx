'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { USER_PROFILE_QUERY } from '@/features/user/services/query';
import { USER_RECIPE_LIST_QUERY } from '@/features/recipe/services/query';
import { USER_FEEDS_QUERY } from '@/features/feed/services/query';
import { ProfileView } from '@/features/user/components/ProfileView';
import useSnackbar from '@/core/hooks/useSnackbar';
import { CURRENT_USER } from '@/features/user/services/query';
import useFollowUser from '@/features/user/hooks/useFollowUser';
import LoginModal from '@/features/auth/components/LoginModal';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import { usePathname } from 'next/navigation';

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userIdInt, setUserIdInt] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'recipes'>('recipes');
  const { showError } = useSnackbar();
  const { user: authUser, loading: authLoading } = useAuth();
  const { previousPath } = useNavigation();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { toggleFollow } = useFollowUser();
  useQuery(CURRENT_USER, {
    fetchPolicy: 'cache-first',
  });

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);

  // Resolve params
  useEffect(() => {
    params.then((resolvedParams) => {
      setUserId(resolvedParams.id);
      setUserIdInt(parseInt(resolvedParams.id, 10));
    });
  }, [params]);

  // Fetch user profile
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(USER_PROFILE_QUERY, {
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  // derive initial follow state once profile is available
  useEffect(() => {
    if (!userData?.userProfile) return;
    // prefer API-provided flag rather than scanning lists
    const apiIsFollowing = !!userData.userProfile.isFollowedByMe;
    setIsFollowing(apiIsFollowing);
  }, [userData]);

  // Fetch user's recipes
  const {
    loading: recipesLoading,
    error: recipesError,
    data: recipesData,
    fetchMore: fetchMoreRecipes,
  } = useQuery(USER_RECIPE_LIST_QUERY, {
    variables: {
      userId: userIdInt,
      search: searchQuery || undefined,
      limit: 24,
      after: undefined,
    },
    skip: !userIdInt,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  // Fetch user's feeds
  const {
    loading: feedsLoading,
    data: feedsData,
    fetchMore: fetchMoreFeeds,
  } = useQuery(USER_FEEDS_QUERY, {
    variables: {
      userId: userIdInt,
      cursor: null,
      limit: 10,
    },
    skip: !userIdInt,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  // Handle user profile error
  useEffect(() => {
    if (userError) {
      const errorMessage = (userError.message || '').toLowerCase();

      // If error looks like an auth/token issue, show login modal similar to ProtectedRoute
      if (
        !authLoading &&
        !authUser &&
        (errorMessage.includes('token') ||
          errorMessage.includes('unauthorized') ||
          errorMessage.includes('not authenticated') ||
          errorMessage.includes('invalid'))
      ) {
        setShowLoginModal(true);
        return;
      }

      showError(userError.message || 'Failed to load user profile');
    }
  }, [userError, showError, authLoading, authUser]);

  const handleCloseLoginModal = () => {
    if (previousPath && previousPath !== pathname) {
      router.push(previousPath);
    } else {
      router.push('/');
    }
    setShowLoginModal(false);
  };

  if (userLoading || !userId) return <p>Loading...</p>;
  if (userError || !userData?.userProfile) {
    if (showLoginModal) {
      return (
        <LoginModal
          isOpen={true}
          onClose={handleCloseLoginModal}
          isMobileFullScreen={true}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Image
          src="/images/broken-image.png"
          alt="Error"
          width={128}
          height={128}
          className="mb-6 opacity-60"
        />
        <h2 className="text-2xl font-bold mb-2 text-gray-700">
          User Not Found
        </h2>
        <p className="text-gray-500 mb-4">
          Sorry, the user you are looking for does not exist.
        </p>
        <button
          onClick={() => router.push('/users')}
          className="text-primary font-semibold hover:underline"
        >
          Back to Users
        </button>
      </div>
    );
  }

  const {
    username,
    fullname,
    image,
    totalFollowers,
    totalFollowing,
    totalPosts,
    isMe,
  } = userData.userProfile;
  const recipes = recipesData?.userRecipeList?.recipes || [];
  const recipesMeta = recipesData?.userRecipeList?.meta || {
    total: 0,
    hasNextPage: false,
    endCursor: null,
  };

  const feeds = feedsData?.userFeeds?.feeds || [];
  const feedsHasMore = feedsData?.userFeeds?.hasMore || false;

  const handleFetchMoreRecipes = (cursor: string) => {
    fetchMoreRecipes({
      variables: { after: cursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          userRecipeList: {
            ...fetchMoreResult.userRecipeList,
            recipes: [
              ...prev.userRecipeList.recipes,
              ...fetchMoreResult.userRecipeList.recipes,
            ],
          },
        };
      },
    });
  };

  const handleFetchMoreFeeds = () => {
    if (!feedsHasMore || feedsLoading) return;

    const nextCursor = feedsData?.userFeeds?.nextCursor;
    if (!nextCursor) return;

    fetchMoreFeeds({
      variables: { cursor: nextCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          userFeeds: {
            ...fetchMoreResult.userFeeds,
            feeds: [
              ...prev.userFeeds.feeds,
              ...fetchMoreResult.userFeeds.feeds,
            ],
          },
        };
      },
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFollowClick = () => {
    if (!userIdInt) return;

    const prev = isFollowing;

    // optimistic UI
    setIsFollowing(!prev);
    setIsFollowLoading(true);

    toggleFollow(userIdInt, prev, {
      onErrorRevert: () => {
        setIsFollowing(prev);
      },
    }).finally(() => {
      setIsFollowLoading(false);
    });
  };

  const handleTabChange = (tab: 'posts' | 'recipes') => {
    setActiveTab(tab);
  };

  return (
    <ProfileView
      userId={userIdInt || 0}
      username={username}
      fullname={fullname}
      image={image}
      stats={{
        posts: totalPosts || feeds.length,
        following: totalFollowing || 0,
        followers: totalFollowers || 0,
      }}
      recipes={recipes}
      recipesLoading={recipesLoading}
      recipesError={recipesError}
      recipesMeta={recipesMeta}
      onFetchMore={handleFetchMoreRecipes}
      onSearchChange={handleSearchChange}
      actionButton={
        isMe
          ? undefined
          : {
              label: isFollowLoading
                ? '...'
                : isFollowing
                ? 'Following'
                : 'Follow',
              onClick: handleFollowClick,
              variant: isFollowing ? 'following' : 'follow',
            }
      }
      isOwnProfile={false}
      emptyStateMessage="No recipes yet."
      feeds={feeds}
      feedsLoading={feedsLoading}
      feedsHasMore={feedsHasMore}
      onFetchMoreFeeds={handleFetchMoreFeeds}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
}
