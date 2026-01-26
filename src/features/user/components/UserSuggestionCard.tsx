import React from 'react';

interface UserSuggestion {
  userId: string;
  username: string;
  fullName: string;
  followerCount: number;
  mutualFollowerCount?: number;
  suggestionReason?: string;
}

interface UserSuggestionCardProps {
  user: UserSuggestion;
  isFollowing?: boolean;
  isLoading?: boolean;
  onFollowToggle: (userId: string) => void;
  onUserClick: (userId: string) => void;
}

export const UserSuggestionCard: React.FC<UserSuggestionCardProps> = ({
  user,
  isFollowing = false,
  isLoading = false,
  onFollowToggle,
  onUserClick,
}) => {
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    onFollowToggle(user.userId);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center"
      onClick={() => onUserClick(user.userId)}
    >
      {/* Avatar */}
      <div className="mb-3">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* User Info */}
      <div className="mb-3 w-full">
        <h3 className="font-semibold text-gray-900 text-sm truncate">
          {user.fullName}
        </h3>
        <p className="text-xs text-gray-500 truncate">@{user.username}</p>
        {user.mutualFollowerCount && user.mutualFollowerCount > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {user.mutualFollowerCount} mutual{' '}
            {user.mutualFollowerCount === 1 ? 'follower' : 'followers'}
          </p>
        )}
      </div>

      {/* Follow Button */}
      <button
        onClick={handleFollowClick}
        disabled={isLoading}
        className={`w-full py-2 rounded-full text-sm font-semibold transition-colors ${
          isLoading
            ? 'opacity-60 cursor-not-allowed'
            : isFollowing
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-primary text-white hover:bg-orange-600'
        }`}
      >
        {isLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};
