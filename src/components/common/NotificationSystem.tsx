import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

export const NotificationSystem: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
          color: theme === 'dark' ? 'var(--text-primary)' : '#111827',
          border: `1px solid ${theme === 'dark' ? 'var(--border-color)' : '#e5e7eb'}`,
          boxShadow: theme === 'dark' 
            ? '0 10px 25px rgba(0, 0, 0, 0.4)' 
            : '0 10px 25px rgba(0, 0, 0, 0.1)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: theme === 'dark' ? '#6b8e23' : '#10b981',
            secondary: theme === 'dark' ? 'var(--text-primary)' : '#ffffff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: theme === 'dark' ? 'var(--text-primary)' : '#ffffff',
          },
        },
      }}
    />
  );
};




