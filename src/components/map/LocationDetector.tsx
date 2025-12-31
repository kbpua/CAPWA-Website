import React, { useEffect } from 'react';
import { useLocation } from '../../hooks/useLocation';
import type { Location } from '../../types';

interface LocationDetectorProps {
  onLocationDetected?: (location: Location) => void;
  isModalOpen?: boolean; // Fade out when modals are open
}

export const LocationDetector: React.FC<LocationDetectorProps> = ({ onLocationDetected, isModalOpen }) => {
  const { location, loading, refreshLocation } = useLocation();

  useEffect(() => {
    if (location && onLocationDetected) {
      onLocationDetected(location);
    }
  }, [location, onLocationDetected]);

  if (loading) {
    return (
      <div className={`absolute top-16 sm:top-20 md:top-24 left-3 sm:left-4 bg-white bg-opacity-95 rounded-lg shadow-lg p-2.5 sm:p-3 z-[1000] max-w-[calc(100vw-1.5rem)] sm:max-w-xs transition-opacity duration-300 ${
        isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-emerald-600"></div>
          <span className="text-xs sm:text-sm text-gray-700">Detecting location...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute top-16 sm:top-20 md:top-24 left-3 sm:left-4 bg-white bg-opacity-95 rounded-lg shadow-lg p-2.5 sm:p-3 z-[1000] max-w-[calc(100vw-1.5rem)] sm:max-w-xs transition-opacity duration-300 ${
      isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">📍 Current Location</p>
          <p className="text-[10px] sm:text-xs text-gray-600 truncate">
            {location?.city && location?.province
              ? `${location.city}, ${location.province}`
              : location?.address || 'Manila, Philippines'}
          </p>
        </div>
        <button
          onClick={refreshLocation}
          className="ml-1 sm:ml-2 text-emerald-600 hover:text-emerald-700 flex-shrink-0"
          title="Refresh location"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

