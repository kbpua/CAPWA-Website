import React, { useState } from 'react';
import { PhilippinesMap } from '../components/map/PhilippinesMap';
import { IncidentDetailModal } from '../components/common/IncidentDetailModal';
import type { IncidentReport } from '../types';
import { reportService } from '../services/reportService';
import toast from 'react-hot-toast';

export const MapPage: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIncidentClick = (incident: IncidentReport) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: IncidentReport['status']) => {
    try {
      await reportService.updateStatus(id, status);
      if (selectedIncident) {
        setSelectedIncident({ ...selectedIncident, status });
      }
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateSeverity = async (id: string, severity: IncidentReport['severity']) => {
    try {
      await reportService.updateSeverity(id, severity);
      if (selectedIncident) {
        setSelectedIncident({ ...selectedIncident, severity });
      }
      toast.success('Severity updated successfully');
    } catch (error) {
      toast.error('Failed to update severity');
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px] relative">
      <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2 border border-green-200">
        <p className="text-sm font-medium text-gray-700">📍 Click on map to report an incident</p>
      </div>
      <PhilippinesMap onIncidentClick={handleIncidentClick} />
      <IncidentDetailModal
        incident={selectedIncident}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateSeverity={handleUpdateSeverity}
      />
    </div>
  );
};

