/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import RecipeCard from '@/core/components/RecipeCard/RecipeCard';
import { RECIPE_LIST_QUERY } from '@/features/recipe/services/query';

// Tipe sort
type SortOption = 'relevance' | 'popularity' | 'latest';
const SORT_LABELS: Record<SortOption, string> = {
  relevance: 'Relevance',
  popularity: 'Popularity',
  latest: 'Latest',
};
const LIMIT = 24;

const SortDropdown: React.FC<{
  value: SortOption;
  onChange: (v: SortOption) => void;
}> = ({ value, onChange }) => (
  <select
    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
    value={value}
    onChange={(e) => onChange(e.target.value as SortOption)}
  >
    {Object.entries(SORT_LABELS).map(([key, label]) => (
      <option key={key} value={key}>
        {label}
      </option>
    ))}
  </select>
);

const RecipeSkeletonGrid: React.FC<{ count: number }> = ({ count }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-2xl bg-gray-100 animate-pulse h-72 w-full"
      />
    ))}
  </div>
);

const RecipesPage: React.FC = () => {
  const [sort, setSort] = useState<SortOption>('relevance');
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search_query') || '';

  const { data, loading, fetchMore } = useQuery(RECIPE_LIST_QUERY, {
    variables: {
      search: searchQuery || undefined,
      after: undefined,
    },
    notifyOnNetworkStatusChange: true,
  });

  const recipes = data?.recipeList?.recipes || [];
  const meta = data?.recipeList?.meta || {};

  // Infinite scroll
  useEffect(() => {
    if (!meta.hasNextPage || loading || isFetchingMore) return;
    const currentLoader = loaderRef.current;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsFetchingMore(true);
          fetchMore({
            variables: { after: meta.endCursor },
            updateQuery: (prev, { fetchMoreResult }) => {
              setIsFetchingMore(false);
              if (!fetchMoreResult) return prev;
              return {
                recipeList: {
                  ...fetchMoreResult.recipeList,
                  recipes: [
                    ...prev.recipeList.recipes,
                    ...fetchMoreResult.recipeList.recipes,
                  ],
                },
              };
            },
          });
        }
      },
      { threshold: 1 }
    );
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [meta.hasNextPage, meta.endCursor, loading, fetchMore, isFetchingMore]);

  return (
    <div className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-0 md:px-0 py-0 flex flex-col items-center">
        <div className="w-full bg-white md:w-4/5 md:bg-white md:rounded-2xl md:shadow-md md:p-8 px-4 md:px-10 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">Tasteplorer / Recipes</p>
              <h1 className="text-2xl font-bold">
                {searchQuery
                  ? `Search results for "${searchQuery}"`
                  : 'Recipes'}
              </h1>
            </div>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {/* Empty state */}
          {!loading && recipes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Image
                src="/icons/not_found_icon.svg"
                alt="No results found"
                width={120}
                height={120}
                className="mb-4"
              />
              <p className="text-gray-500 text-base font-medium">
                No recipes found. Try a new keyword!
              </p>
            </div>
          )}

          {recipes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {recipes.map((recipe: any, idx: number) => (
                <RecipeCard
                  key={recipe.id}
                  title={recipe.title}
                  img={recipe.image?.url || '/images/broken-image.png'}
                  rating={4.5}
                  ingredients={recipe.ingredients?.length || 0}
                  author={recipe.author?.username || '-'}
                  authorAvatar={recipe?.author.image || ''}
                  isBookmarked={false}
                  time={recipe.cookingTime}
                  onClick={() => router.push(`/recipes/${recipe.id}`)}
                  onBookmark={(e) => {
                    e.stopPropagation();
                  }}
                  onMenu={(e) => {
                    e.stopPropagation();
                  }}
                  menuOpen={false}
                />
              ))}
            </div>
          )}

          {loading && recipes.length === 0 && <RecipeSkeletonGrid count={24} />}

          <div ref={loaderRef} className="h-8" />
          {(loading || isFetchingMore) && recipes.length > 0 && (
            <div className="flex justify-center py-6">
              <span className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
            </div>
          )}
          {!meta.hasNextPage && recipes.length > 0 && (
            <div className="text-center text-gray-400 py-8">
              No more recipes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
