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

const DEFAULT_ZOOM = 13;

interface PhilippinesMapProps {
  onIncidentClick?: (incident: IncidentReport) => void;
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

export const PhilippinesMap: React.FC<PhilippinesMapProps> = ({ onIncidentClick }) => {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const { location: userLocation } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    loadIncidents();
  }, []);

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
      await loadIncidents();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowReportForm(false);
    setClickedLocation(null);
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

      <LocationDetector />

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[999]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading incidents...</p>
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

      {/* Emergency Button */}
      {user && <EmergencyButton />}
    </div>
  );
};

