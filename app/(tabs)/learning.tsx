import { View, ScrollView, BackHandler, useColorScheme, Linking, Modal, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/Onboarding';
import { Text } from 'react-native';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Dimensions } from 'react-native';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { useLocalSearchParams } from 'expo-router';

import Header from '@/components/home/Header';
import MotivationalQuote from '@/components/home/MotivationalQuote';
import RecentlyLearning from '@/components/learningPlan/RecentlyLearning';
import WeeklyCourse from '@/components/learningPlan/ResourceWatchlist';
import { useUserStats } from '@/context/UserStatsContext';
import { createTheme } from '@/utils/themeUtils';
import { getYoutubeVideoId } from '@/utils/videoUtils';
import { ResourceItem, ResourceData, LearningPlanData } from '@/types/LearningPlanTypes';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

export default function LearningScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = createTheme(isDarkMode);

  const { updateLastViewedResource } = useUserStats();
  const { openResource } = useLocalSearchParams();

  const [userData, setUserData] = useState({
    hobbyName: 'Coding',
    currentSkillLevel: 'Beginner',
    desiredSkillLevel: 'Advanced',
    timeCommitment: 'dedicated',
    progress: 40,
  });

  const [learningPlan, setLearningPlan] = useState<LearningPlanData | null>({ weeks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(0);

  // Track last viewed resource
  const [lastViewedResource, setLastViewedResource] = useState<ResourceData | null>(null);

  // Video player modal state
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');

  // Article viewer modal state
  const [articleModalVisible, setArticleModalVisible] = useState(false);
  const [currentArticleUrl, setCurrentArticleUrl] = useState('');
  const [currentArticleTitle, setCurrentArticleTitle] = useState('');

  const [currentResourceTitle, setCurrentResourceTitle] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const hobbyName = await AsyncStorage.getItem(STORAGE_KEYS.hobbyName) || 'Coding';
        const currentSkillLevel = await AsyncStorage.getItem(STORAGE_KEYS.currentSkillLevel) || 'Beginner';
        const desiredSkillLevel = await AsyncStorage.getItem(STORAGE_KEYS.desiredSkillLevel) || 'Advanced';
        const timeCommitment = await AsyncStorage.getItem(STORAGE_KEYS.timeCommitment) || 'dedicated';
        const savedProgress = await AsyncStorage.getItem(STORAGE_KEYS.progress) || '40';
        const savedLastViewedResource = await AsyncStorage.getItem(STORAGE_KEYS.lastViewedResource);

        setUserData({
          hobbyName,
          currentSkillLevel,
          desiredSkillLevel,
          timeCommitment,
          progress: parseInt(savedProgress, 10),
        });

        if (savedLastViewedResource) {
          setLastViewedResource(JSON.parse(savedLastViewedResource));
        }

        await AsyncStorage.setItem(STORAGE_KEYS.onboardingCompleted, 'true');

        // After loading user data, check for existing learning plan or fetch new one
        await fetchLearningPlan(hobbyName, currentSkillLevel, desiredSkillLevel, timeCommitment);
      } catch (error) {
        console.error('Failed to load user data:', error);
        setIsLoading(false);
      }
    };

    loadUserData();

    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (videoModalVisible) {
        setVideoModalVisible(false);
        return true;
      }
      if (articleModalVisible) {
        setArticleModalVisible(false);
        return true;
      }
      BackHandler.exitApp();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (openResource) {
      try {
        const resource = JSON.parse(openResource as string);
        setCurrentResourceTitle(resource.title);
        // Check type to decide how to open it:
        if (resource.type === 'video') {
          const videoId = getYoutubeVideoId(resource.url);
          if (videoId) {
            setCurrentVideoId(videoId);
            setVideoModalVisible(true);
          } else {
            Linking.openURL(resource.url);
          }
        } else if (resource.type === 'article') {
          setCurrentArticleUrl(resource.url);
          setArticleModalVisible(true);
        }
      } catch (error) {
        console.error('Error parsing openResource parameter:', error);
      }
    }
  }, [openResource]);

  const extractValidJSON = (text: string): string => {
    // First try to find JSON code block
    const codeBlockMatch = text.match(/```json\n([\s\S]*?)```/);
    if (codeBlockMatch) return codeBlockMatch[1].trim();

    // Fallback to text before Explanation section and remove Processing JSON prefix
    const [jsonWithPrefix] = text.split('\n\nExplanation:\n\n');
    const jsonString = jsonWithPrefix.replace(/^Processing JSON:\s*/i, '').trim();
    return jsonString;
  };

  const fetchLearningPlan = async (
    hobbyName: string,
    currentSkillLevel: string,
    desiredSkillLevel: string,
    timeCommitment: string
  ) => {
    try {
      const storedPlan = await AsyncStorage.getItem(STORAGE_KEYS.learningPlan);
      if (storedPlan) {
        const parsedPlan = JSON.parse(storedPlan);
        try {
          const planData = JSON.parse(parsedPlan.content[0].text);
          setLearningPlan(planData);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Corrupted stored plan:', e);
          await AsyncStorage.removeItem(STORAGE_KEYS.learningPlan);
        }
      }

      const response = await axios.post('https://momentum-backend-server-1.onrender.com/generate-personalized-learning', {
        hobbyName,
        currentSkillLevel,
        desiredSkillLevel,
        timeCommitment
      });

      const fullText = response.data.content[0].text;
      const jsonString = extractValidJSON(fullText);

      const planData = JSON.parse(jsonString);
      if (planData?.weeks) {
        setLearningPlan(planData);
        await AsyncStorage.setItem(STORAGE_KEYS.learningPlan,
          JSON.stringify({
            content: [{ text: jsonString }],
            timestamp: new Date().toISOString()
          })
        );
      } else {
        throw new Error('Invalid learning plan structure');
      }
    } catch (error) {
      console.error('Failed to process learning plan:', { error });
      throw new Error('Failed to load learning plan. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceClick = async (resource: ResourceItem, type: 'video' | 'article', weekIndex: number) => {
    const resourceData = {
      type,
      title: resource.title,
      url: resource.url,
      weekIndex
    };

    await updateLastViewedResource({
      type,
      title: resource.title,
      url: resource.url,
      weekIndex
    });

    setLastViewedResource(resourceData);
    await AsyncStorage.setItem(STORAGE_KEYS.lastViewedResource, JSON.stringify(resourceData));

    if (type === 'video') {
      const videoId = getYoutubeVideoId(resource.url);
      if (videoId) {
        setCurrentVideoId(videoId);
        setCurrentVideoTitle(resource.title);
        setVideoModalVisible(true);
      } else {
        Linking.openURL(resource.url);
      }
    } else {
      setCurrentArticleUrl(resource.url);
      setCurrentArticleTitle(resource.title);
      setArticleModalVisible(true);
    }
  };

  const handleLastResourceClick = () => {
    if (lastViewedResource) {
      setSelectedWeek(lastViewedResource.weekIndex);
      handleResourceClick(
        { title: lastViewedResource.title, url: lastViewedResource.url },
        lastViewedResource.type,
        lastViewedResource.weekIndex
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <LottieView
            source={require('../../assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text className='font-semibold text-xl justify-center items-center text-center'>
            Creating personalized learning plan for you ...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-slate-50 dark:bg-slate-900 mb-[6vh]">
        <Header theme={theme} isDarkMode={isDarkMode} />

        <ScrollView className="flex-1">
          <RecentlyLearning
            lastViewedResource={lastViewedResource}
            onResourceClick={handleLastResourceClick}
            isDarkMode={isDarkMode}
          />

          <WeeklyCourse
            isLoading={isLoading}
            learningPlan={learningPlan}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            onResourceClick={handleResourceClick}
            hobbyName={userData.hobbyName}
            isDarkMode={isDarkMode}
          />
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={videoModalVisible}
          onRequestClose={() => setVideoModalVisible(false)}
        >
          <View className="flex-1 bg-black">
            <View className="h-14 p-2 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setVideoModalVisible(false)}
                className="p-2"
              >
                <Text className="text-white text-lg">←</Text>
              </TouchableOpacity>
              <Text className="text-white flex-1 text-center truncate px-4">{currentVideoTitle}</Text>
              <View className="w-10" />
            </View>

            <View className="flex-1 justify-center">
              {currentVideoId && (
                <YoutubePlayer
                  height={screenWidth * 0.6}
                  play={true}
                  videoId={currentVideoId}
                />
              )}
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={articleModalVisible}
          onRequestClose={() => setArticleModalVisible(false)}
        >
          <View className="flex-1">
            <View className="h-14 p-2 flex-row items-center justify-between bg-white dark:bg-slate-800">
              <TouchableOpacity
                onPress={() => setArticleModalVisible(false)}
                className="p-2"
              >
                <Text className="text-slate-800 dark:text-white text-lg">←</Text>
              </TouchableOpacity>
              <Text className="text-slate-800 dark:text-white flex-1 text-center truncate px-4">{currentArticleTitle}</Text>
              <View className="w-10" />
            </View>

            {currentArticleUrl && (
              <WebView
                source={{ uri: currentArticleUrl }}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}