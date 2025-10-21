/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface RecipeHeroProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  rating?: number;
  totalRatings?: number;
  authorName?: string;
  authorAvatar?: string;
}

const RecipeHero: React.FC<RecipeHeroProps> = ({
  title,
  subtitle,
  imageUrl,
  prepTime,
  cookTime,
  servings,
  difficulty = 'Medium',
  rating = 4.5,
  totalRatings = 127,
  authorName,
  authorAvatar,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showFullSubtitle, setShowFullSubtitle] = useState(false);
  const isSubtitleLong = subtitle && subtitle.split(' ').length > 20; // simple check, adjust as needed

  // Helper to clamp subtitle to N chars and add '... More' if needed
  const clampSubtitle = (text: string, maxChars = 120) => {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars).replace(/\s+$/, '') + '...';
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const totalTime = `${parseInt(prepTime) + parseInt(cookTime)} mins`;

  return (
    <section
      className="relative bg-white dark:bg-background-dark"
      style={{ borderRadius: 20, overflow: 'hidden' }}
    >
      <div
        className={`flex ${isMobile ? 'flex-col' : 'flex-row'}`}
        style={{ minHeight: '400px' }}
      >
        {/* Image Section - Full width on mobile, 1/4 on desktop */}
        <div
          className={`relative bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden ${
            isMobile ? 'h-[300px] w-full' : 'w-1/4'
          }`}
          style={
            !isMobile
              ? { minHeight: '400px', aspectRatio: '16/9', maxWidth: '420px' }
              : { aspectRatio: '16/9' }
          }
        >
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-xl"
            style={{
              display: 'block',
              position: 'absolute',
              zIndex: 1,
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            onLoad={() => console.log('Image loaded successfully:', imageUrl)}
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.currentTarget.src = '/placeholder-recipe.jpg'; // fallback to placeholder
            }}
          />

          {isMobile && (
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
              style={{ zIndex: 2, pointerEvents: 'none' }}
            />
          )}
        </div>

        {/* Content Section - Full width on mobile, 3/4 on desktop */}
        <div
          className={`p-6 sm:p-8 lg:p-12 flex flex-col justify-around w-full min-w-0 flex-grow ${
            !isMobile ? 'w-3/4' : ''
          }`}
        >
          {/* Header */}
          <div className="mb-4 md:mb-6 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 leading-tight w-full">
              {title}
            </h1>
            {subtitle && (
              <>
                <div className="relative w-full">
                  {!showFullSubtitle && isSubtitleLong ? (
                    <span className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed w-full">
                      {clampSubtitle(subtitle)}{' '}
                      <button
                        className="font-semibold text-sm focus:outline-none"
                        style={{ color: '#233748' }}
                        onClick={() => setShowFullSubtitle(true)}
                        tabIndex={0}
                      >
                        more
                      </button>
                    </span>
                  ) : (
                    <span className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed w-full">
                      {subtitle}
                      {isSubtitleLong && (
                        <button
                          className="font-semibold text-sm focus:outline-none"
                          style={{ color: '#233748' }}
                          onClick={() => setShowFullSubtitle(false)}
                        >
                          show less
                        </button>
                      )}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Rating & Author */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 md:mb-6 w-full justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < Math.floor(rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {rating} ({totalRatings} reviews)
              </span>
            </div>

            {authorName && (
              <div className="flex items-center gap-2">
                {authorAvatar && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                    <Image
                      src={authorAvatar}
                      alt={authorName}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  by {authorName}
                </span>
              </div>
            )}
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4 md:mb-6 w-full">
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full mb-1 sm:mb-2 mx-auto">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Prep Time
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {prepTime}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full mb-1 sm:mb-2 mx-auto">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Cook Time
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {cookTime}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full mb-1 sm:mb-2 mx-auto">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Servings
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {servings} people
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full mb-1 sm:mb-2 mx-auto">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Difficulty
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {difficulty}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 w-full justify-start">
            <button className="p-2 sm:p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button className="p-2 sm:p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipeHero;
