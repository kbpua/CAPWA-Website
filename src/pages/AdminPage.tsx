import React from 'react';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { useTheme } from '../contexts/ThemeContext';

export const AdminPage: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(to bottom right, #1a2332, #243447, #2d4054)'
          : 'linear-gradient(to bottom right, #f0fdf4, #fefce8, #ffffff)',
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(to bottom right, #6b8e23, #7a9c4f)'
                  : 'linear-gradient(to bottom right, #10b981, #059669)',
              }}
            >
              <img 
                src="/Logo.png" 
                alt="CAPWA Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 
                className="text-4xl font-bold"
                style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
              >
                Admin Dashboard
              </h1>
              <p 
                className="mt-1"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
              >
                Manage and track all animal welfare incident reports in the Philippines
              </p>
            </div>
          </div>
        </div>
        <AdminDashboard />
      </div>
    </div>
  );
};
