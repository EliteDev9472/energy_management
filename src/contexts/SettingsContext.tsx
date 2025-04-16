
import React, { createContext, useContext, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { getUserSettings, updateUserSettings, UserSettings } from '@/services/userSettingsService';

// Default values for user settings
const defaultSettings: UserSettings = {
  id: '',
  name: '',
  email: '',
  language: 'nl',
  theme: 'light',
  marketing_emails: false,
  notifications: false
};

type SettingsContextType = {
  settings: UserSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<boolean>;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
  refreshSettings: async () => {},
  updateSettings: async () => false
});

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);

  const refreshSettings = async () => {
    setLoading(true);
    try {
      const userSettings = await getUserSettings();
      if (userSettings) {
        setSettings(userSettings);
      }
    } catch (error) {
      console.error("Failed to fetch user settings:", error);
      toast({
        title: "Fout bij laden",
        description: "Er is een fout opgetreden bij het laden van uw instellingen.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await updateUserSettings(updates);
      if (success) {
        setSettings({ ...settings, ...updates });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het bijwerken van uw instellingen.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
