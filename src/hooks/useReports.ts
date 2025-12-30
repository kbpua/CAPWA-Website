import { useState, useEffect, useCallback } from 'react';
import { reportService } from '../services/reportService';
import type { IncidentReport } from '../types';

export const useReports = () => {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getAll();
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const createReport = useCallback(async (report: Omit<IncidentReport, 'id' | 'timestamp' | 'trackingNumber'>) => {
    try {
      const newReport = await reportService.create(report);
      setReports(prev => [...prev, newReport]);
      return newReport;
    } catch (err: any) {
      throw err;
    }
  }, []);

  const updateReport = useCallback(async (id: string, updates: Partial<IncidentReport>) => {
    try {
      const updated = await reportService.update(id, updates);
      setReports(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err: any) {
      throw err;
    }
  }, []);

  const deleteReport = useCallback(async (id: string) => {
    try {
      await reportService.delete(id);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      throw err;
    }
  }, []);

  return {
    reports,
    loading,
    error,
    loadReports,
    createReport,
    updateReport,
    deleteReport,
  };
};

