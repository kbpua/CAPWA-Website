import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center';
  
  const getVariantClasses = () => {
    if (theme === 'dark') {
      return {
        primary: 'bg-[#6b8e23] text-white hover:bg-[#7a9c4f] focus:ring-[#6b8e23] shadow-md hover:shadow-lg hover:scale-105',
        secondary: 'bg-yellow-500 text-[#1a2332] hover:bg-yellow-400 focus:ring-yellow-500 shadow-md hover:shadow-lg font-semibold hover:scale-105',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg hover:scale-105',
        outline: 'border-2 border-[#6b8e23] text-[#6b8e23] hover:bg-[#6b8e23]/20 focus:ring-[#6b8e23] bg-transparent hover:scale-105',
      };
    }
    return {
      primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg hover:scale-105',
      secondary: 'bg-yellow-400 text-green-800 hover:bg-yellow-300 focus:ring-yellow-500 shadow-md hover:shadow-lg font-semibold hover:scale-105',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg hover:scale-105',
      outline: 'border-2 border-green-600 text-green-700 hover:bg-green-50 focus:ring-green-500 bg-white hover:scale-105',
    };
  };
  
  const variantClasses = getVariantClasses();
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

