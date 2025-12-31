import React, { useEffect, useState } from 'react';
import { useLocation } from '../../hooks/useLocation';
import type { Location } from '../../types';

interface LocationDetectorProps {
  onLocationDetected?: (location: Location) => void;
  isModalOpen?: boolean; // Fade out when modals are open
}

export const LocationDetector: React.FC<LocationDetectorProps> = ({ onLocationDetected, isModalOpen }) => {
  const { location, loading, refreshLocation } = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (location && onLocationDetected) {
      onLocationDetected(location);
    }
  }, [location, onLocationDetected]);

  // Handle scroll detection - hide when scrolling, show when stopped
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = Math.abs(currentScrollY - lastScrollY);
          
          if (scrollDelta > 5) {
            setIsScrolling(true);
            // Clear existing timeout
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            // Show again after scrolling stops
            timeoutId = setTimeout(() => {
              setIsScrolling(false);
              timeoutId = null;
            }, 150);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Auto-hide completely after showing location for 3 seconds
  useEffect(() => {
    if (!loading && location && !isModalOpen) {
      const timer = setTimeout(() => {
        // Completely hide after showing location
        setIsVisible(false);
      }, 3000); // 3 seconds to read the location
      return () => clearTimeout(timer);
    }
  }, [loading, location, isModalOpen]);

  // Reset visibility when location changes (new location detected)
  useEffect(() => {
    if (location) {
      setIsVisible(true);
      setIsCollapsed(false);
    }
  }, [location]);

  // Reset visibility when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setIsVisible(true);
    }
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className={`absolute top-16 sm:top-20 md:top-24 left-2 sm:left-3 md:left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-1.5 sm:p-2.5 md:p-3 z-40 max-w-[140px] sm:max-w-xs transition-all duration-300 ${
        isModalOpen || isScrolling ? 'opacity-0 pointer-events-none translate-y-[-10px]' : 'opacity-100 translate-y-0'
      }`}>
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <div className="animate-spin rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 border-b-2 border-emerald-600"></div>
          <span className="text-[9px] sm:text-xs text-gray-700">Detecting...</span>
        </div>
      </div>
    );
  }

  // Completely hide after showing location (not just collapse)
  if (!isVisible) return null;

  return (
    <div className={`absolute top-16 sm:top-20 md:top-24 left-2 sm:left-3 md:left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-1.5 sm:p-2.5 md:p-3 z-40 max-w-[140px] sm:max-w-xs transition-all duration-300 ${
      isModalOpen || isScrolling ? 'opacity-0 pointer-events-none translate-y-[-10px]' : 'opacity-100 translate-y-0'
    }`}>
      <div className="flex items-start justify-between gap-1.5 sm:gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1 leading-tight">📍 Location</p>
          <p className="text-[9px] sm:text-xs text-gray-600 truncate leading-tight">
            {location?.city && location?.province
              ? `${location.city}, ${location.province}`
              : location?.address || 'Manila, PH'}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={refreshLocation}
            className="text-emerald-600 hover:text-emerald-700 p-0.5"
            title="Refresh location"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 p-0.5"
            title="Dismiss"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

