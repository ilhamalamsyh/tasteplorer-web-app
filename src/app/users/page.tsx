'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import UserCard from '@/core/components/UserCard/UserCard';
import { USERS_QUERY } from '@/features/user/services/query';
import useFollowUser from '@/features/user/hooks/useFollowUser';
import { useAuth } from '@/context/AuthContext';

// TypeScript interfaces
interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  isMe?: boolean;
  isFollowedByMe?: boolean;
}

interface UsersData {
  users: {
    data: User[];
    total: number;
    nextCursor?: string;
    hasMore: boolean;
  };
}

const UsersPage: React.FC = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search_query') || '';
  const router = useRouter();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // optimistic overrides map userId -> isFollowing
  const [followingOverrides, setFollowingOverrides] = useState<
    Record<string, boolean>
  >({});
  const [followingLoadingIds, setFollowingLoadingIds] = useState<Set<string>>(
    new Set()
  );
  const { toggleFollow } = useFollowUser();
  const { user: authUser } = useAuth();

  const { data, loading, fetchMore } = useQuery<UsersData>(USERS_QUERY, {
    variables: {
      input: {
        search: searchQuery || undefined,
        cursor: null,
        limit: 20,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const users = data?.users?.data || [];
  const totalUsers = data?.users?.total || 0;
  const hasMore = data?.users?.hasMore || false;
  const nextCursor = data?.users?.nextCursor;

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading || isFetchingMore) return;
    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor) {
          setIsFetchingMore(true);
          fetchMore({
            variables: {
              input: {
                search: searchQuery || undefined,
                cursor: nextCursor,
                limit: 20,
              },
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              setIsFetchingMore(false);
              if (!fetchMoreResult) return prev;
              return {
                users: {
                  ...fetchMoreResult.users,
                  data: [...prev.users.data, ...fetchMoreResult.users.data],
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
  }, [hasMore, nextCursor, loading, fetchMore, isFetchingMore, searchQuery]);

  const handleFollowToggle = (
    userId: string,
    apiIsFollowing: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const prev = followingOverrides.hasOwnProperty(userId)
      ? followingOverrides[userId]
      : apiIsFollowing;

    // optimistic override
    setFollowingOverrides((prevMap) => ({ ...prevMap, [userId]: !prev }));

    setFollowingLoadingIds((prev) => new Set(prev).add(userId));

    toggleFollow(userId, prev, {
      onErrorRevert: () => {
        setFollowingOverrides((prevMap) => {
          const copy = { ...prevMap };
          if (apiIsFollowing === prev) {
            delete copy[userId];
          } else {
            copy[userId] = prev;
          }
          return copy;
        });
      },
    }).finally(() => {
      setFollowingLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });
  };

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">Tasteplorer / Users</p>
            <h1 className="text-2xl font-bold text-gray-900">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : 'All Users'}
            </h1>
            {totalUsers > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Found {totalUsers} user{totalUsers !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Loading state */}
          {loading && users.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Empty state */}
          {!loading && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Image
                src="/icons/not_found_icon.svg"
                alt="No users found"
                width={120}
                height={120}
                className="mb-4 opacity-50"
              />
              <p className="text-gray-500 text-base font-medium">
                No users found. Try a different keyword!
              </p>
            </div>
          )}

          {/* Users Grid - 2 columns */}
          {users.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => {
                const currentIsFollowing = followingOverrides.hasOwnProperty(
                  user.id
                )
                  ? followingOverrides[user.id]
                  : !!user.isFollowedByMe;

                const showFollowButton = !!authUser && !user.isMe;

                return (
                  <UserCard
                    key={user.id}
                    user={user}
                    variant="list"
                    isFollowing={currentIsFollowing}
                    isLoading={followingLoadingIds.has(user.id)}
                    onFollowToggle={
                      showFollowButton
                        ? (id: string, e: React.MouseEvent) =>
                            handleFollowToggle(
                              user.id,
                              !!user.isFollowedByMe,
                              e
                            )
                        : undefined
                    }
                    onClick={handleUserClick}
                  />
                );
              })}
            </div>
          )}

          {/* Loader for infinite scroll */}
          <div ref={loaderRef} className="h-8 mt-4" />
          {(loading || isFetchingMore) && users.length > 0 && (
            <div className="flex justify-center py-6">
              <span className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
            </div>
          )}
          {!hasMore && users.length > 0 && (
            <div className="text-center text-gray-400 py-8">No more users</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
