import { View, ScrollView, BackHandler, useColorScheme, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import Header from '../components/home/Header';
import WelcomeCard from '../components/home/WelcomeCard';
import GoalsStatsCard from '../components/home/GoalsStatsCard';
import ExploreSection from '../components/home/ExploreSection';
import MotivationalQuote from '../components/home/MotivationalQuote';
import { useUserStats } from '@/context/UserStatsContext';
import { createTheme } from '../utils/themeUtils';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = createTheme(isDarkMode);
  const router = useRouter();

  const { userData, lastViewedResource } = useUserStats();

  useEffect(() => {
    // Handle Android back button
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
        <View className="px-4 py-2">
          {/* Display Last Viewed Resource if available */}
          {lastViewedResource && (
            <TouchableOpacity
              className="mx-[10px] my-2 p-4 bg-blue-100 dark:bg-blue-900 rounded-xl"
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

          <TouchableOpacity
            onPress={() => router.push('/progress')}
            style={{
              backgroundColor: theme.primary,
              padding: 12,
              borderRadius: 8,
              marginVertical: 10,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Track Your Progress</Text>
          </TouchableOpacity>

          <ExploreSection theme={theme} />
        </View>

        <MotivationalQuote theme={theme} />
      </ScrollView>
    </View>
  );
}