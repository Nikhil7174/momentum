import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { STORAGE_KEYS } from '@/constants/Onboarding';
import HomeScreen from '../home';

export default function Index() {  
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const onboardingCompleted = await AsyncStorage.getItem(STORAGE_KEYS.onboardingCompleted);
        setHasCompletedOnboarding(onboardingCompleted === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasCompletedOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkOnboardingStatus();
  }, []);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  if (hasCompletedOnboarding) {
    return <HomeScreen />;
  } else {
    return <Redirect href="/welcome" />;
  }
}