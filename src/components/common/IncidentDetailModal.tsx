import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
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
  const { theme } = useTheme();
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

  const getStatusStyles = (status: string) => {
    if (theme === 'dark') {
      return {
        new: {
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          color: '#93c5fd',
          borderColor: 'rgba(59, 130, 246, 0.3)',
        },
        investigating: {
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          color: '#fcd34d',
          borderColor: 'rgba(245, 158, 11, 0.3)',
        },
        resolved: {
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          color: '#6ee7b7',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        },
        closed: {
          backgroundColor: 'rgba(107, 114, 128, 0.2)',
          color: '#d1d5db',
          borderColor: 'rgba(107, 114, 128, 0.3)',
        },
      }[status] || {};
    }
    return {
      new: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        borderColor: '#bfdbfe',
      },
      investigating: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        borderColor: '#fde68a',
      },
      resolved: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        borderColor: '#a7f3d0',
      },
      closed: {
        backgroundColor: '#f3f4f6',
        color: '#374151',
        borderColor: '#e5e7eb',
      },
    }[status] || {};
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Incident Details" size="lg">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="rounded-xl p-4 border"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
                : 'linear-gradient(to bottom right, #f0fdf4, #d1fae5)',
              borderColor: theme === 'dark' ? 'var(--border-color)' : '#d1fae5',
            }}
          >
            <p 
              className="text-sm font-medium mb-1"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
            >
              Tracking Number
            </p>
            <p 
              className="text-lg font-bold font-mono"
              style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
            >
              {incident.trackingNumber || incident.id}
            </p>
          </div>
          <div 
            className="rounded-xl p-4 border"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))'
                : 'linear-gradient(to bottom right, #eff6ff, #cffafe)',
              borderColor: theme === 'dark' ? 'var(--border-color)' : '#bfdbfe',
            }}
          >
            <p 
              className="text-sm font-medium mb-1"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
            >
              Reported On
            </p>
            <p 
              className="text-lg font-semibold"
              style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
            >
              {formatDate(incident.timestamp)}
            </p>
          </div>
        </div>

        {/* Status and Severity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p 
              className="text-sm font-semibold mb-2"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
            >
              Status
            </p>
            <span
              className="inline-block px-4 py-2 rounded-lg font-medium border-2"
              style={getStatusStyles(incident.status)}
            >
              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
            </span>
          </div>
          <div>
            <p 
              className="text-sm font-semibold mb-2"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
            >
              Severity
            </p>
            <PriorityBadge severity={incident.severity} className="text-base px-4 py-2" />
          </div>
        </div>

        {/* Type and Description */}
        <div>
          <p 
            className="text-sm font-semibold mb-2"
            style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
          >
            Incident Type
          </p>
          <div 
            className="rounded-lg p-3 mb-4"
            style={{
              backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#f9fafb',
            }}
          >
            <span 
              className="text-lg font-medium capitalize"
              style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
            >
              {incident.type}
            </span>
          </div>
          
          <p 
            className="text-sm font-semibold mb-2"
            style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
          >
            Description
          </p>
          <div 
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#f9fafb',
              borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
            }}
          >
            <p 
              className="leading-relaxed whitespace-pre-wrap"
              style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#1f2937' }}
            >
              {incident.description}
            </p>
          </div>
        </div>

        {/* Location */}
        <div>
          <p 
            className="text-sm font-semibold mb-2"
            style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
          >
            Location
          </p>
          <div 
            className="rounded-xl p-4 border"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(to bottom right, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))'
                : 'linear-gradient(to bottom right, #faf5ff, #fce7f3)',
              borderColor: theme === 'dark' ? 'var(--border-color)' : '#e9d5ff',
            }}
          >
            {incident.location.address && (
              <p 
                className="font-medium mb-2"
                style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
              >
                {incident.location.address}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {incident.location.city && (
                <div>
                  <span style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}>
                    City:
                  </span>{' '}
                  <span 
                    className="font-medium"
                    style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                  >
                    {incident.location.city}
                  </span>
                </div>
              )}
              {incident.location.province && (
                <div>
                  <span style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}>
                    Province:
                  </span>{' '}
                  <span 
                    className="font-medium"
                    style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                  >
                    {incident.location.province}
                  </span>
                </div>
              )}
              {incident.location.region && (
                <div>
                  <span style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}>
                    Region:
                  </span>{' '}
                  <span 
                    className="font-medium"
                    style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                  >
                    {incident.location.region}
                  </span>
                </div>
              )}
            </div>
            <p 
              className="text-xs mt-2 font-mono"
              style={{ color: theme === 'dark' ? 'var(--text-tertiary)' : '#6b7280' }}
            >
              Coordinates: {incident.location.lat.toFixed(6)}, {incident.location.lng.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Reporter Info */}
        {incident.reporterInfo && (
          <div>
            <p 
              className="text-sm font-semibold mb-2"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
            >
              Reporter Information
            </p>
            <div 
              className="rounded-lg p-4 border"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#f9fafb',
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
              }}
            >
              <p style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}>
                <span className="font-medium">{incident.reporterInfo.name || 'Anonymous'}</span>
              </p>
              {incident.reporterInfo.contact && (
                <p 
                  className="text-sm mt-1"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                >
                  {incident.reporterInfo.contact}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Admin Notes */}
        {incident.adminNotes && incident.adminNotes.length > 0 && (
          <div>
            <p 
              className="text-sm font-semibold mb-2"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
            >
              Admin Notes
            </p>
            <div className="space-y-2">
              {incident.adminNotes.map((note, idx) => (
                <div 
                  key={idx} 
                  className="border-l-4 rounded-r-lg p-3"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : '#fefce8',
                    borderColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.5)' : '#facc15',
                  }}
                >
                  <p 
                    className="text-sm"
                    style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#1f2937' }}
                  >
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(onUpdateStatus || onUpdateSeverity) && (
          <div 
            className="pt-4 border-t space-y-4"
            style={{
              borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
            }}
          >
            {onUpdateStatus && (
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
                >
                  Update Status
                </label>
                <select
                  value={incident.status}
                  onChange={(e) => onUpdateStatus(incident.id, e.target.value as IncidentReport['status'])}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-colors"
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                    borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                    color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                  }}
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
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
                >
                  Update Severity
                </label>
                <select
                  value={incident.severity}
                  onChange={(e) => onUpdateSeverity(incident.id, e.target.value as IncidentReport['severity'])}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-colors"
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                    borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                    color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                  }}
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
        <div 
          className="pt-4 border-t"
          style={{
            borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
          }}
        >
          <Button variant="primary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};



