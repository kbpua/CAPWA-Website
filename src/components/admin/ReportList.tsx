import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { IncidentReport, SeverityLevel, IncidentStatus } from '../../types';
import { PriorityBadge } from './PriorityBadge';

interface ReportListProps {
  reports: IncidentReport[];
  onUpdateStatus: (id: string, status: IncidentStatus) => Promise<void>;
  onUpdateSeverity: (id: string, severity: SeverityLevel) => Promise<void>;
  onViewDetails: (report: IncidentReport) => void;
}

export const ReportList: React.FC<ReportListProps> = ({
  reports,
  onUpdateStatus,
  onUpdateSeverity,
  onViewDetails,
}) => {
  const { theme } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleStatusUpdate = async (id: string, status: IncidentStatus) => {
    setUpdating(id);
    try {
      await onUpdateStatus(id, status);
    } finally {
      setUpdating(null);
    }
  };

  const handleSeverityUpdate = async (id: string, severity: SeverityLevel) => {
    setUpdating(id);
    try {
      await onUpdateSeverity(id, severity);
    } finally {
      setUpdating(null);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: theme === 'dark' ? 'var(--text-tertiary)' : '#9ca3af' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 
          className="mt-2 text-sm font-medium"
          style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
        >
          No reports found
        </h3>
        <p 
          className="mt-1 text-sm"
          style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
        >
          No incidents match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y transition-colors duration-300" style={{ borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb' }}>
        <thead 
          className="transition-colors duration-300"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
              : 'linear-gradient(to right, #f0fdf4, #d1fae5)',
          }}
        >
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
            >
              ID
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
            >
              Type
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
            >
              Severity
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
            >
              Status
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
            >
              Date
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody 
          className="divide-y transition-colors duration-300"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
            borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
          }}
        >
          {reports.map((report) => (
            <React.Fragment key={report.id}>
              <tr 
                className="transition-colors cursor-pointer"
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark'
                    ? 'var(--bg-tertiary)'
                    : '#f0fdf4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark'
                    ? 'var(--card-bg)'
                    : '#ffffff';
                }}
              >
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm font-mono"
                  style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                >
                  {report.trackingNumber || report.id.slice(0, 8)}
                </td>
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm capitalize"
                  style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                >
                  {report.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge severity={report.severity} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className="px-3 py-1.5 text-xs font-semibold rounded-full capitalize border-2"
                    style={{
                      backgroundColor: theme === 'dark'
                        ? report.status === 'new'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : report.status === 'investigating'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : report.status === 'resolved'
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(107, 114, 128, 0.2)'
                        : report.status === 'new'
                        ? '#dbeafe'
                        : report.status === 'investigating'
                        ? '#fef3c7'
                        : report.status === 'resolved'
                        ? '#d1fae5'
                        : '#f3f4f6',
                      color: theme === 'dark'
                        ? report.status === 'new'
                          ? '#93c5fd'
                          : report.status === 'investigating'
                          ? '#fcd34d'
                          : report.status === 'resolved'
                          ? '#6ee7b7'
                          : '#d1d5db'
                        : report.status === 'new'
                        ? '#1e40af'
                        : report.status === 'investigating'
                        ? '#92400e'
                        : report.status === 'resolved'
                        ? '#065f46'
                        : '#374151',
                      borderColor: theme === 'dark'
                        ? report.status === 'new'
                          ? 'rgba(59, 130, 246, 0.3)'
                          : report.status === 'investigating'
                          ? 'rgba(245, 158, 11, 0.3)'
                          : report.status === 'resolved'
                          ? 'rgba(16, 185, 129, 0.3)'
                          : 'rgba(107, 114, 128, 0.3)'
                        : report.status === 'new'
                        ? '#bfdbfe'
                        : report.status === 'investigating'
                        ? '#fde68a'
                        : report.status === 'resolved'
                        ? '#a7f3d0'
                        : '#e5e7eb',
                    }}
                  >
                    {report.status}
                  </span>
                </td>
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
                >
                  {formatDate(report.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#f3f4f6',
                      color: theme === 'dark' ? 'var(--text-primary)' : '#374151',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'var(--border-color)' : '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'var(--bg-tertiary)' : '#f3f4f6';
                    }}
                  >
                    {expandedId === report.id ? 'Hide' : 'Expand'}
                  </button>
                  <button
                    onClick={() => onViewDetails(report)}
                    className="px-3 py-1.5 text-white rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                    style={{
                      background: theme === 'dark'
                        ? 'linear-gradient(to right, #6b8e23, #7a9c4f)'
                        : 'linear-gradient(to right, #10b981, #059669)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme === 'dark'
                        ? 'linear-gradient(to right, #7a9c4f, #8fa85c)'
                        : 'linear-gradient(to right, #059669, #047857)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme === 'dark'
                        ? 'linear-gradient(to right, #6b8e23, #7a9c4f)'
                        : 'linear-gradient(to right, #10b981, #059669)';
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
              {expandedId === report.id && (
                <tr>
                  <td 
                    colSpan={6} 
                    className="px-6 py-4"
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#f9fafb',
                    }}
                  >
                    <div className="space-y-4">
                      <div 
                        className="rounded-xl p-4 border shadow-sm"
                        style={{
                          backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
                          borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
                        }}
                      >
                        <h4 
                          className="text-sm font-semibold mb-3 flex items-center"
                          style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                        >
                          <svg 
                            className="w-4 h-4 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Description
                        </h4>
                        <p 
                          className="text-sm leading-relaxed"
                          style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
                        >
                          {report.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          className="rounded-xl p-4 border"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
                            borderColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
                          }}
                        >
                          <h4 
                            className="text-sm font-semibold mb-2 flex items-center"
                            style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                          >
                            <svg 
                              className="w-4 h-4 mr-2" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              style={{ color: theme === 'dark' ? '#93c5fd' : '#2563eb' }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Location
                          </h4>
                          <p 
                            className="text-sm font-mono"
                            style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#374151' }}
                          >
                            {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                          </p>
                          {report.location.address && (
                            <p 
                              className="text-sm mt-1"
                              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                            >
                              {report.location.address}
                            </p>
                          )}
                        </div>
                        {report.reporterInfo && (
                          <div 
                            className="rounded-xl p-4 border"
                            style={{
                              backgroundColor: theme === 'dark' ? 'rgba(147, 51, 234, 0.1)' : '#faf5ff',
                              borderColor: theme === 'dark' ? 'rgba(147, 51, 234, 0.3)' : '#e9d5ff',
                            }}
                          >
                            <h4 
                              className="text-sm font-semibold mb-2 flex items-center"
                              style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                            >
                              <svg 
                                className="w-4 h-4 mr-2" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                style={{ color: theme === 'dark' ? '#c084fc' : '#9333ea' }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Reporter
                            </h4>
                            <p 
                              className="text-sm font-medium"
                              style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                            >
                              {report.reporterInfo.name || 'Anonymous'}
                            </p>
                            {report.reporterInfo.contact && (
                              <p 
                                className="text-sm mt-1"
                                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                              >
                                {report.reporterInfo.contact}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {report.adminNotes && report.adminNotes.length > 0 && (
                        <div>
                          <h4 
                            className="text-sm font-medium mb-2"
                            style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                          >
                            Admin Notes
                          </h4>
                          <ul 
                            className="list-disc list-inside text-sm space-y-1"
                            style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
                          >
                            {report.adminNotes.map((note, idx) => (
                              <li key={idx}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div 
                        className="flex flex-wrap gap-3 pt-4 border-t-2"
                        style={{
                          borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
                        }}
                      >
                        <div className="flex-1 min-w-[150px]">
                          <label 
                            className="block text-xs font-semibold mb-1"
                            style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                          >
                            Update Status
                          </label>
                          <select
                            value={report.status}
                            onChange={(e) =>
                              handleStatusUpdate(report.id, e.target.value as IncidentStatus)
                            }
                            disabled={updating === report.id}
                            className="w-full text-sm border-2 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
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
                        <div className="flex-1 min-w-[150px]">
                          <label 
                            className="block text-xs font-semibold mb-1"
                            style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                          >
                            Update Severity
                          </label>
                          <select
                            value={report.severity}
                            onChange={(e) =>
                              handleSeverityUpdate(report.id, e.target.value as SeverityLevel)
                            }
                            disabled={updating === report.id}
                            className="w-full text-sm border-2 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
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
                        {updating === report.id && (
                          <div className="flex items-center justify-center px-4 py-2">
                            <div 
                              className="animate-spin rounded-full h-5 w-5 border-b-2 mr-2"
                              style={{
                                borderColor: theme === 'dark' ? '#6b8e23' : '#10b981',
                              }}
                            ></div>
                            <span 
                              className="text-sm font-medium"
                              style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563' }}
                            >
                              Updating...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

