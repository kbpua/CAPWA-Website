import React from 'react';
import type { SeverityLevel } from '../../types';

interface PriorityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ severity, className = '' }) => {
  const severityStyles = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-amber-100 text-amber-800 border-amber-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${severityStyles[severity]} ${className}`}
    >
      <span className="capitalize">{severity}</span>
    </span>
  );
};

