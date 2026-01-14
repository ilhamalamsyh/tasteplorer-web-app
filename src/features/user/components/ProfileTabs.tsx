'use client';

import React from 'react';

interface ProfileTabsProps {
  activeTab: 'posts' | 'recipes';
  onTabChange: (tab: 'posts' | 'recipes') => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabStyle = (tab: 'posts' | 'recipes') => {
    const isActive = activeTab === tab;
    return `flex-1 py-3 text-center font-semibold transition-all duration-200 border-b-2 ${
      isActive
        ? 'border-primary text-primary'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`;
  };

  return (
    <div className="flex border-b border-gray-200 bg-white">
      <button
        type="button"
        className={tabStyle('posts')}
        onClick={() => onTabChange('posts')}
        aria-label="Posts tab"
      >
        Posts
      </button>
      <button
        type="button"
        className={tabStyle('recipes')}
        onClick={() => onTabChange('recipes')}
        aria-label="Recipes tab"
      >
        Recipes
      </button>
    </div>
  );
};
