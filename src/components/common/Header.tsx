import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <img 
              src="/Logo.png" 
              alt="CAPWA Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                // Fallback if logo doesn't exist
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">CAPWA</span>
              <span className="text-xs text-green-100">Community Animals Partners & Welfare Advocates</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                isActive('/')
                  ? 'bg-white text-green-700 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Home
            </Link>
            <Link
              to="/map"
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                isActive('/map')
                  ? 'bg-white text-green-700 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Report Incident
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-lg transition-all font-medium ${
                      isActive('/admin')
                        ? 'bg-white text-green-700 shadow-md'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg transition-all font-medium ${
                    isActive('/profile')
                      ? 'bg-white text-green-700 shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {user?.name || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  isActive('/login')
                    ? 'bg-white text-green-700 shadow-md'
                    : 'bg-yellow-400 text-green-800 hover:bg-yellow-300 shadow-md'
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
