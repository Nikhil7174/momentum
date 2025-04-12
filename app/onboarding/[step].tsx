import { View, Text, TextInput, SafeAreaView, Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import {
    TOTAL_ONBOARDING_STEPS,
    SKILL_LEVELS,
    GOAL_LEVELS,
    TIME_OPTIONS,
    STORAGE_KEYS
} from '../../constants/Onboarding';

export default function OnboardingScreen() {
    const { step } = useLocalSearchParams();
    const currentStep = typeof step === 'string' ? parseInt(step, 10) : 1;
    const progressValue = currentStep / TOTAL_ONBOARDING_STEPS;
    const screenHeight = Dimensions.get('window').height;

    const [hobbyName, setHobbyName] = useState('');
    const [currentSkillLevel, setCurrentSkillLevel] = useState<string | null>(null);
    const [desiredSkillLevel, setDesiredSkillLevel] = useState<string | null>(null);
    const [timeCommitment, setTimeCommitment] = useState<string | null>(null);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const storedHobbyName = await AsyncStorage.getItem(STORAGE_KEYS.hobbyName);
                if (storedHobbyName) setHobbyName(storedHobbyName);

                const storedCurrentSkill = await AsyncStorage.getItem(STORAGE_KEYS.currentSkillLevel);
                if (storedCurrentSkill) setCurrentSkillLevel(storedCurrentSkill);

                const storedDesiredSkill = await AsyncStorage.getItem(STORAGE_KEYS.desiredSkillLevel);
                if (storedDesiredSkill) setDesiredSkillLevel(storedDesiredSkill);

                const storedTimeCommitment = await AsyncStorage.getItem(STORAGE_KEYS.timeCommitment);
                if (storedTimeCommitment) setTimeCommitment(storedTimeCommitment);
            } catch (error) {
                console.error('Error loading stored data:', error);
            }
        };

        loadStoredData();
    }, []);

    const handleContinue = async () => {
        try {
            switch (currentStep) {
                case 1:
                    await AsyncStorage.setItem(STORAGE_KEYS.hobbyName, hobbyName);
                    break;
                case 2:
                    if (currentSkillLevel) {
                        await AsyncStorage.setItem(STORAGE_KEYS.currentSkillLevel, currentSkillLevel);
                    }
                    break;
                case 3:
                    if (desiredSkillLevel) {
                        await AsyncStorage.setItem(STORAGE_KEYS.desiredSkillLevel, desiredSkillLevel);
                    }
                    break;
                case 4:
                    if (timeCommitment) {
                        await AsyncStorage.setItem(STORAGE_KEYS.timeCommitment, timeCommitment);
                        await AsyncStorage.setItem(STORAGE_KEYS.onboardingCompleted, 'true');
                    }
                    break;
            }

            if (currentStep < 4) {
                router.push(`/onboarding/${currentStep + 1}`);
            } else {
                router.replace('/(tabs)');
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
                        <View className="bg-orange-100 p-4 rounded-lg mb-6">
                            <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                What hobby do you want to learn?
                            </Text>
                        </View>

                        <TextInput
                            value={hobbyName}
                            onChangeText={setHobbyName}
                            placeholder="e.g., Guitar, Photography, Coding (Python)"
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

                        {SKILL_LEVELS.map((level) => (
                            <TouchableOpacity
                                key={level.id}
                                onPress={() => setCurrentSkillLevel(level.id)}
                                className={`flex-row justify-between items-center border mb-4 p-4 rounded-lg ${
                                    currentSkillLevel === level.id
                                        ? 'bg-blue-50 dark:bg-blue-900 border-blue-100 dark:border-blue-800'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                            >
                                <View className={`${
                                        currentSkillLevel === level.id
                                            ? 'border-sky-600'
                                            : 'border-gray-400'
                                    } border-[2px] my-2 rounded-xl flex flex-row items-center justify-between p-3`}>
                                
                                <Text
                                    className={`text-lg ${
                                        currentSkillLevel === level.id
                                            ? 'text-blue-600 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    {level.label}
                                </Text>

                                {currentSkillLevel === level.id ? (
                                    <View className="h-6 w-6 rounded-full bg-blue-600 items-center justify-center">
                                        <View className="h-2 w-2 rounded-full bg-white" />
                                    </View>
                                ) : (
                                    <View className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-500" />
                                )}
                                
                                </View>
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

                        {GOAL_LEVELS.map((level) => (
                            <TouchableOpacity
                                key={level.id}
                                onPress={() => setDesiredSkillLevel(level.id)}
                                className={`flex-row justify-between items-center border mb-4 p-4 rounded-lg ${
                                    desiredSkillLevel === level.id
                                        ? 'bg-blue-50 dark:bg-blue-900 border-blue-100 dark:border-blue-800'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                            >
                                <View className={`${
                                        desiredSkillLevel === level.id
                                            ? 'border-sky-600'
                                            : 'border-gray-400'
                                    } border-[2px] my-2 rounded-xl flex flex-row items-center justify-between p-3`}>
                                
                                <Text
                                    className={`text-lg ${
                                        desiredSkillLevel === level.id
                                            ? 'text-blue-600 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    {level.label}
                                </Text>

                                {desiredSkillLevel === level.id ? (
                                    <View className="h-6 w-6 rounded-full bg-blue-600 items-center justify-center">
                                        <View className="h-2 w-2 rounded-full bg-white" />
                                    </View>
                                ) : (
                                    <View className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-500" />
                                )}
                                
                                </View>
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

                        {TIME_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => setTimeCommitment(option.id)}
                                className={`flex-row justify-between items-center border mb-4 p-4 rounded-lg ${
                                    timeCommitment === option.id
                                        ? 'bg-blue-50 dark:bg-blue-900 border-blue-100 dark:border-blue-800'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                            >
                                <View className={`${
                                        timeCommitment === option.id
                                            ? 'border-sky-600'
                                            : 'border-gray-400'
                                    } border-[2px] my-2 rounded-xl flex flex-row items-center justify-between p-3`}>
                                
                                <Text
                                    className={`text-lg ${
                                        timeCommitment === option.id
                                            ? 'text-blue-600 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    {option.label}
                                </Text>

                                {timeCommitment === option.id ? (
                                    <View className="h-6 w-6 rounded-full bg-blue-600 items-center justify-center">
                                        <View className="h-2 w-2 rounded-full bg-white" />
                                    </View>
                                ) : (
                                    <View className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-500" />
                                )}
                                
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <View style={{ height: screenHeight }} className="p-6">
                {/* Header with back button and progress */}
                <View className="mb-6 mt-4">
                    <View className="flex-row items-center mb-2 mr-6">
                        {currentStep > 0 && (
                            <TouchableOpacity onPress={() => router.push(currentStep == 1 ? `/(tabs)` : `/onboarding/${currentStep - 1}`)}>
                                <AntDesign name="arrowleft" size={24} color="#fff" className="dark:text-white" />
                            </TouchableOpacity>
                        )}
                        <View className="flex-1 items-center">
                            <Text className="text-lg font-bold text-gray-800 dark:text-white">
                                {currentStep} / {TOTAL_ONBOARDING_STEPS}
                            </Text>
                        </View>
                    </View>
                    {/* Progress Bar */}
                    <Progress.Bar
                        progress={progressValue}
                        width={null}
                        color="#3B82F6"
                        borderWidth={0}
                        unfilledColor="#D1D5DB"
                        style={{ marginTop: 4 }}
                    />
                </View>

                {/* Main content */}
                <View className="flex-1 justify-start" style={{ paddingTop: screenHeight * 0.05 }}>
                    {renderStepContent()}
                </View>

                {/* Bottom button - fixed at bottom */}
                <View className="mb-4">
                    <TouchableOpacity
                        onPress={handleContinue}
                        disabled={!isStepValid()}
                    >
                        <View className={`w-full py-4 rounded-lg ${isStepValid() ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                            <Text className="text-white text-center font-semibold text-lg">
                                {currentStep === TOTAL_ONBOARDING_STEPS ? 'Get Started' : 'Continue'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}