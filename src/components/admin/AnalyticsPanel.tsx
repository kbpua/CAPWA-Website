import React from 'react';
import type { DashboardStats } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsPanelProps {
  stats: DashboardStats;
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ stats }) => {
  const typeData = Object.entries(stats.reportsByType).map(([type, value]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value,
  }));

  const statusData = Object.entries(stats.reportsByStatus).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
  }));

  const severityData = Object.entries(stats.reportsBySeverity).map(([severity, value]) => ({
    name: severity.charAt(0).toUpperCase() + severity.slice(1),
    value,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={typeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Severity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={severityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Region</h3>
        <div className="space-y-2">
          {Object.entries(stats.reportsByRegion).map(([region, count]) => (
            <div key={region} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">{region}</span>
              <span className="text-sm font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

