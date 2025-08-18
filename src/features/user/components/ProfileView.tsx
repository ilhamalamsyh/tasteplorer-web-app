'use client'; // Add this line

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '../services/query';
import { client } from '@/lib/apollo-client';
import { Avatar } from '@/core/components/image/Avatar';
import RecipeCard from '@/core/components/RecipeCard/RecipeCard';

export const ProfileView = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(CURRENT_USER, { client });
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { username, fullname, image } = data.currentUser;

  const handleCardClick = (title: string) => {
    router.push(
      `/recipes/${encodeURIComponent(title.replace(/\s+/g, '-').toLowerCase())}`
    );
  };

  const handleBookmark = (idx: number, e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    // Update bookmark state
  };

  const handleMenu = (idx: number, e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    setOpenMenuIndex(idx === openMenuIndex ? null : idx);
  };

  return (
    <div>
      {/* Profile Section */}
      <main className="max-w-3xl mx-auto px-4 md:px-20 lg:px-40 py-8">
        <div className="flex flex-col  text-center mb-8">
          <Avatar imageUrl={image} fullName={fullname} />
          <h1 className="text-xl font-semibold mb-1 mx-auto text-center truncate max-w-[200px] sm:max-w-[200px] md:max-w-[350px] lg:max-w-[400px]">
            {fullname}
          </h1>
          <p className="text-gray-500 mb-4">{`@${username}`}</p>
          <div className="flex justify-center gap-6 mb-4">
            <div className="text-center">
              <p className="font-semibold">0</p>
              <p className="text-gray-500 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">0</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">0</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
          </div>
          <Link href={'/profile/edit'} className="flex justify-center">
            {' '}
            <button
              type="submit"
              className="w-full py-2 border-2 border-black text-black font-semibold rounded-3xl hover:bg-black hover:bg-opacity-5 transition active:scale-95"
            >
              Edit Profile
            </button>
          </Link>
        </div>
      </main>

      {/* Recipe Section */}
      <div className="w-full py-6 sm:py-8 md:py-12">
        {username ? (
          <div className="max-w-[900px] mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 justify-center">
              {sampleCards.map((card, idx) => (
                <RecipeCard
                  key={idx}
                  title={card.title}
                  img={card.imageUrl}
                  rating={card.rating}
                  ingredients={card.ingredients}
                  author={fullname}
                  authorAvatar={image}
                  isBookmarked={card.isBookmarked}
                  time={card.time}
                  onClick={() => handleCardClick(card.title)}
                  onBookmark={(e) => handleBookmark(idx, e)}
                  onMenu={(e) => handleMenu(idx, e)}
                  menuOpen={openMenuIndex === idx}
                  className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4">
              <Image
                src="https://global-web-assets.cpcdn.com/assets/empty_states/no_results-8613ba06d717993e5429d9907d209dc959106472a8a4089424f1b0ccbbcd5fa9.svg"
                alt="Empty bowl"
                width={64}
                height={64}
                className="opacity-50"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              No cooking activity yet.
            </h2>
            <p className="text-gray-500 mb-4">
              From your kitchen to the world - Share your recipes!
            </p>
            <button className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-3xl hover:bg-orange-600 transition">
              Post
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Updated mock data to match RecipeCard props
const sampleCards = [
  {
    title: 'Delicious Spaghetti',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
    rating: 95,
    ingredients: 8,
    isBookmarked: false,
    time: '30 mins',
  },
  {
    title: 'Refreshing Smoothie',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
    rating: 88,
    ingredients: 5,
    isBookmarked: false,
    time: '10 mins',
  },
  {
    title: 'Crispy Fried Chicken',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
    rating: 92,
    ingredients: 10,
    isBookmarked: false,
    time: '45 mins',
  },
  {
    title: 'Chocolate Cake',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
    rating: 97,
    ingredients: 12,
    isBookmarked: false,
    time: '60 mins',
  },
  {
    title: 'Chocolate Cake1',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
    rating: 97,
    ingredients: 12,
    isBookmarked: false,
    time: '60 mins',
  },
  {
    title: 'Chocolate Cake2',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
    rating: 97,
    ingredients: 12,
    isBookmarked: false,
    time: '60 mins',
  },
  {
    title: 'Chocolate Cake3',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
    rating: 97,
    ingredients: 12,
    isBookmarked: true,
    time: '60 mins',
  },
];
