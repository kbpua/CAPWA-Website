import React, { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const { theme } = useTheme();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        ></div>

        {/* Modal */}
        <div
          className={`relative rounded-2xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all duration-300`}
          style={{
            backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div 
              className="flex items-center justify-between px-6 py-5 border-b rounded-t-2xl transition-colors duration-300"
              style={{
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
                background: theme === 'dark' 
                  ? 'linear-gradient(to right, #243447, #2d4054)'
                  : 'linear-gradient(to right, #f0fdf4, #d1fae5)',
              }}
            >
              <h3 
                className="text-2xl font-bold"
                style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                id="modal-title"
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                className="transition-colors rounded-lg p-2 hover:bg-opacity-20"
                style={{
                  color: theme === 'dark' ? 'var(--text-secondary)' : '#9ca3af',
                }}
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {!title && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 transition-colors rounded-lg p-2 z-10"
              style={{
                color: theme === 'dark' ? 'var(--text-secondary)' : '#9ca3af',
              }}
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Content */}
          <div 
            className="px-6 py-6 max-h-[70vh] overflow-y-auto"
            style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};



