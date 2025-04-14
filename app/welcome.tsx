import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const router = useRouter();
  
  const handleGetStarted = () => {
    // Navigate to the first onboarding step
    router.push('/onboarding/1');
  };
  
  return (
    <View className="flex-1 bg-white dark:bg-gray-900 justify-center items-center px-6">
      <StatusBar style="auto" />
      
      <View className="items-center mb-10">
        <Image 
          source={require('../assets/images/icon.png')} 
          className="w-32 h-32 mb-6"
        />
        <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome to Momentum
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center mb-4">
          Your personal guide to mastering any hobby or skill
        </Text>
      </View>
      
      <View className="w-full bg-blue-50 dark:bg-blue-900 rounded-xl p-6 mb-8">
        <Text className="text-gray-600 font-semibold dark:text-gray-300 text-center">
          We'll help you create a personalized learning plan based on your
          current level and goals.
        </Text>
      </View>
      
      <TouchableOpacity 
        className="bg-blue-600 w-full p-4 rounded-2xl"
        onPress={handleGetStarted}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}