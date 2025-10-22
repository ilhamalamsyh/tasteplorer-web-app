import React, { useRef, useState } from 'react';
import Image from 'next/image';

export interface RelatedRecipe {
  id: string;
  title: string;
  imageUrl: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  totalRatings: number;
  author: {
    name: string;
    avatar?: string;
  };
}

interface RelatedRecipesProps {
  recipes: RelatedRecipe[];
  title?: string;
  className?: string;
  onRecipeClick?: (recipeId: string) => void;
  onBookmark?: (recipeId: string) => void;
}

const RelatedRecipes: React.FC<RelatedRecipesProps> = ({
  recipes,
  title = 'You May Also Like',
  className = '',
  onRecipeClick,
  onBookmark,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Hard':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  React.useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [recipes]);

  if (recipes.length === 0) return null;

  return (
    <section
      className={`bg-white dark:bg-background-dark rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="p-2 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="p-2 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Recipe Cards */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recipes.map((recipe) => (
          <article
            key={recipe.id}
            className="flex-shrink-0 w-80 md:w-96 bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onRecipeClick?.(recipe.id)}
          >
            {/* Recipe Image */}
            <div className="relative aspect-video overflow-hidden max-w-[350px] max-h-[200px] mx-auto">
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 320px, 384px"
                style={{ maxWidth: '350px', maxHeight: '200px' }}
              />

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark?.(recipe.id);
                  }}
                  className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Bookmark recipe"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
                    />
                  </svg>
                </button>
              </div>

              {/* Difficulty Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                    recipe.difficulty
                  )}`}
                >
                  {recipe.difficulty}
                </span>
              </div>
            </div>

            {/* Recipe Content */}
            <div className="p-4 md:p-5">
              {/* Title */}
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {recipe.title}
              </h3>

              {/* Author */}
              <div className="flex items-center gap-2 mb-3">
                {recipe.author.avatar ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={recipe.author.avatar}
                      alt={recipe.author.name}
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {recipe.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.author.name}
                </span>
              </div>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
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
                    {recipe.prepTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
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
                    {recipe.cookTime}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {recipe.rating}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    ({recipe.totalRatings})
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="flex justify-center mt-4 md:hidden">
        <div className="flex gap-1">
          {Array.from({ length: Math.ceil(recipes.length / 2) }).map(
            (_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default RelatedRecipes;
