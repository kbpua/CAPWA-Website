import type { User, DashboardStats, AdminActivity, IncidentReport } from '../types';
import { authService } from './authService';
import { reportService } from './reportService';

const STORAGE_KEY_ADMIN_ACTIVITIES = 'animal_welfare_admin_activities';
const STORAGE_KEY_USERS = 'animal_welfare_users';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all users
const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    if (!stored) return [];
    return JSON.parse(stored).map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
    }));
  } catch {
    return [];
  }
};

// Save users
const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

// Get admin activities
const getStoredActivities = (): AdminActivity[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ADMIN_ACTIVITIES);
    if (!stored) return [];
    return JSON.parse(stored).map((activity: any) => ({
      ...activity,
      timestamp: new Date(activity.timestamp),
    }));
  } catch {
    return [];
  }
};

// Save admin activity
const saveActivity = (activity: AdminActivity): void => {
  const activities = getStoredActivities();
  activities.push(activity);
  localStorage.setItem(STORAGE_KEY_ADMIN_ACTIVITIES, JSON.stringify(activities.slice(-100))); // Keep last 100
};

export const adminService = {
  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(400);
    
    const incidents = await reportService.getAll();
    const users = getStoredUsers();
    
    const stats: DashboardStats = {
      totalReports: incidents.length,
      criticalReports: incidents.filter(i => i.severity === 'critical' || i.type === 'emergency').length,
      newReports: incidents.filter(i => i.status === 'new').length,
      resolvedReports: incidents.filter(i => i.status === 'resolved' || i.status === 'closed').length,
      activeUsers: users.filter(u => {
        if (!u.lastLogin) return false;
        const daysSinceLogin = (Date.now() - u.lastLogin.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLogin <= 30;
      }).length,
      reportsByType: {
        abandoned: incidents.filter(i => i.type === 'abandoned').length,
        injured: incidents.filter(i => i.type === 'injured').length,
        abuse: incidents.filter(i => i.type === 'abuse').length,
        stray: incidents.filter(i => i.type === 'stray').length,
        other: incidents.filter(i => i.type === 'other').length,
        emergency: incidents.filter(i => i.type === 'emergency').length,
      },
      reportsByStatus: {
        new: incidents.filter(i => i.status === 'new').length,
        investigating: incidents.filter(i => i.status === 'investigating').length,
        resolved: incidents.filter(i => i.status === 'resolved').length,
        closed: incidents.filter(i => i.status === 'closed').length,
      },
      reportsBySeverity: {
        critical: incidents.filter(i => i.severity === 'critical').length,
        high: incidents.filter(i => i.severity === 'high').length,
        medium: incidents.filter(i => i.severity === 'medium').length,
        low: incidents.filter(i => i.severity === 'low').length,
      },
      reportsByRegion: incidents.reduce((acc, inc) => {
        const region = inc.location.region || 'Unknown';
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
    
    return stats;
  },

  // Get all users
  getAllUsers: async (): Promise<Omit<User, 'password'>[]> => {
    await delay(300);
    const users = getStoredUsers();
    return users.map(({ password, ...user }) => user);
  },

  // Update user role
  updateUserRole: async (userId: string, newRole: User['role'], adminUserId: string): Promise<Omit<User, 'password'>> => {
    await delay(400);
    
    const currentUser = await authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
      throw new Error('User not found');
    }
    
    users[index].role = newRole;
    saveUsers(users);
    
    // Log activity
    const adminUser = users.find(u => u.id === adminUserId);
    saveActivity({
      id: `activity-${Date.now()}`,
      userId: adminUserId,
      userName: adminUser?.name || 'Unknown',
      action: 'update_user_role',
      resource: 'user',
      resourceId: userId,
      timestamp: new Date(),
      ipAddress: '127.0.0.1',
    });
    
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  },

  // Delete user
  deleteUser: async (userId: string, adminUserId: string): Promise<void> => {
    await delay(400);
    
    const currentUser = await authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    
    if (userId === adminUserId) {
      throw new Error('Cannot delete your own account');
    }
    
    const users = getStoredUsers();
    const filtered = users.filter(u => u.id !== userId);
    saveUsers(filtered);
    
    // Log activity
    const adminUser = users.find(u => u.id === adminUserId);
    saveActivity({
      id: `activity-${Date.now()}`,
      userId: adminUserId,
      userName: adminUser?.name || 'Unknown',
      action: 'delete_user',
      resource: 'user',
      resourceId: userId,
      timestamp: new Date(),
      ipAddress: '127.0.0.1',
    });
  },

  // Get admin activities
  getAdminActivities: async (limit: number = 50): Promise<AdminActivity[]> => {
    await delay(300);
    const activities = getStoredActivities();
    return activities.slice(-limit).reverse(); // Most recent first
  },

  // Assign incident
  assignIncident: async (incidentId: string, userId: string, adminUserId: string): Promise<IncidentReport> => {
    await delay(400);
    
    const currentUser = await authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    
    const incident = await reportService.update(incidentId, { assignedTo: userId });
    
    // Log activity
    const adminUser = await authService.getCurrentUser();
    saveActivity({
      id: `activity-${Date.now()}`,
      userId: adminUserId,
      userName: adminUser?.name || 'Unknown',
      action: 'assign_incident',
      resource: 'incident',
      resourceId: incidentId,
      timestamp: new Date(),
      ipAddress: '127.0.0.1',
    });
    
    return incident;
  },
};

