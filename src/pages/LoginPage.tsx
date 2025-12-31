import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../components/auth/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  // Redirect to home if already logged in
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 transition-colors duration-300"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(to bottom right, #1a2332, #243447, #2d4054)'
          : 'linear-gradient(to bottom right, #d1fae5, #ffffff, #dbeafe)'
      }}
    >
      <LoginForm />
    </div>
  );
};



