import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900">{user.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{user.email}</p>
          </div>

          {user.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{user.phone}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              user.role === 'admin' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>

          {user.location && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <p className="text-gray-900">
                {user.location.address || `${user.location.city}, ${user.location.province}`}
              </p>
            </div>
          )}

          <div className="border-t pt-6">
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

