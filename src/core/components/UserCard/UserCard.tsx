import React from 'react';
import Image from 'next/image';

export interface UserCardProps {
  user: {
    id: string;
    username: string;
    fullname: string;
    image?: string;
  };
  variant?: 'grid' | 'list';
  isFollowing?: boolean;
  onFollowToggle?: (userId: string, e: React.MouseEvent) => void;
  onClick?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  variant = 'grid',
  isFollowing = false,
  onFollowToggle,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(user.id);
    }
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFollowToggle) {
      onFollowToggle(user.id, e);
    }
  };

  // Grid variant - for search page (vertical layout)
  if (variant === 'grid') {
    return (
      <div
        className="flex flex-col items-center p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        {user.image && user.image.trim() !== '' ? (
          <Image
            src={user.image}
            alt={user.fullname}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full mb-2 object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl mb-2">
            {user.fullname.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="font-semibold text-gray-800 text-sm mb-1 text-center truncate w-full px-1">
          {user.fullname}
        </div>
        <div className="text-xs text-gray-500 text-center truncate w-full px-1">
          @{user.username}
        </div>
      </div>
    );
  }

  // List variant - for users page (horizontal layout with Follow button)
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        {/* Avatar - Left */}
        <div className="flex-shrink-0">
          {user.image && user.image.trim() !== '' ? (
            <Image
              src={user.image}
              alt={user.fullname}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl">
              {user.fullname.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User Info - Middle */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate">
            {user.fullname}
          </h3>
          <p className="text-sm text-gray-500 truncate">@{user.username}</p>
        </div>

        {/* Follow Button - Right */}
        {onFollowToggle && (
          <div className="flex-shrink-0">
            <button
              onClick={handleFollowClick}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                isFollowing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-primary text-white hover:bg-orange-600'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
