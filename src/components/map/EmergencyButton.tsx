import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { Modal } from '../common/Modal';
import { getEmergencyContacts } from '../../utils/emergencyContacts';
import toast from 'react-hot-toast';
import { Phone, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface EmergencyButtonProps {
  onModalStateChange?: (isOpen: boolean) => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onModalStateChange }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { user } = useAuth();
  const { location } = useLocation();
  const emergencyContacts = getEmergencyContacts().slice(0, 3);

  const handleEmergencyClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmEmergency = async () => {
    setShowConfirmModal(false);
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
          name: user?.name || 'Anonymous',
          userId: user?.id,
        },
      });

      toast.success('Emergency report submitted! Help is on the way.');
      setShowSuccessModal(true);
    } catch (error: any) {
      toast.error('Failed to submit emergency report. Please try again.');
      console.error('Emergency report error:', error);
    } finally {
      setIsReporting(false);
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\D/g, '')}`;
  };

  // Notify parent when modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(showConfirmModal || showSuccessModal);
    }
  }, [showConfirmModal, showSuccessModal, onModalStateChange]);

  return (
    <>
    <button
        onClick={handleEmergencyClick}
      disabled={isReporting}
        className="fixed bottom-24 right-4 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full shadow-2xl hover:shadow-red-500/50 hover:scale-110 transition-all flex items-center justify-center z-40 animate-pulse ring-4 ring-red-300/30 font-bold text-sm"
      aria-label="Emergency SOS"
      title="Emergency SOS - Report Critical Incident"
    >
        <span className="text-xl md:text-2xl font-bold">SOS</span>
      </button>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title=""
        size="md"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Emergency SOS Report</h3>
          <p className="text-gray-600 mb-6">
            This will create a <span className="font-bold text-red-600">CRITICAL EMERGENCY</span> incident report.
            Emergency services will be notified immediately.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-red-900 mb-2">⚠️ Please confirm:</p>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• This is a life-threatening emergency</li>
              <li>• Immediate assistance is required</li>
              <li>• Your location will be shared with emergency services</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={handleConfirmEmergency}
              disabled={isReporting}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  Confirm Emergency
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title=""
        size="lg"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4 animate-pulse">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">🚨 Emergency Report Submitted</h3>
          <p className="text-lg text-gray-700 mb-6">
            Emergency services have been notified. Help is on the way!
          </p>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 mb-6">
            <h4 className="text-xl font-bold text-red-900 mb-4 flex items-center justify-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Stay Safe - Important Instructions
            </h4>
            <ul className="text-left text-gray-800 space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Stay in a safe location if possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Keep your phone accessible for emergency responders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Do not approach aggressive or injured animals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Wait for professional assistance to arrive</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Phone className="w-5 h-5 text-red-600" />
              Emergency Contacts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emergencyContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleCall(contact.phone)}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg hover:from-red-100 hover:to-orange-100 transition-all group"
                >
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                  <Phone className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">For immediate life-threatening emergencies:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handleCall('117')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Call 117
                </button>
                <button
                  onClick={() => handleCall('911')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Call 911
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSuccessModal(false)}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
          >
            Understood - Close
    </button>
        </div>
      </Modal>
    </>
  );
};

