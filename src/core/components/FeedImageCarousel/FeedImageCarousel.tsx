'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface FeedImageCarouselProps {
  /** Ordered list of image URLs to display. */
  images: string[];
  /** Tailwind aspect-ratio class applied to the card image area (e.g. "aspect-[4/3]" or "aspect-video"). */
  aspectRatio?: string;
}

const FeedImageCarousel: React.FC<FeedImageCarouselProps> = ({
  images,
  aspectRatio = 'aspect-[4/3]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [originX, setOriginX] = useState('50%');
  const [originY, setOriginY] = useState('50%');

  const count = images.length;
  const slides = images.map((src) => ({ src }));

  // Track the active slide index by listening to scroll events on the scroll container.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || count <= 1) return;

    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveIndex(Math.max(0, Math.min(index, count - 1)));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [count]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: 'smooth' });
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollToIndex(Math.max(0, activeIndex - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollToIndex(Math.min(count - 1, activeIndex + 1));
  };

  const openLightbox = (index: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setOriginX(
        (((rect.left + rect.width / 2) / window.innerWidth) * 100).toFixed(1) +
          '%'
      );
      setOriginY(
        (((rect.top + rect.height / 2) / window.innerHeight) * 100).toFixed(1) +
          '%'
      );
    }
    setLightboxIndex(index);
    setOpen(true);
  };

  if (!count) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectRatio} bg-gray-100 overflow-hidden`}
    >
      {/* ── Scroll container ── */}
      <div
        ref={scrollRef}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="relative flex-none w-full h-full snap-center cursor-pointer"
            onClick={() => openLightbox(i)}
            role="button"
            tabIndex={0}
            aria-label={`View image ${i + 1} of ${count}`}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(i)}
          >
            <Image
              src={src}
              alt={`Post image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-200 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 672px"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* ── Prev / Next arrows (multi-image only) ── */}
      {count > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-default"
          >
            <FaChevronLeft size={14} />
          </button>

          <button
            onClick={handleNext}
            disabled={activeIndex === count - 1}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-default"
          >
            <FaChevronRight size={14} />
          </button>

          {/* ── Dot indicators ── */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === activeIndex ? 'bg-white w-3' : 'bg-white/60 w-1.5'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Lightbox ── */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom]}
        carousel={{ imageFit: 'contain', finite: true }}
        animation={{ fade: 220 }}
        className="yarl__card-origin"
        styles={{
          root: {
            '--yarl__card-ox': originX,
            '--yarl__card-oy': originY,
          },
        }}
      />
    </div>
  );
};

export default FeedImageCarousel;
