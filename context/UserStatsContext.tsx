import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/Onboarding';

// Define all the types we need
export interface ResourceData {
  type: 'video' | 'article';
  title: string;
  url: string;
  weekIndex: number;
}

export interface UserData {
  hobbyName: string;
  currentSkillLevel: string;
  desiredSkillLevel: string;
  timeCommitment: string;
  progress: number;
}

export interface WeekData {
  id: string;
  name: string;
  completed: boolean;
}

// Create context type
interface UserStatsContextType {
  userData: UserData;
  weeks: WeekData[];
  lastViewedResource: ResourceData | null;
  updateLastViewedResource: (resource: ResourceData) => Promise<void>;
  toggleWeekCompletion: (id: string) => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

// Create the context with default values
const UserStatsContext = createContext<UserStatsContextType>({
  userData: {
    hobbyName: '',
    currentSkillLevel: '',
    desiredSkillLevel: '',
    timeCommitment: '',
    progress: 0,
  },
  weeks: [],
  lastViewedResource: null,
  updateLastViewedResource: async () => {},
  toggleWeekCompletion: async () => {},
  updateUserData: async () => {},
});

// Provider component
export function UserStatsProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>({
    hobbyName: '',
    currentSkillLevel: '',
    desiredSkillLevel: '',
    timeCommitment: '',
    progress: 0,
  });
  
  const [weeks, setWeeks] = useState<WeekData[]>([
    { id: '1', name: 'Week 1', completed: false },
    { id: '2', name: 'Week 2', completed: false },
    { id: '3', name: 'Week 3', completed: false },
    { id: '4', name: 'Week 4', completed: false },
  ]);
  
  const [lastViewedResource, setLastViewedResource] = useState<ResourceData | null>(null);

  // Load all data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data
        const hobbyName = await AsyncStorage.getItem(STORAGE_KEYS.hobbyName) || 'Coding';
        const currentSkillLevel = await AsyncStorage.getItem(STORAGE_KEYS.currentSkillLevel) || 'Beginner';
        const desiredSkillLevel = await AsyncStorage.getItem(STORAGE_KEYS.desiredSkillLevel) || 'Advanced';
        const timeCommitment = await AsyncStorage.getItem(STORAGE_KEYS.timeCommitment) || '10 hours/week';
        const savedProgress = await AsyncStorage.getItem(STORAGE_KEYS.progress) || '0';

        setUserData({
          hobbyName,
          currentSkillLevel,
          desiredSkillLevel,
          timeCommitment,
          progress: parseInt(savedProgress, 10),
        });
        
        // Load weeks data
        const savedWeeks = await AsyncStorage.getItem(STORAGE_KEYS.weeks);
        if (savedWeeks) {
          setWeeks(JSON.parse(savedWeeks));
        }
        
        // Load last viewed resource
        const savedResource = await AsyncStorage.getItem(STORAGE_KEYS.lastViewedResource);
        if (savedResource) {
          setLastViewedResource(JSON.parse(savedResource));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, []);

  // Update functions
  const updateLastViewedResource = async (resource: ResourceData) => {
    try {
      setLastViewedResource(resource);
      await AsyncStorage.setItem(STORAGE_KEYS.lastViewedResource, JSON.stringify(resource));
    } catch (error) {
      console.error('Failed to update last viewed resource:', error);
    }
  };
  
  const toggleWeekCompletion = async (id: string) => {
    const updatedWeeks = weeks.map(week =>
      week.id === id ? { ...week, completed: !week.completed } : week
    );
    setWeeks(updatedWeeks);
    
    // Update progress based on completed weeks
    const completedCount = updatedWeeks.filter(week => week.completed).length;
    const newProgress = Math.round((completedCount / updatedWeeks.length) * 100);
    
    setUserData(prev => ({ ...prev, progress: newProgress }));
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.weeks, JSON.stringify(updatedWeeks));
      await AsyncStorage.setItem(STORAGE_KEYS.progress, newProgress.toString());
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };
  
  const updateUserData = async (data: Partial<UserData>) => {
    const updatedData = { ...userData, ...data };
    setUserData(updatedData);
    
    try {
      // Only update the fields that were provided
      if (data.hobbyName) await AsyncStorage.setItem(STORAGE_KEYS.hobbyName, data.hobbyName);
      if (data.currentSkillLevel) await AsyncStorage.setItem(STORAGE_KEYS.currentSkillLevel, data.currentSkillLevel);
      if (data.desiredSkillLevel) await AsyncStorage.setItem(STORAGE_KEYS.desiredSkillLevel, data.desiredSkillLevel);
      if (data.timeCommitment) await AsyncStorage.setItem(STORAGE_KEYS.timeCommitment, data.timeCommitment);
      if (data.progress !== undefined) await AsyncStorage.setItem(STORAGE_KEYS.progress, data.progress.toString());
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  return (
    <UserStatsContext.Provider 
      value={{ 
        userData,
        weeks,
        lastViewedResource, 
        updateLastViewedResource,
        toggleWeekCompletion,
        updateUserData
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
}

export const useUserStats = () => useContext(UserStatsContext);