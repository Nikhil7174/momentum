import { View, Text, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const [userData, setUserData] = useState({
    hobbyName: '',
    currentSkillLevel: '',
    desiredSkillLevel: '',
    timeCommitment: '',
  });
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const hobbyName = await AsyncStorage.getItem('hobbyName') || '';
        const currentSkillLevel = await AsyncStorage.getItem('currentSkillLevel') || '';
        const desiredSkillLevel = await AsyncStorage.getItem('desiredSkillLevel') || '';
        const timeCommitment = await AsyncStorage.getItem('timeCommitment') || '';
        
        setUserData({
          hobbyName,
          currentSkillLevel,
          desiredSkillLevel,
          timeCommitment,
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    
    loadUserData();
  }, []);
  
  const getLevelText = (level: string) => {
    const labels: Record<string, string> = {
      'beginner': 'Complete Beginner',
      'some_experience': 'Some Experience',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'basic': 'Basic Proficiency',
      'hobby': 'Hobby Level',
      'professional': 'Professional Level',
      'casual': '1-2 hours per week',
      'regular': '3-5 hours per week',
      'dedicated': '5-10 hours per week',
      'intense': '10+ hours per week',
    };
    
    return labels[level] || level;
  };
  
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-6">
        <View className="items-center mb-6">
          <Image 
            source={require('../assets/images/icon.png')} 
            className="w-16 h-16"
          />
        </View>
        
        <View className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6 mb-6">
          <View className="flex-row items-center mb-2">
            <Image 
              source={require('../assets/images/favicon.png')} 
              className="w-10 h-10 rounded-full mr-3"
            />
            <Text className="text-lg font-bold text-gray-800 dark:text-white">
              Hello, Hobbyist!
            </Text>
          </View>
          
          <Text className="text-gray-700 dark:text-gray-300">
            Welcome to your {userData.hobbyName} learning journey! We've created a personalized path for you.
          </Text>
        </View>
        
        <View className="mb-6">
          <Text className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Your Learning Plan
          </Text>
          
          <View className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-4">
            <Text className="font-semibold text-lg mb-1 text-gray-800 dark:text-white">
              Hobby:
            </Text>
            <Text className="text-gray-700 dark:text-gray-300">
              {userData.hobbyName}
            </Text>
          </View>
          
          <View className="bg-green-50 dark:bg-green-900 rounded-lg p-4 mb-4">
            <Text className="font-semibold text-lg mb-1 text-gray-800 dark:text-white">
              Current Level:
            </Text>
            <Text className="text-gray-700 dark:text-gray-300">
              {getLevelText(userData.currentSkillLevel)}
            </Text>
          </View>
          
          <View className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 mb-4">
            <Text className="font-semibold text-lg mb-1 text-gray-800 dark:text-white">
              Goal Level:
            </Text>
            <Text className="text-gray-700 dark:text-gray-300">
              {getLevelText(userData.desiredSkillLevel)}
            </Text>
          </View>
          
          <View className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
            <Text className="font-semibold text-lg mb-1 text-gray-800 dark:text-white">
              Time Commitment:
            </Text>
            <Text className="text-gray-700 dark:text-gray-300">
              {getLevelText(userData.timeCommitment)}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mb-6">
          <Text className="text-white text-center font-semibold text-lg">
            Start First Lesson
          </Text>
        </TouchableOpacity>
        
        <View className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <Text className="text-gray-600 dark:text-gray-400 italic text-center">
            "Success is built on small efforts, repeated daily."
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}