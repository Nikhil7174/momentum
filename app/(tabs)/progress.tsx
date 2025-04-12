import React, { useEffect } from 'react';
import { View, ScrollView, BackHandler } from 'react-native';
import { useColorScheme } from 'react-native';
import { createTheme } from '../../utils/themeUtils';
import Header from '../../components/home/Header';
import GoalsStatsCard from '../../components/home/GoalsStatsCard';
import ProgressChart from '../../components/home/ProgressChart';
import LearningPlan from '../../components/home/LearningPlan';
import MotivationalQuote from '../../components/home/MotivationalQuote';
import { useUserStats } from '@/context/UserStatsContext';

const ProgressScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = createTheme(isDarkMode);

  const { userData, weeks, toggleWeekCompletion } = useUserStats();

  useEffect(() => {
    // Optionally handle Android back button for your progress screen
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header theme={theme} isDarkMode={isDarkMode} />
      <ScrollView style={{ flex: 1 }}>
        <GoalsStatsCard theme={theme} userData={userData} />
        <ProgressChart theme={theme} userData={userData} />
        <LearningPlan
          theme={theme}
          weeks={weeks}
          toggleweekCompletion={toggleWeekCompletion}
        />
        <MotivationalQuote theme={theme} />
      </ScrollView>
    </View>
  );
};

export default ProgressScreen;