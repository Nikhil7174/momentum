import { View, Text, TextInput, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen() {
  const { step } = useLocalSearchParams();
  const currentStep = typeof step === 'string' ? parseInt(step, 10) : 1;
  
  // For Step 1
  const [hobbyName, setHobbyName] = useState('');
  
  // For Step 2
  const [currentSkillLevel, setCurrentSkillLevel] = useState<string | null>(null);
  const skillLevels = [
    { id: 'beginner', label: 'Complete Beginner' },
    { id: 'some_experience', label: 'Some Experience' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];
  
  // For Step 3
  const [desiredSkillLevel, setDesiredSkillLevel] = useState<string | null>(null);
  const goalLevels = [
    { id: 'basic', label: 'Basic Proficiency' },
    { id: 'hobby', label: 'Hobby Level' },
    { id: 'advanced', label: 'Advanced Skills' },
    { id: 'professional', label: 'Professional Level' },
  ];
  
  // For Step 4
  const [timeCommitment, setTimeCommitment] = useState<string | null>(null);
  const timeOptions = [
    { id: 'casual', label: '1-2 hours per week' },
    { id: 'regular', label: '3-5 hours per week' },
    { id: 'dedicated', label: '5-10 hours per week' },
    { id: 'intense', label: '10+ hours per week' },
  ];
  
  // Load stored data when the component mounts
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedHobbyName = await AsyncStorage.getItem('hobbyName');
        if (storedHobbyName) setHobbyName(storedHobbyName);
        
        const storedCurrentSkill = await AsyncStorage.getItem('currentSkillLevel');
        if (storedCurrentSkill) setCurrentSkillLevel(storedCurrentSkill);
        
        const storedDesiredSkill = await AsyncStorage.getItem('desiredSkillLevel');
        if (storedDesiredSkill) setDesiredSkillLevel(storedDesiredSkill);
        
        const storedTimeCommitment = await AsyncStorage.getItem('timeCommitment');
        if (storedTimeCommitment) setTimeCommitment(storedTimeCommitment);
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };
    
    loadStoredData();
  }, []);
  
  const handleContinue = async () => {
    try {
      // Save current step data
      switch (currentStep) {
        case 1:
          await AsyncStorage.setItem('hobbyName', hobbyName);
          break;
        case 2:
          if (currentSkillLevel) {
            await AsyncStorage.setItem('currentSkillLevel', currentSkillLevel);
          }
          break;
        case 3:
          if (desiredSkillLevel) {
            await AsyncStorage.setItem('desiredSkillLevel', desiredSkillLevel);
          }
          break;
        case 4:
          if (timeCommitment) {
            await AsyncStorage.setItem('timeCommitment', timeCommitment);
          }
          break;
      }
      
      // Navigate to next step or home
      if (currentStep < 4) {
        router.push(`/onboarding/${currentStep + 1}`);
      } else {
        router.replace('/home');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return hobbyName.trim().length > 0;
      case 2:
        return currentSkillLevel !== null;
      case 3:
        return desiredSkillLevel !== null;
      case 4:
        return timeCommitment !== null;
      default:
        return false;
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <View className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg mb-6">
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                What hobby do you want to learn?
              </Text>
            </View>
            
            <TextInput
              value={hobbyName}
              onChangeText={setHobbyName}
              placeholder="e.g., Guitar, Pottery, Photography"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg p-4 mb-6"
            />
          </>
        );
      
      case 2:
        return (
          <>
            <View className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg mb-6">
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                What's your current skill level?
              </Text>
            </View>
            
            {skillLevels.map((level) => (
              <TouchableOpacity 
                key={level.id}
                onPress={() => setCurrentSkillLevel(level.id)}
                className={`border mb-4 p-4 rounded-lg ${
                  currentSkillLevel === level.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Text 
                  className={`text-lg ${
                    currentSkillLevel === level.id 
                      ? 'text-blue-700 dark:text-blue-300 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        );
      
      case 3:
        return (
          <>
            <View className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg mb-6">
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                What skill level do you want to achieve?
              </Text>
            </View>
            
            {goalLevels.map((level) => (
              <TouchableOpacity 
                key={level.id}
                onPress={() => setDesiredSkillLevel(level.id)}
                className={`border mb-4 p-4 rounded-lg ${
                  desiredSkillLevel === level.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Text 
                  className={`text-lg ${
                    desiredSkillLevel === level.id 
                      ? 'text-blue-700 dark:text-blue-300 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        );
      
      case 4:
        return (
          <>
            <View className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg mb-6">
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                How much time can you commit weekly?
              </Text>
            </View>
            
            {timeOptions.map((option) => (
              <TouchableOpacity 
                key={option.id}
                onPress={() => setTimeCommitment(option.id)}
                className={`border mb-4 p-4 rounded-lg ${
                  timeCommitment === option.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Text 
                  className={`text-lg ${
                    timeCommitment === option.id 
                      ? 'text-blue-700 dark:text-blue-300 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-lg font-bold text-gray-800 dark:text-white">
            {currentStep} / 4
          </Text>
        </View>
        
        {renderStepContent()}
        
        <TouchableOpacity 
          onPress={handleContinue}
          disabled={!isStepValid()}
          className={`w-full py-4 rounded-lg mt-6 ${
            isStepValid() 
              ? 'bg-blue-500' 
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {currentStep === 4 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
