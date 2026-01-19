import React from 'react';
import { profile } from '@/core/data/profile';
import { myCommunities, recommendedCommunities } from '@/core/data/communities';
import Image from 'next/image';

const FeedSidebar: React.FC = () => {
  return (
    <aside className="flex flex-col gap-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
        {profile.avatar && profile.avatar.trim() !== '' ? (
          <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2">
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl mb-2">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="font-semibold text-gray-900 text-xl">
          {profile.name}
        </div>
        <div className="flex gap-4 text-sm text-gray-500 mt-1">
          <span>{profile.following} Following</span>
          <span>{profile.followers} Followers</span>
        </div>
      </div>
      {/* My Communities */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="font-semibold text-gray-800 text-lg mb-3">
          My Communities
        </div>
        <ul className="flex flex-col gap-2">
          {myCommunities.map((c) => (
            <li key={c.name} className="flex items-center gap-2">
              {c.avatar && c.avatar.trim() !== '' ? (
                <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={c.avatar}
                    alt={c.name}
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs">
                  {c.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-base text-gray-700 font-medium truncate">
                {c.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* Recommended Communities */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="font-semibold text-gray-800 text-lg mb-3">
          Recommended Communities
        </div>
        <ul className="flex flex-col gap-2">
          {recommendedCommunities.map((c) => (
            <li key={c.name} className="flex items-center gap-2">
              {c.avatar && c.avatar.trim() !== '' ? (
                <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={c.avatar}
                    alt={c.name}
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs">
                  {c.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-base text-gray-700 font-medium truncate">
                  {c.name}
                </span>
                <span className="text-sm text-gray-400 truncate">
                  {c.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Footer-style links section */}
      <div className="mt-6 px-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[12px] text-gray-400">
          <a href="#" className="hover:underline">
            Feedback & Support
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            About Us
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Blog
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Conversations
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Ingredients
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Do Not Sell My Personal Information
          </a>
        </div>
        <div className="text-[12px] text-gray-400 mt-2">© 2025 Tasteplorer</div>
      </div>
    </aside>
  );
};

export default FeedSidebar;
