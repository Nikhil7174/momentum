import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { createTheme } from '../../utils/themeUtils';
import { useTheme } from '@react-navigation/native';

export default function TabLayout() {
  const rootTheme = useTheme();
  const isDarkMode = rootTheme.dark;
  const theme = createTheme(isDarkMode);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? "#fff" : theme.primary,
        tabBarInactiveTintColor: isDarkMode ? '#8e8e93' : '#999999',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            shadowColor: isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
            shadowOffset: { width: 0, height: isDarkMode ? -2 : 2 },
            shadowOpacity: isDarkMode ? 1 : 0.3,
            shadowRadius: isDarkMode ? 10 : 4,
          },
          default: {
            position: 'absolute',
            borderTopWidth: 0,
            height: 50,
            marginBottom: 8,
            backgroundColor: isDarkMode ? theme.card : 'white',
            elevation: 10,
            shadowColor: isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
            shadowOffset: { width: 0, height: isDarkMode ? -1 : 2 },
            shadowOpacity: isDarkMode ? 1 : 0.3,
            shadowRadius: isDarkMode ? 10 : 4,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
            borderWidth: isDarkMode ? 1 : 0,
            paddingBottom: 0,
            borderRadius: 40,
            marginHorizontal: 20,
            paddingTop: 3,
          },
        }),
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learning',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="studentdesk" color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}