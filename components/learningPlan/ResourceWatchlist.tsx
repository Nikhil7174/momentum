import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { LearningPlanData, ResourceItem } from '@/types/LearningPlanTypes';

type WeeklyCourseProps = {
  isLoading: boolean;
  learningPlan: LearningPlanData | null;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  onResourceClick: (resource: ResourceItem, type: 'video' | 'article', weekIndex: number) => void;
  hobbyName: string;
  isDarkMode: boolean;
};

export default function ResourceWatchlist({ 
  isLoading, 
  learningPlan, 
  selectedWeek, 
  setSelectedWeek, 
  onResourceClick,
  hobbyName,
  isDarkMode
}: WeeklyCourseProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'description'>('videos');

  if (isLoading) {
    return (
      <View className="p-4 bg-white dark:bg-slate-800 rounded-xl mx-4">
        <Text className="text-slate-600 dark:text-slate-300">Loading your personalized learning plan...</Text>
      </View>
    );
  }

  if (!learningPlan || learningPlan.weeks.length === 0) {
    return (
      <View className="p-4 bg-white dark:bg-slate-800 rounded-xl mx-4">
        <Text className="text-slate-600 dark:text-slate-300">
          No learning plan found. Please check your connection and try again.
        </Text>
      </View>
    );
  }

  const currentWeek = learningPlan.weeks[selectedWeek];

  return (
    <View className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden mx-4 my-2">
      <View className="px-4 py-3 bg-slate-100 dark:bg-slate-700">
        <View className="border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1">
          <Picker
            selectedValue={selectedWeek}
            onValueChange={(itemValue: number) => setSelectedWeek(itemValue)}
            style={{ color: isDarkMode ? '#fff' : '#333' }}
            dropdownIconColor={isDarkMode ? '#fff' : '#333'}
          >
            {learningPlan.weeks.map((_, index) => (
              <Picker.Item key={index} label={`Week ${index + 1}`} value={index} />
            ))}
          </Picker>
        </View>
      </View>
      
      <View className="p-4">
        <Text className="text-2xl font-bold text-slate-800 dark:text-white">
          Personalized {hobbyName} Course - Week {selectedWeek + 1}
        </Text>
        <Text className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          {currentWeek.youtubeVideos.length} Videos • {currentWeek.learningArticles.length} Articles
        </Text>
      </View>
      
      <View className="flex-row">
        <TouchableOpacity 
          className={`flex-1 py-3 items-center ${activeTab === 'videos' ? 'bg-[#8b5cf6]' : 'bg-[#c2abfd] dark:bg-purple-700'}`}
          onPress={() => setActiveTab('videos')}
        >
          <Text className={`font-medium ${activeTab === 'videos' ? 'text-white' : 'text-purple-900 dark:text-purple-100'}`}>
            Videos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 py-3 items-center ${activeTab === 'description' ? 'bg-[#8b5cf6]' : 'bg-[#c2abfd] dark:bg-purple-700'}`}
          onPress={() => setActiveTab('description')}
        >
          <Text className={`font-medium ${activeTab === 'description' ? 'text-white' : 'text-purple-900 dark:text-purple-100'}`}>
            Articles
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'videos' && (
        <View className="p-4">
          {currentWeek.youtubeVideos.map((video, index) => (
            <TouchableOpacity 
              key={`video-${index}`}
              onPress={() => onResourceClick(video, 'video', selectedWeek)}
              className="flex-row items-center p-3 mb-2 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <View className="w-10 h-10 mr-3 rounded-full bg-[#8b5cf6] items-center justify-center">
                <Ionicons name="play-circle" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 dark:text-white">
                  {video.title}
                </Text>
                {video.duration && (
                  <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {video.duration}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {activeTab === 'description' && (
        <View className="p-4">
          {currentWeek.learningArticles.map((article, index) => (
            <TouchableOpacity 
              key={`article-${index}`}
              onPress={() => onResourceClick(article, 'article', selectedWeek)}
              className="flex-row items-center p-3 mb-2 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <View className="w-10 h-10 mr-3 rounded-full bg-blue-500 items-center justify-center">
                <Ionicons name="document-text-outline" size={24} color="white" />
              </View>
              <Text className="flex-1 text-slate-800 dark:text-white">
                {article.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}