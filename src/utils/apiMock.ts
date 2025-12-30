import type { IncidentReport, SeverityLevel, IncidentStatus } from '../types';

const STORAGE_KEY = 'animal_welfare_incidents';

/**
 * Simulate API delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all incidents from localStorage
 */
const getStoredIncidents = (): IncidentReport[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const incidents = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return incidents.map((incident: any) => ({
      ...incident,
      timestamp: new Date(incident.timestamp),
    }));
  } catch {
    return [];
  }
};

/**
 * Save incidents to localStorage
 */
const saveIncidents = (incidents: IncidentReport[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
};

/**
 * Generate a unique ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Mock API service for incident reports
 */
export const incidentApi = {
  /**
   * Get all incidents
   */
  getAll: async (): Promise<IncidentReport[]> => {
    await delay(300);
    return getStoredIncidents();
  },

  /**
   * Get a single incident by ID
   */
  getById: async (id: string): Promise<IncidentReport | null> => {
    await delay(200);
    const incidents = getStoredIncidents();
    return incidents.find(inc => inc.id === id) || null;
  },

  /**
   * Create a new incident
   */
  create: async (incident: Omit<IncidentReport, 'id' | 'timestamp'>): Promise<IncidentReport> => {
    await delay(400);
    const incidents = getStoredIncidents();
    const newIncident: IncidentReport = {
      ...incident,
      id: generateId(),
      timestamp: new Date(),
    };
    incidents.push(newIncident);
    saveIncidents(incidents);
    return newIncident;
  },

  /**
   * Update an existing incident
   */
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

  /**
   * Delete an incident
   */
  delete: async (id: string): Promise<void> => {
    await delay(200);
    const incidents = getStoredIncidents();
    const filtered = incidents.filter(inc => inc.id !== id);
    saveIncidents(filtered);
  },

  /**
   * Update incident status
   */
  updateStatus: async (id: string, status: IncidentStatus): Promise<IncidentReport> => {
    return incidentApi.update(id, { status });
  },

  /**
   * Update incident severity
   */
  updateSeverity: async (id: string, severity: SeverityLevel): Promise<IncidentReport> => {
    return incidentApi.update(id, { severity });
  },

  /**
   * Add admin note to incident
   */
  addNote: async (id: string, note: string): Promise<IncidentReport> => {
    await delay(300);
    const incidents = getStoredIncidents();
    const index = incidents.findIndex(inc => inc.id === id);
    if (index === -1) {
      throw new Error('Incident not found');
    }
    const incident = incidents[index];
    const adminNotes = incident.adminNotes || [];
    adminNotes.push(note);
    incidents[index] = { ...incident, adminNotes };
    saveIncidents(incidents);
    return incidents[index];
  },
};

/**
 * Initialize with sample data if localStorage is empty
 */
export const initializeSampleData = (): void => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing || JSON.parse(existing).length === 0) {
    const sampleIncidents: IncidentReport[] = [
      {
        id: 'sample-1',
        location: { lat: 40.7580, lng: -73.9855 },
        type: 'injured',
        description: 'Found an injured cat near the park entrance. Appears to have a wounded leg.',
        severity: 'high',
        status: 'new',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        reporterInfo: { name: 'John Doe', contact: 'john@example.com' },
      },
      {
        id: 'sample-2',
        location: { lat: 40.7489, lng: -73.9680 },
        type: 'abandoned',
        description: 'Several abandoned puppies found in a box. They appear healthy but need shelter.',
        severity: 'critical',
        status: 'investigating',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        reporterInfo: { name: 'Jane Smith' },
      },
    ];
    saveIncidents(sampleIncidents);
  }
};

