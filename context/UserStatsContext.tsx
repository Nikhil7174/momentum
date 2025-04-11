import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/Onboarding';

// Define the resource data type
export interface ResourceData {
  type: 'video' | 'article';
  title: string;
  url: string;
  weekIndex: number;
}

// Create context type
interface UserStatsContextType {
  lastViewedResource: ResourceData | null;
  updateLastViewedResource: (resource: ResourceData) => Promise<void>;
}

// Create the context with default values
const UserStatsContext = createContext<UserStatsContextType>({
  lastViewedResource: null,
  updateLastViewedResource: async () => {},
});

// Provider component
export function UserStatsProvider({ children }: { children: ReactNode }) {
  const [lastViewedResource, setLastViewedResource] = useState<ResourceData | null>(null);

  // Load last viewed resource on mount
  useEffect(() => {
    const loadLastViewedResource = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEYS.lastViewedResource);
        if (saved) {
          setLastViewedResource(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load last viewed resource:', error);
      }
    };
    
    loadLastViewedResource();
  }, []);

  // Update function that will be used by screens
  const updateLastViewedResource = async (resource: ResourceData) => {
    try {
      setLastViewedResource(resource);
      await AsyncStorage.setItem(STORAGE_KEYS.lastViewedResource, JSON.stringify(resource));
    } catch (error) {
      console.error('Failed to update last viewed resource:', error);
    }
  };

  return (
    <UserStatsContext.Provider 
      value={{ 
        lastViewedResource, 
        updateLastViewedResource 
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
}

export const useUserStats = () => useContext(UserStatsContext);