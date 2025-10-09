import React from 'react';
import Image from 'next/image';

interface RecipeCardProps {
  title: string;
  img: string;
  rating: number;
  ingredients: number;
  author: string;
  authorAvatar: string;
  isBookmarked: boolean;
  time: string;
  onClick: () => void;
  onBookmark: (e: React.MouseEvent) => void;
  onMenu: (e: React.MouseEvent) => void;
  menuOpen: boolean;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  img,
  rating,
  ingredients,
  author,
  authorAvatar,
  isBookmarked,
  time,
  onClick,
  onBookmark,
  onMenu,
  menuOpen,
  className = '',
}) => (
  <div
    className={`w-[190px] sm:w-[180px] md:w-[180px] lg:w-[190px] xl:w-[210px] bg-white rounded-2xl transition overflow-hidden flex flex-col border border-transparent p-0 relative cursor-pointer isolate ${className}`}
    onClick={onClick}
  >
    {/* Image with badge, bookmark, author, and menu */}
    <div className="relative w-full aspect-[4/6] overflow-hidden rounded-lg">
      {img && img.trim() !== '' ? (
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
          className="object-cover rounded-lg transition-transform duration-300 hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
          <span className="text-sm">No Image</span>
        </div>
      )}
      {/* Rating badge with increased z-index */}
      <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 flex items-center text-xs font-bold text-gray-800 shadow z-[100]">
        <svg
          className="w-4 h-4 mr-1 text-primary"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
        {rating}%
      </div>
      {/* Bookmark icon with increased z-index */}
      <button
        className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow z-[100]"
        onClick={onBookmark}
      >
        {isBookmarked ? (
          <svg
            className="w-5 h-5 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
            />
          </svg>
        )}
      </button>
      {/* Author and menu with increased z-index */}
      <div className="absolute left-0 right-0 bottom-0 px-2 sm:px-3 pb-2 sm:pb-3 flex items-center justify-between z-[100] bg-gradient-to-t from-black/60 to-transparent rounded-lg">
        <div className="flex items-center space-x-1 sm:space-x-2 bg-white/80 rounded-full px-1.5 sm:px-2 py-1">
          <div className="relative w-5 h-5 sm:w-6 sm:h-6">
            {authorAvatar && authorAvatar.trim() !== '' ? (
              <Image
                src={authorAvatar}
                alt={author}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs">
                {author.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-gray-700 truncate max-w-[60px] sm:max-w-[80px]">
            {author}
          </span>
        </div>
        <button
          className="bg-white/80 rounded-full p-0.5 sm:p-1 ml-1 sm:ml-2 z-[100]"
          onClick={onMenu}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <circle cx="4" cy="10" r="2" />
            <circle cx="10" cy="10" r="2" />
            <circle cx="16" cy="10" r="2" />
          </svg>
        </button>
        {/* Action menu with increased z-index */}
        {menuOpen && (
          <div className="absolute right-0 bottom-8 sm:bottom-10 bg-white border rounded shadow-lg p-1 sm:p-2 text-xs sm:text-sm z-[110]">
            <div className="py-1 px-2 sm:px-3 hover:bg-gray-100 cursor-pointer">
              Share
            </div>
            <div className="py-1 px-2 sm:px-3 hover:bg-gray-100 cursor-pointer">
              Report
            </div>
          </div>
        )}
      </div>
    </div>
    {/* Title and info */}
    <div className="pt-2 pb-5 flex flex-col">
      <h3 className="font-semibold text-base font-poppins text-gray-900 line-clamp-2 leading-none mb-4 min-h-[32px]">
        {title}
      </h3>
      <div className="flex items-center text-xs text-gray-700 space-x-2 mt-0 mb-0">
        <span>{ingredients} ingredients</span>
        <span>·</span>
        <span>{time}</span>
      </div>
    </div>
  </div>
);

export default RecipeCard;
