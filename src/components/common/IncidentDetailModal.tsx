import React from 'react';
import type { IncidentReport } from '../../types';
import { Modal } from './Modal';
import { PriorityBadge } from '../admin/PriorityBadge';
import { Button } from './Button';

interface IncidentDetailModalProps {
  incident: IncidentReport | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: IncidentReport['status']) => void;
  onUpdateSeverity?: (id: string, severity: IncidentReport['severity']) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateSeverity,
}) => {
  if (!incident) return null;

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    investigating: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Incident Details" size="lg">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <p className="text-sm font-medium text-gray-600 mb-1">Tracking Number</p>
            <p className="text-lg font-bold text-gray-900 font-mono">{incident.trackingNumber || incident.id}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm font-medium text-gray-600 mb-1">Reported On</p>
            <p className="text-lg font-semibold text-gray-900">{formatDate(incident.timestamp)}</p>
          </div>
        </div>

        {/* Status and Severity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Status</p>
            <span
              className={`inline-block px-4 py-2 rounded-lg font-medium border-2 ${
                statusColors[incident.status]
              }`}
            >
              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Severity</p>
            <PriorityBadge severity={incident.severity} className="text-base px-4 py-2" />
          </div>
        </div>

        {/* Type and Description */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Incident Type</p>
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <span className="text-lg font-medium text-gray-900 capitalize">{incident.type}</span>
          </div>
          
          <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{incident.description}</p>
          </div>
        </div>

        {/* Location */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Location</p>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            {incident.location.address && (
              <p className="text-gray-900 font-medium mb-2">{incident.location.address}</p>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {incident.location.city && (
                <div>
                  <span className="text-gray-600">City:</span>{' '}
                  <span className="font-medium text-gray-900">{incident.location.city}</span>
                </div>
              )}
              {incident.location.province && (
                <div>
                  <span className="text-gray-600">Province:</span>{' '}
                  <span className="font-medium text-gray-900">{incident.location.province}</span>
                </div>
              )}
              {incident.location.region && (
                <div>
                  <span className="text-gray-600">Region:</span>{' '}
                  <span className="font-medium text-gray-900">{incident.location.region}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono">
              Coordinates: {incident.location.lat.toFixed(6)}, {incident.location.lng.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Reporter Info */}
        {incident.reporterInfo && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Reporter Information</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-900">
                <span className="font-medium">{incident.reporterInfo.name || 'Anonymous'}</span>
              </p>
              {incident.reporterInfo.contact && (
                <p className="text-gray-600 text-sm mt-1">{incident.reporterInfo.contact}</p>
              )}
            </div>
          </div>
        )}

        {/* Admin Notes */}
        {incident.adminNotes && incident.adminNotes.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Admin Notes</p>
            <div className="space-y-2">
              {incident.adminNotes.map((note, idx) => (
                <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-3">
                  <p className="text-sm text-gray-800">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(onUpdateStatus || onUpdateSeverity) && (
          <div className="pt-4 border-t border-gray-200 space-y-4">
            {onUpdateStatus && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                <select
                  value={incident.status}
                  onChange={(e) => onUpdateStatus(incident.id, e.target.value as IncidentReport['status'])}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                >
                  <option value="new">New</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}
            {onUpdateSeverity && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Update Severity</label>
                <select
                  value={incident.severity}
                  onChange={(e) => onUpdateSeverity(incident.id, e.target.value as IncidentReport['severity'])}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Close Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button variant="primary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

