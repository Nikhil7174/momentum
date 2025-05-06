import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { STORAGE_KEYS } from '@/constants/Onboarding';
import { LearningPlanData } from '@/types/LearningPlanTypes';
import { BACKEND_SERVER_URL } from '@/config/config';

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

// Extend the context type to include setIsLoadingPlan
interface UserStatsContextType {
  userData: UserData;
  weeks: WeekData[];
  lastViewedResource: ResourceData | null;
  updateLastViewedResource: (resource: ResourceData) => Promise<void>;
  toggleWeekCompletion: (id: string) => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  learningPlan: LearningPlanData | null;
  isLoadingPlan: boolean;
  setIsLoadingPlan: React.Dispatch<React.SetStateAction<boolean>>;
  fetchLearningPlan: () => Promise<void>;
  userDataUpdated: boolean;
  setUserDataUpdated: React.Dispatch<React.SetStateAction<boolean>>;
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
  learningPlan: { weeks: [] },
  isLoadingPlan: false,
  setIsLoadingPlan: () => {},
  fetchLearningPlan: async () => {},
  userDataUpdated: false,
  setUserDataUpdated: () => {},
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
  const [learningPlan, setLearningPlan] = useState<LearningPlanData | null>({ weeks: [] });
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [userDataUpdated, setUserDataUpdated] = useState(false);

  // Load all data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const hobbyName = await AsyncStorage.getItem(STORAGE_KEYS.hobbyName) || '';
        const currentSkillLevel = await AsyncStorage.getItem(STORAGE_KEYS.currentSkillLevel) || '';
        const desiredSkillLevel = await AsyncStorage.getItem(STORAGE_KEYS.desiredSkillLevel) || '';
        const timeCommitment = await AsyncStorage.getItem(STORAGE_KEYS.timeCommitment) || '';
        const savedProgress = await AsyncStorage.getItem(STORAGE_KEYS.progress) || '0';

        setUserData({
          hobbyName,
          currentSkillLevel,
          desiredSkillLevel,
          timeCommitment,
          progress: parseInt(savedProgress, 10),
        });
        
        const savedWeeks = await AsyncStorage.getItem(STORAGE_KEYS.weeks);
        if (savedWeeks) {
          setWeeks(JSON.parse(savedWeeks));
        }
        
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

  const fetchLearningPlan = async () => {
    try {
      setIsLoadingPlan(true);
      setLastViewedResource(null);

      const [hobbyName, currentSkillLevel, desiredSkillLevel, timeCommitment] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.hobbyName),
        AsyncStorage.getItem(STORAGE_KEYS.currentSkillLevel),
        AsyncStorage.getItem(STORAGE_KEYS.desiredSkillLevel),
        AsyncStorage.getItem(STORAGE_KEYS.timeCommitment),
      ]);
  
      if (!hobbyName || !currentSkillLevel || !desiredSkillLevel || !timeCommitment) {
        console.error('Missing required user data for learning plan');
        setIsLoadingPlan(false);
        return;
      }
      
      // Check if we already have a stored plan
      const storedPlan = await AsyncStorage.getItem(STORAGE_KEYS.learningPlan);
      
      if (storedPlan) {
        const parsedPlan = JSON.parse(storedPlan);
        const storedUserData = parsedPlan.userData || {};
        if (
          storedUserData.hobbyName === hobbyName &&
          storedUserData.currentSkillLevel === currentSkillLevel &&
          storedUserData.desiredSkillLevel === desiredSkillLevel &&
          storedUserData.timeCommitment === timeCommitment
        ) {
          try {
            const planData = JSON.parse(parsedPlan.content[0].text);
            setLearningPlan(planData);
            setIsLoadingPlan(false);
            return;
          } catch (e) {
            console.error('Corrupted stored plan:', e);
            await AsyncStorage.removeItem(STORAGE_KEYS.learningPlan);
          }
        }
      }
      
      const response = await axios.post( BACKEND_SERVER_URL, {
        hobbyName,
        currentSkillLevel,
        desiredSkillLevel,
        timeCommitment
      });
  
      const planData = response.data;
      if (planData?.weeks) {
        setLearningPlan(planData);
        await AsyncStorage.setItem(
          STORAGE_KEYS.learningPlan,
          JSON.stringify({
            content: [{ text: JSON.stringify(planData) }],
            userData: {
              hobbyName,
              currentSkillLevel,
              desiredSkillLevel,
              timeCommitment
            },
            timestamp: new Date().toISOString()
          })
        );
      } else {
        throw new Error('Invalid learning plan structure');
      }
    } catch (error) {
      console.error('Failed to process learning plan:', { error });
      setLearningPlan({ weeks: [] });
    } finally {
      setIsLoadingPlan(false);
    }
  };

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
    // Update storage FIRST
    try {
      if (data.hobbyName !== undefined) await AsyncStorage.setItem(STORAGE_KEYS.hobbyName, data.hobbyName);
      if (data.currentSkillLevel !== undefined) await AsyncStorage.setItem(STORAGE_KEYS.currentSkillLevel, data.currentSkillLevel);
      if (data.desiredSkillLevel !== undefined) await AsyncStorage.setItem(STORAGE_KEYS.desiredSkillLevel, data.desiredSkillLevel);
      if (data.timeCommitment !== undefined) await AsyncStorage.setItem(STORAGE_KEYS.timeCommitment, data.timeCommitment);
      if (data.progress !== undefined) await AsyncStorage.setItem(STORAGE_KEYS.progress, data.progress.toString());
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  
    // Then update state
    setUserData(prev => {
      const newData = { ...prev, ...data };
      // Remove stored plan if any key changed
      if (data.hobbyName || data.currentSkillLevel || data.desiredSkillLevel || data.timeCommitment) {
        AsyncStorage.removeItem(STORAGE_KEYS.learningPlan).catch(console.error);
      }
      return newData;
    });
    setUserDataUpdated(true);
  };

  return (
    <UserStatsContext.Provider 
      value={{ 
        userData,
        weeks,
        lastViewedResource,
        updateLastViewedResource,
        toggleWeekCompletion,
        updateUserData,
        learningPlan,
        isLoadingPlan,
        setIsLoadingPlan,
        fetchLearningPlan,
        userDataUpdated,
        setUserDataUpdated
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
}

export const useUserStats = () => useContext(UserStatsContext);