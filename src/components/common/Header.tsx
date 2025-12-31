import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Menu, X, Home, MapPin, Shield, User, LogOut, LogIn } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/map', label: 'Report Incident', icon: MapPin },
  ];
  
  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100' 
          : 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg'
      }`}>
        <nav className="container mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3.5 lg:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-2.5 lg:space-x-3 hover:opacity-90 transition-all duration-200 hover:scale-105 group flex-shrink-0"
            >
              <div className="relative">
                <img 
                  src="/Logo.png" 
                  alt="CAPWA Logo" 
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 object-contain transition-transform duration-200 group-hover:rotate-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold transition-colors duration-300 truncate ${
                  scrolled ? 'text-green-700' : 'text-white'
                }`}>
                  CAPWA
                </span>
                <span className={`text-[9px] sm:text-[10px] md:text-xs lg:text-xs transition-colors duration-300 hidden md:block ${
                  scrolled ? 'text-green-600' : 'text-green-100'
                }`}>
                  Community Animals Partners & Welfare Advocates
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-2 flex-shrink-0">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 xl:space-x-2 px-3 xl:px-4 py-2 xl:py-2.5 rounded-xl transition-all duration-200 font-medium text-sm xl:text-base ${
                      isActive(link.path)
                        ? scrolled
                          ? 'bg-green-100 text-green-700 shadow-md'
                          : 'bg-white text-green-700 shadow-lg'
                        : scrolled
                          ? 'text-green-700 hover:bg-green-50'
                          : 'text-white hover:bg-white/20'
                    } hover:scale-105`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}
              <div className="flex items-center space-x-1.5 xl:space-x-2">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className={`flex items-center space-x-1.5 xl:space-x-2 px-3 xl:px-4 py-2 xl:py-2.5 rounded-xl transition-all duration-200 font-medium text-sm xl:text-base ${
                          isActive('/admin')
                            ? scrolled
                              ? 'bg-green-100 text-green-700 shadow-md'
                              : 'bg-white text-green-700 shadow-lg'
                            : scrolled
                              ? 'text-green-700 hover:bg-green-50'
                              : 'text-white hover:bg-white/20'
                        } hover:scale-105`}
                      >
                        <Shield className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden xl:inline">Admin</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className={`flex items-center space-x-1.5 xl:space-x-2 px-3 xl:px-4 py-2 xl:py-2.5 rounded-xl transition-all duration-200 font-medium text-sm xl:text-base ${
                        isActive('/profile')
                          ? scrolled
                            ? 'bg-green-100 text-green-700 shadow-md'
                            : 'bg-white text-green-700 shadow-lg'
                          : scrolled
                            ? 'text-green-700 hover:bg-green-50'
                            : 'text-white hover:bg-white/20'
                      } hover:scale-105`}
                    >
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="max-w-[100px] xl:max-w-none truncate">{user?.name || 'Profile'}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center space-x-1.5 xl:space-x-2 px-3 xl:px-4 py-2 xl:py-2.5 rounded-xl transition-all duration-200 font-medium text-sm xl:text-base ${
                        scrolled
                          ? 'text-green-700 hover:bg-green-50'
                          : 'text-white hover:bg-white/20'
                      } hover:scale-105`}
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden xl:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className={`flex items-center space-x-1.5 xl:space-x-2 px-3 xl:px-4 py-2 xl:py-2.5 rounded-xl transition-all duration-200 font-medium text-sm xl:text-base ${
                      isActive('/login')
                        ? scrolled
                          ? 'bg-green-100 text-green-700 shadow-md'
                          : 'bg-white text-green-700 shadow-lg'
                        : 'bg-yellow-400 text-green-800 hover:bg-yellow-300 shadow-md hover:shadow-lg'
                    } hover:scale-105`}
                  >
                    <LogIn className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Login</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Tablet Navigation (md to lg) */}
            <div className="hidden md:flex lg:hidden items-center space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      isActive(link.path)
                        ? scrolled
                          ? 'bg-green-100 text-green-700 shadow-md'
                          : 'bg-white text-green-700 shadow-lg'
                        : scrolled
                          ? 'text-green-700 hover:bg-green-50'
                          : 'text-white hover:bg-white/20'
                    } hover:scale-105`}
                    title={link.label}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                        isActive('/admin')
                          ? scrolled
                            ? 'bg-green-100 text-green-700 shadow-md'
                            : 'bg-white text-green-700 shadow-lg'
                          : scrolled
                            ? 'text-green-700 hover:bg-green-50'
                            : 'text-white hover:bg-white/20'
                      } hover:scale-105`}
                      title="Admin"
                    >
                      <Shield className="w-4 h-4" />
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      isActive('/profile')
                        ? scrolled
                          ? 'bg-green-100 text-green-700 shadow-md'
                          : 'bg-white text-green-700 shadow-lg'
                        : scrolled
                          ? 'text-green-700 hover:bg-green-50'
                          : 'text-white hover:bg-white/20'
                    } hover:scale-105`}
                    title={user?.name || 'Profile'}
                  >
                    <User className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      scrolled
                        ? 'text-green-700 hover:bg-green-50'
                        : 'text-white hover:bg-white/20'
                    } hover:scale-105`}
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm bg-yellow-400 text-green-800 hover:bg-yellow-300 shadow-md hover:shadow-lg hover:scale-105`}
                  title="Login"
                >
                  <LogIn className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                scrolled 
                  ? 'text-green-700 hover:bg-green-50' 
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/Logo.png" 
                alt="CAPWA Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-xl font-bold text-white">CAPWA</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive(link.path)
                      ? 'bg-green-100 text-green-700 shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-gray-200 mt-4">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                        isActive('/admin')
                          ? 'bg-green-100 text-green-700 shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      isActive('/profile')
                        ? 'bg-green-100 text-green-700 shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>{user?.name || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium bg-yellow-400 text-green-800 hover:bg-yellow-300 shadow-md"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
