'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import {
  CURRENT_USER,
  MY_RECIPE_LIST_QUERY,
  USER_SUGGESTION_LIST_QUERY,
} from '@/features/user/services/query';
import { client } from '@/lib/apollo-client';
import { ProfileView } from '@/features/user/components/ProfileView';
import useSnackbar from '@/core/hooks/useSnackbar';

export default function ProfilePage() {
  const router = useRouter();
  const { showError } = useSnackbar();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [followingUserIds, setFollowingUserIds] = React.useState<Set<string>>(
    new Set()
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
    fetchMore,
  } = useQuery(MY_RECIPE_LIST_QUERY, {
    variables: {
      search: searchQuery || undefined,
      limit: 24,
      after: undefined,
    },
    skip: !userData?.currentUser,
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

  if (userLoading) return <p>Loading...</p>;
  if (userError && !userError.message.toLowerCase().includes('token'))
    return <p>Error: {userError.message}</p>;

  const { username, fullname, image } = userData.currentUser;
  const recipes = recipesData?.myRecipeList?.recipes || [];
  const meta = recipesData?.myRecipeList?.meta || {
    total: 0,
    hasNextPage: false,
  };
  const suggestions = suggestionsData?.userSuggestionList?.users || [];

  const handleFetchMore = (cursor: string) => {
    fetchMore({
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

  return (
    <ProfileView
      username={username}
      fullname={fullname}
      image={image}
      stats={{
        posts: meta.total,
        following: 0,
        followers: 0,
      }}
      recipes={recipes}
      recipesLoading={recipesLoading}
      recipesError={recipesError}
      recipesMeta={meta}
      onFetchMore={handleFetchMore}
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
      isOwnProfile={true}
    />
  );
}
