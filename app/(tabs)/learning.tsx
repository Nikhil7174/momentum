import { View, ScrollView, BackHandler, useColorScheme, Linking, Modal, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Text } from 'react-native';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Header from '@/components/home/Header';
import RecentlyLearning from '@/components/learningPlan/RecentlyLearning';
import WeeklyCourse from '@/components/learningPlan/ResourceWatchlist';
import { useUserStats } from '@/context/UserStatsContext';
import { createTheme } from '@/utils/themeUtils';
import { getYoutubeVideoId } from '@/utils/videoUtils';
import { ResourceItem } from '@/types/LearningPlanTypes';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

export default function LearningScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = createTheme(isDarkMode);
  const router = useRouter();

  const { openResource } = useLocalSearchParams();
  const { 
    userData, 
    lastViewedResource, 
    updateLastViewedResource,
    learningPlan,
    isLoadingPlan,
    fetchLearningPlan,
    userDataUpdated,  // Add this
    setUserDataUpdated  // Add this  
  } = useUserStats();

  const [selectedWeek, setSelectedWeek] = useState(0);

  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');

  const [articleModalVisible, setArticleModalVisible] = useState(false);
  const [currentArticleUrl, setCurrentArticleUrl] = useState('');
  const [currentArticleTitle, setCurrentArticleTitle] = useState('');

  const [currentResourceTitle, setCurrentResourceTitle] = useState('');
  const isFetchingRef = useRef(false);

  const isUserDataComplete = () => {
    return (
      userData.hobbyName && 
      userData.currentSkillLevel && 
      userData.desiredSkillLevel && 
      userData.timeCommitment
    );
  };

  useEffect(() => {
    if (!isFetchingRef.current && isUserDataComplete() && (userDataUpdated || !learningPlan?.weeks?.length)) {
      isFetchingRef.current = true;
      
      fetchLearningPlan().finally(() => {
        isFetchingRef.current = false;
        setUserDataUpdated(false);
      });
    }
  }, [userDataUpdated, userData]);

  useEffect(() => {
    if (openResource) {
      try {
        const resource = JSON.parse(openResource as string);
        setCurrentResourceTitle(resource.title);
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

  const handleResourceClick = async (resource: ResourceItem, type: 'video' | 'article', weekIndex: number) => {
    const resourceData = {
      type,
      title: resource.title,
      url: resource.url,
      weekIndex
    };

    await updateLastViewedResource(resourceData);

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

  if (!isUserDataComplete()) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text className='font-semibold text-xl text-center mb-6'>
            Please complete your profile to generate a learning plan
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/ProfileScreen')}
            className='bg-blue-500 py-3 px-6 rounded-lg'
          >
            <Text className='text-white font-semibold'>Go to Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoadingPlan) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <LottieView
            source={require('../../assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text className='font-semibold text-xl justify-center items-center text-center dark:text-white'>
            Creating personalized learning plan for {userData.hobbyName} ...
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
            isLoading={isLoadingPlan}
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