import React from 'react';
import FeedSidebar from '@/core/components/FeedSidebar/FeedSidebar';
import FeedPostCard from '@/core/components/FeedPostCard/FeedPostCard';
import { feedPosts } from '@/core/data/feedPosts';
import '@/styles/tailwind.css';

const Home = () => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <main className="flex justify-center w-full max-w-[1440px] mx-auto">
        {/* Sidebar (desktop only, sticky) */}
        <aside className="hidden lg:block w-[380px] flex-shrink-0 py-8 pr-8">
          <div className="sticky top-24">
            <FeedSidebar />
          </div>
        </aside>
        {/* Feed */}
        <section className="flex flex-col w-full max-w-2xl py-8 gap-6 px-4 lg:px-0">
          {feedPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
