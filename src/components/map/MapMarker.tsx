import React from 'react';
import { Marker, Popup } from 'react-leaflet';
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
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${getMarkerColor(incident.severity)}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
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
        <div className="p-3 min-w-[240px] max-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-gray-900 capitalize text-base">{incident.type}</span>
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                incident.severity === 'critical'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : incident.severity === 'high'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : incident.severity === 'medium'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}
            >
              {incident.severity}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-3 leading-relaxed">{incident.description}</p>
          
          <div className="space-y-1.5 mb-3 pb-3 border-b border-gray-200">
            <div className="flex items-center text-xs text-gray-600">
              <span className="font-medium mr-2">Status:</span>
              <span className="capitalize text-gray-800">{incident.status}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <span className="font-medium mr-2">Reported:</span>
              <span className="text-gray-800">{formatDate(incident.timestamp)}</span>
            </div>
            {incident.location.city && (
              <div className="flex items-center text-xs text-gray-600">
                <span className="font-medium mr-2">Location:</span>
                <span className="text-gray-800">{incident.location.city}</span>
              </div>
            )}
          </div>
          
          {onClick && (
            <button
              onClick={handleViewDetails}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
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

