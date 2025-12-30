import type { Location } from '../types';

/**
 * Format coordinates for display
 */
export const formatCoordinates = (location: Location): string => {
  return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
};

/**
 * Calculate distance between two points (Haversine formula)
 */
export const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLon = ((loc2.lng - loc1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Default map center (can be configured based on target region)
 */
export const DEFAULT_MAP_CENTER: Location = {
  lat: 40.7128,
  lng: -74.0060, // Default to NYC, can be changed
};

/**
 * Default map zoom level
 */
export const DEFAULT_ZOOM = 13;

