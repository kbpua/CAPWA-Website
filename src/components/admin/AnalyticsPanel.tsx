import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { DashboardStats } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsPanelProps {
  stats: DashboardStats;
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ stats }) => {
  const { theme } = useTheme();
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

  const textColor = theme === 'dark' ? 'var(--text-primary)' : '#111827';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div 
        className="rounded-lg shadow p-6 border transition-colors duration-300"
        style={{
          backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
          borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
        }}
      >
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: textColor }}
        >
          Reports by Type
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={typeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: textColor }} />
            <YAxis tick={{ fill: textColor }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
                color: textColor,
              }}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar dataKey="value" fill={theme === 'dark' ? '#6b8e23' : '#10b981'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div 
        className="rounded-lg shadow p-6 border transition-colors duration-300"
        style={{
          backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
          borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
        }}
      >
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: textColor }}
        >
          Reports by Status
        </h3>
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
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
                color: textColor,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div 
        className="rounded-lg shadow p-6 border transition-colors duration-300"
        style={{
          backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
          borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
        }}
      >
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: textColor }}
        >
          Reports by Severity
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={severityData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: textColor }} />
            <YAxis tick={{ fill: textColor }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
                color: textColor,
              }}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar dataKey="value" fill={theme === 'dark' ? '#fca5a5' : '#ef4444'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div 
        className="rounded-lg shadow p-6 border transition-colors duration-300"
        style={{
          backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
          borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
        }}
      >
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: textColor }}
        >
          Reports by Region
        </h3>
        <div className="space-y-2">
          {Object.entries(stats.reportsByRegion).map(([region, count]) => (
            <div 
              key={region} 
              className="flex items-center justify-between p-2 rounded transition-colors duration-300"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#f9fafb',
              }}
            >
              <span 
                className="text-sm"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
              >
                {region}
              </span>
              <span 
                className="text-sm font-semibold"
                style={{ color: textColor }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

