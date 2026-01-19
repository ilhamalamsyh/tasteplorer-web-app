import React from 'react';
import {
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaEllipsisH,
} from 'react-icons/fa';
import Image from 'next/image';

interface FeedPostCardProps {
  post: {
    id: number;
    user: { name: string; avatar: string };
    community: { name: string; avatar: string };
    time: string;
    text: string;
    image: string;
    source: { title: string; url: string; image: string };
    liked: boolean;
    bookmarked: boolean;
    comments: number;
  };
  className?: string;
}

const FeedPostCard: React.FC<FeedPostCardProps> = ({ post, className }) => {
  return (
    <article
      className={`bg-white rounded-3xl p-0 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-3">
          {post.user.avatar && post.user.avatar.trim() !== '' ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={post.user.avatar}
                alt={post.user.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
              {post.user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-base">
                {post.user.name}
              </span>
              <span className="text-sm text-gray-400">· {post.time}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {post.community.avatar && post.community.avatar.trim() !== '' ? (
                <div className="relative w-4 h-4 rounded-full overflow-hidden">
                  <Image
                    src={post.community.avatar}
                    alt={post.community.name}
                    fill
                    className="object-cover"
                    sizes="16px"
                  />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs">
                  {post.community.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-gray-500">
                {post.community.name}
              </span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full">
          <FaEllipsisH size={18} />
        </button>
      </div>
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        {post.image && post.image.trim() !== '' ? (
          <Image
            src={post.image}
            alt="Post"
            fill
            className="object-cover transition-transform duration-200 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            <span className="text-sm">No Image Available</span>
          </div>
        )}
      </div>
      {/* Text */}
      <div className="px-5 pt-3 pb-1">
        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line break-words">
          {post.text}
        </p>
      </div>
      {/* Source Card */}
      <a
        href={post.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-gray-50 rounded-xl mx-5 my-2 px-3 py-2 hover:bg-gray-100 transition"
      >
        {post.source.image && post.source.image.trim() !== '' ? (
          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={post.source.image}
              alt={post.source.title}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs">
            {post.source.title.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-medium text-sm text-gray-700 truncate">
          {post.source.title}
        </span>
      </a>
      {/* Actions */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-gray-50 text-gray-500">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1 hover:text-primary text-base">
            <FaRegHeart size={18} />
            <span className="text-sm">Like</span>
          </button>
          <button className="flex items-center gap-1 hover:text-primary text-base">
            <FaRegComment size={18} />
            <span className="text-sm">{post.comments}</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="hover:text-primary text-base">
            {post.bookmarked ? (
              <FaBookmark size={18} />
            ) : (
              <FaRegBookmark size={18} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default FeedPostCard;
