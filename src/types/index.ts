// User and Authentication Types
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  password?: string; // Only in mock data, never in actual user objects
  name: string;
  role: UserRole;
  phone?: string;
  location?: {
    address: string;
    city: string;
    province: string;
    region: string;
    lat: number;
    lng: number;
  };
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// Incident Types
export type IncidentType = 'abandoned' | 'injured' | 'abuse' | 'stray' | 'other' | 'emergency';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'new' | 'investigating' | 'resolved' | 'closed';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  province?: string;
  region?: string;
  barangay?: string;
}

export interface ReporterInfo {
  name?: string;
  contact?: string;
  userId?: string;
}

export interface IncidentReport {
  id: string;
  location: Location;
  type: IncidentType;
  description: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  timestamp: Date;
  reporterInfo?: ReporterInfo;
  adminNotes?: string[];
  assignedTo?: string;
  photos?: string[];
  trackingNumber?: string;
}

// Chatbot Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'message' | 'emergency' | 'symptom' | 'action';
}

export interface EmergencyProtocol {
  id: string;
  title: string;
  description: string;
  steps: string[];
  contacts?: string[];
}

// Philippines Data Types
export interface PhilippineRegion {
  id: string;
  name: string;
  code: string;
  provinces: PhilippineProvince[];
}

export interface PhilippineProvince {
  id: string;
  name: string;
  code: string;
  region: string;
  cities: PhilippineCity[];
}

export interface PhilippineCity {
  id: string;
  name: string;
  code: string;
  province: string;
  coordinates: Location;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'rescue' | 'veterinary' | 'police' | 'government';
  location?: string;
  region?: string;
  available24h?: boolean;
}

// Admin Types
export interface AdminActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface DashboardStats {
  totalReports: number;
  criticalReports: number;
  newReports: number;
  resolvedReports: number;
  activeUsers: number;
  reportsByType: Record<IncidentType, number>;
  reportsByStatus: Record<IncidentStatus, number>;
  reportsBySeverity: Record<SeverityLevel, number>;
  reportsByRegion: Record<string, number>;
}

