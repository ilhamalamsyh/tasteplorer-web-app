import React, { useEffect, useState, ReactNode } from 'react';
import { useScrollLock } from '@/core/hooks/useScrollLock';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Use the scroll lock hook
  useScrollLock(isOpen);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] z-50 transition-all duration-300 ease-in-out"
    >
      <div
        onClick={handleOverlayClick}
        className={`
          min-h-screen overflow-hidden
          ${isMobile ? 'bg-bgcolor' : 'flex items-center justify-center p-4'}
        `}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            bg-white relative overflow-y-auto scrollbar-hide
            ${
              isMobile
                ? 'min-h-screen w-full px-6 py-8'
                : 'w-full max-w-2xl mx-auto rounded-3xl shadow-xl transform transition-all duration-300 ease-out max-h-[90vh]'
            }
          `}
        >
          {/* Close button - consistent for both mobile and desktop */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-500 hover:text-gray-700 z-10 transition-colors p-2"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
