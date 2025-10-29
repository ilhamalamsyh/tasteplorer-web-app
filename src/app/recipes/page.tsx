/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import RecipeCard from '@/core/components/RecipeCard/RecipeCard';
import { recipes as dummyRecipes } from '@/core/data/recipes';

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

const fetchRecipes = async (page: number, limit: number, sort: string) => {
  // Simulasi delay dan pagination dummy
  await new Promise((r) => setTimeout(r, 600));
  const start = (page - 1) * limit;
  const end = start + limit;
  return dummyRecipes.slice(start, end);
};

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState<SortOption>('relevance');
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Fetch recipes
  const loadRecipes = useCallback(
    async (reset = false) => {
      setIsLoading(true);
      try {
        const data = await fetchRecipes(reset ? 1 : page, LIMIT, sort);
        if (reset) {
          setRecipes(data);
        } else {
          setRecipes((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === LIMIT);
      } finally {
        setIsLoading(false);
      }
    },
    [page, sort]
  );

  // Initial & sort change fetch
  useEffect(() => {
    setPage(1);
    loadRecipes(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || isLoading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, isLoading]);

  // Fetch next page
  useEffect(() => {
    if (page === 1) return;
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-0 md:px-0 py-0 flex flex-col items-center">
        <div className="w-full bg-white md:w-4/5 md:bg-white md:rounded-2xl md:shadow-md md:p-8 px-4 md:px-10 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">Tasteplorer / Recipes</p>
              <h1 className="text-2xl font-bold">Recipes</h1>
            </div>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {recipes.map((recipe, idx) => (
              <RecipeCard
                key={recipe.title + idx}
                title={recipe.title}
                img={recipe.img}
                rating={recipe.rating}
                ingredients={recipe.ingredients}
                author={recipe.author}
                authorAvatar={recipe.authorAvatar}
                isBookmarked={recipe.isBookmarked}
                time={recipe.time}
                onClick={() => {}}
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

          {isLoading && recipes.length === 0 && (
            <RecipeSkeletonGrid count={24} />
          )}

          <div ref={loaderRef} className="h-8" />
          {isLoading && recipes.length > 0 && (
            <div className="flex justify-center py-6">
              <span className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
            </div>
          )}
          {!hasMore && recipes.length > 0 && (
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
