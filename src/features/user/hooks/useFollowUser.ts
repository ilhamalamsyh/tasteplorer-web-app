import { useMutation, useQuery } from '@apollo/client';
import { FOLLOW_USER, UNFOLLOW_USER } from '../services/mutation';
import { CURRENT_USER } from '../services/query';
import useSnackbar from '@/core/hooks/useSnackbar';

type ToggleOptions = {
  onErrorRevert?: () => void;
};

export const useFollowUser = () => {
  const { data } = useQuery(CURRENT_USER, { fetchPolicy: 'cache-first' });
  const { showError } = useSnackbar();

  const [follow, { loading: followLoading }] = useMutation(FOLLOW_USER);
  const [unfollow, { loading: unfollowLoading }] = useMutation(UNFOLLOW_USER);

  const loading = followLoading || unfollowLoading;

  const toggleFollow = async (
    targetUserId: string | number,
    isCurrentlyFollowing: boolean,
    options?: ToggleOptions
  ) => {
    const followerId = data?.currentUser?.id
      ? parseInt(data.currentUser.id, 10)
      : null;

    if (!followerId) {
      showError('You must be logged in to follow users');
      options?.onErrorRevert?.();
      return;
    }

    try {
      if (isCurrentlyFollowing) {
        await unfollow({
          variables: { followerId, followingId: Number(targetUserId) },
        });
      } else {
        await follow({
          variables: { followerId, followingId: Number(targetUserId) },
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message || 'Failed to update follow status');
      options?.onErrorRevert?.();
    }
  };

  return { toggleFollow, loading };
};

export default useFollowUser;
