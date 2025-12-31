import React, { useState } from 'react';
import type { IncidentType, SeverityLevel, Location, ReporterInfo } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../common/Button';

interface ReportFormProps {
  location: Location;
  onSubmit: (data: {
    location: Location;
    type: IncidentType;
    description: string;
    severity: SeverityLevel;
    reporterInfo?: ReporterInfo;
  }) => void;
  onCancel: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ location, onSubmit, onCancel }) => {
  const { theme } = useTheme();
  const [type, setType] = useState<IncidentType>('other');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('medium');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a description');
      return;
    }

    onSubmit({
      location,
      type,
      description,
      severity,
      reporterInfo: {
        name: reporterName.trim() || undefined,
        contact: reporterContact.trim() || undefined,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 transition-colors duration-300"
        style={{
          backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
          borderColor: theme === 'dark' ? 'var(--border-color)' : '#bbf7d0',
        }}
      >
        <div 
          className="rounded-t-2xl p-6 text-white transition-colors duration-300"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to right, #6b8e23, #7a9c4f)'
              : 'linear-gradient(to right, #10b981, #059669)',
          }}
        >
          <h2 className="text-2xl font-bold mb-1">Report Incident</h2>
          <p className="text-white/90 text-sm">Help us protect animals in the Philippines</p>
        </div>
        <div className="p-6">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Location Info */}
            <div 
              className="p-4 rounded-xl border-2 transition-colors duration-300"
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(to bottom right, #1e3a5f, #1e4a6f)'
                  : 'linear-gradient(to bottom right, #eff6ff, #e0f2fe)',
                borderColor: theme === 'dark' ? '#3a4d63' : '#bfdbfe',
              }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: theme === 'dark' ? '#93c5fd' : '#2563eb' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p 
                  className="text-sm font-semibold"
                  style={{ color: theme === 'dark' ? '#bfdbfe' : '#1e40af' }}
                >
                  Selected Location
                </p>
              </div>
              <p 
                className="text-sm font-mono rounded-lg px-3 py-2"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(30, 58, 95, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                  color: theme === 'dark' ? 'var(--text-primary)' : '#111827',
                }}
              >
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
              {location.address && (
                <p 
                  className="text-sm mt-2"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
                >
                  {location.address}
                </p>
              )}
            </div>

            {/* Incident Type */}
            <div>
              <label 
                htmlFor="type" 
                className="block text-sm font-medium mb-1"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
              >
                Incident Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as IncidentType)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                  borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                  color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                }}
                required
              >
              <option value="abandoned">Abandoned Animal</option>
              <option value="injured">Injured Animal</option>
              <option value="abuse">Animal Abuse</option>
              <option value="stray">Stray Animal</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
              </select>
            </div>

            {/* Severity Level */}
            <div>
              <label 
                htmlFor="severity" 
                className="block text-sm font-medium mb-1"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
              >
                Severity Level <span className="text-red-500">*</span>
              </label>
              <select
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all"
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                  borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                  color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                }}
                required
              >
                <option value="low">Low - Monitor situation</option>
                <option value="medium">Medium - Requires attention</option>
                <option value="high">High - Urgent action needed</option>
                <option value="critical">Critical - Immediate intervention required</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium mb-1"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all"
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                  borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                  color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                }}
                placeholder="Please provide detailed information about the incident (location, animal condition, situation, etc.)..."
                required
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
              >
                Photos (Optional)
              </label>
              <div 
                className="border-2 border-dashed rounded-xl p-6 text-center hover:border-green-400 transition-colors cursor-pointer group"
                style={{
                  borderColor: theme === 'dark' ? 'var(--border-color)' : '#86efac',
                  background: theme === 'dark' 
                    ? 'linear-gradient(to bottom right, rgba(30, 58, 95, 0.3), rgba(30, 74, 111, 0.3))'
                    : 'linear-gradient(to bottom right, rgba(240, 253, 244, 0.5), rgba(209, 250, 229, 0.5))',
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    // Photo upload simulation - files are selected but not uploaded
                    if (e.target.files && e.target.files.length > 0) {
                      const fileCount = e.target.files.length;
                      alert(`${fileCount} photo(s) selected. Photo upload will be fully integrated with backend.`);
                    }
                  }}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <svg
                    className="mx-auto h-12 w-12 text-green-500 group-hover:text-green-600 transition-colors"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p 
                    className="mt-3 text-sm font-medium transition-colors"
                    style={{ 
                      color: theme === 'dark' ? 'var(--text-secondary)' : '#374151',
                    }}
                  >
                    Click to upload photos
                  </p>
                  <p 
                    className="mt-1 text-xs"
                    style={{ color: theme === 'dark' ? 'var(--text-tertiary)' : '#6b7280' }}
                  >
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </label>
              </div>
            </div>

            {/* Reporter Info (Optional) */}
            <div 
              className="border-t pt-4"
              style={{
                borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
              }}
            >
              <p 
                className="text-sm font-medium mb-3"
                style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
              >
                Your Information (Optional)
              </p>
              <div className="space-y-3">
                <div>
                  <label 
                    htmlFor="reporterName" 
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
                  >
                    Name
                  </label>
                  <input
                    id="reporterName"
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                      borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                      color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                    }}
                    placeholder="Your name (optional)"
                  />
                </div>
                <div>
                  <label 
                    htmlFor="reporterContact" 
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#374151' }}
                  >
                    Contact
                  </label>
                  <input
                    id="reporterContact"
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                      borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                      color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                    }}
                    placeholder="Email or phone (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
              >
                Submit Report
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

