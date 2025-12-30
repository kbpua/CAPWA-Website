import React, { useState } from 'react';
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
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
        <p className="mt-1 text-sm text-gray-500">No incidents match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reports.map((report) => (
            <React.Fragment key={report.id}>
              <tr className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {report.trackingNumber || report.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {report.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge severity={report.severity} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize border-2 ${
                    report.status === 'new' 
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : report.status === 'investigating'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      : report.status === 'resolved'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(report.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    {expandedId === report.id ? 'Hide' : 'Expand'}
                  </button>
                  <button
                    onClick={() => onViewDetails(report)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    View Details
                  </button>
                </td>
              </tr>
              {expandedId === report.id && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Description
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{report.description}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Location
                          </h4>
                          <p className="text-sm text-gray-700 font-mono">
                            {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                          </p>
                          {report.location.address && (
                            <p className="text-sm text-gray-600 mt-1">{report.location.address}</p>
                          )}
                        </div>
                        {report.reporterInfo && (
                          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Reporter
                            </h4>
                            <p className="text-sm font-medium text-gray-900">
                              {report.reporterInfo.name || 'Anonymous'}
                            </p>
                            {report.reporterInfo.contact && (
                              <p className="text-sm text-gray-600 mt-1">
                                {report.reporterInfo.contact}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {report.adminNotes && report.adminNotes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Admin Notes</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {report.adminNotes.map((note, idx) => (
                              <li key={idx}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-gray-200">
                        <div className="flex-1 min-w-[150px]">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Update Status</label>
                          <select
                            value={report.status}
                            onChange={(e) =>
                              handleStatusUpdate(report.id, e.target.value as IncidentStatus)
                            }
                            disabled={updating === report.id}
                            className="w-full text-sm border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white transition-all"
                          >
                            <option value="new">New</option>
                            <option value="investigating">Investigating</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Update Severity</label>
                          <select
                            value={report.severity}
                            onChange={(e) =>
                              handleSeverityUpdate(report.id, e.target.value as SeverityLevel)
                            }
                            disabled={updating === report.id}
                            className="w-full text-sm border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white transition-all"
                          >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                          </select>
                        </div>
                        {updating === report.id && (
                          <div className="flex items-center justify-center px-4 py-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-2"></div>
                            <span className="text-sm font-medium text-gray-600">Updating...</span>
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

