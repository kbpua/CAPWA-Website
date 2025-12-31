import React, { useEffect, useState } from 'react';

export const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const minimumDisplayTime = 1500; // Minimum 1.5 seconds
    const fadeOutDuration = 2000; // 2 seconds fade out (slower)

    // Hide loading screen after a minimum display time and when page is loaded
    const handleHide = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumDisplayTime - elapsed);
      
      setTimeout(() => {
        setIsVisible(false);
        // Remove from DOM after fade out completes
        setTimeout(() => {
          setShouldRender(false);
        }, fadeOutDuration);
      }, remainingTime);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleHide();
    } else {
      window.addEventListener('load', handleHide);
    }

    // Fallback: ensure it shows for at least 3 seconds even if page loads quickly
    const fallbackTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
      }, fadeOutDuration);
    }, minimumDisplayTime);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('load', handleHide);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div 
      data-loading-screen
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 flex items-center justify-center transition-opacity duration-[2000ms] ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6 animate-fadeIn">
        {/* Logo */}
        <div className="relative">
          <img 
            src="/Logo.png" 
            alt="CAPWA Logo" 
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain animate-pulse"
            onError={(e) => {
              // Fallback if logo doesn't load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Spinning ring around logo */}
          <div className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 animate-fadeIn">
            CAPWA
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-green-100 font-medium animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Community Animals Partners & Welfare Advocates
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center space-x-2 mt-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Loading Text */}
        <p className="text-white/80 text-sm sm:text-base mt-2 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          Loading...
        </p>
      </div>
    </div>
  );
};

