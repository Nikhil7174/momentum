import { View, ScrollView, BackHandler, useColorScheme, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LABELS, STORAGE_KEYS } from '@/constants/Onboarding';
import { Redirect, useRouter } from 'expo-router';

import Header from '../components/home/Header';
import WelcomeCard from '../components/home/WelcomeCard';
import GoalsStatsCard from '../components/home/GoalsStatsCard';
import ProgressChart from '../components/home/ProgressChart';
import LearningPlan from '../components/home/LearningPlan';
import ExploreSection from '../components/home/ExploreSection';
import MotivationalQuote from '../components/home/MotivationalQuote';
import { useUserStats } from '@/context/UserStatsContext';
import { createTheme } from '../utils/themeUtils';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = createTheme(isDarkMode);
  const router = useRouter();

  const { lastViewedResource } = useUserStats();


  const [userData, setUserData] = useState({
    hobbyName: 'Coding',
    currentSkillLevel: 'Beginner',
    desiredSkillLevel: 'Advanced',
    timeCommitment: '10 hours/week',
    progress: 40, // Track user progress
  });

  const [techniques, setTechniques] = useState([
    { id: '1', name: 'Technique 1', completed: false },
    { id: '2', name: 'Technique 2', completed: false },
    { id: '3', name: 'Technique 3', completed: true },
    { id: '4', name: 'Technique 4', completed: false },
    { id: '5', name: 'Technique 5', completed: true },
  ]);



  useEffect(() => {
    const loadUserData = async () => {
      try {
        const hobbyName = await AsyncStorage.getItem(STORAGE_KEYS.hobbyName) || 'Coding';
        const currentSkillLevel = await AsyncStorage.getItem(STORAGE_KEYS.currentSkillLevel) || 'Beginner';
        const desiredSkillLevel = await AsyncStorage.getItem(STORAGE_KEYS.desiredSkillLevel) || 'Advanced';
        const timeCommitment = await AsyncStorage.getItem(STORAGE_KEYS.timeCommitment) || '10 hours/week';
        const savedProgress = await AsyncStorage.getItem(STORAGE_KEYS.progress) || '40';
        const savedTechniques = await AsyncStorage.getItem(STORAGE_KEYS.techniques);

        setUserData({
          hobbyName,
          currentSkillLevel,
          desiredSkillLevel,
          timeCommitment,
          progress: parseInt(savedProgress, 10),
        });

        if (savedTechniques) {
          setTechniques(JSON.parse(savedTechniques));
        }

        await AsyncStorage.setItem(STORAGE_KEYS.onboardingCompleted, 'true');
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();

    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const toggleTechniqueCompletion = async (id: string) => {
    const updatedTechniques = techniques.map(technique =>
      technique.id === id ? { ...technique, completed: !technique.completed } : technique
    );
    setTechniques(updatedTechniques);

    // Calculate progress
    const completedCount = updatedTechniques.filter(t => t.completed).length;
    const newProgress = Math.round((completedCount / updatedTechniques.length) * 100);

    setUserData(prev => ({
      ...prev,
      progress: newProgress
    }));

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.techniques, JSON.stringify(updatedTechniques));
      await AsyncStorage.setItem(STORAGE_KEYS.progress, newProgress.toString());
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>

      <Header theme={theme} isDarkMode={isDarkMode} />

      <ScrollView style={{ flex: 1 }}>
        <View className="px-4 py-2">
          {/* Display Last Viewed Resource if available */}
          {lastViewedResource && (
            <TouchableOpacity
              className="mx-4 my-2 p-4 bg-blue-100 dark:bg-blue-900 rounded-xl"
              onPress={() => {
                router.push({
                  pathname: '/learning',
                  params: { openResource: JSON.stringify(lastViewedResource) }
                });
              }}
            >
              <Text className="text-sm text-blue-500 dark:text-blue-300 font-medium">
                Continue Learning
              </Text>
              <Text className="text-base text-slate-800 dark:text-white font-bold mt-1">
                {lastViewedResource.title}
              </Text>
              <Text className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Week {lastViewedResource.weekIndex + 1} • {lastViewedResource.type === 'video' ? 'Video' : 'Article'}
              </Text>
            </TouchableOpacity>
          )}

          <WelcomeCard theme={theme} hobbyName={userData.hobbyName} />

          <GoalsStatsCard theme={theme} userData={userData} />

          <ProgressChart theme={theme} userData={userData} />

          <LearningPlan
            theme={theme}
            techniques={techniques}
            toggleTechniqueCompletion={toggleTechniqueCompletion}
          />

          <ExploreSection theme={theme} />
        </View>

        <MotivationalQuote theme={theme} />
      </ScrollView>
    </View>
  );
}