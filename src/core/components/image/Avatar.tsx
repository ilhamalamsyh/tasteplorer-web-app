import Image from 'next/image';
import { useState } from 'react';

interface AvatarProps {
  imageUrl?: string;
  fullName: string;
}

export const Avatar: React.FC<AvatarProps> = ({ imageUrl, fullName }) => {
  const [isImageError, setIsImageError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // More robust check for valid image URL
  const hasValidImageUrl = imageUrl && imageUrl.trim() !== '' && !isImageError;

  return (
    <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
      {hasValidImageUrl ? (
        <Image
          src={imageUrl}
          alt="Profile"
          width={96}
          height={96}
          className="object-cover w-full h-full"
          onError={() => setIsImageError(true)} // Handle broken images
        />
      ) : (
        <span className="text-white text-3xl font-bold">
          {getInitials(fullName)}
        </span>
      )}
    </div>
  );
};
