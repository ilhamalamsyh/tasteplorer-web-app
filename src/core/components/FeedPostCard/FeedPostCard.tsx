import React from 'react';
import {
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaEllipsisH,
} from 'react-icons/fa';

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
}

const FeedPostCard: React.FC<FeedPostCardProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-base">
                {post.user.name}
              </span>
              <span className="text-sm text-gray-400">· {post.time}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <img
                src={post.community.avatar}
                alt={post.community.name}
                className="w-4 h-4 rounded-full"
              />
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
      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={post.image}
          alt="Post"
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>
      {/* Text */}
      <div className="px-5 pt-3 pb-1">
        <p className="text-gray-800 text-base leading-snug">{post.text}</p>
      </div>
      {/* Source Card */}
      <a
        href={post.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-gray-50 rounded-xl mx-5 my-2 px-3 py-2 hover:bg-gray-100 transition"
      >
        <img
          src={post.source.image}
          alt={post.source.title}
          className="w-8 h-8 rounded-lg object-cover"
        />
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
