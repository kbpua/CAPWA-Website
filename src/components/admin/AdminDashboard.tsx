import React, { useState, useEffect } from 'react';
import type { IncidentReport, IncidentType, SeverityLevel, IncidentStatus, DashboardStats } from '../../types';
import { ReportList } from './ReportList';
import { adminService } from '../../services/adminService';
import { reportService } from '../../services/reportService';
import { UserManagement } from './UserManagement';
import { AnalyticsPanel } from './AnalyticsPanel';
import { IncidentDetailModal } from '../common/IncidentDetailModal';
import { useTheme } from '../../contexts/ThemeContext';

export const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
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
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{
              borderColor: theme === 'dark' ? '#6b8e23' : '#10b981',
            }}
          ></div>
          <p 
            className="mt-4"
            style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#374151' }}
          >
            Loading dashboard...
          </p>
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
        <div 
          className="rounded-xl shadow-lg p-6 border hover:shadow-xl transition-shadow"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
            borderColor: theme === 'dark' ? 'var(--border-color)' : '#d1fae5',
          }}
        >
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 rounded-xl p-4 shadow-md"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
                  : 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)',
              }}
            >
              <svg 
                className="h-7 w-7" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: theme === 'dark' ? '#6ee7b7' : '#059669' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
              >
                Total Reports
              </p>
              <p 
                className="text-2xl font-semibold"
                style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
              >
                {stats.totalReports}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-lg p-6 border hover:shadow-xl transition-shadow"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
            borderColor: theme === 'dark' ? 'var(--border-color)' : '#fecaca',
          }}
        >
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 rounded-xl p-4 shadow-md"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(to bottom right, rgba(220, 38, 38, 0.2), rgba(244, 63, 94, 0.2))'
                  : 'linear-gradient(to bottom right, #fee2e2, #fce7f3)',
              }}
            >
              <svg 
                className="h-7 w-7" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: theme === 'dark' ? '#fca5a5' : '#dc2626' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
              >
                Critical
              </p>
              <p 
                className="text-2xl font-semibold"
                style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
              >
                {stats.criticalReports}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-lg p-6 border hover:shadow-xl transition-shadow"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
            borderColor: theme === 'dark' ? 'var(--border-color)' : '#bfdbfe',
          }}
        >
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 rounded-xl p-4 shadow-md"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))'
                  : 'linear-gradient(to bottom right, #dbeafe, #cffafe)',
              }}
            >
              <svg 
                className="h-7 w-7" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: theme === 'dark' ? '#93c5fd' : '#2563eb' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
              >
                New
              </p>
              <p 
                className="text-2xl font-semibold"
                style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
              >
                {stats.newReports}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-lg p-6 border hover:shadow-xl transition-shadow"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
            borderColor: theme === 'dark' ? 'var(--border-color)' : '#d1fae5',
          }}
        >
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 rounded-xl p-4 shadow-md"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
                  : 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)',
              }}
            >
              <svg 
                className="h-7 w-7" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: theme === 'dark' ? '#6ee7b7' : '#059669' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p 
                className="text-sm font-medium"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
              >
                Resolved
              </p>
              <p 
                className="text-2xl font-semibold"
                style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
              >
                {stats.resolvedReports}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="rounded-xl shadow-lg border overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
          borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
        }}
      >
        <div 
          className="border-b"
          style={{
            borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
            background: theme === 'dark'
              ? 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
              : 'linear-gradient(to right, #f0fdf4, #d1fae5)',
          }}
        >
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-8 py-4 text-sm font-semibold border-b-3 transition-all ${
                activeTab === 'reports'
                  ? theme === 'dark'
                    ? 'border-[#6b8e23] text-[#6b8e23]'
                    : 'border-green-600 text-green-700 bg-white'
                  : theme === 'dark'
                  ? 'border-transparent text-gray-400 hover:text-[#6b8e23] hover:bg-white/5'
                  : 'border-transparent text-gray-600 hover:text-green-600 hover:bg-white/50'
              }`}
              style={activeTab === 'reports' && theme === 'dark' ? { backgroundColor: 'var(--card-bg)' } : {}}
            >
              📋 Reports
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-8 py-4 text-sm font-semibold border-b-3 transition-all ${
                activeTab === 'analytics'
                  ? theme === 'dark'
                    ? 'border-[#6b8e23] text-[#6b8e23]'
                    : 'border-green-600 text-green-700 bg-white'
                  : theme === 'dark'
                  ? 'border-transparent text-gray-400 hover:text-[#6b8e23] hover:bg-white/5'
                  : 'border-transparent text-gray-600 hover:text-green-600 hover:bg-white/50'
              }`}
              style={activeTab === 'analytics' && theme === 'dark' ? { backgroundColor: 'var(--card-bg)' } : {}}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-8 py-4 text-sm font-semibold border-b-3 transition-all ${
                activeTab === 'users'
                  ? theme === 'dark'
                    ? 'border-[#6b8e23] text-[#6b8e23]'
                    : 'border-green-600 text-green-700 bg-white'
                  : theme === 'dark'
                  ? 'border-transparent text-gray-400 hover:text-[#6b8e23] hover:bg-white/5'
                  : 'border-transparent text-gray-600 hover:text-green-600 hover:bg-white/50'
              }`}
              style={activeTab === 'users' && theme === 'dark' ? { backgroundColor: 'var(--card-bg)' } : {}}
            >
              👥 Users
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'reports' && (
            <>
              {/* Filters */}
              <div 
                className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl"
                style={{
                  background: theme === 'dark'
                    ? 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
                    : 'linear-gradient(to right, #f0fdf4, #d1fae5)',
                }}
              >
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
                  >
                    Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as IncidentType | 'all')}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                      borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                      color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                    }}
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
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
                  >
                    Severity
                  </label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value as SeverityLevel | 'all')}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                      borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                      color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                    }}
                  >
                    <option value="all">All Severities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
                  >
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'all')}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                      borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                      color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div 
                className="mb-4 text-sm font-medium rounded-lg px-4 py-2 inline-block"
                style={{
                  color: theme === 'dark' ? 'var(--text-secondary)' : '#4b5563',
                  backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#f9fafb',
                }}
              >
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
