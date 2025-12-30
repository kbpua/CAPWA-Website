import { useState, useEffect } from 'react';
import { locationService } from '../services/locationService';
import type { Location } from '../types';

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        const currentLocation = await locationService.getCurrentLocation();
        setLocation(currentLocation);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to get location');
        // Fallback to default Philippines location
        setLocation(locationService.getDefaultLocation());
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const refreshLocation = async () => {
    try {
      setLoading(true);
      const currentLocation = await locationService.getCurrentLocation();
      setLocation(currentLocation);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
      setLocation(locationService.getDefaultLocation());
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
    refreshLocation,
    defaultLocation: locationService.getDefaultLocation(),
  };
};

