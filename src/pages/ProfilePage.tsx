import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 
          className="text-3xl font-bold mb-6"
          style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
        >
          My Profile
        </h1>
        
        <div 
          className="rounded-lg shadow-md p-6 space-y-6 border transition-colors duration-300"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
            borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
          }}
        >
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
            >
              Name
            </label>
            <p style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}>
              {user.name}
            </p>
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
            >
              Email
            </label>
            <p style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}>
              {user.email}
            </p>
          </div>

          {user.phone && (
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
              >
                Phone
              </label>
              <p style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}>
                {user.phone}
              </p>
            </div>
          )}

          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
            >
              Role
            </label>
            <span 
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: theme === 'dark'
                  ? user.role === 'admin'
                    ? 'rgba(147, 51, 234, 0.2)'
                    : 'rgba(59, 130, 246, 0.2)'
                  : user.role === 'admin'
                  ? '#f3e8ff'
                  : '#dbeafe',
                color: theme === 'dark'
                  ? user.role === 'admin'
                    ? '#c084fc'
                    : '#93c5fd'
                  : user.role === 'admin'
                  ? '#6b21a8'
                  : '#1e40af',
              }}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>

          {user.location && (
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
              >
                Location
              </label>
              <p style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}>
                {user.location.address || `${user.location.city}, ${user.location.province}`}
              </p>
            </div>
          )}

          <div 
            className="border-t pt-6"
            style={{ borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb' }}
          >
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

