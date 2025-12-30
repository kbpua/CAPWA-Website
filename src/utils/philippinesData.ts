import type { PhilippineRegion, PhilippineProvince, PhilippineCity, Location } from '../types';

export const PHILIPPINE_REGIONS: PhilippineRegion[] = [
  {
    id: 'ncr',
    name: 'National Capital Region (NCR)',
    code: 'NCR',
    provinces: [
      {
        id: 'metro-manila',
        name: 'Metro Manila',
        code: 'MM',
        region: 'NCR',
        cities: [
          { id: 'manila', name: 'Manila', code: 'MNL', province: 'Metro Manila', coordinates: { lat: 14.5995, lng: 120.9842 } },
          { id: 'quezon-city', name: 'Quezon City', code: 'QC', province: 'Metro Manila', coordinates: { lat: 14.6760, lng: 121.0437 } },
          { id: 'makati', name: 'Makati', code: 'MKT', province: 'Metro Manila', coordinates: { lat: 14.5547, lng: 121.0244 } },
          { id: 'taguig', name: 'Taguig', code: 'TAG', province: 'Metro Manila', coordinates: { lat: 14.5176, lng: 121.0509 } },
        ],
      },
    ],
  },
  {
    id: 'region-iii',
    name: 'Central Luzon (Region III)',
    code: 'R3',
    provinces: [
      {
        id: 'bulacan',
        name: 'Bulacan',
        code: 'BUL',
        region: 'Region III',
        cities: [
          { id: 'malolos', name: 'Malolos', code: 'MLS', province: 'Bulacan', coordinates: { lat: 14.8433, lng: 120.8114 } },
        ],
      },
    ],
  },
  {
    id: 'region-vii',
    name: 'Central Visayas (Region VII)',
    code: 'R7',
    provinces: [
      {
        id: 'cebu',
        name: 'Cebu',
        code: 'CEB',
        region: 'Region VII',
        cities: [
          { id: 'cebu-city', name: 'Cebu City', code: 'CEB', province: 'Cebu', coordinates: { lat: 10.3157, lng: 123.8854 } },
          { id: 'lapu-lapu', name: 'Lapu-Lapu City', code: 'LLC', province: 'Cebu', coordinates: { lat: 10.3103, lng: 123.9494 } },
        ],
      },
    ],
  },
  {
    id: 'region-xi',
    name: 'Davao Region (Region XI)',
    code: 'R11',
    provinces: [
      {
        id: 'davao-del-sur',
        name: 'Davao del Sur',
        code: 'DDS',
        region: 'Region XI',
        cities: [
          { id: 'davao-city', name: 'Davao City', code: 'DVO', province: 'Davao del Sur', coordinates: { lat: 7.1907, lng: 125.4553 } },
        ],
      },
    ],
  },
  {
    id: 'region-xii',
    name: 'SOCCSKSARGEN (Region XII)',
    code: 'R12',
    provinces: [
      {
        id: 'south-cotabato',
        name: 'South Cotabato',
        code: 'SCT',
        region: 'Region XII',
        cities: [
          { id: 'general-santos', name: 'General Santos', code: 'GSC', province: 'South Cotabato', coordinates: { lat: 6.5244, lng: 124.8469 } },
        ],
      },
    ],
  },
];

export const DEFAULT_PH_LOCATION: Location = {
  lat: 14.5995, // Manila
  lng: 120.9842,
  address: 'Manila, Metro Manila',
  city: 'Manila',
  province: 'Metro Manila',
  region: 'NCR',
};

export const getCityByCoordinates = (lat: number, lng: number): PhilippineCity | null => {
  for (const region of PHILIPPINE_REGIONS) {
    for (const province of region.provinces) {
      for (const city of province.cities) {
        const distance = Math.sqrt(
          Math.pow(city.coordinates.lat - lat, 2) + Math.pow(city.coordinates.lng - lng, 2)
        );
        if (distance < 0.1) {
          return city;
        }
      }
    }
  }
  return null;
};

export const getAllCities = (): PhilippineCity[] => {
  const cities: PhilippineCity[] = [];
  PHILIPPINE_REGIONS.forEach(region => {
    region.provinces.forEach(province => {
      cities.push(...province.cities);
    });
  });
  return cities;
};

export const getProvincesByRegion = (regionCode: string): PhilippineProvince[] => {
  const region = PHILIPPINE_REGIONS.find(r => r.code === regionCode || r.id === regionCode);
  return region?.provinces || [];
};

