'use client';

import React, { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';

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

interface UserPostsListProps {
  feeds: Feed[];
  loading: boolean;
  hasMore: boolean;
  onFetchMore?: () => void;
}

export const UserPostsList: React.FC<UserPostsListProps> = ({
  feeds,
  loading,
  hasMore,
  onFetchMore,
}) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;
    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && onFetchMore) {
          onFetchMore();
        }
      },
      { threshold: 1 }
    );
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, loading, onFetchMore]);

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  // Loading state
  if (loading && feeds.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Empty state
  if (!loading && feeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
        <p className="text-gray-500">
          Start sharing your culinary journey!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feeds.map((feed) => (
        <article
          key={feed.id}
          className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-3">
            {feed.user.profileImageUrl ? (
              <img
                src={feed.user.profileImageUrl}
                alt={feed.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                {feed.user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-base">
                  {feed.user.username}
                </span>
                <span className="text-sm text-gray-400">
                  · {formatTime(feed.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pb-3">
            <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line break-words">
              {feed.content}
            </p>
          </div>

          {/* Images */}
          {feed.images && feed.images.length > 0 && (
            <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
              <img
                src={feed.images[0].imageUrl}
                alt="Post"
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          )}

          {/* Actions placeholder */}
          <div className="px-5 py-3 border-t border-gray-50">
            <div className="flex items-center gap-6 text-gray-500">
              <button className="text-sm hover:text-primary transition">
                Like
              </button>
              <button className="text-sm hover:text-primary transition">
                Comment
              </button>
            </div>
          </div>
        </article>
      ))}

      {/* Loader for infinite scroll */}
      <div ref={loaderRef} className="h-8" />
      {loading && feeds.length > 0 && (
        <div className="flex justify-center py-6">
          <span className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
        </div>
      )}
      {!hasMore && feeds.length > 0 && (
        <div className="text-center text-gray-400 py-8">No more posts</div>
      )}
    </div>
  );
};
