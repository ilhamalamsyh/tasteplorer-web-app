'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { FOLLOWERS_QUERY, FOLLOWING_QUERY } from '../services/query';
import Modal from '@/core/components/modal/Modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  fullname: string;
  image?: string;
  isMe: boolean;
  isFollowedByMe: boolean;
}

interface PageInfo {
  nextCursor: number | null;
  hasNext: boolean;
}

interface UserFollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  type: 'followers' | 'following';
}

const UserFollowListModal: React.FC<UserFollowListModalProps> = ({
  isOpen,
  onClose,
  userId,
  type,
}) => {
  const router = useRouter();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    nextCursor: null,
    hasNext: false,
  });
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [followingStates, setFollowingStates] = useState<{
    [key: number]: boolean;
  }>({});

  // Determine which query to use
  const query = type === 'followers' ? FOLLOWERS_QUERY : FOLLOWING_QUERY;

  const { loading, fetchMore } = useQuery(query, {
    variables: {
      userId,
      cursor: null,
      limit: 20,
    },
    skip: !isOpen,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const result = type === 'followers' ? data.followers : data.following;
      if (result) {
        setUsers(result.users);
        setPageInfo(result.pageInfo);

        // Initialize following states
        const states: { [key: number]: boolean } = {};
        result.users.forEach((user: User) => {
          states[user.id] = user.isFollowedByMe;
        });
        setFollowingStates(states);
      }
    },
  });

  // TODO: Implement follow/unfollow mutation
  const handleFollowToggle = async (targetUserId: number) => {
    // Optimistic update
    setFollowingStates((prev) => ({
      ...prev,
      [targetUserId]: !prev[targetUserId],
    }));

    // TODO: Call your follow/unfollow mutation here
  };

  // Infinite scroll
  useEffect(() => {
    if (!pageInfo.hasNext || loading || isFetchingMore) return;

    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pageInfo.nextCursor) {
          setIsFetchingMore(true);
          fetchMore({
            variables: {
              userId,
              cursor: pageInfo.nextCursor,
              limit: 20,
            },
          }).then((result) => {
            const newData =
              type === 'followers'
                ? result.data.followers
                : result.data.following;

            if (newData) {
              setUsers((prev) => [...prev, ...newData.users]);
              setPageInfo(newData.pageInfo);

              // Update following states for new users
              const newStates: { [key: number]: boolean } = {};
              newData.users.forEach((user: User) => {
                newStates[user.id] = user.isFollowedByMe;
              });
              setFollowingStates((prev) => ({ ...prev, ...newStates }));
            }
            setIsFetchingMore(false);
          });
        }
      },
      { threshold: 1 }
    );

    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [pageInfo, loading, isFetchingMore, fetchMore, userId, type]);

  const handleUserClick = (targetUserId: number) => {
    onClose();
    router.push(`/users/${targetUserId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Container dengan padding horizontal minimal */}
      <div className="w-full max-w-sm mx-auto px-2 sm:px-3">
        {/* Header - dengan padding top yang cukup untuk close button */}
        <div className="sticky top-0 bg-white z-10 pt-16 sm:pt-4 pb-4 mb-2 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {type === 'followers' ? 'Followers' : 'Following'}
          </h2>
        </div>

        {/* User List - Scrollable */}
        <div className="max-h-[500px] overflow-y-auto scrollbar-hide -mx-2 sm:-mx-3 px-2 sm:px-3">
          {loading && users.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No {type === 'followers' ? 'followers' : 'following'} yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* User Info */}
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                    onClick={() => handleUserClick(user.id)}
                  >
                    {/* Avatar */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                      {user.image && user.image.trim() !== '' ? (
                        <Image
                          src={user.image}
                          alt={user.fullname}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-sm">
                          {getInitials(user.fullname)}
                        </div>
                      )}
                    </div>

                    {/* Username and Fullname */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.fullname}
                      </p>
                    </div>
                  </div>

                  {/* Follow Button */}
                  {!user.isMe && (
                    <button
                      onClick={() => handleFollowToggle(user.id)}
                      className={`px-6 py-2 rounded-full font-semibold text-sm transition-all flex-shrink-0 ml-3 ${
                        followingStates[user.id]
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-primary text-white hover:bg-orange-600'
                      }`}
                    >
                      {followingStates[user.id] ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Loader for infinite scroll */}
          <div ref={loaderRef} className="h-8 mt-4" />
          {isFetchingMore && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserFollowListModal;
