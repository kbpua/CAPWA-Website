import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';

export const WelcomePage: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-colors duration-300"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(to bottom right, #1a2332, #243447, #2d4054)'
          : 'linear-gradient(to bottom right, #f0fdf4, #fefce8, #fef3c7)'
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16 fade-in">
            <div className="inline-block mb-4 md:mb-6 relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-4 ring-yellow-300/50 transition-transform duration-300 hover:scale-110">
                <img 
                  src="/Logo.png" 
                  alt="CAPWA Logo" 
                  className="w-20 h-20 md:w-24 md:h-24 object-contain"
                  onError={(e) => {
                    // Fallback icon if logo doesn't exist
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <svg class="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      `;
                    }
                  }}
                />
              </div>
              {/* Decorative stars */}
              <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 text-yellow-400 text-2xl md:text-4xl animate-pulse">⭐</div>
              <div className="absolute -bottom-1 md:-bottom-2 -left-2 md:-left-4 text-green-400 text-xl md:text-2xl">✨</div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6">
              <span className={`block ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>CAPWA</span>
              <span className={`block text-3xl sm:text-4xl md:text-5xl mt-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`}>Animal Welfare</span>
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 max-w-3xl mx-auto leading-relaxed px-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Community Animals Partners & Welfare Advocates
            </p>
            <p className={`text-base sm:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Help protect animals across the Philippines by reporting incidents quickly and easily.
              Our platform connects concerned citizens with animal welfare organizations.
            </p>
          </div>

          {/* Features Grid with collage-style cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
            <div 
              className="backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 text-center transform hover:scale-105 transition-all duration-300 border-2 relative overflow-hidden"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--card-bg)' : 'rgba(255, 255, 255, 0.8)',
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#bbf7d0',
              }}
            >
              <div className="absolute top-2 right-2 w-16 h-16 bg-yellow-200/30 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 
                  className="text-xl md:text-2xl font-bold mb-3 md:mb-4"
                  style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                >
                  Interactive Map
                </h3>
                <p 
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                >
                  Pinpoint incident locations on an interactive map for precise reporting across the Philippines
                </p>
              </div>
            </div>

            <div 
              className="backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 text-center transform hover:scale-105 transition-all duration-300 border-2 relative overflow-hidden"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--card-bg)' : 'rgba(255, 255, 255, 0.8)',
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#fde68a',
              }}
            >
              <div className="absolute top-2 left-2 w-16 h-16 bg-green-200/30 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 
                  className="text-xl md:text-2xl font-bold mb-3 md:mb-4"
                  style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                >
                  Quick Reporting
                </h3>
                <p 
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                >
                  Submit reports with descriptions and severity levels in minutes. Emergency SOS available for critical cases.
                </p>
              </div>
            </div>

            <div 
              className="backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 text-center transform hover:scale-105 transition-all duration-300 border-2 relative overflow-hidden sm:col-span-2 md:col-span-1"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--card-bg)' : 'rgba(255, 255, 255, 0.8)',
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#bbf7d0',
              }}
            >
              <div className="absolute bottom-2 right-2 w-16 h-16 bg-yellow-200/30 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 
                  className="text-xl md:text-2xl font-bold mb-3 md:mb-4"
                  style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                >
                  AI Assistant
                </h3>
                <p 
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                >
                  Get instant help with our AI chatbot. Emergency protocols and guidance available 24/7.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div 
            className="rounded-2xl shadow-2xl p-6 md:p-10 text-center relative overflow-hidden transition-colors duration-300"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(to right, #6b8e23, #7a9c4f)'
                : 'linear-gradient(to right, #10b981, #059669)',
            }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                Ready to Make a Difference? 🐾
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-green-50 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                Join CAPWA in protecting animals across the Philippines. Every report makes a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
                <Link to="/map" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-green-800 font-bold shadow-lg hover:shadow-xl transition-all duration-200">
                    Report an Incident
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-white font-bold hover:scale-105 transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Animal speech bubbles decoration */}
          <div className="mt-12 md:mt-16 flex justify-around items-end gap-4">
            <div 
              className="backdrop-blur-sm rounded-3xl p-3 md:p-4 shadow-lg border-2 transform -rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--card-bg)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#86efac',
              }}
            >
              <p 
                className="text-lg md:text-2xl font-bold"
                style={{ color: theme === 'dark' ? '#34d399' : '#15803d' }}
              >
                ARF ARF! 🐕
              </p>
            </div>
            <div 
              className="backdrop-blur-sm rounded-3xl p-3 md:p-4 shadow-lg border-2 transform rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--card-bg)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#fde047',
              }}
            >
              <p 
                className="text-lg md:text-2xl font-bold"
                style={{ color: theme === 'dark' ? '#fbbf24' : '#a16207' }}
              >
                MEOW! 🐱
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
