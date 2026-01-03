'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import {
  USER_PROFILE_QUERY,
  USER_RECIPE_LIST_QUERY,
} from '@/features/user/services/query';
import { ProfileView } from '@/features/user/components/ProfileView';
import useSnackbar from '@/core/hooks/useSnackbar';

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userIdInt, setUserIdInt] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { showError } = useSnackbar();

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

  // Fetch user's recipes
  const {
    loading: recipesLoading,
    error: recipesError,
    data: recipesData,
    fetchMore,
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

  // Handle user profile error
  useEffect(() => {
    if (userError) {
      showError(userError.message || 'Failed to load user profile');
    }
  }, [userError, showError]);

  if (userLoading || !userId) return <p>Loading...</p>;
  if (userError || !userData?.userProfile)
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

  const { username, fullname, image, followers, following } =
    userData.userProfile;
  const recipes = recipesData?.userRecipeList?.recipes || [];
  const meta = recipesData?.userRecipeList?.meta || {
    total: 0,
    hasNextPage: false,
  };

  const handleFetchMore = (cursor: string) => {
    fetchMore({
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFollowClick = () => {
    // TODO: Implement follow functionality
    console.log('Follow user:', userId);
  };

  return (
    <ProfileView
      username={username}
      fullname={fullname}
      image={image}
      stats={{
        posts: meta.total,
        following: following.total,
        followers: followers.total,
      }}
      recipes={recipes}
      recipesLoading={recipesLoading}
      recipesError={recipesError}
      recipesMeta={meta}
      onFetchMore={handleFetchMore}
      onSearchChange={handleSearchChange}
      actionButton={{
        label: 'Follow',
        onClick: handleFollowClick,
        variant: 'follow',
      }}
      isOwnProfile={false}
      emptyStateMessage="No recipes yet."
    />
  );
}
