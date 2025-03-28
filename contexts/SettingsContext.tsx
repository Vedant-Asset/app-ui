import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, getData, saveData } from '../utils/storage';

type Settings = {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
};

const defaultSettings: Settings = {
  theme: 'light',
  notifications: true,
  language: 'en',
  fontSize: 'medium',
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getData<Settings>(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await saveData(STORAGE_KEYS.SETTINGS, updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 