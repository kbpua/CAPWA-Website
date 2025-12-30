import { DEFAULT_PH_LOCATION, getCityByCoordinates } from '../utils/philippinesData';
import type { Location } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const locationService = {
  // Get user's current location
  getCurrentLocation: async (): Promise<Location> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        // Fallback to Manila, Philippines
        resolve(DEFAULT_PH_LOCATION);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Check if location is within Philippines bounds (approximate)
          if (lat >= 4.0 && lat <= 22.0 && lng >= 114.0 && lng <= 128.0) {
            const city = getCityByCoordinates(lat, lng);
            resolve({
              lat,
              lng,
              city: city?.name,
              province: city?.province,
              region: city ? city.province : 'Unknown',
              address: city ? `${city.name}, ${city.province}` : `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            });
          } else {
            // Location outside Philippines, default to Manila
            resolve(DEFAULT_PH_LOCATION);
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Fallback to Manila, Philippines
          resolve(DEFAULT_PH_LOCATION);
        },
        {
          timeout: 10000,
          maximumAge: 600000, // 10 minutes
        }
      );
    });
  },

  // Reverse geocode (get address from coordinates)
  reverseGeocode: async (lat: number, lng: number): Promise<Location> => {
    await delay(300);
    
    const city = getCityByCoordinates(lat, lng);
    
    return {
      lat,
      lng,
      city: city?.name,
      province: city?.province,
      region: city ? city.province : 'Unknown',
      address: city ? `${city.name}, ${city.province}` : `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    };
  },

  // Get default Philippines location
  getDefaultLocation: (): Location => {
    return DEFAULT_PH_LOCATION;
  },

  // Validate if coordinates are in Philippines
  isInPhilippines: (lat: number, lng: number): boolean => {
    // Approximate Philippines bounds
    return lat >= 4.0 && lat <= 22.0 && lng >= 114.0 && lng <= 128.0;
  },
};

