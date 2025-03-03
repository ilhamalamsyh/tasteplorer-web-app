'use client'; // Add this line

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '../services/query';
import { client } from '@/lib/apollo-client';
import { Avatar } from '@/core/components/image/Avatar';

export const ProfileView = () => {
  const { loading, error, data } = useQuery(CURRENT_USER, { client });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { username, fullname, image } = data.currentUser;
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

      {/* Empty State Content Section - FULL WIDTH */}
      {/* ToDo: This code below is example on handling the user's recipe already exist or not. It will implement later */}
      <div className="w-screen py-12 px-6 sm:px-24 text-center">
        {username ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCards.map((card, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-lg bg-white"
              >
                <div className="w-20 h-20 mx-auto mb-4">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="text-gray-500 mb-4">{card.description}</p>
                <button className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">
                  View Details
                </button>
              </div>
            ))}
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

// this is mock data
const sampleCards = [
  {
    title: 'Delicious Spaghetti',
    description: 'A tasty homemade spaghetti recipe with rich tomato sauce.',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
  },
  {
    title: 'Refreshing Smoothie',
    description: 'A healthy fruit smoothie packed with vitamins and flavor.',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
  },
  {
    title: 'Crispy Fried Chicken',
    description: 'Golden-brown crispy chicken that’s juicy on the inside.',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
  },
  {
    title: 'Chocolate Cake',
    description:
      'A moist chocolate cake topped with rich dark chocolate ganache.',
    imageUrl:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
  },
];
