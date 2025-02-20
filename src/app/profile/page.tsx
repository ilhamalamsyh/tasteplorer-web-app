'use-client';

import ProtectedRoute from '@/routes/ProtectedRoute';
import Image from 'next/image';
import Link from 'next/link';
// import { button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div>
        {/* Profile Section */}
        <main className="max-w-3xl mx-auto px-4 md:px-20 lg:px-40 py-8">
          <div className="flex flex-col  text-center mb-8">
            <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-1">
              Chef Jarjit edited asfasfasf safasfasfasfasfasf safasfasfasfasfasf
              safasfasfasfasfasf safasfasfasfasfasf safasfasfasfasfasf
              safasfasfasfasfasf safasfasfasfasfasf safasfasf
            </h1>
            <p className="text-gray-500 mb-4">@cook_111743917</p>
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
        <div className="w-screen py-12 px-6 sm:px-24 text-center">
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
