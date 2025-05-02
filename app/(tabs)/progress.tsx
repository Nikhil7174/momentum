import React from 'react';
import { View, ScrollView } from 'react-native';
import { createTheme } from '../../utils/themeUtils';
import Header from '../../components/home/Header';
import GoalsStatsCard from '../../components/home/GoalsStatsCard';
import LearningPath from '@/components/progress/LearningPath';
import LearningPlan from '@/components/home/LearningPlan';
import MotivationalQuote from '../../components/home/MotivationalQuote';
import { useUserStats } from '@/context/UserStatsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

const ProgressScreen: React.FC = () => {
  const rootTheme = useTheme();
  const isDarkMode = rootTheme.dark;
  const theme = createTheme(isDarkMode);

  const { userData, weeks, toggleWeekCompletion } = useUserStats();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Header theme={theme} />
        <ScrollView style={{ flex: 1, paddingTop: 15, marginBottom: 15, paddingHorizontal: 10 }}>
          <GoalsStatsCard theme={theme} userData={userData} />

          <LearningPath
            theme={theme}
            weeks={weeks}
          />

          <LearningPlan
            theme={theme}
            weeks={weeks}
            toggleWeekCompletion={toggleWeekCompletion}
          />

          <MotivationalQuote theme={theme} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProgressScreen;