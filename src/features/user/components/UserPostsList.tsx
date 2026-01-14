'use client';

import React, { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import { useMutation } from '@apollo/client';
import { DELETE_FEED_MUTATION } from '@/features/feed/services/mutation';
import FeedForm from '@/features/feed/components/FeedForm';
import DeleteConfirmationModal from '@/features/feed/components/DeleteConfirmationModal';
import useSnackbar from '@/core/hooks/useSnackbar';

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
  isOwnProfile?: boolean; // Add prop to differentiate own profile vs others
}

export const UserPostsList: React.FC<UserPostsListProps> = ({
  feeds,
  loading,
  hasMore,
  onFetchMore,
  isOwnProfile,
}) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const { showError } = useSnackbar();

  const [deleteFeed, { loading: isDeleting }] = useMutation(
    DELETE_FEED_MUTATION,
    {
      onCompleted: (data) => {
        if (data.deleteFeed.success) {
          console.log('✅ Post deleted successfully');
          setShowDeleteModal(false);
          setSelectedFeedId(null);
          // Refresh the list
          if (onFetchMore) {
            window.location.reload(); // Simple refresh, or use refetch
          }
        }
      },
      onError: (error) => {
        showError(error.message || 'Failed to delete post');
      },
    }
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && menuRefs.current[openMenuId]) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

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

  const handleMenuToggle = (feedId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === feedId ? null : feedId);
  };

  const handleEdit = (feedId: string) => {
    console.log('Edit post:', feedId);
    setSelectedFeedId(feedId);
    setOpenMenuId(null);
    setShowEditForm(true);
  };

  const handleDelete = (feedId: string) => {
    console.log('Delete post:', feedId);
    setSelectedFeedId(feedId);
    setOpenMenuId(null);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFeedId) return;

    try {
      await deleteFeed({
        variables: { id: selectedFeedId },
      });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditSuccess = () => {
    console.log('✅ Post updated successfully');
    // Refresh the list
    if (onFetchMore) {
      window.location.reload(); // Simple refresh, or use refetch
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
        <h2 className="text-xl font-semibold mb-2">
          {isOwnProfile ? 'No posts yet' : 'No activity yet'}
        </h2>
        <p className="text-gray-500">
          {isOwnProfile
            ? 'Start sharing your culinary journey!'
            : "This user hasn't posted anything yet."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-4">
        {feeds.map((feed) => (
          <article
            key={feed.id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-3">
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
                    <span className="font-semibold text-gray-900 text-sm">
                      {feed.user.username}
                    </span>
                    <span className="text-xs text-gray-400">
                      · {formatTime(feed.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Three Dots Menu */}
              <div
                className="relative"
                ref={(el) => {
                  menuRefs.current[feed.id] = el;
                }}
              >
                <button
                  onClick={(e) => handleMenuToggle(feed.id, e)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Post options"
                >
                  <HiOutlineDotsHorizontal className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {openMenuId === feed.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-1">
                      <button
                        onClick={() => handleEdit(feed.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <HiOutlinePencilSquare className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-900">
                          Edit Post
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(feed.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                      >
                        <HiOutlineTrash className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-600">
                          Delete Post
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-2">
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line break-words">
                {feed.content}
              </p>
            </div>

            {/* Images */}
            {feed.images && feed.images.length > 0 && (
              <div className="w-full aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={feed.images[0].imageUrl}
                  alt="Post"
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>
            )}

            {/* Actions placeholder */}
            <div className="px-4 py-2 border-t border-gray-50">
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

      {/* Edit Post Modal */}
      {showEditForm && selectedFeedId && (
        <FeedForm
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setSelectedFeedId(null);
          }}
          onSuccess={handleEditSuccess}
          feedId={selectedFeedId}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFeedId(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};
