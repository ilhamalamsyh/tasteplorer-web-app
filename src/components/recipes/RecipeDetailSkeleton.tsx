import React from 'react';

const RecipeDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Skeleton */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Skeleton */}
            <div className="aspect-[4/3] lg:aspect-square bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="p-6 md:p-8 lg:p-10">
              {/* Title */}
              <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-full"></div>
              </div>

              {/* Rating & Author */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mb-2 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1 w-16 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
          {/* Ingredients Skeleton */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 animate-pulse">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-7 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>

              {/* Shopping List Button */}
              <div className="h-16 bg-gray-100 rounded-lg mb-6"></div>

              {/* Ingredients List */}
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions & Notes Skeleton */}
          <div className="xl:col-span-2 space-y-8">
            {/* Instructions Skeleton */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 animate-pulse">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-7 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>

              {/* Instructions List */}
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 md:gap-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                        <div className="h-5 bg-gray-200 rounded mb-3 w-1/2"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Skeleton */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 animate-pulse">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-7 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>

              {/* Add Note Form */}
              <div className="mb-8">
                <div className="h-4 bg-gray-200 rounded mb-2 w-48"></div>
                <div className="h-24 bg-gray-100 rounded-lg mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>

              {/* Notes List */}
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4 md:p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded mb-1 w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Recipes Skeleton */}
        <div className="mt-12">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="h-7 bg-gray-200 rounded w-40"></div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>

            {/* Recipe Cards */}
            <div className="flex gap-4 md:gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-80 md:w-96 bg-gray-50 rounded-lg overflow-hidden"
                >
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-4 md:p-5">
                    <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailSkeleton;
