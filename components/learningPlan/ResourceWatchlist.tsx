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
      <View style={{
        padding: 16,
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        borderRadius: 12,
        marginHorizontal: 16
      }}>
        <Text style={{
          color: isDarkMode ? '#cbd5e1' : '#64748b'
        }}>
          Loading your personalized learning plan...
        </Text>
      </View>
    );
  }

  if (!learningPlan || learningPlan.weeks.length === 0) {
    return (
      <View style={{
        padding: 16,
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        borderRadius: 12,
        marginHorizontal: 16
      }}>
        <Text style={{
          color: isDarkMode ? '#cbd5e1' : '#64748b'
        }}>
          No learning plan found. Please check your connection and try again.
        </Text>
      </View>
    );
  }

  const currentWeek = learningPlan.weeks[selectedWeek];

  return (
    <View style={{
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      marginHorizontal: 16,
      marginVertical: 8
    }}>
      <View style={{
        marginHorizontal: 16,
        backgroundColor: isDarkMode ? '#334155' : '#f1f5f9'
      }}>
        <View style={{
          borderWidth: 1,
          borderColor: isDarkMode ? '#475569' : '#cbd5e1',
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 4
        }}>
          <Picker
            selectedValue={selectedWeek}
            onValueChange={(itemValue: number) => setSelectedWeek(itemValue)}
            style={{ color: isDarkMode ? '#ffffff' : '#333333' }}
            dropdownIconColor={isDarkMode ? '#ffffff' : '#333333'}
          >
            {learningPlan.weeks.map((_, index) => (
              <Picker.Item key={index} label={`Week ${index + 1}`} value={index} />
            ))}
          </Picker>
        </View>
      </View>
      
      <View style={{ padding: 16 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: isDarkMode ? '#ffffff' : '#1e293b'
        }}>
          Personalized {hobbyName} Course - Week {selectedWeek + 1}
        </Text>
        <Text style={{
          fontSize: 14,
          color: isDarkMode ? '#cbd5e1' : '#64748b',
          marginTop: 4
        }}>
          {currentWeek.youtubeVideos.length} Videos • {currentWeek.learningArticles.length} Articles
        </Text>
      </View>
      
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            marginLeft: 16,
            alignItems: 'center',
            backgroundColor: activeTab === 'videos' ? '#8b5cf6' : isDarkMode ? '#7e22ce' : '#c2abfd'
          }}
          onPress={() => setActiveTab('videos')}
        >
          <Text style={{
            fontWeight: '500',
            color: activeTab === 'videos' ? '#ffffff' : isDarkMode ? '#f3e8ff' : '#581c87'
          }}>
            Videos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{
            flex: 1,
            paddingVertical: 12,
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
            marginRight: 16,
            alignItems: 'center',
            backgroundColor: activeTab === 'description' ? '#8b5cf6' : isDarkMode ? '#7e22ce' : '#c2abfd'
          }}
          onPress={() => setActiveTab('description')}
        >
          <Text style={{
            fontWeight: '500',
            color: activeTab === 'description' ? '#ffffff' : isDarkMode ? '#f3e8ff' : '#581c87'
          }}>
            Articles
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'videos' && (
        <View style={{ padding: 16 }}>
          {currentWeek.youtubeVideos.map((video, index) => (
            <TouchableOpacity 
              key={`video-${index}`}
              onPress={() => onResourceClick(video, 'video', selectedWeek)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                marginBottom: 8,
                backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                borderRadius: 8
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                marginRight: 12,
                borderRadius: 20,
                backgroundColor: '#8b5cf6',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Ionicons name="play-circle" size={24} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: isDarkMode ? '#ffffff' : '#1e293b'
                }}>
                  {video.title}
                </Text>
                {video.duration && (
                  <Text style={{
                    fontSize: 12,
                    color: isDarkMode ? '#94a3b8' : '#64748b',
                    marginTop: 4
                  }}>
                    {video.duration}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {activeTab === 'description' && (
        <View style={{ padding: 16 }}>
          {currentWeek.learningArticles.map((article, index) => (
            <TouchableOpacity 
              key={`article-${index}`}
              onPress={() => onResourceClick(article, 'article', selectedWeek)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                marginBottom: 8,
                backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                borderRadius: 8
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                marginRight: 12,
                borderRadius: 20,
                backgroundColor: '#8b5cf6',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Ionicons name="document-text-outline" size={24} color="white" />
              </View>
              <Text style={{
                flex: 1,
                color: isDarkMode ? '#ffffff' : '#1e293b'
              }}>
                {article.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}