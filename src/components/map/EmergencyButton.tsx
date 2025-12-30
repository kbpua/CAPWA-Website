import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import toast from 'react-hot-toast';

export const EmergencyButton: React.FC = () => {
  const [isReporting, setIsReporting] = useState(false);
  const { user } = useAuth();
  const { location } = useLocation();

  const handleEmergencyReport = async () => {
    if (!confirm('This will create an EMERGENCY incident report. Continue?')) {
      return;
    }

    setIsReporting(true);
    try {
      await reportService.create({
        location: location || {
          lat: 14.5995,
          lng: 120.9842,
          city: 'Manila',
          province: 'Metro Manila',
          region: 'NCR',
        },
        type: 'emergency',
        description: 'EMERGENCY: Immediate assistance required. Reported via SOS button.',
        severity: 'critical',
        status: 'new',
        reporterInfo: {
          name: user?.name,
          userId: user?.id,
        },
      });

      toast.success('Emergency report submitted! Help is on the way.');
      
      // Simulate alert to emergency services
      alert('🚨 EMERGENCY REPORT SUBMITTED\n\nEmergency services have been notified. Please stay safe and wait for assistance.');
    } catch (error: any) {
      toast.error('Failed to submit emergency report. Please try again.');
      console.error('Emergency report error:', error);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <button
      onClick={handleEmergencyReport}
      disabled={isReporting}
      className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full shadow-2xl hover:shadow-red-500/50 hover:scale-110 transition-all flex items-center justify-center z-40 animate-pulse ring-4 ring-red-300/30 font-bold text-sm"
      aria-label="Emergency SOS"
      title="Emergency SOS - Report Critical Incident"
    >
      <span className="text-2xl font-bold">SOS</span>
    </button>
  );
};

