import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useTheme } from '../../contexts/ThemeContext';
import type { IncidentReport } from '../../types';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon colors based on severity
const getMarkerColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return '#dc2626'; // red
    case 'high':
      return '#f59e0b'; // amber
    case 'medium':
      return '#3b82f6'; // blue
    case 'low':
      return '#10b981'; // green
    default:
      return '#6b7280'; // gray
  }
};

interface MapMarkerProps {
  incident: IncidentReport;
  onClick?: (incident: IncidentReport) => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ incident, onClick }) => {
  const { theme } = useTheme();
  const borderColor = theme === 'dark' ? '#1a2332' : 'white';
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${getMarkerColor(incident.severity)}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid ${borderColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(incident);
  };

  return (
    <Marker
      position={[incident.location.lat, incident.location.lng]}
      icon={customIcon}
    >
      <Popup className="custom-popup" autoClose={false} closeOnClick={true}>
        <div 
          className="p-3 min-w-[240px] max-w-[280px]"
          style={{
            color: theme === 'dark' ? 'var(--text-primary)' : '#111827',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span 
              className="font-bold capitalize text-base"
              style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
            >
              {incident.type}
            </span>
            <span
              className="px-2.5 py-1 text-xs font-semibold rounded-full capitalize"
              style={{
                backgroundColor: theme === 'dark'
                  ? incident.severity === 'critical'
                    ? 'rgba(220, 38, 38, 0.2)'
                    : incident.severity === 'high'
                    ? 'rgba(245, 158, 11, 0.2)'
                    : incident.severity === 'medium'
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(16, 185, 129, 0.2)'
                  : incident.severity === 'critical'
                  ? '#fee2e2'
                  : incident.severity === 'high'
                  ? '#fef3c7'
                  : incident.severity === 'medium'
                  ? '#dbeafe'
                  : '#d1fae5',
                color: theme === 'dark'
                  ? incident.severity === 'critical'
                    ? '#fca5a5'
                    : incident.severity === 'high'
                    ? '#fcd34d'
                    : incident.severity === 'medium'
                    ? '#93c5fd'
                    : '#6ee7b7'
                  : incident.severity === 'critical'
                  ? '#991b1b'
                  : incident.severity === 'high'
                  ? '#92400e'
                  : incident.severity === 'medium'
                  ? '#1e40af'
                  : '#065f46',
                borderColor: theme === 'dark'
                  ? incident.severity === 'critical'
                    ? 'rgba(220, 38, 38, 0.3)'
                    : incident.severity === 'high'
                    ? 'rgba(245, 158, 11, 0.3)'
                    : incident.severity === 'medium'
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(16, 185, 129, 0.3)'
                  : incident.severity === 'critical'
                  ? '#fecaca'
                  : incident.severity === 'high'
                  ? '#fde68a'
                  : incident.severity === 'medium'
                  ? '#bfdbfe'
                  : '#a7f3d0',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            >
              {incident.severity}
            </span>
          </div>
          
          <p 
            className="text-sm mb-3 line-clamp-3 leading-relaxed"
            style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
          >
            {incident.description}
          </p>
          
          <div 
            className="space-y-1.5 mb-3 pb-3 border-b"
            style={{
              borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
            }}
          >
            <div 
              className="flex items-center text-xs"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
            >
              <span className="font-medium mr-2">Status:</span>
              <span 
                className="capitalize"
                style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
              >
                {incident.status}
              </span>
            </div>
            <div 
              className="flex items-center text-xs"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
            >
              <span className="font-medium mr-2">Reported:</span>
              <span style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}>
                {formatDate(incident.timestamp)}
              </span>
            </div>
            {incident.location.city && (
              <div 
                className="flex items-center text-xs"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
              >
                <span className="font-medium mr-2">Location:</span>
                <span style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}>
                  {incident.location.city}
                </span>
              </div>
            )}
          </div>
          
          {onClick && (
            <button
              onClick={handleViewDetails}
              className="w-full px-4 py-2.5 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(to right, #6b8e23, #7a9c4f)'
                  : 'linear-gradient(to right, #10b981, #059669)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme === 'dark'
                  ? 'linear-gradient(to right, #7a9c4f, #8fa85c)'
                  : 'linear-gradient(to right, #059669, #047857)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme === 'dark'
                  ? 'linear-gradient(to right, #6b8e23, #7a9c4f)'
                  : 'linear-gradient(to right, #10b981, #059669)';
              }}
            >
              <span>View Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

