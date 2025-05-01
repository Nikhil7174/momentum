import React, { useCallback } from 'react';
import { View, ScrollView, BackHandler, Text, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Header from '../components/home/Header';
import WelcomeCard from '../components/home/WelcomeCard';
import GoalsStatsCard from '../components/home/GoalsStatsCard';
import ExploreSection from '../components/home/ExploreSection';
import MotivationalQuote from '../components/home/MotivationalQuote';
import { useUserStats } from '@/context/UserStatsContext';
import { createTheme } from '../utils/themeUtils';
import { useTheme } from '@react-navigation/native';
import ContinueLearning from '@/components/home/ContinueLearning';

export default function HomeScreen() {
  const rootTheme = useTheme();
  const isDarkMode = rootTheme.dark;
  const theme = createTheme(isDarkMode);
  const router = useRouter();
  const { userData, lastViewedResource } = useUserStats();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        BackHandler.exitApp();
        return true;
      });
      return () => backHandler.remove();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header theme={theme} />

      <ScrollView style={{ flex: 1 }}>
        <View className="px-4 py-2">
          {lastViewedResource && (
            <ContinueLearning theme={theme} lastViewedResource={lastViewedResource} />
          )}

          <WelcomeCard theme={theme} hobbyName={userData.hobbyName} />
          <GoalsStatsCard theme={theme} userData={userData} />

          {/* Track Your Progress button */}
          <View
            style={{
              backgroundColor: '#292929',
              padding: 16,
              borderRadius: 16,
              marginVertical: 12,
              marginHorizontal: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5
            }}
          >
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Image
                  source={require('../assets/images/progress.png')}
                  style={{ width: 62, height: 62, borderRadius: 4 }}
                />
              </View>

              <View>
                <View style={{
                  flex: 1,
                  marginLeft: 16,
                  alignItems: 'flex-end'
                }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                    How to track your progress
                  </Text>
                  <Text style={{ color: 'white', fontSize: 14 }}>
                    16 Minutes
                  </Text>
                </View>

                <TouchableOpacity onPress={() => router.push('/progress')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginTop: 25
                  }}>
                  <View
                    style={{
                      backgroundColor: '#404040',
                      borderRadius: 16,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      marginRight: 12
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 12 }}>On Progress</Text>
                  </View>

                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>→</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ExploreSection theme={theme} />
        </View>

        <MotivationalQuote theme={theme} />
      </ScrollView>
    </View>
  );
}