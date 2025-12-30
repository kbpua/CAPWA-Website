import React from 'react';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50/20 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <img 
                src="/Logo.png" 
                alt="CAPWA Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage and track all animal welfare incident reports in the Philippines
              </p>
            </div>
          </div>
        </div>
        <AdminDashboard />
      </div>
    </div>
  );
};
