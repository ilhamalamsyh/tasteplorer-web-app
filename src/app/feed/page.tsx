'use client';
import React, { useState, useEffect } from 'react';
import FeedPostCard from '@/core/components/FeedPostCard/FeedPostCard';
import { feedPosts } from '@/core/data/feedPosts';
import ProtectedRoute from '@/routes/ProtectedRoute';
import '@/styles/tailwind.css';

// Add shimmer animation style
const shimmerStyle = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite linear;
  background-size: 200% 100%;
}
`;

const FeedPage = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full overflow-x-hidden">
        <style>{shimmerStyle}</style>
        <main className="flex justify-center w-full max-w-[1440px] mx-auto">
          {/* Feed */}
          <section className="flex flex-col w-full max-w-2xl py-2 gap-4 px px-0 sm:px-4 lg:px-0">
            {showSkeleton
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f6f6f6] rounded-2xl w-full h-48 mb-2 overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#f6f6f6] via-[#ececec] to-[#f6f6f6] animate-shimmer" />
                    <div className="flex flex-col h-full justify-between p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div className="flex-1">
                          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                          <div className="h-3 w-16 bg-gray-100 rounded" />
                        </div>
                      </div>
                      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded mb-4" />
                      <div className="flex gap-2 mt-auto">
                        <div className="h-8 w-20 bg-gray-200 rounded" />
                        <div className="h-8 w-20 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                ))
              : feedPosts.map((post) => (
                  <FeedPostCard
                    key={post.id}
                    post={post}
                    className="shadow-none border-none"
                  />
                ))}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default FeedPage;
