import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../common/Modal';
import { getEmergencyContacts } from '../../utils/emergencyContacts';
import toast from 'react-hot-toast';
import { Phone, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface EmergencyButtonProps {
  onModalStateChange?: (isOpen: boolean) => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onModalStateChange }) => {
  const { theme } = useTheme();
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
          <div 
            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(220, 38, 38, 0.2)' : '#fee2e2',
            }}
          >
            <AlertTriangle 
              className="h-10 w-10" 
              style={{ color: theme === 'dark' ? '#fca5a5' : '#dc2626' }}
            />
          </div>
          <h3 
            className="text-2xl font-bold mb-2"
            style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
          >
            Emergency SOS Report
          </h3>
          <p 
            className="mb-6"
            style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
          >
            This will create a <span 
              className="font-bold"
              style={{ color: theme === 'dark' ? '#fca5a5' : '#dc2626' }}
            >
              CRITICAL EMERGENCY
            </span> incident report.
            Emergency services will be notified immediately.
          </p>
          
          <div 
            className="border rounded-lg p-4 mb-6 text-left"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2',
              borderColor: theme === 'dark' ? 'rgba(220, 38, 38, 0.3)' : '#fecaca',
            }}
          >
            <p 
              className="text-sm font-semibold mb-2"
              style={{ color: theme === 'dark' ? '#fca5a5' : '#991b1b' }}
            >
              ⚠️ Please confirm:
            </p>
            <ul 
              className="text-sm space-y-1"
              style={{ color: theme === 'dark' ? '#fca5a5' : '#991b1b' }}
            >
              <li>• This is a life-threatening emergency</li>
              <li>• Immediate assistance is required</li>
              <li>• Your location will be shared with emergency services</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#e5e7eb',
                color: theme === 'dark' ? 'var(--text-primary)' : '#1f2937',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? 'var(--border-color)' : '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? 'var(--bg-tertiary)' : '#e5e7eb';
              }}
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
          <div 
            className="mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-4 animate-pulse"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5',
            }}
          >
            <CheckCircle 
              className="h-12 w-12" 
              style={{ color: theme === 'dark' ? '#6ee7b7' : '#059669' }}
            />
          </div>
          <h3 
            className="text-3xl font-bold mb-2"
            style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
          >
            🚨 Emergency Report Submitted
          </h3>
          <p 
            className="text-lg mb-6"
            style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
          >
            Emergency services have been notified. Help is on the way!
          </p>

          <div 
            className="border-2 rounded-xl p-6 mb-6"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(to right, rgba(220, 38, 38, 0.15), rgba(251, 146, 60, 0.15))'
                : 'linear-gradient(to right, #fef2f2, #fff7ed)',
              borderColor: theme === 'dark' ? 'rgba(220, 38, 38, 0.3)' : '#fecaca',
            }}
          >
            <h4 
              className="text-xl font-bold mb-4 flex items-center justify-center gap-2"
              style={{ color: theme === 'dark' ? '#fca5a5' : '#991b1b' }}
            >
              <AlertTriangle className="w-6 h-6" />
              Stay Safe - Important Instructions
            </h4>
            <ul 
              className="text-left space-y-2 mb-4"
              style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#1f2937' }}
            >
              <li className="flex items-start gap-2">
                <span 
                  className="font-bold"
                  style={{ color: theme === 'dark' ? '#fca5a5' : '#dc2626' }}
                >
                  •
                </span>
                <span>Stay in a safe location if possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span 
                  className="font-bold"
                  style={{ color: theme === 'dark' ? '#fca5a5' : '#dc2626' }}
                >
                  •
                </span>
                <span>Keep your phone accessible for emergency responders</span>
              </li>
              <li className="flex items-start gap-2">
                <span 
                  className="font-bold"
                  style={{ color: theme === 'dark' ? '#fca5a5' : '#dc2626' }}
                >
                  •
                </span>
                <span>Do not approach aggressive or injured animals</span>
              </li>
              <li className="flex items-start gap-2">
                <span 
                  className="font-bold"
                  style={{ color: theme === 'dark' ? '#fca5a5' : '#dc2626' }}
                >
                  •
                </span>
                <span>Wait for professional assistance to arrive</span>
              </li>
            </ul>
          </div>

          <div 
            className="border rounded-xl p-6 mb-6"
            style={{
              backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
              borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
            }}
          >
            <h4 
              className="text-lg font-semibold mb-4 flex items-center justify-center gap-2"
              style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
            >
              <Phone 
                className="w-5 h-5" 
                style={{ color: theme === 'dark' ? '#fca5a5' : '#dc2626' }}
              />
              Emergency Contacts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emergencyContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleCall(contact.phone)}
                  className="flex items-center justify-between p-4 border-2 rounded-lg transition-all group"
                  style={{
                    background: theme === 'dark'
                      ? 'linear-gradient(to right, rgba(220, 38, 38, 0.1), rgba(251, 146, 60, 0.1))'
                      : 'linear-gradient(to right, #fef2f2, #fff7ed)',
                    borderColor: theme === 'dark' ? 'rgba(220, 38, 38, 0.3)' : '#fecaca',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme === 'dark'
                      ? 'linear-gradient(to right, rgba(220, 38, 38, 0.2), rgba(251, 146, 60, 0.2))'
                      : 'linear-gradient(to right, #fee2e2, #fed7aa)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = theme === 'dark'
                      ? 'linear-gradient(to right, rgba(220, 38, 38, 0.1), rgba(251, 146, 60, 0.1))'
                      : 'linear-gradient(to right, #fef2f2, #fff7ed)';
                  }}
                >
                  <div className="text-left">
                    <p 
                      className="font-semibold"
                      style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                    >
                      {contact.name}
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                    >
                      {contact.phone}
                    </p>
                  </div>
                  <Phone 
                    className="w-5 h-5 group-hover:scale-110 transition-transform" 
                    style={{ color: theme === 'dark' ? '#fca5a5' : '#dc2626' }}
                  />
                </button>
              ))}
            </div>
            <div 
              className="mt-4 pt-4 border-t"
              style={{
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
              }}
            >
              <p 
                className="text-sm mb-2"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
              >
                For immediate life-threatening emergencies:
              </p>
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
            className={`px-8 py-3 text-white rounded-lg font-semibold transition-all shadow-lg ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#6b8e23] to-[#7a9c4f] hover:from-[#7a9c4f] hover:to-[#8fa85c]'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
            }`}
          >
            Understood - Close
          </button>
        </div>
      </Modal>
    </>
  );
};

