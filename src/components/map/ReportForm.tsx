import React, { useState } from 'react';
import type { IncidentType, SeverityLevel, Location, ReporterInfo } from '../../types';
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-green-100">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">Report Incident</h2>
          <p className="text-green-100 text-sm">Help us protect animals in the Philippines</p>
        </div>
        <div className="p-6">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Location Info */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm font-semibold text-blue-900">Selected Location</p>
              </div>
              <p className="text-sm font-mono text-gray-900 bg-white/60 rounded-lg px-3 py-2">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
              {location.address && (
                <p className="text-sm text-gray-700 mt-2">{location.address}</p>
              )}
            </div>

            {/* Incident Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Incident Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as IncidentType)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 bg-white transition-all"
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
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                Severity Level <span className="text-red-500">*</span>
              </label>
              <select
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 bg-white transition-all"
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 resize-none transition-all"
                placeholder="Please provide detailed information about the incident (location, animal condition, situation, etc.)..."
                required
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center bg-gradient-to-br from-green-50/50 to-emerald-50/50 hover:border-green-400 transition-colors cursor-pointer group">
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
                  <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors">
                    Click to upload photos
                  </p>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </label>
              </div>
            </div>

            {/* Reporter Info (Optional) */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Your Information (Optional)</p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="reporterName"
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Your name (optional)"
                  />
                </div>
                <div>
                  <label htmlFor="reporterContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    id="reporterContact"
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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

