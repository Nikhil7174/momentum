import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/Onboarding';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextType {
  themePreference: ThemePreference;
  theme: 'light' | 'dark';
  setThemePreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themePreference: 'system',
  theme: 'light',
  setThemePreference: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useDeviceColorScheme();
  
  const [themePreference, setPreference] = useState<ThemePreference>('system');
  
  const theme = themePreference === 'system' 
    ? (deviceTheme || 'light') as 'light' | 'dark'
    : themePreference as 'light' | 'dark';

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.themeStorageKey);
        if (savedTheme && ['system', 'light', 'dark'].includes(savedTheme)) {
          setPreference(savedTheme as ThemePreference);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);

  const setThemePreference = async (newPreference: ThemePreference) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.themeStorageKey, newPreference);
      setPreference(newPreference);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        theme,
        setThemePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);