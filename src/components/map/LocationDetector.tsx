import React, { useEffect } from 'react';
import { useLocation } from '../../hooks/useLocation';
import type { Location } from '../../types';

interface LocationDetectorProps {
  onLocationDetected?: (location: Location) => void;
}

export const LocationDetector: React.FC<LocationDetectorProps> = ({ onLocationDetected }) => {
  const { location, loading, refreshLocation } = useLocation();

  useEffect(() => {
    if (location && onLocationDetected) {
      onLocationDetected(location);
    }
  }, [location, onLocationDetected]);

  if (loading) {
    return (
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
          <span className="text-sm text-gray-700">Detecting location...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg shadow-lg p-3 z-[1000] max-w-xs">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-700 mb-1">📍 Current Location</p>
          <p className="text-xs text-gray-600">
            {location?.city && location?.province
              ? `${location.city}, ${location.province}`
              : location?.address || 'Manila, Philippines'}
          </p>
        </div>
        <button
          onClick={refreshLocation}
          className="ml-2 text-emerald-600 hover:text-emerald-700"
          title="Refresh location"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

