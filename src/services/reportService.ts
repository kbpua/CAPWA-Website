import type { IncidentReport, SeverityLevel, IncidentStatus } from '../types';
import { INITIAL_INCIDENTS } from '../data/initialData';

const STORAGE_KEY_INCIDENTS = 'animal_welfare_incidents';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize incidents if localStorage is empty
const initializeIncidents = (): void => {
  const existing = localStorage.getItem(STORAGE_KEY_INCIDENTS);
  if (!existing) {
    const incidentsWithDates = INITIAL_INCIDENTS.map(incident => ({
      ...incident,
      timestamp: new Date().toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidentsWithDates));
  }
};

initializeIncidents();

// Get all incidents from storage
const getStoredIncidents = (): IncidentReport[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_INCIDENTS);
    if (!stored) return [];
    return JSON.parse(stored).map((incident: any) => ({
      ...incident,
      timestamp: new Date(incident.timestamp),
    }));
  } catch {
    return [];
  }
};

// Save incidents to storage
const saveIncidents = (incidents: IncidentReport[]): void => {
  localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
};

// Generate tracking number
const generateTrackingNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INC-${year}-${random}`;
};

export const reportService = {
  // Get all incidents
  getAll: async (): Promise<IncidentReport[]> => {
    await delay(300);
    return getStoredIncidents();
  },

  // Get incident by ID
  getById: async (id: string): Promise<IncidentReport | null> => {
    await delay(200);
    const incidents = getStoredIncidents();
    return incidents.find(inc => inc.id === id) || null;
  },

  // Create new incident
  create: async (incident: Omit<IncidentReport, 'id' | 'timestamp' | 'trackingNumber'>): Promise<IncidentReport> => {
    await delay(400);
    
    const incidents = getStoredIncidents();
    const newIncident: IncidentReport = {
      ...incident,
      id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      trackingNumber: generateTrackingNumber(),
      status: incident.status || 'new',
    };
    
    incidents.push(newIncident);
    saveIncidents(incidents);
    
    return newIncident;
  },

  // Update incident
  update: async (id: string, updates: Partial<IncidentReport>): Promise<IncidentReport> => {
    await delay(300);
    
    const incidents = getStoredIncidents();
    const index = incidents.findIndex(inc => inc.id === id);
    
    if (index === -1) {
      throw new Error('Incident not found');
    }
    
    incidents[index] = { ...incidents[index], ...updates };
    saveIncidents(incidents);
    
    return incidents[index];
  },

  // Delete incident
  delete: async (id: string): Promise<void> => {
    await delay(200);
    const incidents = getStoredIncidents();
    const filtered = incidents.filter(inc => inc.id !== id);
    saveIncidents(filtered);
  },

  // Update status
  updateStatus: async (id: string, status: IncidentStatus): Promise<IncidentReport> => {
    return reportService.update(id, { status });
  },

  // Update severity
  updateSeverity: async (id: string, severity: SeverityLevel): Promise<IncidentReport> => {
    return reportService.update(id, { severity });
  },

  // Add admin note
  addAdminNote: async (id: string, note: string): Promise<IncidentReport> => {
    await delay(300);
    
    const incidents = getStoredIncidents();
    const index = incidents.findIndex(inc => inc.id === id);
    
    if (index === -1) {
      throw new Error('Incident not found');
    }
    
    const incident = incidents[index];
    const adminNotes = incident.adminNotes || [];
    adminNotes.push(`${new Date().toLocaleString()}: ${note}`);
    
    incidents[index] = { ...incident, adminNotes };
    saveIncidents(incidents);
    
    return incidents[index];
  },

  // Get incidents by user
  getByUserId: async (userId: string): Promise<IncidentReport[]> => {
    await delay(300);
    const incidents = getStoredIncidents();
    return incidents.filter(inc => inc.reporterInfo?.userId === userId);
  },

  // Get incidents by status
  getByStatus: async (status: IncidentStatus): Promise<IncidentReport[]> => {
    await delay(300);
    const incidents = getStoredIncidents();
    return incidents.filter(inc => inc.status === status);
  },

  // Get critical incidents
  getCritical: async (): Promise<IncidentReport[]> => {
    await delay(300);
    const incidents = getStoredIncidents();
    return incidents.filter(inc => inc.severity === 'critical' || inc.type === 'emergency');
  },
};

