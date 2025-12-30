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

  return (
    <Marker
      position={[incident.location.lat, incident.location.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => onClick?.(incident),
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 capitalize">{incident.type}</span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                incident.severity === 'critical'
                  ? 'bg-red-100 text-red-800'
                  : incident.severity === 'high'
                  ? 'bg-amber-100 text-amber-800'
                  : incident.severity === 'medium'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {incident.severity}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{incident.description}</p>
          <div className="text-xs text-gray-500">
            <p>Status: <span className="capitalize">{incident.status}</span></p>
            <p>{formatDate(incident.timestamp)}</p>
          </div>
          {onClick && (
            <button
              className="mt-2 w-full text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              onClick={() => onClick(incident)}
            >
              View Details →
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

