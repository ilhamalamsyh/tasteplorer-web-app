'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import {
  CURRENT_USER,
  MY_RECIPE_LIST_QUERY,
  USER_SUGGESTION_LIST_QUERY,
} from '@/features/user/services/query';
import { USER_FEEDS_QUERY } from '@/features/feed/services/query';
import { client } from '@/lib/apollo-client';
import { ProfileView } from '@/features/user/components/ProfileView';
import useSnackbar from '@/core/hooks/useSnackbar';

export default function ProfileContent() {
  const router = useRouter();
  const { showError } = useSnackbar();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [followingUserIds, setFollowingUserIds] = React.useState<Set<string>>(
    new Set()
  );
  const [activeTab, setActiveTab] = React.useState<'posts' | 'recipes'>(
    'posts'
  );

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
    fetchMore: fetchMoreRecipes,
  } = useQuery(MY_RECIPE_LIST_QUERY, {
    variables: {
      search: searchQuery || undefined,
      limit: 24,
      after: undefined,
    },
    skip: !userData?.currentUser || activeTab !== 'recipes',
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  // Fetch user's feeds/posts
  const {
    loading: feedsLoading,
    error: feedsError,
    data: feedsData,
    fetchMore: fetchMoreFeeds,
  } = useQuery(USER_FEEDS_QUERY, {
    variables: {
      userId: userData?.currentUser?.id ? parseInt(userData.currentUser.id) : 0,
      cursor: null,
      limit: 10,
    },
    skip: !userData?.currentUser || activeTab !== 'posts',
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  // Fetch user suggestions
  const { loading: suggestionsLoading, data: suggestionsData } = useQuery(
    USER_SUGGESTION_LIST_QUERY,
    {
      variables: {
        limit: 10,
        offset: 0,
      },
      skip: !userData?.currentUser,
      fetchPolicy: 'network-only',
    }
  );

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

  // Handle feeds error
  useEffect(() => {
    if (feedsError) {
      showError(feedsError.message || 'Failed to load posts');
    }
  }, [feedsError, showError]);

  if (userLoading) return <p>Loading...</p>;
  if (userError && !userError.message.toLowerCase().includes('token'))
    return <p>Error: {userError.message}</p>;

  if (!userData?.currentUser) {
    return <p>Loading...</p>;
  }

  const { username, fullname, image } = userData.currentUser;
  const recipes = recipesData?.myRecipeList?.recipes || [];
  const recipesMeta = recipesData?.myRecipeList?.meta || {
    total: 0,
    hasNextPage: false,
  };
  const feeds = feedsData?.userFeeds?.feeds || [];
  const feedsHasMore = feedsData?.userFeeds?.hasMore || false;
  const suggestions = suggestionsData?.userSuggestionList?.users || [];

  const handleFetchMoreRecipes = (cursor: string) => {
    fetchMoreRecipes({
      variables: { after: cursor },
      updateQuery: (prev, { fetchMoreResult }) => {
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
  };

  const handleFetchMoreFeeds = () => {
    const nextCursor = feedsData?.userFeeds?.nextCursor;
    if (!nextCursor || !feedsHasMore) return;

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

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleFollowToggle = (userId: string) => {
    setFollowingUserIds((prev) => {
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

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  const handleTabChange = (tab: 'posts' | 'recipes') => {
    setActiveTab(tab);
  };

  return (
    <ProfileView
      userId={parseInt(userData.currentUser.id)}
      username={username}
      fullname={fullname}
      image={image}
      stats={{
        posts: recipesMeta.total,
        following: 0,
        followers: 0,
      }}
      recipes={recipes}
      recipesLoading={recipesLoading}
      recipesError={recipesError}
      recipesMeta={recipesMeta}
      onFetchMore={handleFetchMoreRecipes}
      onSearchChange={handleSearchChange}
      actionButton={{
        label: 'Edit Profile',
        onClick: handleEditProfile,
        variant: 'edit',
      }}
      userSuggestions={{
        users: suggestions,
        loading: suggestionsLoading,
        onFollowToggle: handleFollowToggle,
        onUserClick: handleUserClick,
        followingUserIds: followingUserIds,
      }}
      feeds={feeds}
      feedsLoading={feedsLoading}
      feedsHasMore={feedsHasMore}
      onFetchMoreFeeds={handleFetchMoreFeeds}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      isOwnProfile={true}
    />
  );
}
