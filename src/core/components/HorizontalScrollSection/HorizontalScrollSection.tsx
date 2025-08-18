import React, { useRef, ReactNode } from 'react';
import useScrollButtons from '@/core/hooks/useScrollButtons';

interface HorizontalScrollSectionProps {
  title: string;
  children: ReactNode;
  sectionWidth?: string;
}

const HorizontalScrollSection: React.FC<HorizontalScrollSectionProps> = ({
  title,
  children,
  sectionWidth = 'max-w-3xl',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = useScrollButtons(scrollRef as React.RefObject<HTMLDivElement>);

  // Track scroll position for chevron visibility
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [children]);

  React.useEffect(() => {
    updateScrollButtons();
  }, [children]);

  return (
    <section
      className={`px-0 md:px-0 bg-white py-10 ${sectionWidth} mx-auto relative`}
    >
      {title && (
        <h2 className="text-2xl font-semibold mb-6 font-poppins text-gray-800 text-left">
          {title}
        </h2>
      )}
      <div className="relative group">
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-[35%] z-10 bg-white border border-gray-200 rounded-full shadow-sm w-8 h-8 hidden md:flex items-center justify-center hover:bg-gray-100 transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-[35%] z-10 bg-white border border-gray-200 rounded-full shadow-sm w-8 h-8 hidden md:flex items-center justify-center hover:bg-gray-100 transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
        <div
          ref={scrollRef}
          className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-hide touch-pan-x"
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScrollSection;
