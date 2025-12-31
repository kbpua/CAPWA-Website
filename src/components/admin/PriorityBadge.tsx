import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { SeverityLevel } from '../../types';

interface PriorityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ severity, className = '' }) => {
  const { theme } = useTheme();
  
  const getSeverityStyles = () => {
    if (theme === 'dark') {
      return {
        critical: {
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          color: '#fca5a5',
          borderColor: 'rgba(220, 38, 38, 0.3)',
        },
        high: {
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          color: '#fcd34d',
          borderColor: 'rgba(245, 158, 11, 0.3)',
        },
        medium: {
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          color: '#93c5fd',
          borderColor: 'rgba(59, 130, 246, 0.3)',
        },
        low: {
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          color: '#6ee7b7',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        },
      };
    }
    return {
      critical: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderColor: '#fecaca',
      },
      high: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        borderColor: '#fde68a',
      },
      medium: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        borderColor: '#bfdbfe',
      },
      low: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        borderColor: '#a7f3d0',
      },
    };
  };

  const styles = getSeverityStyles()[severity];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
      style={styles}
    >
      <span className="capitalize">{severity}</span>
    </span>
  );
};

