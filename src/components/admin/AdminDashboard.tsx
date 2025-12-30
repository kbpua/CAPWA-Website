import React, { useState, useEffect } from 'react';
import type { IncidentReport, IncidentType, SeverityLevel, IncidentStatus, DashboardStats } from '../../types';
import { ReportList } from './ReportList';
import { adminService } from '../../services/adminService';
import { reportService } from '../../services/reportService';
import { UserManagement } from './UserManagement';
import { AnalyticsPanel } from './AnalyticsPanel';
import { IncidentDetailModal } from '../common/IncidentDetailModal';

export const AdminDashboard: React.FC = () => {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'reports' | 'users' | 'analytics'>('reports');
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<IncidentType | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, typeFilter, severityFilter, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsData, statsData] = await Promise.all([
        reportService.getAll(),
        adminService.getDashboardStats(),
      ]);
      setReports(reportsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    if (typeFilter !== 'all') {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }
    if (severityFilter !== 'all') {
      filtered = filtered.filter((r) => r.severity === severityFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    setFilteredReports(filtered);
  };

  const handleUpdateStatus = async (id: string, status: IncidentStatus) => {
    try {
      await reportService.updateStatus(id, status);
      await loadData();
      if (selectedIncident?.id === id) {
        setSelectedIncident({ ...selectedIncident, status });
      }
    } catch (error: any) {
      alert('Failed to update status. Please try again.');
    }
  };

  const handleUpdateSeverity = async (id: string, severity: SeverityLevel) => {
    try {
      await reportService.updateSeverity(id, severity);
      await loadData();
      if (selectedIncident?.id === id) {
        setSelectedIncident({ ...selectedIncident, severity });
      }
    } catch (error: any) {
      alert('Failed to update severity. Please try again.');
    }
  };

  const handleViewDetails = (report: IncidentReport) => {
    setSelectedIncident(report);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4 shadow-md">
              <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl p-4 shadow-md">
              <svg className="h-7 w-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Critical</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.criticalReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-4 shadow-md">
              <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.newReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4 shadow-md">
              <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.resolvedReports}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-8 py-4 text-sm font-semibold border-b-3 transition-all ${
                activeTab === 'reports'
                  ? 'border-green-600 text-green-700 bg-white'
                  : 'border-transparent text-gray-600 hover:text-green-600 hover:bg-white/50'
              }`}
            >
              📋 Reports
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-8 py-4 text-sm font-semibold border-b-3 transition-all ${
                activeTab === 'analytics'
                  ? 'border-green-600 text-green-700 bg-white'
                  : 'border-transparent text-gray-600 hover:text-green-600 hover:bg-white/50'
              }`}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-8 py-4 text-sm font-semibold border-b-3 transition-all ${
                activeTab === 'users'
                  ? 'border-green-600 text-green-700 bg-white'
                  : 'border-transparent text-gray-600 hover:text-green-600 hover:bg-white/50'
              }`}
            >
              👥 Users
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'reports' && (
            <>
              {/* Filters */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as IncidentType | 'all')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white transition-all"
                  >
                    <option value="all">All Types</option>
                    <option value="abandoned">Abandoned</option>
                    <option value="injured">Injured</option>
                    <option value="abuse">Abuse</option>
                    <option value="stray">Stray</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value as SeverityLevel | 'all')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white transition-all"
                  >
                    <option value="all">All Severities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'all')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white transition-all"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg px-4 py-2 inline-block">
                Showing {filteredReports.length} of {reports.length} reports
              </div>

              <ReportList
                reports={filteredReports}
                onUpdateStatus={handleUpdateStatus}
                onUpdateSeverity={handleUpdateSeverity}
                onViewDetails={handleViewDetails}
              />
            </>
          )}

          {activeTab === 'analytics' && stats && <AnalyticsPanel stats={stats} />}

          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncident}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedIncident(null);
        }}
        onUpdateStatus={handleUpdateStatus}
        onUpdateSeverity={handleUpdateSeverity}
      />
    </div>
  );
};
