import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import type { User } from '../../types';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

export const UserManagement: React.FC = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error: any) {
      toast.error('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    if (!currentUser) return;

    try {
      await adminService.updateUserRole(userId, newRole, currentUser.id);
      toast.success('User role updated successfully');
      await loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!currentUser) return;

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await adminService.deleteUser(userId, currentUser.id);
      toast.success('User deleted successfully');
      await loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{
            borderColor: theme === 'dark' ? '#6b8e23' : '#10b981',
          }}
        ></div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg shadow border transition-colors duration-300"
      style={{
        backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
        borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
      }}
    >
      <div 
        className="px-6 py-4 border-b"
        style={{
          borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb',
        }}
      >
        <h2 
          className="text-lg font-semibold"
          style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
        >
          User Management
        </h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y transition-colors duration-300" style={{ borderColor: theme === 'dark' ? 'var(--border-color)' : '#e5e7eb' }}>
            <thead 
              className="transition-colors duration-300"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#f9fafb',
              }}
            >
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
                >
                  Name
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
                >
                  Email
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: theme === 'dark' ? 'var(--text-secondary)' : '#6b7280' }}
                >
                  Role
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                  >
                    {user.name}
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{ color: theme === 'dark' ? 'var(--text-primary)' : '#111827' }}
                  >
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                      disabled={user.id === currentUser?.id}
                      className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--input-bg)' : '#ffffff',
                        borderColor: theme === 'dark' ? 'var(--input-border)' : '#d1d5db',
                        color: theme === 'dark' ? 'var(--input-text)' : '#111827',
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.id !== currentUser?.id && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

