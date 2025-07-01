import React from 'react';
import FeedSidebar from '@/core/components/FeedSidebar/FeedSidebar';
import FeedPostCard from '@/core/components/FeedPostCard/FeedPostCard';
import { feedPosts } from '@/core/data/feedPosts';
import '@/styles/tailwind.css';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc] w-full">
      <main className="flex justify-center flex-1 w-full">
        {/* Sidebar (desktop only, sticky) */}
        <aside className="hidden lg:block w-[380px] flex-shrink-0 py-8 pr-8">
          <div className="sticky top-8">
            <FeedSidebar />
          </div>
        </aside>
        {/* Feed */}
        <section className="flex flex-col w-full max-w-2xl py-8 gap-6">
          {feedPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
