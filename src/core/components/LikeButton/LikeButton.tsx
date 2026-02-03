import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import LoginModal from '@/features/auth/components/LoginModal';
import { useAuth } from '@/context/AuthContext';
import useSnackbar from '@/core/hooks/useSnackbar';
import { TOGGLE_LIKE_RECIPE } from '@/features/recipe/services/mutation';

interface LikeButtonProps {
  id: string; // recipeId
  initialIsLiked?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onToggled?: (isLiked: boolean) => void;
}

const sizeMap: Record<string, string> = {
  sm: 'w-4 h-4 sm:w-4 sm:h-4',
  md: 'w-5 h-5 sm:w-6 sm:h-6',
  lg: 'w-6 h-6 sm:w-7 sm:h-7',
};

const LikeButton: React.FC<LikeButtonProps> = ({
  id,
  initialIsLiked = false,
  className = '',
  size = 'md',
  disabled = false,
  onToggled,
}) => {
  const { user } = useAuth();
  const { showError } = useSnackbar();
  const [liked, setLiked] = useState<boolean>(!!initialIsLiked);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [toggleLike] = useMutation(TOGGLE_LIKE_RECIPE);

  // keep internal state in sync when prop changes
  useEffect(() => {
    setLiked(!!initialIsLiked);
  }, [initialIsLiked]);

  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleClick = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (disabled) return;

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // optimistic update
    const prev = liked;
    setLiked(!prev);
    setIsLoading(true);

    try {
      const { data } = await toggleLike({
        variables: { input: { recipeId: id } },
      });

      const serverIsLiked = data?.toggleLikeRecipe?.isLiked;
      if (typeof serverIsLiked === 'boolean') {
        setLiked(serverIsLiked);
        onToggled?.(serverIsLiked);
      } else {
        // If server doesn't return explicit isLiked, keep optimistic state
        onToggled?.(!prev);
      }
    } catch (err: unknown) {
      // revert optimistic update
      setLiked(prev);
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError(String(err) || 'Failed to update like');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading || disabled}
        aria-pressed={liked}
        className={`${className} p-2 sm:p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          liked
            ? 'text-red-500 border-2 border-red-100 bg-red-50 dark:border-red-900/30'
            : 'border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
        } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <svg
          className={sizeMap[size]}
          viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {showLoginModal && (
        <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} />
      )}
    </>
  );
};

export default LikeButton;
