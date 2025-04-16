
import { ConnectionPreferences, ColumnVisibility, defaultColumnVisibility } from '@/types/connection';

const PREFERENCES_KEY = 'cedrus_connections_preferences';

export const saveConnectionPreferences = (preferences: ConnectionPreferences): void => {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
};

export const loadConnectionPreferences = (): ConnectionPreferences => {
  const savedPreferences = localStorage.getItem(PREFERENCES_KEY);
  
  if (savedPreferences) {
    try {
      return JSON.parse(savedPreferences) as ConnectionPreferences;
    } catch (error) {
      console.error('Failed to parse saved preferences:', error);
    }
  }
  
  // Return default preferences if nothing is saved or parsing failed
  return {
    columnVisibility: defaultColumnVisibility,
    itemsPerPage: 5
  };
};
