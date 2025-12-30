import { PHILIPPINE_EMERGENCY_CONTACTS } from '../data/initialData';
import type { EmergencyContact } from '../types';

export const getEmergencyContacts = (): EmergencyContact[] => {
  return PHILIPPINE_EMERGENCY_CONTACTS;
};

export const getEmergencyContactsByType = (type: EmergencyContact['type']): EmergencyContact[] => {
  return PHILIPPINE_EMERGENCY_CONTACTS.filter(contact => contact.type === type);
};

export const getEmergencyContactsByRegion = (region: string): EmergencyContact[] => {
  return PHILIPPINE_EMERGENCY_CONTACTS.filter(
    contact => contact.region === region || contact.location?.includes(region)
  );
};

export const getNearestEmergencyContact = (region: string, type?: EmergencyContact['type']): EmergencyContact | null => {
  let contacts = getEmergencyContactsByRegion(region);
  if (type) {
    contacts = contacts.filter(c => c.type === type);
  }
  return contacts.length > 0 ? contacts[0] : getEmergencyContacts()[0];
};

export const formatPhoneNumber = (phone: string): string => {
  // Format Philippine phone numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+63 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `+63 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

