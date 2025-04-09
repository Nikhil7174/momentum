import { View, Text, Image, Button } from 'react-native';
import { Link } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Welcome() {
  return (
    <View className="flex-1 justify-between bg-white dark:bg-gray-900 px-6 py-10">
      <View className="items-center mb-12">
        <Image 
          source={require('../../assets/images/icon.png')} 
          className="w-24 h-24 mb-4"
        />
        
      </View>
      
      <View>
      <View><Text className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Your Hobby Journey
        </Text>
        <Text className="text-xl text-center text-gray-600 dark:text-gray-300 mb-6">
          made super easy
        </Text>
        </View>
      <View className="w-full rounded-xl bg-blue-50 dark:bg-blue-900 p-6 mb-8">
        <Text className="text-center text-gray-700 dark:text-gray-100 text-lg mb-2">
          Hello, Hobby Explorer!
        </Text>
        <Text className="text-center text-gray-600 dark:text-gray-300">
          Tell us a few details about what you want to learn.
        </Text>
      </View>
      </View>
      
      <View>
      <Link href="../onboarding/1" asChild>
        <TouchableOpacity className="w-full bg-green-300 py-4 rounded-lg">
          <Text className="text-white text-center font-semibold text-lg">
            Continue
          </Text>
        </TouchableOpacity>
      </Link>

      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
        By continuing, you agree to our Terms and Privacy Policy
      </Text>
      </View>
    </View>
  );
}