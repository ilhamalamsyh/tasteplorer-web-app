'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import FeedPostCard from '@/core/components/FeedPostCard/FeedPostCard';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { HOME_FEEDS_QUERY } from '@/features/user/services/query';
import { formatRelativeTime } from '@/utils/time-format';
import '@/styles/tailwind.css';

// Add shimmer animation style
const shimmerStyle = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite linear;
  background-size: 200% 100%;
}
`;

// TypeScript interfaces
interface FeedImage {
  id: string;
  imageUrl: string;
  position: number;
}

interface FeedUser {
  id: string;
  username: string;
  profileImageUrl?: string;
}

interface Feed {
  id: string;
  user: FeedUser;
  recipeId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  images: FeedImage[];
}

interface HomeFeedsData {
  homeFeeds: {
    feeds: Feed[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

const FeedPage = () => {
  const router = useRouter();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { data, loading, error, fetchMore } = useQuery<HomeFeedsData>(
    HOME_FEEDS_QUERY,
    {
      variables: {
        cursor: null,
        limit: 10,
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
    }
  );

  const feeds = data?.homeFeeds?.feeds || [];
  const hasMore = data?.homeFeeds?.hasMore || false;
  const nextCursor = data?.homeFeeds?.nextCursor;

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading || isFetchingMore) return;
    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor) {
          setIsFetchingMore(true);
          fetchMore({
            variables: { cursor: nextCursor, limit: 10 },
            updateQuery: (prev, { fetchMoreResult }) => {
              setIsFetchingMore(false);
              if (!fetchMoreResult) return prev;
              return {
                homeFeeds: {
                  ...fetchMoreResult.homeFeeds,
                  feeds: [
                    ...prev.homeFeeds.feeds,
                    ...fetchMoreResult.homeFeeds.feeds,
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
  }, [hasMore, nextCursor, loading, fetchMore, isFetchingMore]);

  // Transform API data to FeedPostCard format
  const transformFeedData = (feed: Feed) => {
    // Create a copy of images array before sorting to avoid mutating read-only array
    const sortedImages = [...feed.images].sort(
      (a, b) => a.position - b.position
    );
    const firstImage = sortedImages[0];

    return {
      id: parseInt(feed.id),
      user: {
        name: feed.user.username,
        avatar: feed.user.profileImageUrl || '',
      },
      community: {
        name: 'Tasteplorer',
        avatar: '',
      },
      time: formatRelativeTime(feed.createdAt),
      text: feed.content,
      image: firstImage?.imageUrl || '',
      source: {
        title: feed.recipeId ? 'View Recipe' : 'Tasteplorer',
        url: feed.recipeId ? `/recipes/${feed.recipeId}` : '#',
        image: firstImage?.imageUrl || '',
      },
      liked: false,
      bookmarked: false,
      comments: 0,
      recipeId: feed.recipeId,
    };
  };

  const handleSourceClick = (e: React.MouseEvent, recipeId?: string) => {
    if (recipeId) {
      e.preventDefault();
      router.push(`/recipes/${recipeId}`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full overflow-x-hidden">
        <style>{shimmerStyle}</style>
        <main className="flex justify-center w-full max-w-[1440px] mx-auto">
          {/* Feed */}
          <section className="flex flex-col w-full max-w-2xl py-2 gap-4 px px-0 sm:px-4 lg:px-0">
            {loading && feeds.length === 0
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f6f6f6] rounded-2xl w-full h-48 mb-2 overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#f6f6f6] via-[#ececec] to-[#f6f6f6] animate-shimmer" />
                    <div className="flex flex-col h-full justify-between p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div className="flex-1">
                          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                          <div className="h-3 w-16 bg-gray-100 rounded" />
                        </div>
                      </div>
                      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded mb-4" />
                      <div className="flex gap-2 mt-auto">
                        <div className="h-8 w-20 bg-gray-200 rounded" />
                        <div className="h-8 w-20 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                ))
              : feeds.map((feed) => {
                  const transformedPost = transformFeedData(feed);
                  return (
                    <div
                      key={feed.id}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('a[href*="/recipes/"]')) {
                          handleSourceClick(e, feed.recipeId);
                        }
                      }}
                    >
                      <FeedPostCard
                        post={transformedPost}
                        className="shadow-none border-none"
                      />
                    </div>
                  );
                })}

            {/* Error State */}
            {error && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-red-500 text-center">
                  Failed to load feeds. Please try again later.
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loading && feeds.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 text-center">
                  No feeds available yet. Start following users to see their
                  posts!
                </p>
              </div>
            )}

            {/* Loader for infinite scroll */}
            <div ref={loaderRef} className="h-8 mt-4" />
            {(loading || isFetchingMore) && feeds.length > 0 && (
              <div className="flex justify-center py-6">
                <span className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
              </div>
            )}
            {!hasMore && feeds.length > 0 && (
              <div className="text-center text-gray-400 py-8">
                No more feeds
              </div>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default FeedPage;
