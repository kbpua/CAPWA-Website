import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import type { IncidentReport, Location } from '../../types';
import { MapMarker } from './MapMarker';
import { ReportForm } from './ReportForm';
import { LocationDetector } from './LocationDetector';
import { EmergencyButton } from './EmergencyButton';
import { DEFAULT_PH_LOCATION } from '../../utils/philippinesData';
import { reportService } from '../../services/reportService';
import { useLocation } from '../../hooks/useLocation';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

const DEFAULT_ZOOM = 13;

interface PhilippinesMapProps {
  onIncidentClick?: (incident: IncidentReport) => void;
  refreshTrigger?: number; // Trigger to reload incidents
  isDetailModalOpen?: boolean; // Track if detail modal is open
  onReportFormStateChange?: (isOpen: boolean) => void; // Notify when report form opens/closes
}

// Component to handle map clicks
const MapClickHandler: React.FC<{ onMapClick: (location: Location) => void }> = ({
  onMapClick,
}) => {
  useMapEvents({
    click: (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

export const PhilippinesMap: React.FC<PhilippinesMapProps> = ({ onIncidentClick, refreshTrigger, isDetailModalOpen, onReportFormStateChange }) => {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [showTapInstruction, setShowTapInstruction] = useState(true);
  const { location: userLocation } = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    loadIncidents();
  }, []);

  // Reload incidents when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      loadIncidents();
    }
  }, [refreshTrigger]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await reportService.getAll();
      setIncidents(data);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (location: Location) => {
    setClickedLocation(location);
    setShowReportForm(true);
    if (onReportFormStateChange) {
      onReportFormStateChange(true);
    }
  };

  const handleFormSubmit = async (formData: {
    location: Location;
    type: IncidentReport['type'];
    description: string;
    severity: IncidentReport['severity'];
    reporterInfo?: IncidentReport['reporterInfo'];
  }) => {
    try {
      await reportService.create({
        ...formData,
        status: 'new' as const,
        reporterInfo: {
          ...formData.reporterInfo,
          userId: user?.id,
        },
      });
      setShowReportForm(false);
      setClickedLocation(null);
      if (onReportFormStateChange) {
        onReportFormStateChange(false);
      }
      await loadIncidents();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowReportForm(false);
    setClickedLocation(null);
    if (onReportFormStateChange) {
      onReportFormStateChange(false);
    }
  };

  const handleMarkerClick = (incident: IncidentReport) => {
    if (onIncidentClick) {
      onIncidentClick(incident);
    }
  };

  const mapCenter = userLocation || DEFAULT_PH_LOCATION;

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleMapClick} />
        {incidents.map((incident) => (
          <MapMarker
            key={incident.id}
            incident={incident}
            onClick={handleMarkerClick}
          />
        ))}
      </MapContainer>

      <LocationDetector isModalOpen={showReportForm || isDetailModalOpen || isEmergencyModalOpen} />

      {/* Loading State */}
      {loading && (
        <div 
          className="absolute inset-0 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-[999]"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(26, 35, 50, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          }}
        >
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{
                borderColor: theme === 'dark' ? '#6b8e23' : '#10b981',
              }}
            ></div>
            <p 
              className="mt-4"
              style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#374151' }}
            >
              Loading incidents...
            </p>
          </div>
        </div>
      )}

      {/* Tap Map Instruction */}
      {showTapInstruction && !showReportForm && !loading && (
        <div 
          className="absolute top-20 right-2 sm:right-3 md:right-4 backdrop-blur-sm rounded-lg shadow-lg p-3 sm:p-4 z-40 max-w-[200px] sm:max-w-xs border transition-all duration-300"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(36, 52, 71, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1">
              <span className="text-lg sm:text-xl">📍</span>
              <p 
                className="text-xs sm:text-sm font-medium leading-tight"
                style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#374151' }}
              >
                Tap map to report
              </p>
            </div>
            <button
              onClick={() => setShowTapInstruction(false)}
              className="p-0.5 rounded transition-colors hover:bg-opacity-20 flex-shrink-0"
              style={{
                color: theme === 'dark' ? 'var(--text-tertiary)' : '#9ca3af',
              }}
              title="Dismiss"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Report Form Modal */}
      {showReportForm && clickedLocation && (
        <ReportForm
          location={clickedLocation}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Emergency Button - Available to all users, including non-logged-in */}
      <EmergencyButton onModalStateChange={setIsEmergencyModalOpen} />
    </div>
  );
};

